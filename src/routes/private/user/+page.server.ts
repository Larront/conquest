import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	userUpdateSchema,
	passwordUpdateSchema,
	factionManagementSchema,
	sanitizeText
} from '$lib/validation';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	// Run user session and factions query in parallel
	const [{ user }, { data: factions }] = await Promise.all([
		safeGetSession(),
		supabase.from('factions').select('name, allegiance') // Need allegiance for dropdown display
	]);

	// Load user factions for faction management
	const { data: userFactions } = await supabase
		.from('user_factions')
		.select('*')
		.eq('user_id', user.id)
		.order('faction_display_name');

	const passwordForm = await superValidate(zod4(passwordUpdateSchema));
	const userForm = await superValidate(zod4(userUpdateSchema));
	const factionForm = await superValidate(zod4(factionManagementSchema));

	return {
		user,
		factions,
		userFactions: userFactions ?? [],
		passwordForm,
		userForm,
		factionForm
	};
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
	},

	savefaction: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession();

		if (!user) {
			return fail(401, { errors: { general: 'Unauthorized' } });
		}

		const factionForm = await superValidate(request, zod4(factionManagementSchema));
		if (!factionForm.valid) {
			return fail(400, { factionForm });
		}

		const { factionName, factionDisplayName, userFactionId } = factionForm.data;

		// Check if this display name already exists for this user (excluding current faction if editing)
		let existingQuery = supabase
			.from('user_factions')
			.select('id')
			.eq('user_id', user.id)
			.eq('faction_display_name', factionDisplayName);

		if (userFactionId) {
			existingQuery = existingQuery.neq('id', parseInt(userFactionId));
		}

		const { data: existing } = await existingQuery;

		if (existing && existing.length > 0) {
			return fail(400, {
				factionForm,
				message: 'You already have a faction with this display name'
			});
		}

		try {
			if (userFactionId) {
				// Update existing faction
				const { error } = await supabase
					.from('user_factions')
					.update({
						faction_name: factionName,
						faction_display_name: factionDisplayName
					})
					.eq('id', parseInt(userFactionId))
					.eq('user_id', user.id);

				if (error) {
					console.error('Failed to update faction:', error);
					return fail(500, {
						factionForm,
						message: 'Failed to update faction'
					});
				}
			} else {
				// Create new faction
				const { error } = await supabase.from('user_factions').insert({
					user_id: user.id,
					faction_name: factionName,
					faction_display_name: factionDisplayName
				});

				if (error) {
					console.error('Failed to create faction:', error);
					return fail(500, {
						factionForm,
						message: 'Failed to create faction'
					});
				}
			}

			return { factionForm };
		} catch (error) {
			console.error('Unexpected error:', error);
			return fail(500, {
				factionForm,
				message: 'An unexpected error occurred'
			});
		}
	},

	deletefaction: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession();

		if (!user) {
			return fail(401, { errors: { general: 'Unauthorized' } });
		}

		const formData = await request.formData();
		const userFactionId = formData.get('userFactionId') as string;

		if (!userFactionId) {
			return fail(400, { message: 'Invalid faction ID' });
		}

		try {
			// Check if this faction has any battles or control records
			const [{ data: battles }, { data: control }] = await Promise.all([
				supabase
					.from('battles')
					.select('id')
					.or(
						`attacker_user_faction_id.eq.${userFactionId},defender_user_faction_id.eq.${userFactionId}`
					)
					.limit(1),
				supabase.from('control').select('id').eq('user_faction_id', userFactionId).limit(1)
			]);

			if ((battles && battles.length > 0) || (control && control.length > 0)) {
				return fail(400, {
					message:
						'Cannot delete faction that has battle history or planet control. This preserves historical data.'
				});
			}

			// Safe to delete
			const { error } = await supabase
				.from('user_factions')
				.delete()
				.eq('id', parseInt(userFactionId))
				.eq('user_id', user.id);

			if (error) {
				console.error('Failed to delete faction:', error);
				return fail(500, { message: 'Failed to delete faction' });
			}

			return {};
		} catch (error) {
			console.error('Unexpected error during deletion:', error);
			return fail(500, { message: 'An unexpected error occurred' });
		}
	}
};
