import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { battleUploadSchema, sanitizeText } from '$lib/validation';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	// Run database queries in parallel and select only needed fields
	const [
		{ data: planets },
		{ data: userFactions }
	] = await Promise.all([
		supabase.from('planets').select('id, name'), // Only fields needed for dropdown
		supabase
			.from('user_factions')
			.select('id, user_id, faction_name, faction_display_name, profiles!inner(username)')
			.order('faction_display_name')
	]);

	const form = await superValidate(
		{ selectedPlanet: 1, battleDate: new Date().toISOString().split('T')[0], points: 500 },
		zod4(battleUploadSchema),
		{ errors: false }
	);

	return { planets: planets ?? [], userFactions: userFactions ?? [], form };
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
		const attackerUserFactionId = form.data.attacker;
		const attackerPoints = form.data.attackerPoints.toString();
		const defenderUserFactionId = form.data.defender;
		const defenderPoints = form.data.defenderPoints.toString();
		const result = form.data.result;
		const description = sanitizedDescription;
		const battleDate = form.data.battleDate;

		// Get user IDs from user_faction IDs for backward compatibility
		const { data: attackerUserFaction } = await supabase
			.from('user_factions')
			.select('user_id')
			.eq('id', attackerUserFactionId)
			.single();

		const { data: defenderUserFaction } = await supabase
			.from('user_factions')
			.select('user_id')
			.eq('id', defenderUserFactionId)
			.single();

		if (!attackerUserFaction || !defenderUserFaction) {
			return fail(400, {
				errors: { general: 'Invalid faction selection' },
				values: form.data
			});
		}

		const battle = {
			planet: Number(selectedPlanet),
			battle_type: battleType,
			points,
			attacker: attackerUserFaction.user_id,
			attacker_points: attackerPoints,
			defender: defenderUserFaction.user_id,
			defender_points: Number(defenderPoints),
			result,
			description,
			battle_date: new Date(battleDate),
			attacker_user_faction_id: attackerUserFactionId,
			defender_user_faction_id: defenderUserFactionId
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
		const winnerUserFactionId = battle.result === 'Attacker Victory' ? attackerUserFactionId : defenderUserFactionId;
		const loserUserFactionId = battle.result === 'Attacker Victory' ? defenderUserFactionId : attackerUserFactionId;
		const winner = battle.result === 'Attacker Victory' ? battle.attacker : battle.defender;
		const loser = battle.result === 'Attacker Victory' ? battle.defender : battle.attacker;

		// Update user faction stats using direct SQL execution
		try {
			if (result === 'Draw') {
				// Both get a draw
				await supabase.rpc('execute_sql', {
					query: `UPDATE user_factions SET battles_drawn = battles_drawn + 1 WHERE id IN (${winnerUserFactionId}, ${loserUserFactionId})`
				});
			} else {
				// Winner gets win, loser gets loss
				await supabase.rpc('execute_sql', {
					query: `UPDATE user_factions SET battles_won = battles_won + 1 WHERE id = ${winnerUserFactionId}`
				});
				await supabase.rpc('execute_sql', {
					query: `UPDATE user_factions SET battles_lost = battles_lost + 1 WHERE id = ${loserUserFactionId}`
				});
			}

			// Update total points for both user factions
			const winnerPoints = battle.result === 'Attacker Victory' ? Number(attackerPoints) : Number(defenderPoints);
			const loserPoints = battle.result === 'Attacker Victory' ? Number(defenderPoints) : Number(attackerPoints);

			await supabase.rpc('execute_sql', {
				query: `UPDATE user_factions SET total_points = total_points + ${winnerPoints} WHERE id = ${winnerUserFactionId}`
			});
			await supabase.rpc('execute_sql', {
				query: `UPDATE user_factions SET total_points = total_points + ${loserPoints} WHERE id = ${loserUserFactionId}`
			});
		} catch (error) {
			console.error('Failed to update user faction stats:', error);
		}

		// Update legacy profile stats for backward compatibility
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

		let winnerControl = control.find((c) => c.user_faction_id === winnerUserFactionId);
		let loserControl = control.find((c) => c.user_faction_id === loserUserFactionId);
		const contestedControl = control.find((c) => c.profile === 'Contested');

		if (!winnerControl) {
			const { data, error } = await supabase
				.from('control')
				.insert({ planet, user_faction_id: winnerUserFactionId, control: 0 })
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
				.insert({ planet, user_faction_id: loserUserFactionId, control: 0 })
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
