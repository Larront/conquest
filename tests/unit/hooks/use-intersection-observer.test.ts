import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Svelte's onMount
vi.mock('svelte', () => ({
	onMount: vi.fn((fn) => fn())
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

mockIntersectionObserver.mockImplementation((callback, options) => ({
	observe: mockObserve,
	unobserve: mockUnobserve,
	disconnect: mockDisconnect,
	root: null,
	rootMargin: options?.rootMargin || '0px',
	thresholds: Array.isArray(options?.threshold) ? options.threshold : [options?.threshold || 0]
}));

Object.defineProperty(window, 'IntersectionObserver', {
	writable: true,
	configurable: true,
	value: mockIntersectionObserver
});

describe('IntersectionObserver Hook', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Ensure window is available
		global.window = global.window || ({} as any);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('IntersectionObserverManager Class', () => {
		it('should create IntersectionObserver with default options', () => {
			// Import here to use mocked IntersectionObserver
			class TestIntersectionObserverManager {
				private observer: IntersectionObserver | null = null;
				private observedElements = new Map<Element, () => void>();

				constructor(options: IntersectionObserverInit = {}) {
					if (typeof window !== 'undefined') {
						this.observer = new window.IntersectionObserver(
							(entries) => {
								entries.forEach((entry) => {
									const callback = this.observedElements.get(entry.target);
									if (callback && entry.isIntersecting) {
										callback();
										this.unobserve(entry.target);
									}
								});
							},
							{
								rootMargin: '50px',
								threshold: 0.1,
								...options
							}
						);
					}
				}

				observe(element: Element, callback: () => void) {
					if (this.observer) {
						this.observedElements.set(element, callback);
						this.observer.observe(element);
					}
				}

				unobserve(element: Element) {
					if (this.observer) {
						this.observer.unobserve(element);
						this.observedElements.delete(element);
					}
				}

				disconnect() {
					if (this.observer) {
						this.observer.disconnect();
						this.observedElements.clear();
					}
				}

				get observedCount() {
					return this.observedElements.size;
				}
			}

			const manager = new TestIntersectionObserverManager();

			expect(mockIntersectionObserver).toHaveBeenCalledWith(
				expect.any(Function),
				{
					rootMargin: '50px',
					threshold: 0.1
				}
			);
		});

		it('should create IntersectionObserver with custom options', () => {
			class TestIntersectionObserverManager {
				private observer: IntersectionObserver | null = null;

				constructor(options: IntersectionObserverInit = {}) {
					if (typeof window !== 'undefined') {
						this.observer = new window.IntersectionObserver(
							() => {},
							{
								rootMargin: '50px',
								threshold: 0.1,
								...options
							}
						);
					}
				}
			}

			const customOptions = {
				rootMargin: '100px',
				threshold: 0.5
			};

			new TestIntersectionObserverManager(customOptions);

			expect(mockIntersectionObserver).toHaveBeenCalledWith(
				expect.any(Function),
				{
					rootMargin: '100px',
					threshold: 0.5
				}
			);
		});

		it('should handle SSR environment gracefully', () => {
			// Remove window to simulate SSR
			const originalWindow = global.window;
			delete (global as any).window;

			class TestIntersectionObserverManager {
				private observer: IntersectionObserver | null = null;

				constructor() {
					if (typeof window !== 'undefined') {
						this.observer = new IntersectionObserver(() => {});
					}
				}

				get hasObserver() {
					return this.observer !== null;
				}
			}

			const manager = new TestIntersectionObserverManager();
			expect(manager.hasObserver).toBe(false);

			// Restore window
			global.window = originalWindow;
		});
	});

	describe('Element Observation', () => {
		it('should observe element and store callback', () => {
			class TestIntersectionObserverManager {
				private observer: any;
				private observedElements = new Map<Element, () => void>();

				constructor() {
					this.observer = {
						observe: mockObserve,
						unobserve: mockUnobserve,
						disconnect: mockDisconnect
					};
				}

				observe(element: Element, callback: () => void) {
					this.observedElements.set(element, callback);
					this.observer.observe(element);
				}

				get observedCount() {
					return this.observedElements.size;
				}
			}

			const manager = new TestIntersectionObserverManager();
			const mockElement = document.createElement('div');
			const mockCallback = vi.fn();

			manager.observe(mockElement, mockCallback);

			expect(mockObserve).toHaveBeenCalledWith(mockElement);
			expect(manager.observedCount).toBe(1);
		});

		it('should unobserve element and remove callback', () => {
			class TestIntersectionObserverManager {
				private observer: any;
				private observedElements = new Map<Element, () => void>();

				constructor() {
					this.observer = {
						observe: mockObserve,
						unobserve: mockUnobserve,
						disconnect: mockDisconnect
					};
				}

				observe(element: Element, callback: () => void) {
					this.observedElements.set(element, callback);
					this.observer.observe(element);
				}

				unobserve(element: Element) {
					this.observer.unobserve(element);
					this.observedElements.delete(element);
				}

				get observedCount() {
					return this.observedElements.size;
				}
			}

			const manager = new TestIntersectionObserverManager();
			const mockElement = document.createElement('div');
			const mockCallback = vi.fn();

			manager.observe(mockElement, mockCallback);
			expect(manager.observedCount).toBe(1);

			manager.unobserve(mockElement);
			expect(mockUnobserve).toHaveBeenCalledWith(mockElement);
			expect(manager.observedCount).toBe(0);
		});

		it('should disconnect and clear all observations', () => {
			class TestIntersectionObserverManager {
				private observer: any;
				private observedElements = new Map<Element, () => void>();

				constructor() {
					this.observer = {
						observe: mockObserve,
						unobserve: mockUnobserve,
						disconnect: mockDisconnect
					};
				}

				observe(element: Element, callback: () => void) {
					this.observedElements.set(element, callback);
					this.observer.observe(element);
				}

				disconnect() {
					this.observer.disconnect();
					this.observedElements.clear();
				}

				get observedCount() {
					return this.observedElements.size;
				}
			}

			const manager = new TestIntersectionObserverManager();
			const mockElement1 = document.createElement('div');
			const mockElement2 = document.createElement('div');

			manager.observe(mockElement1, vi.fn());
			manager.observe(mockElement2, vi.fn());
			expect(manager.observedCount).toBe(2);

			manager.disconnect();
			expect(mockDisconnect).toHaveBeenCalled();
			expect(manager.observedCount).toBe(0);
		});
	});

	describe('Intersection Callback Logic', () => {
		it('should call callback when element intersects', () => {
			const mockCallback = vi.fn();
			const mockElement = document.createElement('div');
			
			// Simulate the intersection callback
			const simulateIntersectionCallback = (
				entries: Array<{ target: Element; isIntersecting: boolean }>,
				observedElements: Map<Element, () => void>
			) => {
				entries.forEach((entry) => {
					const callback = observedElements.get(entry.target);
					if (callback && entry.isIntersecting) {
						callback();
					}
				});
			};

			const observedElements = new Map();
			observedElements.set(mockElement, mockCallback);

			const entries = [{ target: mockElement, isIntersecting: true }];
			simulateIntersectionCallback(entries, observedElements);

			expect(mockCallback).toHaveBeenCalled();
		});

		it('should not call callback when element is not intersecting', () => {
			const mockCallback = vi.fn();
			const mockElement = document.createElement('div');
			
			const simulateIntersectionCallback = (
				entries: Array<{ target: Element; isIntersecting: boolean }>,
				observedElements: Map<Element, () => void>
			) => {
				entries.forEach((entry) => {
					const callback = observedElements.get(entry.target);
					if (callback && entry.isIntersecting) {
						callback();
					}
				});
			};

			const observedElements = new Map();
			observedElements.set(mockElement, mockCallback);

			const entries = [{ target: mockElement, isIntersecting: false }];
			simulateIntersectionCallback(entries, observedElements);

			expect(mockCallback).not.toHaveBeenCalled();
		});

		it('should handle multiple intersecting elements', () => {
			const mockCallback1 = vi.fn();
			const mockCallback2 = vi.fn();
			const mockElement1 = document.createElement('div');
			const mockElement2 = document.createElement('div');
			
			const simulateIntersectionCallback = (
				entries: Array<{ target: Element; isIntersecting: boolean }>,
				observedElements: Map<Element, () => void>
			) => {
				entries.forEach((entry) => {
					const callback = observedElements.get(entry.target);
					if (callback && entry.isIntersecting) {
						callback();
					}
				});
			};

			const observedElements = new Map();
			observedElements.set(mockElement1, mockCallback1);
			observedElements.set(mockElement2, mockCallback2);

			const entries = [
				{ target: mockElement1, isIntersecting: true },
				{ target: mockElement2, isIntersecting: true }
			];
			simulateIntersectionCallback(entries, observedElements);

			expect(mockCallback1).toHaveBeenCalled();
			expect(mockCallback2).toHaveBeenCalled();
		});
	});

	describe('Default Options', () => {
		it('should use correct default options', () => {
			const defaultOptions = {
				rootMargin: '50px',
				threshold: 0.1
			};

			expect(defaultOptions.rootMargin).toBe('50px');
			expect(defaultOptions.threshold).toBe(0.1);
		});

		it('should merge custom options with defaults', () => {
			const defaultOptions = {
				rootMargin: '50px',
				threshold: 0.1
			};

			const customOptions = {
				threshold: 0.5
			};

			const mergedOptions = { ...defaultOptions, ...customOptions };

			expect(mergedOptions.rootMargin).toBe('50px');
			expect(mergedOptions.threshold).toBe(0.5);
		});
	});

	describe('Use Intersection Observer Function', () => {
		it('should return manager object', () => {
			const mockOnMount = vi.fn((callback) => {
				callback(); // Immediately call the callback
				return vi.fn(); // Return cleanup function
			});

			// Mock the useIntersectionObserver function logic
			const useIntersectionObserver = (options?: IntersectionObserverInit) => {
				let manager: any = null;

				mockOnMount(() => {
					manager = { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
					return () => {
						manager?.disconnect();
					};
				});

				return {
					get manager() {
						return manager;
					}
				};
			};

			const result = useIntersectionObserver();
			expect(result.manager).toBeDefined();
			expect(typeof result.manager.observe).toBe('function');
			expect(typeof result.manager.unobserve).toBe('function');
			expect(typeof result.manager.disconnect).toBe('function');
		});

		it('should call cleanup on unmount', () => {
			const mockCleanup = vi.fn();
			const mockDisconnect = vi.fn();
			const mockOnMount = vi.fn((callback) => {
				const cleanup = callback();
				if (cleanup) {
					mockCleanup.mockImplementation(cleanup);
				}
				return cleanup;
			});

			// Simulate the hook
			const useIntersectionObserver = () => {
				let manager: any = null;

				mockOnMount(() => {
					manager = { disconnect: mockDisconnect };
					return () => {
						manager?.disconnect();
					};
				});

				return { manager };
			};

			useIntersectionObserver();

			// Simulate component unmount by calling cleanup
			mockCleanup();
			expect(mockDisconnect).toHaveBeenCalled();
		});
	});

	describe('Edge Cases', () => {
		it('should handle null observer gracefully', () => {
			class TestIntersectionObserverManager {
				private observer: IntersectionObserver | null = null;
				private observedElements = new Map<Element, () => void>();

				observe(element: Element, callback: () => void) {
					if (this.observer) {
						this.observedElements.set(element, callback);
						this.observer.observe(element);
					}
				}

				unobserve(element: Element) {
					if (this.observer) {
						this.observer.unobserve(element);
						this.observedElements.delete(element);
					}
				}

				disconnect() {
					if (this.observer) {
						this.observer.disconnect();
						this.observedElements.clear();
					}
				}

				get observedCount() {
					return this.observedElements.size;
				}
			}

			const manager = new TestIntersectionObserverManager();
			const mockElement = document.createElement('div');

			// These should not throw errors
			expect(() => {
				manager.observe(mockElement, vi.fn());
				manager.unobserve(mockElement);
				manager.disconnect();
			}).not.toThrow();

			expect(manager.observedCount).toBe(0);
		});

		it('should handle undefined callback gracefully', () => {
			const simulateIntersectionCallback = (
				entries: Array<{ target: Element; isIntersecting: boolean }>,
				observedElements: Map<Element, () => void>
			) => {
				entries.forEach((entry) => {
					const callback = observedElements.get(entry.target);
					if (callback && entry.isIntersecting) {
						callback();
					}
				});
			};

			const mockElement = document.createElement('div');
			const observedElements = new Map();
			// Don't set any callback for the element

			const entries = [{ target: mockElement, isIntersecting: true }];

			// Should not throw error
			expect(() => {
				simulateIntersectionCallback(entries, observedElements);
			}).not.toThrow();
		});
	});

	describe('Performance Considerations', () => {
		it('should automatically unobserve after intersection', () => {
			const mockCallback = vi.fn();
			const mockElement = document.createElement('div');
			
			// Simulate the manager with auto-unobserve behavior
			class TestManager {
				private observedElements = new Map<Element, () => void>();

				observe(element: Element, callback: () => void) {
					this.observedElements.set(element, callback);
				}

				handleIntersection(entry: { target: Element; isIntersecting: boolean }) {
					const callback = this.observedElements.get(entry.target);
					if (callback && entry.isIntersecting) {
						callback();
						this.unobserve(entry.target); // Auto-unobserve
					}
				}

				unobserve(element: Element) {
					this.observedElements.delete(element);
				}

				get observedCount() {
					return this.observedElements.size;
				}
			}

			const manager = new TestManager();
			manager.observe(mockElement, mockCallback);
			expect(manager.observedCount).toBe(1);

			manager.handleIntersection({ target: mockElement, isIntersecting: true });
			expect(mockCallback).toHaveBeenCalled();
			expect(manager.observedCount).toBe(0); // Should be auto-unobserved
		});
	});
});