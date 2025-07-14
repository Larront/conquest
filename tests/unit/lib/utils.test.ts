import { describe, it, expect } from 'vitest';
import { cn } from '$lib/utils';

describe('cn utility function', () => {
	it('should merge class names correctly', () => {
		const result = cn('class1', 'class2');
		expect(result).toBe('class1 class2');
	});

	it('should handle conditional classes', () => {
		const result = cn('base', true && 'conditional', false && 'hidden');
		expect(result).toBe('base conditional');
	});

	it('should handle arrays of classes', () => {
		const result = cn(['class1', 'class2'], 'class3');
		expect(result).toBe('class1 class2 class3');
	});

	it('should handle objects with boolean values', () => {
		const result = cn({
			'class1': true,
			'class2': false,
			'class3': true
		});
		expect(result).toBe('class1 class3');
	});

	it('should merge Tailwind classes and resolve conflicts', () => {
		// This tests that tailwind-merge is working
		const result = cn('px-2 py-1 px-3');
		expect(result).toBe('py-1 px-3'); // px-3 should override px-2
	});

	it('should handle empty inputs', () => {
		expect(cn()).toBe('');
		expect(cn('')).toBe('');
		expect(cn(null)).toBe('');
		expect(cn(undefined)).toBe('');
	});

	it('should handle complex combinations', () => {
		const isActive = true;
		const size = 'large';
		
		const result = cn(
			'base-class',
			isActive && 'active',
			{
				'size-small': size === 'small',
				'size-large': size === 'large'
			},
			['additional', 'classes']
		);
		
		expect(result).toBe('base-class active size-large additional classes');
	});

	it('should handle whitespace correctly', () => {
		const result = cn('  class1  ', '  class2  ');
		expect(result).toBe('class1 class2');
	});

	it('should handle duplicate classes', () => {
		const result = cn('class1 class2', 'class1 class3');
		// clsx doesn't dedupe by default, so duplicates are expected
		expect(result).toBe('class1 class2 class1 class3');
	});
});

// Test the TypeScript utility types by ensuring they compile correctly
describe('TypeScript utility types', () => {
	it('should compile WithoutChild type correctly', () => {
		// This is more of a compile-time test
		type TestType = { name: string; child?: string };
		type WithoutChildTest = import('$lib/utils').WithoutChild<TestType>;
		
		// The type should not have 'child' property
		const test: WithoutChildTest = { name: 'test' };
		expect(test.name).toBe('test');
	});

	it('should compile WithoutChildren type correctly', () => {
		type TestType = { name: string; children?: string };
		type WithoutChildrenTest = import('$lib/utils').WithoutChildren<TestType>;
		
		// The type should not have 'children' property
		const test: WithoutChildrenTest = { name: 'test' };
		expect(test.name).toBe('test');
	});

	it('should compile WithElementRef type correctly', () => {
		type TestType = { name: string };
		type WithRefTest = import('$lib/utils').WithElementRef<TestType>;
		
		// The type should have an optional 'ref' property
		const test: WithRefTest = { name: 'test', ref: null };
		expect(test.name).toBe('test');
		expect(test.ref).toBe(null);
	});
});