import { render, type RenderOptions } from '@testing-library/svelte';
import type { ComponentType, SvelteComponent } from 'svelte';

/**
 * Custom render function with default options
 */
export function renderComponent<T extends SvelteComponent>(
	Component: ComponentType<T>,
	options?: RenderOptions<T>
) {
	return render(Component, {
		...options
	});
}

/**
 * Helper to create mock user data
 */
export function createMockUser(overrides: Record<string, any> = {}) {
	return {
		id: 'test-user-id',
		username: 'testuser',
		email: 'test@example.com',
		battles_won: 5,
		battles_lost: 3,
		battles_drawn: 1,
		total_points: 150,
		created_at: '2023-01-01T00:00:00.000Z',
		...overrides
	};
}

/**
 * Helper to create mock planet data
 */
export function createMockPlanet(overrides: Record<string, any> = {}) {
	return {
		id: 1,
		name: 'Test Planet',
		distance: '25',
		description: 'A test planet for testing purposes',
		...overrides
	};
}

/**
 * Helper to create mock battle data
 */
export function createMockBattle(overrides: Record<string, any> = {}) {
	return {
		id: 1,
		planet: 1,
		battle_type: 'Combat Patrol',
		points: 1000,
		attacker: 1,
		defender: 2,
		attacker_points: 60,
		defender_points: 40,
		result: 'Attacker Victory',
		battle_date: '2023-01-01',
		description: 'Test battle description',
		created_at: '2023-01-01T00:00:00.000Z',
		...overrides
	};
}

/**
 * Helper to create mock faction data
 */
export function createMockFaction(overrides: Record<string, any> = {}) {
	return {
		id: 1,
		name: 'Space Marines',
		allegiance: 'Imperium',
		color: '#0066cc',
		...overrides
	};
}

/**
 * Helper to create mock user faction data
 */
export function createMockUserFaction(overrides: Record<string, any> = {}) {
	return {
		id: 1,
		user_id: 'test-user-id',
		faction_name: 'Space Marines',
		faction_display_name: 'Test Space Marines',
		battles_won: 3,
		battles_lost: 1,
		battles_drawn: 0,
		total_points: 90,
		profiles: {
			username: 'testuser'
		},
		...overrides
	};
}

/**
 * Helper to wait for next tick
 */
export function waitForNextTick() {
	return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Helper to create form data for testing
 */
export function createFormData(data: Record<string, string | number>) {
	const formData = new FormData();
	Object.entries(data).forEach(([key, value]) => {
		formData.append(key, String(value));
	});
	return formData;
}