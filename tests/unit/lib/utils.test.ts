import { describe, it, expect } from 'vitest';
import { cn } from '$lib/utils';

describe('cn (className utility)', () => {
	it('should merge basic class names', () => {
		const result = cn('class1', 'class2');
		expect(result).toBe('class1 class2');
	});

	it('should handle conditional classes', () => {
		const result = cn('base', true && 'conditional', false && 'hidden');
		expect(result).toBe('base conditional');
	});

	it('should handle array of classes', () => {
		const result = cn(['class1', 'class2'], 'class3');
		expect(result).toBe('class1 class2 class3');
	});

	it('should handle object with boolean values', () => {
		const result = cn({
			active: true,
			disabled: false,
			visible: true
		});
		expect(result).toBe('active visible');
	});

	it('should merge tailwind classes correctly', () => {
		// tailwind-merge should handle conflicting classes
		const result = cn('p-4', 'p-8');
		expect(result).toBe('p-8'); // p-8 should override p-4
	});

	it('should handle complex tailwind class merging', () => {
		const result = cn('bg-red-500', 'bg-blue-500', 'text-white');
		expect(result).toBe('bg-blue-500 text-white'); // bg-blue-500 should override bg-red-500
	});

	it('should handle multiple overlapping classes', () => {
		const result = cn('p-2 m-2', 'p-4 text-red-500');
		expect(result).toBe('m-2 p-4 text-red-500'); // p-4 should override p-2
	});

	it('should handle empty inputs', () => {
		const result = cn('', null, undefined, false);
		expect(result).toBe('');
	});

	it('should handle nested arrays and objects', () => {
		const result = cn('base', ['nested', { conditional: true }], 'final');
		expect(result).toBe('base nested conditional final');
	});

	it('should handle whitespace normalization', () => {
		const result = cn('  class1  ', '  class2  ');
		expect(result).toBe('class1 class2');
	});

	it('should handle responsive classes', () => {
		const result = cn('text-sm', 'md:text-base', 'lg:text-lg');
		expect(result).toBe('text-sm md:text-base lg:text-lg');
	});

	it('should handle state variants', () => {
		const result = cn('bg-blue-500', 'hover:bg-blue-600', 'focus:bg-blue-700');
		expect(result).toBe('bg-blue-500 hover:bg-blue-600 focus:bg-blue-700');
	});

	it('should handle complex real-world example', () => {
		const isActive = true;
		const variant = 'primary';
		const size = 'lg';

		const result = cn(
			'base-button',
			{
				active: isActive,
				inactive: !isActive
			},
			variant === 'primary' && 'btn-primary',
			size === 'lg' && 'btn-lg',
			'hover:opacity-90'
		);

		expect(result).toBe('base-button active btn-primary btn-lg hover:opacity-90');
	});
});
