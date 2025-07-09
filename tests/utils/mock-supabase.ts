import { vi } from 'vitest';

export const createMockSupabaseClient = () => {
	const mockClient = {
		auth: {
			signUp: vi.fn(),
			signInWithPassword: vi.fn(),
			signOut: vi.fn(),
			resetPasswordForEmail: vi.fn(),
			updateUser: vi.fn(),
			getSession: vi.fn(),
			onAuthStateChange: vi.fn(),
			getUser: vi.fn()
		},
		from: vi.fn(() => ({
			select: vi.fn().mockReturnThis(),
			insert: vi.fn().mockReturnThis(),
			update: vi.fn().mockReturnThis(),
			delete: vi.fn().mockReturnThis(),
			eq: vi.fn().mockReturnThis(),
			neq: vi.fn().mockReturnThis(),
			gt: vi.fn().mockReturnThis(),
			lt: vi.fn().mockReturnThis(),
			gte: vi.fn().mockReturnThis(),
			lte: vi.fn().mockReturnThis(),
			like: vi.fn().mockReturnThis(),
			ilike: vi.fn().mockReturnThis(),
			is: vi.fn().mockReturnThis(),
			in: vi.fn().mockReturnThis(),
			contains: vi.fn().mockReturnThis(),
			containedBy: vi.fn().mockReturnThis(),
			rangeGt: vi.fn().mockReturnThis(),
			rangeLt: vi.fn().mockReturnThis(),
			rangeGte: vi.fn().mockReturnThis(),
			rangeLte: vi.fn().mockReturnThis(),
			rangeAdjacent: vi.fn().mockReturnThis(),
			overlaps: vi.fn().mockReturnThis(),
			textSearch: vi.fn().mockReturnThis(),
			match: vi.fn().mockReturnThis(),
			not: vi.fn().mockReturnThis(),
			or: vi.fn().mockReturnThis(),
			filter: vi.fn().mockReturnThis(),
			order: vi.fn().mockReturnThis(),
			limit: vi.fn().mockReturnThis(),
			range: vi.fn().mockReturnThis(),
			abortSignal: vi.fn().mockReturnThis(),
			single: vi.fn().mockReturnThis(),
			maybeSingle: vi.fn().mockReturnThis(),
			csv: vi.fn().mockReturnThis(),
			geojson: vi.fn().mockReturnThis(),
			explain: vi.fn().mockReturnThis(),
			rollback: vi.fn().mockReturnThis(),
			returns: vi.fn().mockReturnThis(),
			then: vi.fn()
		})),
		rpc: vi.fn(),
		storage: {
			from: vi.fn(() => ({
				upload: vi.fn(),
				download: vi.fn(),
				list: vi.fn(),
				remove: vi.fn(),
				createSignedUrl: vi.fn(),
				createSignedUrls: vi.fn(),
				getPublicUrl: vi.fn()
			}))
		},
		realtime: {
			channel: vi.fn(() => ({
				on: vi.fn().mockReturnThis(),
				subscribe: vi.fn().mockReturnThis(),
				unsubscribe: vi.fn().mockReturnThis()
			}))
		},
		channel: vi.fn(() => ({
			on: vi.fn().mockReturnThis(),
			subscribe: vi.fn().mockReturnThis(),
			unsubscribe: vi.fn().mockReturnThis()
		}))
	};

	return mockClient;
};

export const createMockAuthSession = () => ({
	access_token: 'mock-access-token',
	refresh_token: 'mock-refresh-token',
	expires_in: 3600,
	token_type: 'bearer',
	user: {
		id: 'mock-user-id',
		email: 'test@example.com',
		email_confirmed_at: '2023-01-01T00:00:00.000Z',
		phone: null,
		phone_confirmed_at: null,
		confirmed_at: '2023-01-01T00:00:00.000Z',
		created_at: '2023-01-01T00:00:00.000Z',
		updated_at: '2023-01-01T00:00:00.000Z',
		last_sign_in_at: '2023-01-01T00:00:00.000Z',
		app_metadata: {},
		user_metadata: {},
		aud: 'authenticated',
		role: 'authenticated'
	}
});

export const createMockUser = () => ({
	id: 'mock-user-id',
	username: 'testuser',
	email: 'test@example.com',
	battles_won: 5,
	battles_lost: 3,
	battles_drawn: 1,
	total_points: 150,
	faction: 1,
	created_at: '2023-01-01T00:00:00.000Z',
	updated_at: '2023-01-01T00:00:00.000Z'
});

export const createMockBattle = () => ({
	id: 1,
	user_id: 'mock-user-id',
	planet_id: 1,
	battle_type: 'Combat Patrol',
	points: 1000,
	attacker_faction: 1,
	defender_faction: 2,
	attacker_points: 60,
	defender_points: 40,
	result: 'Attacker Victory',
	battle_date: '2023-01-01',
	created_at: '2023-01-01T00:00:00.000Z'
});

export const createMockPlanet = () => ({
	id: 1,
	name: 'Test Planet',
	sector: 'Test Sector',
	population: 1000000,
	strategic_value: 'High',
	terrain: 'Urban',
	status: 'Active',
	created_at: '2023-01-01T00:00:00.000Z',
	updated_at: '2023-01-01T00:00:00.000Z'
});

export const createMockFaction = () => ({
	id: 1,
	name: 'Test Faction',
	color: '#FF0000',
	description: 'A test faction',
	created_at: '2023-01-01T00:00:00.000Z',
	updated_at: '2023-01-01T00:00:00.000Z'
});

export const mockSupabaseResponse = (data: any, error: any = null) => ({
	data,
	error,
	count: Array.isArray(data) ? data.length : data ? 1 : 0,
	status: error ? 400 : 200,
	statusText: error ? 'Bad Request' : 'OK'
});

export const mockSupabaseError = (message: string, code: string = 'MOCK_ERROR') => ({
	message,
	code,
	details: null,
	hint: null
});

export {};
