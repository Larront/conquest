import { test, expect } from '@playwright/test';

test.describe('Battle Submission', () => {
  test.beforeEach(async ({ page }) => {
    // Note: These tests assume authentication is handled at the route level
    // In a real e2e test, you'd need to authenticate first
    await page.goto('/private/upload');
  });

  test('should display battle submission form', async ({ page }) => {
    // Check that the form elements are present
    await expect(page.locator('text=BATTLE REPORT SUBMISSION')).toBeVisible();
    await expect(page.locator('form')).toBeVisible();
    
    // Check for required form fields
    await expect(page.locator('select[name="selectedPlanet"]')).toBeVisible();
    await expect(page.locator('input[name="battleDate"]')).toBeVisible();
    await expect(page.locator('select[name="battleType"]')).toBeVisible();
    await expect(page.locator('input[name="points"]')).toBeVisible();
    await expect(page.locator('select[name="attacker"]')).toBeVisible();
    await expect(page.locator('select[name="defender"]')).toBeVisible();
    await expect(page.locator('input[name="attackerPoints"]')).toBeVisible();
    await expect(page.locator('input[name="defenderPoints"]')).toBeVisible();
    
    // Check for battle result radio buttons
    await expect(page.locator('input[name="result"][value="Attacker Victory"]')).toBeVisible();
    await expect(page.locator('input[name="result"][value="Defender Victory"]')).toBeVisible();
    await expect(page.locator('input[name="result"][value="Draw"]')).toBeVisible();
    
    // Check for description textarea
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
    
    // Check for submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show form validation errors for empty submission', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('.text-red-400')).toBeVisible();
  });

  test('should fill out complete battle form', async ({ page }) => {
    // Fill out the form with valid data
    await page.selectOption('select[name="selectedPlanet"]', { index: 1 });
    await page.fill('input[name="battleDate"]', '2024-12-01');
    await page.selectOption('select[name="battleType"]', 'Combat Patrol');
    await page.fill('input[name="points"]', '1000');
    
    // Select attacker and defender (if options are available)
    const attackerSelect = page.locator('select[name="attacker"]');
    const defenderSelect = page.locator('select[name="defender"]');
    
    // Check if options are available and select them
    if (await attackerSelect.locator('option').count() > 1) {
      await attackerSelect.selectOption({ index: 1 });
    }
    if (await defenderSelect.locator('option').count() > 1) {
      await defenderSelect.selectOption({ index: 1 });
    }
    
    // Fill in points
    await page.fill('input[name="attackerPoints"]', '15');
    await page.fill('input[name="defenderPoints"]', '10');
    
    // Select battle result
    await page.check('input[name="result"][value="Attacker Victory"]');
    
    // Fill description
    await page.fill('textarea[name="description"]', 'A fierce battle on the industrial world resulted in Imperial victory.');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Check for loading state
    await expect(page.locator('text=TRANSMITTING REPORT')).toBeVisible();
  });

  test('should highlight selected battle result', async ({ page }) => {
    // Click on attacker victory
    await page.click('input[name="result"][value="Attacker Victory"]');
    
    // Check that the corresponding div is highlighted
    await expect(page.locator('div:has-text("Attacker Victory")')).toHaveClass(/border-red-500/);
    
    // Click on defender victory
    await page.click('input[name="result"][value="Defender Victory"]');
    
    // Check that defender victory is now highlighted
    await expect(page.locator('div:has-text("Defender Victory")')).toHaveClass(/border-green-500/);
  });

  test('should validate points field constraints', async ({ page }) => {
    const pointsInput = page.locator('input[name="points"]');
    
    // Check min/max attributes
    await expect(pointsInput).toHaveAttribute('min', '500');
    await expect(pointsInput).toHaveAttribute('max', '2000');
    await expect(pointsInput).toHaveAttribute('step', '500');
    
    // Test invalid values
    await pointsInput.fill('100');
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('.text-red-400')).toBeVisible();
  });

  test('should validate attacker and defender points', async ({ page }) => {
    const attackerPointsInput = page.locator('input[name="attackerPoints"]');
    const defenderPointsInput = page.locator('input[name="defenderPoints"]');
    
    // Check min/max attributes
    await expect(attackerPointsInput).toHaveAttribute('min', '0');
    await expect(attackerPointsInput).toHaveAttribute('max', '100');
    await expect(defenderPointsInput).toHaveAttribute('min', '0');
    await expect(defenderPointsInput).toHaveAttribute('max', '100');
    
    // Test boundary values
    await attackerPointsInput.fill('0');
    await defenderPointsInput.fill('100');
    
    // Values should be accepted
    await expect(attackerPointsInput).toHaveValue('0');
    await expect(defenderPointsInput).toHaveValue('100');
  });

  test('should navigate back to home', async ({ page }) => {
    // Click the X button to go back to home
    await page.click('a:has-text("×")');
    await expect(page).toHaveURL('/');
  });

  test('should show loading state during submission', async ({ page }) => {
    // Fill out minimal form
    await page.selectOption('select[name="selectedPlanet"]', { index: 1 });
    await page.fill('input[name="battleDate"]', '2024-12-01');
    await page.check('input[name="result"][value="Draw"]');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show loading text
    await expect(page.locator('text=TRANSMITTING REPORT')).toBeVisible();
    
    // Submit button should be disabled during submission
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
  });
});