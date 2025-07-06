import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { battleUploadSchema, sanitizeText } from '$lib/validation';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	// Run database queries in parallel and select only needed fields
	const [
		{ data: planets },
		{ data: profiles }
	] = await Promise.all([
		supabase.from('planets').select('id, name'), // Only fields needed for dropdown
		supabase.from('profiles').select('id, username, faction') // Only fields needed for selection
	]);

	const form = await superValidate(
		{ selectedPlanet: 1, battleDate: new Date().toISOString(), points: 500 },
		zod4(battleUploadSchema)
	);

	return { planets: planets ?? [], profiles: profiles ?? [], form };
};

export const actions: Actions = {
	update: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, zod4(battleUploadSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// Sanitize text fields
		const sanitizedDescription = form.data.description ? sanitizeText(form.data.description) : '';

		// Convert to proper types for database
		const selectedPlanet = form.data.selectedPlanet.toString();
		const battleType = form.data.battleType;
		const points = form.data.points.toString();
		const attacker = form.data.attacker;
		const attackerPoints = form.data.attackerPoints.toString();
		const defender = form.data.defender;
		const defenderPoints = form.data.defenderPoints.toString();
		const result = form.data.result;
		const description = sanitizedDescription;
		const battleDate = form.data.battleDate;

		const battle = {
			planet: Number(selectedPlanet),
			battle_type: battleType,
			points,
			attacker,
			attacker_points: attackerPoints,
			defender,
			defender_points: Number(defenderPoints),
			result,
			description,
			battle_date: new Date(battleDate)
		};

		const { error: battleError } = await supabase.from('battles').upsert(battle);

		if (battleError) {
			console.error('Failed to create battle', battleError);
			return fail(500, {
				errors: { general: 'Failed to create battle report' },
				values: form.data
			});
		}

		const planet = battle.planet;
		const winner = battle.result === 'Attacker Victory' ? battle.attacker : battle.defender;
		const loser = battle.result === 'Attacker Victory' ? battle.defender : battle.attacker;

		const { error: profileError } = await supabase.rpc('update_battle_stats', {
			winner_id: winner,
			loser_id: loser,
			is_draw: result === 'Draw',
			winner_points: battle.result === 'Attacker Victory' ? attackerPoints : defenderPoints,
			loser_points: battle.result === 'Attacker Victory' ? defenderPoints : attackerPoints
		});

		if (profileError) {
			console.error('Failed to update profiles', profileError);
			return fail(500, {
				errors: { general: 'Failed to update player statistics' },
				values: form.data
			});
		}

		const { data: control, error: controlError } = await supabase
			.from('control')
			.select()
			.eq('planet', battle.planet);

		if (controlError || !control) {
			console.error('Failed to fetch control', controlError);
			return fail(500, {
				errors: { general: 'Failed to fetch faction control data' },
				values: form.data
			});
		}

		let winnerControl = control.find((c) => c.profile === winner);
		let loserControl = control.find((c) => c.profile === loser);
		const contestedControl = control.find((c) => c.profile === 'Contested');

		if (!winnerControl) {
			const { data, error } = await supabase
				.from('control')
				.insert({ planet, profile: winner, control: 0 })
				.select()
				.single();
			if (error) {
				console.error('Failed to create winner faction control', error);
				return fail(500, {
					errors: { general: 'Failed to create winner faction control' },
					values: form.data
				});
			}
			winnerControl = data;
		}

		if (!loserControl) {
			const { data, error } = await supabase
				.from('control')
				.insert({ planet, profile: loser, control: 0 })
				.select()
				.single();
			if (error) {
				console.error('Failed to create loser faction control', error);
				return fail(500, {
					errors: { general: 'Failed to create loser faction control' },
					values: form.data
				});
			}
			loserControl = data;
		}

		const updates = [];

		if (contestedControl && contestedControl.control >= 10) {
			updates.push({
				id: winnerControl.id,
				control: Math.min(winnerControl.control + 10, 100)
			});
			updates.push({
				id: contestedControl.id,
				control: Math.max(contestedControl.control - 10, 0)
			});
		} else {
			updates.push({
				id: winnerControl.id,
				control: Math.min(winnerControl.control + 10, 100)
			});
			updates.push({
				id: loserControl.id,
				control: Math.max(loserControl.control - 10, 0)
			});
		}

		for (const update of updates) {
			const { error } = await supabase
				.from('control')
				.update({ control: update.control })
				.eq('id', update.id);
			if (error) {
				console.error('Failed to update faction control', error);
				return fail(500, {
					errors: { general: 'Failed to update faction control' },
					values: form.data
				});
			}
		}

		redirect(303, '/');
	}
};
