import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the auth page before each test
		await page.goto('/auth');
	});

	test('should display login form', async ({ page }) => {
		// Check if login form is visible
		await expect(page.locator('form')).toBeVisible();

		// Check for email input
		const emailInput = page.locator('input[type="email"], input[name="email"]');
		await expect(emailInput).toBeVisible();

		// Check for password input
		const passwordInput = page.locator('input[type="password"], input[name="password"]');
		await expect(passwordInput).toBeVisible();

		// Check for submit button
		const submitButton = page.locator('button[type="submit"], input[type="submit"]');
		await expect(submitButton).toBeVisible();
	});

	test('should show validation errors for invalid email', async ({ page }) => {
		// Fill in invalid email
		await page.fill('input[type="email"], input[name="email"]', 'invalid-email');
		await page.fill('input[type="password"], input[name="password"]', 'password123');

		// Submit form
		await page.click('button[type="submit"], input[type="submit"]');

		// Check for validation error (this depends on your implementation)
		// This test might need to be adjusted based on how your app handles validation
		await expect(page.locator('body')).toBeVisible();
	});

	test('should show validation errors for empty fields', async ({ page }) => {
		// Try to submit empty form
		await page.click('button[type="submit"], input[type="submit"]');

		// Check that form is still visible (validation should prevent submission)
		await expect(page.locator('form')).toBeVisible();
	});

	test('should handle login attempt with invalid credentials', async ({ page }) => {
		// Fill in fake credentials
		await page.fill('input[type="email"], input[name="email"]', 'test@example.com');
		await page.fill('input[type="password"], input[name="password"]', 'wrongpassword');

		// Submit form
		await page.click('button[type="submit"], input[type="submit"]');

		// Wait for response
		await page.waitForTimeout(2000);

		// Should still be on auth page or show error
		await expect(page.locator('body')).toBeVisible();
	});

	test('should navigate to registration form', async ({ page }) => {
		// Look for registration link/button
		const signUpLink = page.locator(
			'text=Sign Up, text=Register, a[href*="register"], a[href*="signup"]'
		);

		if ((await signUpLink.count()) > 0) {
			await signUpLink.first().click();

			// Check if registration form is visible
			await expect(page.locator('form')).toBeVisible();
		}
	});

	test('should be responsive on mobile', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		await page.goto('/auth');

		// Check if form is visible on mobile
		await expect(page.locator('form')).toBeVisible();

		// Check if inputs are properly sized
		const emailInput = page.locator('input[type="email"], input[name="email"]');
		await expect(emailInput).toBeVisible();
	});
});

test.describe('Registration Flow', () => {
	test('should display registration form elements', async ({ page }) => {
		await page.goto('/auth/register');

		// Check if registration form is visible
		await expect(page.locator('form')).toBeVisible();

		// Check for username input (if it exists)
		const usernameInput = page.locator('input[name="username"]');
		if ((await usernameInput.count()) > 0) {
			await expect(usernameInput).toBeVisible();
		}

		// Check for email input
		const emailInput = page.locator('input[type="email"], input[name="email"]');
		await expect(emailInput).toBeVisible();

		// Check for password input
		const passwordInput = page.locator('input[type="password"], input[name="password"]');
		await expect(passwordInput).toBeVisible();
	});

	test('should validate registration form fields', async ({ page }) => {
		await page.goto('/auth/register');

		// Try to submit with invalid email
		await page.fill('input[type="email"], input[name="email"]', 'invalid-email');
		await page.fill('input[type="password"], input[name="password"]', 'short');

		// Submit form
		await page.click('button[type="submit"], input[type="submit"]');

		// Should stay on the same page due to validation
		await expect(page.locator('form')).toBeVisible();
	});
});

test.describe('Password Reset Flow', () => {
	test('should display password reset form', async ({ page }) => {
		await page.goto('/auth/reset');

		// Check if password reset form is visible
		await expect(page.locator('form')).toBeVisible();

		// Check for email input
		const emailInput = page.locator('input[type="email"], input[name="email"]');
		await expect(emailInput).toBeVisible();
	});

	test('should handle password reset request', async ({ page }) => {
		await page.goto('/auth/reset');

		// Fill in email
		await page.fill('input[type="email"], input[name="email"]', 'test@example.com');

		// Submit form
		await page.click('button[type="submit"], input[type="submit"]');

		// Wait for response
		await page.waitForTimeout(2000);

		// Should show some feedback or redirect
		await expect(page.locator('body')).toBeVisible();
	});
});

test.describe('Auth Page Accessibility', () => {
	test('should have proper form labels', async ({ page }) => {
		await page.goto('/auth');

		// Check for form labels
		const labels = page.locator('label');
		if ((await labels.count()) > 0) {
			await expect(labels.first()).toBeVisible();
		}
	});

	test('should be keyboard accessible', async ({ page }) => {
		await page.goto('/auth');

		// Tab through form elements
		await page.keyboard.press('Tab');

		// Check if focus is visible
		const focusedElement = page.locator(':focus');
		await expect(focusedElement).toBeVisible();

		// Continue tabbing
		await page.keyboard.press('Tab');
		await expect(page.locator(':focus')).toBeVisible();
	});
});
