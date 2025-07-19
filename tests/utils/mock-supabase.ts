import { vi } from 'vitest';

/**
 * Mock Supabase client for testing
 */
export function createMockSupabaseClient() {
	const mockSelect = vi.fn().mockReturnThis();
	const mockInsert = vi.fn().mockReturnThis();
	const mockUpdate = vi.fn().mockReturnThis();
	const mockDelete = vi.fn().mockReturnThis();
	const mockEq = vi.fn().mockReturnThis();
	const mockSingle = vi.fn();
	const mockOrder = vi.fn().mockReturnThis();
	const mockLimit = vi.fn().mockReturnThis();
	const mockRange = vi.fn().mockReturnThis();

	const mockFrom = vi.fn(() => ({
		select: mockSelect,
		insert: mockInsert,
		update: mockUpdate,
		delete: mockDelete,
		eq: mockEq,
		single: mockSingle,
		order: mockOrder,
		limit: mockLimit,
		range: mockRange
	}));

	const mockSignUp = vi.fn();
	const mockSignInWithPassword = vi.fn();
	const mockSignOut = vi.fn();
	const mockGetUser = vi.fn();
	const mockGetSession = vi.fn();
	const mockOnAuthStateChange = vi.fn(() => ({
		data: { subscription: { unsubscribe: vi.fn() } }
	}));
	const mockUpdateUser = vi.fn();

	const mockAuth = {
		signUp: mockSignUp,
		signInWithPassword: mockSignInWithPassword,
		signOut: mockSignOut,
		getUser: mockGetUser,
		getSession: mockGetSession,
		onAuthStateChange: mockOnAuthStateChange,
		updateUser: mockUpdateUser,
		resetPasswordForEmail: vi.fn()
	};

	const mockSupabase = {
		from: mockFrom,
		auth: mockAuth
	};

	return {
		mockSupabase,
		mockFrom,
		mockSelect,
		mockInsert,
		mockUpdate,
		mockDelete,
		mockEq,
		mockSingle,
		mockOrder,
		mockLimit,
		mockRange,
		mockAuth,
		mockSignUp,
		mockSignInWithPassword,
		mockSignOut,
		mockGetUser,
		mockGetSession,
		mockOnAuthStateChange,
		mockUpdateUser
	};
}

/**
 * Mock successful Supabase response
 */
export function createSuccessResponse<T>(data: T) {
	return {
		data,
		error: null,
		status: 200,
		statusText: 'OK'
	};
}

/**
 * Mock error Supabase response
 */
export function createErrorResponse(message: string, code?: string) {
	return {
		data: null,
		error: {
			message,
			code: code || 'error',
			details: null,
			hint: null
		},
		status: 400,
		statusText: 'Bad Request'
	};
}

/**
 * Mock auth user
 */
export function createMockAuthUser(overrides: Record<string, any> = {}) {
	return {
		id: 'auth-user-id',
		email: 'test@example.com',
		email_confirmed_at: '2023-01-01T00:00:00.000Z',
		created_at: '2023-01-01T00:00:00.000Z',
		updated_at: '2023-01-01T00:00:00.000Z',
		...overrides
	};
}

/**
 * Mock auth session
 */
export function createMockAuthSession(overrides: Record<string, any> = {}) {
	return {
		access_token: 'mock-access-token',
		refresh_token: 'mock-refresh-token',
		expires_in: 3600,
		expires_at: Date.now() + 3600 * 1000,
		token_type: 'bearer',
		user: createMockAuthUser(),
		...overrides
	};
}