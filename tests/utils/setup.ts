import { expect, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/svelte';
import '@testing-library/jest-dom';

// Cleanup after each test
beforeEach(() => {
	cleanup();
});

// Mock environment variables for testing
global.process = global.process || {};
global.process.env = global.process.env || {};

// Mock SvelteKit environment variables
global.process.env.PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
global.process.env.PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Mock fetch for API calls
global.fetch =
	global.fetch ||
	(() =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve({}),
			text: () => Promise.resolve(''),
			status: 200,
			statusText: 'OK'
		}));

// Mock console.error to avoid spam during tests
const originalError = console.error;
console.error = (...args: any[]) => {
	// Ignore certain warnings during tests
	if (
		args[0]?.includes?.('Warning: ') ||
		args[0]?.includes?.('console.warn') ||
		args[0]?.includes?.('Deprecation warning')
	) {
		return;
	}
	originalError.call(console, ...args);
};

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
	root = null;
	rootMargin = '';
	thresholds = [];
	constructor() {}
	disconnect() {}
	observe() {}
	unobserve() {}
	takeRecords() {
		return [];
	}
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
	constructor() {}
	disconnect() {}
	observe() {}
	unobserve() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => {}
	})
});

// Mock URL constructor for relative paths
global.URL =
	global.URL ||
	class URL {
		constructor(public href: string) {}
		toString() {
			return this.href;
		}
	};

export {};
