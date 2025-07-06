/**
 * Intersection Observer hook for performance optimization
 * Only renders elements when they come into viewport
 */

import { onMount } from 'svelte';

export class IntersectionObserverManager {
	private observer: IntersectionObserver | null = null;
	private observedElements = new Map<Element, () => void>();

	constructor(options: IntersectionObserverInit = {}) {
		if (typeof window !== 'undefined') {
			this.observer = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					const callback = this.observedElements.get(entry.target);
					if (callback) {
						if (entry.isIntersecting) {
							callback();
							// Once intersected, we can stop observing this element
							this.unobserve(entry.target);
						}
					}
				});
			}, {
				rootMargin: '50px', // Start loading 50px before entering viewport
				threshold: 0.1,
				...options
			});
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
}

export function useIntersectionObserver(options?: IntersectionObserverInit) {
	let manager: IntersectionObserverManager | null = $state(null);

	onMount(() => {
		manager = new IntersectionObserverManager(options);
		
		return () => {
			manager?.disconnect();
		};
	});

	return {
		get manager() {
			return manager;
		}
	};
}