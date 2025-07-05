import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: planets } = await supabase.from('planets').select();
	const { data: profiles } = await supabase.from('profiles').select();

	return { planets: planets ?? [], profiles: profiles ?? [] };
};

export const actions: Actions = {
	update: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const selectedPlanet = formData.get('selectedPlanet') as string;
		const battleType = formData.get('battleType') as string;
		const points = formData.get('points') as string;
		const attacker = formData.get('attacker') as string;
		const attackerPoints = formData.get('attackerPoints') as string;
		const defender = formData.get('defender') as string;
		const defenderPoints = formData.get('defenderPoints') as string;
		const result = formData.get('result') as string;
		const description = formData.get('description') as string;
		const battleDate = formData.get('battleDate') as string;

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
			return fail(500, {
				selectedPlanet,
				battleType,
				points,
				attacker,
				attackerPoints,
				defender,
				defenderPoints,
				result,
				description,
				battleDate
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
			console.log('Failed to update profiles', profileError);
			return fail(500, { error: 'Failed to update profiles' });
		}

		const { data: control, error: controlError } = await supabase
			.from('control')
			.select()
			.eq('planet', battle.planet);

		if (controlError || !control) {
			console.log('Failed to fetch control', controlError);
			return fail(500, { error: 'Failed to fetch faction control' });
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
				console.log('Failed to create winner faction control', error);
				return fail(500, { error: 'Failed to create winner faction control' });
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
				console.log('Failed to create loser faction control', error);
				return fail(500, { error: 'Failed to create loser faction control' });
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
				console.log('Failed to update faction control', error);
				return fail(500, { error: 'Failed to update faction control' });
			}
		}

		redirect(303, '/');
	}
};
