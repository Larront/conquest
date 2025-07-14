import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login form and allow navigation', async ({ page }) => {
    await page.goto('/auth');
    
    // Check that auth page loads correctly
    await expect(page).toHaveTitle(/Exanimis/);
    await expect(page.locator('form')).toBeVisible();
    
    // Check for email and password fields (name attribute instead of type)
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    
    // Check for submit button with specific text
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('text=AUTHENTICATE')).toBeVisible();
  });

  test('should toggle between signin and signup modes', async ({ page }) => {
    await page.goto('/auth');
    
    // Initially should show signin mode
    await expect(page.locator('text=ACCESS TERMINAL')).toBeVisible();
    await expect(page.locator('text=AUTHENTICATE')).toBeVisible();
    
    // Click to switch to signup mode
    await page.click('text=New Recruit? Request Enlistment Authorization');
    
    // Should now show signup mode
    await expect(page.locator('text=RECRUITMENT PROTOCOL')).toBeVisible();
    await expect(page.locator('text=ENLIST')).toBeVisible();
    await expect(page.locator('input[name="username"]')).toBeVisible();
    
    // Switch back to signin
    await page.click('text=Already Enlisted? Access Terminal');
    await expect(page.locator('text=ACCESS TERMINAL')).toBeVisible();
  });

  test('should show validation errors for invalid form submission', async ({ page }) => {
    await page.goto('/auth');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('.text-red-400')).toBeVisible();
  });

  test('should show password toggle functionality', async ({ page }) => {
    await page.goto('/auth');
    
    const passwordInput = page.locator('input[name="password"]');
    const toggleButton = page.locator('button:has-text("👁")').or(page.locator('button').filter({ hasText: /eye/i }));
    
    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Fill password field
    await passwordInput.fill('testpassword');
    
    // Toggle password visibility if toggle button exists
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'text');
    }
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
    const closeButton = page.locator('a').filter({ hasText: /×|✕/ });
    await closeButton.click();
    await expect(page).toHaveURL('/');
  });
});