import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { userUpdateSchema, passwordUpdateSchema, sanitizeText } from '$lib/validation';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	// Run user session and factions query in parallel
	const [
		{ user },
		{ data: factions }
	] = await Promise.all([
		safeGetSession(),
		supabase.from('factions').select('name') // Only field needed for dropdown
	]);

	const passwordForm = await superValidate(zod4(passwordUpdateSchema));
	const userForm = await superValidate(zod4(userUpdateSchema));

	return { user, factions, passwordForm, userForm };
};

export const actions: Actions = {
	updatepassword: async ({ request, locals: { supabase, safeGetSession } }) => {
		const passwordForm = await superValidate(request, zod4(passwordUpdateSchema));
		const { user } = await safeGetSession();

		if (!passwordForm.valid) {
			return fail(400, {
				passwordForm
			});
		}

		// Verify current password by attempting to sign in
		const { error: error_signin } = await supabase.auth.signInWithPassword({
			email: user.email,
			password: passwordForm.data.currentPassword
		});

		if (error_signin) {
			console.error('Current password verification failed:', error_signin);
			return fail(400, { passwordForm });
		}

		// Update password
		const { error: error_update } = await supabase.auth.updateUser({
			password: passwordForm.data.newPassword
		});

		if (error_update) {
			console.error('Password update failed:', error_update);
			return fail(400, {
				passwordForm
			});
		} else {
			redirect(303, '/');
		}
	},
	updateuser: async ({ request, locals: { supabase, safeGetSession } }) => {
		const userForm = await superValidate(request, zod4(userUpdateSchema));
		const { user } = await safeGetSession();

		if (!userForm.valid) {
			return fail(400, {
				userForm
			});
		}

		// Sanitize text fields
		const sanitizedUsername = sanitizeText(userForm.data.username);

		// Check if username is already taken (excluding current user)
		const { data: existingUser } = await supabase
			.from('profiles')
			.select('id')
			.eq('username', sanitizedUsername)
			.neq('id', user.id)
			.single();

		if (existingUser) {
			return fail(400, {
				userForm
			});
		}

		const user_meta = {
			username: sanitizedUsername,
			faction: userForm.data.faction
		};

		const { error } = await supabase.from('profiles').update(user_meta).eq('id', user.id);

		if (error) {
			console.error('Failed to update user profile:', error);
			return fail(500, {
				userForm
			});
		}

		redirect(303, '/');
	}
};
