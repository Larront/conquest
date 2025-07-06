import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

import type { PageServerLoad, Actions } from '../$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { userCreationSchema } from '$lib/validation';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: factions } = await supabase.from('factions').select();
	const form = await superValidate(zod4(userCreationSchema));

	return { factions: factions ?? [], form };
};

export const actions: Actions = {
	signup: async ({ request, locals: { supabase }, url }) => {
		const form = await superValidate(request, zod4(userCreationSchema));
		console.log(form);
		if (!form.valid) {
			return fail(400, { form });
		}

		// Build dynamic redirect URL based on current origin or environment override
		const emailRedirectTo: string = env.PUBLIC_EMAIL_REDIRECT_URL || `${url.origin}/auth/confirm`;

		const { error } = await supabase.auth.signUp({
			email: form.data.email,
			password: form.data.password,
			options: {
				data: {
					faction: form.data.faction,
					username: form.data.username
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
