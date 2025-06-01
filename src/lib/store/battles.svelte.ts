import type { Battle } from '../types';

export function battleService() {
	let battles = $state<Battle[]>([]);

	async function submitBattle(battleData: Omit<Battle, 'id' | 'created_at'>): Promise<Battle> {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const battle: Battle = {
			...battleData,
			id: Date.now().toString(),
			created_at: new Date().toISOString()
		};

		battles = [...battles, battle];
		return battle;
	}

	async function getBattles(): Promise<Battle[]> {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500));
		return battles;
	}

	return {
		submitBattle,
		getBattles
	};
}
