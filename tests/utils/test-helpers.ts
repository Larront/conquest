import { render, type RenderResult } from '@testing-library/svelte';
import { vi } from 'vitest';
import { createMockSupabaseClient, createMockAuthSession } from './mock-supabase';

/**
 * Mock SvelteKit's page store
 */
export const mockPageStore = (url: string = '/', params: Record<string, string> = {}) => ({
	url: new URL(url, 'http://localhost:3000'),
	params,
	route: { id: '/test' },
	status: 200,
	error: null,
	data: {},
	form: null
});

/**
 * Mock SvelteKit's navigation functions
 */
export const mockNavigation = () => ({
	goto: vi.fn(),
	invalidate: vi.fn(),
	invalidateAll: vi.fn(),
	preloadData: vi.fn(),
	preloadCode: vi.fn(),
	beforeNavigate: vi.fn(),
	afterNavigate: vi.fn(),
	pushState: vi.fn(),
	replaceState: vi.fn()
});

/**
 * Mock form data for testing
 */
export const createMockFormData = (data: Record<string, string | File>): FormData => {
	const formData = new FormData();
	Object.entries(data).forEach(([key, value]) => {
		formData.append(key, value);
	});
	return formData;
};

/**
 * Mock file for file upload testing
 */
export const createMockFile = (
	name: string = 'test.txt',
	content: string = 'test content',
	type: string = 'text/plain'
): File => {
	const blob = new Blob([content], { type });
	return new File([blob], name, { type });
};

/**
 * Wait for async operations to complete
 */
export const waitForAsync = (ms: number = 0): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Mock window.location
 */
export const mockLocation = (href: string = 'http://localhost:3000/') => {
	const location = new URL(href);
	Object.defineProperty(window, 'location', {
		value: {
			href: location.href,
			origin: location.origin,
			protocol: location.protocol,
			host: location.host,
			hostname: location.hostname,
			port: location.port,
			pathname: location.pathname,
			search: location.search,
			hash: location.hash,
			assign: vi.fn(),
			replace: vi.fn(),
			reload: vi.fn()
		},
		writable: true
	});
	return window.location;
};

/**
 * Mock local storage
 */
export const mockLocalStorage = () => {
	const store: Record<string, string> = {};

	Object.defineProperty(window, 'localStorage', {
		value: {
			getItem: vi.fn((key: string) => store[key] || null),
			setItem: vi.fn((key: string, value: string) => {
				store[key] = value;
			}),
			removeItem: vi.fn((key: string) => {
				delete store[key];
			}),
			clear: vi.fn(() => {
				Object.keys(store).forEach((key) => delete store[key]);
			}),
			length: Object.keys(store).length,
			key: vi.fn((index: number) => Object.keys(store)[index] || null)
		},
		writable: true
	});

	return window.localStorage;
};

/**
 * Mock session storage
 */
export const mockSessionStorage = () => {
	const store: Record<string, string> = {};

	Object.defineProperty(window, 'sessionStorage', {
		value: {
			getItem: vi.fn((key: string) => store[key] || null),
			setItem: vi.fn((key: string, value: string) => {
				store[key] = value;
			}),
			removeItem: vi.fn((key: string) => {
				delete store[key];
			}),
			clear: vi.fn(() => {
				Object.keys(store).forEach((key) => delete store[key]);
			}),
			length: Object.keys(store).length,
			key: vi.fn((index: number) => Object.keys(store)[index] || null)
		},
		writable: true
	});

	return window.sessionStorage;
};

/**
 * Create a mock event
 */
export const createMockEvent = (type: string, options: EventInit = {}) => {
	return new Event(type, options);
};

/**
 * Create a mock keyboard event
 */
export const createMockKeyboardEvent = (
	type: string,
	key: string,
	options: KeyboardEventInit = {}
) => {
	return new KeyboardEvent(type, { key, ...options });
};

/**
 * Create a mock mouse event
 */
export const createMockMouseEvent = (type: string, options: MouseEventInit = {}) => {
	return new MouseEvent(type, options);
};

/**
 * Utility to suppress console warnings during tests
 */
export const suppressConsoleWarnings = () => {
	const originalWarn = console.warn;
	console.warn = vi.fn();
	return () => {
		console.warn = originalWarn;
	};
};

/**
 * Utility to suppress console errors during tests
 */
export const suppressConsoleErrors = () => {
	const originalError = console.error;
	console.error = vi.fn();
	return () => {
		console.error = originalError;
	};
};

export {};
