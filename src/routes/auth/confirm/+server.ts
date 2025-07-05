import { AuthError, type EmailOtpType } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

/**
 * Detect if the request is likely from an email client scanning/prefetching links
 */
function isLikelyEmailClientScanning(userAgent: string): boolean {
	const emailClientPatterns = [
		/Gmail/i,
		/Outlook/i,
		/AppleMail/i,
		/Thunderbird/i,
		/YahooMail/i,
		/ProtonMail/i,
		/bot/i,
		/crawler/i,
		/scanner/i,
		/preview/i,
		/prefetch/i,
		/LinkPreview/i,
		/facebookexternalhit/i,
		/Slackbot/i,
		/WhatsApp/i,
		/Telegram/i
	];

	return emailClientPatterns.some((pattern) => pattern.test(userAgent));
}

export const GET: RequestHandler = async ({ url, locals: { supabase }, request }) => {
	const token_hash: string | null = url.searchParams.get('token_hash');
	const type: EmailOtpType | null = url.searchParams.get('type') as EmailOtpType | null;
	const next: string = url.searchParams.get('next') ?? '/';

	const userAgent: string = request.headers.get('user-agent') || '';
	const isEmailClient: boolean = isLikelyEmailClientScanning(userAgent);

	console.log('Email confirmation attempt:', {
		token_hash: token_hash ? 'present' : 'missing',
		type,
		next,
		url: url.toString(),
		userAgent,
		isEmailClient
	});

	/**
	 * Clean up the redirect URL by deleting the Auth flow parameters.
	 *
	 * `next` is preserved for now, because it's needed in the error case.
	 */
	const redirectTo: URL = new URL(url);
	redirectTo.pathname = next;
	redirectTo.searchParams.delete('token_hash');
	redirectTo.searchParams.delete('type');

	if (!token_hash) {
		console.error('Email verification failed: Missing token_hash parameter');
		redirectTo.pathname = '/auth/error';
		redirectTo.searchParams.set('reason', 'missing_token');
		redirect(303, redirectTo);
	}

	if (!type) {
		console.error('Email verification failed: Missing type parameter');
		redirectTo.pathname = '/auth/error';
		redirectTo.searchParams.set('reason', 'missing_type');
		redirect(303, redirectTo);
	}

	if (token_hash && type) {
		const { error, data } = await supabase.auth.verifyOtp({ type, token_hash });

		if (!error) {
			console.log('Email verification successful:', {
				user_id: data.user?.id,
				email: data.user?.email,
				redirecting_to: redirectTo.toString()
			});
			redirectTo.searchParams.delete('next');
			redirect(303, redirectTo);
		} else {
			console.error('Email verification failed:', {
				error: error.message,
				status: error.status,
				code: error instanceof AuthError ? 'AUTH_ERROR' : 'UNKNOWN_ERROR',
				isEmailClient,
				userAgent
			});

			// Check if this might be due to email client pre-scanning
			const isPotentiallyPreScanned: boolean =
				isEmailClient ||
				(error.message.includes('token') && error.message.includes('invalid')) ||
				error.message.includes('expired') ||
				error.message.includes('already');

			redirectTo.pathname = '/auth/error';
			redirectTo.searchParams.set(
				'reason',
				isPotentiallyPreScanned ? 'email_client_scanning' : 'verification_failed'
			);
			redirectTo.searchParams.set('error', error.message);
			if (isEmailClient) {
				redirectTo.searchParams.set('client_type', 'email_client');
			}
			redirect(303, redirectTo);
		}
	}

	// This should never be reached, but keeping as fallback
	console.error('Email verification reached unexpected fallback case');
	redirectTo.pathname = '/auth/error';
	redirectTo.searchParams.set('reason', 'unexpected_fallback');
	redirect(303, redirectTo);
};
