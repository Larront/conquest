import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	const { data: factions } = await supabase.from('factions').select();

	return { user, factions };
};

export const actions: Actions = {
	update: async ({ request, locals: { supabase, safeGetSession } }) => {
		const formData = await request.formData();
		const { user } = await safeGetSession();
		const current_password = formData.get('current-password') as string;
		const new_password = formData.get('new-password') as string;

		const { error: error_signin } = await supabase.auth.signInWithPassword({
			email: user.email,
			password: current_password
		});

		if (error_signin) {
			console.error(error_signin);
			redirect(303, '/auth/error');
		}
		const { error: error_update } = await supabase.auth.updateUser({ password: new_password });

		if (error_update) {
			console.error(error_signin);
			redirect(303, '/auth/error');
		} else {
			redirect(303, '/');
		}
	}
};
