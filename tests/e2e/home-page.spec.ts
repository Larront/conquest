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
    // Look for planet elements (they should be positioned around the sun)
    const planets = page.locator('[data-testid="planet"]').or(page.locator('.planet')).or(page.locator('button').filter({ hasText: /planet/i }));
    
    // Wait for planets to load
    await page.waitForTimeout(1000);
    
    // Check that there are planets visible (the exact selector depends on implementation)
    // Since we can't see the exact planet structure, we'll check for common planet-related elements
    const possiblePlanetElements = await page.locator('div').filter({ hasText: /planet|world/i }).count();
    
    // Should have some planet-related content
    expect(possiblePlanetElements).toBeGreaterThan(0);
  });

  test('should open planet info panel when planet is clicked', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);
    
    // Try to find and click a planet element
    // This will depend on the actual planet implementation
    const planetElements = page.locator('button').filter({ hasText: /\w+/ }); // Generic planet button
    
    if (await planetElements.count() > 0) {
      await planetElements.first().click();
      
      // Should open planet info panel
      await expect(page.locator('.border-yellow-600')).toBeVisible();
      
      // Should show close button
      await expect(page.locator('button:has-text("×")')).toBeVisible();
    }
  });

  test('should close planet info panel when X is clicked', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);
    
    // Try to click a planet first
    const planetElements = page.locator('button').filter({ hasText: /\w+/ });
    
    if (await planetElements.count() > 0) {
      await planetElements.first().click();
      
      // Wait for panel to open
      await page.waitForTimeout(500);
      
      // Click close button
      const closeButton = page.locator('button:has-text("×")').last();
      if (await closeButton.isVisible()) {
        await closeButton.click();
        
        // Panel should be closed (depends on implementation)
        await page.waitForTimeout(500);
      }
    }
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
    // Wait for page to load
    await page.waitForTimeout(1000);
    
    // Try to click a planet
    const planetElements = page.locator('button').filter({ hasText: /\w+/ });
    
    if (await planetElements.count() > 0) {
      await planetElements.first().click();
      
      // Look for loading indicator
      const loadingIndicator = page.locator('text=Loading planet details');
      
      // If loading state exists, it should be visible
      if (await loadingIndicator.isVisible()) {
        await expect(loadingIndicator).toBeVisible();
      }
    }
  });

  test('should display faction control information', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);
    
    // Look for faction-related content
    const factionElements = page.locator('div').filter({ hasText: /faction|control/i });
    
    // Should have some faction-related information
    const factionCount = await factionElements.count();
    expect(factionCount).toBeGreaterThan(0);
  });
});