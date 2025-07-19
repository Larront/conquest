import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login form and allow navigation', async ({ page }) => {
    await page.goto('/auth');
    
    // Check that auth page loads correctly
    await expect(page).toHaveTitle(/Exanimis/);
    await expect(page.locator('form')).toBeVisible();
    
    // Check for email and password fields with proper labels
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('text=VOX TRANSMISSION CODE')).toBeVisible();
    await expect(page.locator('label:has-text("AUTHORIZATION CIPHER")')).toBeVisible();
    
    // Check for submit button with correct text
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('button:has-text("AUTHENTICATE")')).toBeVisible();
  });

  test('should toggle between signin and signup modes', async ({ page }) => {
    await page.goto('/auth');
    
    // Initially should show signin mode
    await expect(page.locator('text=++ ACCESS TERMINAL ++')).toBeVisible();
    await expect(page.locator('button:has-text("AUTHENTICATE")')).toBeVisible();
    
    // Click to switch to signup mode
    await page.click('text=New Recruit? Request Enlistment Authorization');
    
    // Wait for mode change and check signup mode elements
    await expect(page.locator('h2')).toContainText('RECRUITMENT PROTOCOL');
    await expect(page.locator('button:has-text("ENLIST")')).toBeVisible();
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('text=SERVITOR DESIGNATION')).toBeVisible();
    
    // Switch back to signin
    await page.click('text=Already Enlisted? Access Terminal');
    await expect(page.locator('h2')).toContainText('ACCESS TERMINAL');
  });

  test('should show validation errors for invalid form submission', async ({ page }) => {
    await page.goto('/auth');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should either show validation errors inline or navigate to error page
    try {
      await expect(page.locator('p.text-red-400').first()).toBeVisible({ timeout: 5000 });
    } catch {
      // If redirected to error page, that's also valid behavior
      await expect(page).toHaveURL(/\/auth\/error/);
    }
  });

  test('should show password toggle functionality', async ({ page }) => {
    await page.goto('/auth');
    
    const passwordInput = page.locator('input[name="password"]');
    // The toggle button is positioned absolutely next to password field
    const toggleButton = page.locator('button[type="button"]').nth(0);
    
    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Fill password field
    await passwordInput.fill('testpassword');
    
    // Toggle password visibility
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Toggle back
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should redirect to home when accessing protected route without auth', async ({ page }) => {
    await page.goto('/private/upload');
    
    // Should be redirected to auth page
    await expect(page).toHaveURL(/\/auth/);
  });

  test('should show password reset option', async ({ page }) => {
    await page.goto('/auth');
    
    // Look for password reset link
    const resetLink = page.locator('a[href="/auth/reset"]');
    await expect(resetLink).toBeVisible();
    
    await resetLink.click();
    await expect(page).toHaveURL(/\/auth\/reset/);
  });

  test('should navigate back to home from auth page', async ({ page }) => {
    await page.goto('/auth');
    
    // Click the X button to go back to home
    const closeButton = page.locator('a[href="/"]').filter({ has: page.locator('svg') });
    await closeButton.click();
    await expect(page).toHaveURL('/');
  });
});