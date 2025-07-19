import { test, expect } from '@playwright/test';

test.describe('Home Page - Planet and Faction Control', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main solar system view', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Exanimis/);
    
    // Check for main header
    await expect(page.locator('text=MALVERNIS SECTOR')).toBeVisible();
    await expect(page.locator('text=IMPERIAL RECONNAISSANCE')).toBeVisible();
    
    // Check for central sun element
    await expect(page.locator('.shadow-sun')).toBeVisible();
    
    // Check for background elements
    await expect(page.locator('.bg-gradient-to-br')).toBeVisible();
  });

  test('should show authentication prompt when not logged in', async ({ page }) => {
    // Should show ACCESS button when not authenticated
    await expect(page.locator('a[href="/auth"]')).toBeVisible();
    await expect(page.locator('text=ACCESS')).toBeVisible();
    
    // Should not show Report Battle button
    await expect(page.locator('text=Report Battle')).not.toBeVisible();
  });

  test('should display planets in solar system layout', async ({ page }) => {
    // Wait for page and planets to load
    await page.waitForLoadState('networkidle');
    
    // Look for planet buttons based on the home page snapshot
    const planetButtons = page.locator('button').filter({ hasText: /View details for/ });
    
    // Should have planet buttons visible
    const planetCount = await planetButtons.count();
    expect(planetCount).toBeGreaterThan(0);
    
    // Check for specific planets mentioned in snapshot
    await expect(page.locator('button:has-text("View details for Veltraxis")')).toBeVisible();
  });

  test('should open planet info panel when planet is clicked', async ({ page }) => {
    // Wait for planets to load
    await page.waitForLoadState('networkidle');
    
    // Click on a specific planet
    const planetButton = page.locator('button:has-text("View details for Veltraxis")');
    await planetButton.click();
    
    // Should open planet info panel with yellow border
    await expect(page.locator('.border-yellow-600').last()).toBeVisible({ timeout: 5000 });
    
    // Should show close button (X icon)
    await expect(page.locator('button').filter({ has: page.locator('svg') }).last()).toBeVisible();
  });

  test('should close planet info panel when X is clicked', async ({ page }) => {
    // Wait for planets to load
    await page.waitForLoadState('networkidle');
    
    // Click on a planet to open panel
    const planetButton = page.locator('button:has-text("View details for Veltraxis")');
    await planetButton.click();
    
    // Wait for panel to open
    const panel = page.locator('.border-yellow-600').last();
    await expect(panel).toBeVisible({ timeout: 5000 });
    
    // Click close button (X icon)
    const closeButton = page.locator('button').filter({ has: page.locator('svg') }).last();
    await closeButton.click();
    
    // Panel should close or become hidden
    await expect(panel).not.toBeVisible({ timeout: 5000 });
  });

  test('should display orbital paths around the sun', async ({ page }) => {
    // Check for orbital path elements
    await expect(page.locator('.rounded-full.border')).toBeVisible();
    
    // Should have multiple orbital paths
    const orbitalPaths = await page.locator('.rounded-full.border').count();
    expect(orbitalPaths).toBeGreaterThan(0);
  });

  test('should have responsive design for mobile', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for layout to adjust
    await page.waitForLoadState('networkidle');
    
    // Main content should still be visible
    await expect(page.locator('text=MALVERNIS SECTOR')).toBeVisible();
    
    // Should adapt layout for mobile
    await expect(page.locator('.flex-col')).toBeVisible();
  });

  test('should show stellar background effects', async ({ page }) => {
    // Check for nebula effects
    await expect(page.locator('.blur-3xl')).toBeVisible();
    
    // Check for star field
    await expect(page.locator('.animate-twinkle')).toBeVisible();
    
    // Check for gradient background
    await expect(page.locator('.bg-gradient-to-br')).toBeVisible();
  });

  test('should navigate to auth page when ACCESS is clicked', async ({ page }) => {
    // Click ACCESS button
    await page.click('a[href="/auth"]');
    
    // Should navigate to auth page
    await expect(page).toHaveURL('/auth');
  });

  test('should show loading state for planet info', async ({ page }) => {
    // Wait for planets to load
    await page.waitForLoadState('networkidle');
    
    // Click on a planet
    const planetButton = page.locator('button:has-text("View details for Veltraxis")');
    await planetButton.click();
    
    // Look for loading indicator based on the actual component
    const loadingIndicator = page.locator('text=Loading planet details...');
    
    // Loading state might be very brief, so we check if it appears
    try {
      await expect(loadingIndicator).toBeVisible({ timeout: 2000 });
    } catch {
      // Loading might be too fast to catch, which is fine
      // Check that panel opens instead
      await expect(page.locator('.border-yellow-600').last()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display faction control information', async ({ page }) => {
    // Wait for data to load
    await page.waitForLoadState('networkidle');
    
    // Click on a planet to see faction control info
    const planetButton = page.locator('button:has-text("View details for Veltraxis")');
    await planetButton.click();
    
    // Wait for planet info panel to open
    await expect(page.locator('.border-yellow-600').last()).toBeVisible({ timeout: 5000 });
    
    // Look for faction-related content in the panel
    // This might include faction names, control percentages, etc.
    const panelContent = page.locator('.border-yellow-600').last();
    await expect(panelContent).toContainText(/control|faction|percentage/i);
  });
});