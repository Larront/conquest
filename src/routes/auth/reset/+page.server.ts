import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { passwordResetRequestSchema } from '$lib/validation';
import { env } from '$env/dynamic/public';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod4(passwordResetRequestSchema));
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase }, url }) => {
		const form = await superValidate(request, zod4(passwordResetRequestSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Build redirect URL for password reset confirmation
		const redirectTo = env.PUBLIC_EMAIL_REDIRECT_URL || `${url.origin}/auth/reset/confirm`;

		// Send password reset email
		const { error } = await supabase.auth.resetPasswordForEmail(form.data.email, {
			redirectTo
		});

		if (error) {
			console.error('Password reset request failed:', error.message);
			// Don't reveal if email exists or not for security
			// Always show success message
		}

		// Always redirect to acknowledgment page regardless of whether email exists
		// This prevents email enumeration attacks
		redirect(303, '/auth/reset/acknowledge');
	}
};
