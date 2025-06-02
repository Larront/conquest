import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { data: planets } = await supabase.from('planets').select();
	const { data: battles } = await supabase.from('battles').select();
	const { data: profiles } = await supabase.from('profiles').select();
	const { data: control } = await supabase.from('control').select();
	const { data: factions } = await supabase.from('factions').select();

	console.log(control);
	const { user } = await safeGetSession();

	if (user == null) {
		console.error('Error fetching user');
	} else {
		console.log('User:', user);
	}

	return {
		planets: planets ?? [],
		battles: battles ?? [],
		profiles: profiles ?? [],
		control: control ?? [],
		factions: factions ?? [],
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
