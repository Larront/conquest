import { redirect } from '@sveltejs/kit';

import type { PageServerLoad, Actions } from '../$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: factions } = await supabase.from('factions').select();

	return { factions: factions ?? [] };
};

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const username = formData.get('username') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const faction = formData.get('faction') as string;

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					faction: faction,
					username: username
				},
				emailRedirectTo: 'http://www.examinis.larront.com/auth'
			}
		});
		if (error) {
			console.error(error);
			redirect(303, '/auth/error');
		} else {
			redirect(303, '/auth/acknowledge');
		}
	},
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			console.error(error);
			redirect(303, '/auth/error');
		} else {
			console.log('Sign in successful');
			redirect(303, '/');
		}
	}
};
