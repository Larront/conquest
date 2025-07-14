import '@testing-library/jest-dom';
import { beforeAll, vi } from 'vitest';

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
	observe: vi.fn(),
	disconnect: vi.fn(),
	unobserve: vi.fn()
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
	observe: vi.fn(),
	disconnect: vi.fn(),
	unobserve: vi.fn()
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
	writable: true,
	value: vi.fn()
});

// Mock fetch
global.fetch = vi.fn();

beforeAll(() => {
	// Reset all mocks before each test
	vi.clearAllMocks();
});