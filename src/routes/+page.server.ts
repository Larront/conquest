import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	// Run database queries in parallel for better performance
	// Only select needed fields to reduce data transfer
	const [
		{ data: planets },
		{ data: battles },
		{ data: profiles },
		{ data: control },
		{ data: factions },
		{ data: userFactions },
		{ user }
	] = await Promise.all([
		supabase.from('planets').select(), // All fields needed for planet display
		supabase.from('battles').select(), // All fields needed for battle history
		supabase.from('profiles').select('id, username'), // Only fields used in frontend
		supabase.from('control').select(), // All fields needed for faction control
		supabase.from('factions').select('name, allegiance'), // Only fields used in frontend
		supabase
			.from('user_factions')
			.select(
				'id, user_id, faction_name, faction_display_name, battles_won, battles_lost, battles_drawn, total_points, profiles!inner(username)'
			)
			.order('faction_display_name'),
		safeGetSession()
	]);

	// User authentication handled by layout

	return {
		planets: planets ?? [],
		battles: battles ?? [],
		profiles: profiles ?? [],
		control: control ?? [],
		factions: factions ?? [],
		userFactions: userFactions ?? [],
		user
	};
};

export const actions: Actions = {
	signout: async ({ locals: { supabase, safeGetSession } }) => {
		const session = await safeGetSession();
		if (session) {
			await supabase.auth.signOut();
			redirect(303, '/');
		}
	}
};
