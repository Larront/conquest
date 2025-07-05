import { redirect } from '@sveltejs/kit';
import { PUBLIC_EMAIL_REDIRECT_URL } from '$env/static/public';

import type { PageServerLoad, Actions } from '../$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: factions } = await supabase.from('factions').select();

	return { factions: factions ?? [] };
};

export const actions: Actions = {
	signup: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData();
		const username: string = formData.get('username') as string;
		const email: string = formData.get('email') as string;
		const password: string = formData.get('password') as string;
		const faction: string = formData.get('faction') as string;

		// Build dynamic redirect URL based on current origin or environment override
		const emailRedirectTo: string = PUBLIC_EMAIL_REDIRECT_URL || `${url.origin}/auth/confirm`;

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					faction: faction,
					username: username
				},
				emailRedirectTo
			}
		});
		if (error) {
			console.error('Signup error:', error.message);
			redirect(303, '/auth/error');
		} else {
			redirect(303, '/auth/acknowledge');
		}
	},
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email: string = formData.get('email') as string;
		const password: string = formData.get('password') as string;

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
