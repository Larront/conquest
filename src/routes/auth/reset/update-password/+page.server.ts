import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { passwordResetConfirmSchema } from '$lib/validation';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	// Check if we have a session (user clicked reset link)
	const {
		data: { session }
	} = await supabase.auth.getSession();

	// Extract token-related params from URL
	const accessToken = url.searchParams.get('access_token');
	const type = url.searchParams.get('type');

	// If no session and no tokens, redirect to error
	if (!session && (!accessToken || type !== 'recovery')) {
		redirect(303, '/auth/error?message=Invalid or expired password reset link');
	}

	const form = await superValidate(zod4(passwordResetConfirmSchema));

	return {
		form,
		hasValidSession: !!session || (!!accessToken && type === 'recovery')
	};
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod4(passwordResetConfirmSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Update the user's password
		const { error } = await supabase.auth.updateUser({
			password: form.data.newPassword
		});

		if (error) {
			console.error('Password update failed:', error.message);
			return fail(400, {
				form,
				message: 'Failed to update password. Please try again or request a new reset link.'
			});
		}

		// Password updated successfully - redirect to login with success message
		redirect(
			303,
			'/auth?message=Password updated successfully. Please log in with your new password.'
		);
	}
};
