import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { data: planets } = await supabase.from('planets').select();
	const { session } = await safeGetSession();

	return { planets: planets ?? [], session };
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
