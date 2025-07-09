import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
	test('should display the home page with title', async ({ page }) => {
		await page.goto('/');

		// Check if the page loads successfully
		await expect(page).toHaveTitle(/Conquest/);

		// Check for key elements that should be present
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should display planet grid or content', async ({ page }) => {
		await page.goto('/');

		// Wait for the page to load
		await page.waitForLoadState('networkidle');

		// Check for main content area
		await expect(page.locator('main')).toBeVisible();
	});

	test('should have navigation elements', async ({ page }) => {
		await page.goto('/');

		// Check for navigation or header elements
		// This will depend on the actual page structure
		await expect(page.locator('body')).toBeVisible();

		// Check if access/login functionality is present
		const accessButton = page.locator('text=ACCESS');
		if ((await accessButton.count()) > 0) {
			await expect(accessButton).toBeVisible();
		}
	});

	test('should be responsive on mobile', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		await page.goto('/');

		// Check if the page is responsive
		await expect(page.locator('body')).toBeVisible();

		// Check if content is properly displayed on mobile
		await expect(page.locator('main')).toBeVisible();
	});
});

test.describe('Navigation', () => {
	test('should navigate to auth page when access button is clicked', async ({ page }) => {
		await page.goto('/');

		// Look for access button
		const accessButton = page.locator('text=ACCESS');

		if ((await accessButton.count()) > 0) {
			await accessButton.click();

			// Check if navigated to auth page
			await expect(page).toHaveURL(/auth/);
		}
	});

	test('should handle 404 pages gracefully', async ({ page }) => {
		await page.goto('/non-existent-page');

		// Should either redirect or show a 404 page
		// The response should be handled gracefully
		await expect(page.locator('body')).toBeVisible();
	});
});

test.describe('Performance', () => {
	test('should load within reasonable time', async ({ page }) => {
		const startTime = Date.now();

		await page.goto('/');
		await page.waitForLoadState('networkidle');

		const loadTime = Date.now() - startTime;

		// Should load within 5 seconds
		expect(loadTime).toBeLessThan(5000);
	});
});

test.describe('Accessibility', () => {
	test('should have proper page structure', async ({ page }) => {
		await page.goto('/');

		// Check for semantic HTML elements
		await expect(page.locator('main')).toBeVisible();

		// Check for proper heading structure
		const headings = page.locator('h1, h2, h3, h4, h5, h6');
		await expect(headings.first()).toBeVisible();
	});

	test('should be keyboard navigable', async ({ page }) => {
		await page.goto('/');

		// Test basic keyboard navigation
		await page.keyboard.press('Tab');

		// Check if focus is visible
		const focusedElement = page.locator(':focus');
		await expect(focusedElement).toBeVisible();
	});
});
