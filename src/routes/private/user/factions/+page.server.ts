import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { z } from 'zod/v4';

const factionManagementSchema = z.object({
	factionName: z.string().min(1, 'Faction type is required'),
	factionDisplayName: z
		.string()
		.min(1, 'Display name is required')
		.max(50, 'Display name cannot exceed 50 characters'),
	userFactionId: z.string().optional()
});

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();

	if (!user) {
		redirect(303, '/auth');
	}

	// Run database queries in parallel
	const [{ data: userFactions }, { data: factions }] = await Promise.all([
		supabase
			.from('user_factions')
			.select('*')
			.eq('user_id', user.id)
			.order('faction_display_name'),
		supabase.from('factions').select('name, allegiance').order('name')
	]);

	const form = await superValidate(zod4(factionManagementSchema), { errors: false });

	return {
		userFactions: userFactions ?? [],
		factions: factions ?? [],
		form
	};
};

export const actions: Actions = {
	save: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession();

		if (!user) {
			return fail(401, { errors: { general: 'Unauthorized' } });
		}

		const form = await superValidate(request, zod4(factionManagementSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { factionName, factionDisplayName, userFactionId } = form.data;

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
				form,
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
						form,
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
						form,
						message: 'Failed to create faction'
					});
				}
			}

			redirect(303, '/private/user/factions');
		} catch (error) {
			console.error('Unexpected error:', error);
			return fail(500, {
				form,
				message: 'An unexpected error occurred'
			});
		}
	},

	delete: async ({ request, locals: { supabase, safeGetSession } }) => {
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
					.or(`attacker_user_faction_id.eq.${userFactionId},defender_user_faction_id.eq.${userFactionId}`)
					.limit(1),
				supabase.from('control').select('id').eq('user_faction_id', userFactionId).limit(1)
			]);

			if ((battles && battles.length > 0) || (control && control.length > 0)) {
				return fail(400, {
					message: 'Cannot delete faction that has battle history or planet control. This preserves historical data.'
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

			redirect(303, '/private/user/factions');
		} catch (error) {
			console.error('Unexpected error during deletion:', error);
			return fail(500, { message: 'An unexpected error occurred' });
		}
	}
};