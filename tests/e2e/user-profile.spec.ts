import { test, expect } from '@playwright/test';
import { authenticateUser, TEST_USERS } from './auth-helpers';

test.describe('User Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate user before accessing protected route
    await authenticateUser(page, TEST_USERS.basic);
    await page.goto('/private/user');
  });

  test('should display user profile page with tabs', async ({ page }) => {
    // Check that the profile page loads
    await expect(page.locator('text=++ SERVITOR RECORDS ++')).toBeVisible();
    
    // Check for tab navigation
    await expect(page.locator('button:has-text("Profile")')).toBeVisible();
    await expect(page.locator('button:has-text("Factions")')).toBeVisible();
    await expect(page.locator('button:has-text("Security")')).toBeVisible();
    
    // Profile tab should be active by default (has border-yellow-500 class)
    await expect(page.locator('button:has-text("Profile")')).toHaveClass(/border-yellow-500/);
  });

  test('should show profile information in profile tab', async ({ page }) => {
    // Should be on profile tab by default
    await expect(page.locator('text=PROFILE INFORMATION')).toBeVisible();
    await expect(page.locator('text=ACCOUNT INFORMATION')).toBeVisible();
    await expect(page.locator('text=COMBAT RECORD')).toBeVisible();
    
    // Check for profile form elements  
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('text=SERVITOR DESIGNATION')).toBeVisible();
    
    // Check for account information section
    await expect(page.locator('text=Enlisted:')).toBeVisible();
    await expect(page.locator('text=Servitor ID:')).toBeVisible();
    await expect(page.locator('text=Security Clearance:')).toBeVisible();
    
    // Check for battle statistics
    await expect(page.locator('text=Victories')).toBeVisible();
    await expect(page.locator('text=Defeats')).toBeVisible();
    await expect(page.locator('text=Draws')).toBeVisible();
    await expect(page.locator('text=Win Rate')).toBeVisible();
  });

  test('should switch to factions tab', async ({ page }) => {
    // Click on factions tab
    await page.click('button:has-text("Factions")');
    
    // Should show factions content
    await expect(page.locator('text=Faction Management')).toBeVisible();
    await expect(page.locator('button:has-text("Add New Faction")')).toBeVisible();
    
    // Factions tab should be active
    await expect(page.locator('button:has-text("Factions")')).toHaveClass(/border-yellow-500/);
  });

  test('should show add faction form when Add New Faction is clicked', async ({ page }) => {
    // Go to factions tab
    await page.click('button:has-text("Factions")');
    
    // Click add new faction button
    await page.click('button:has-text("Add New Faction")');
    
    // Should show add faction form
    await expect(page.locator('text=++ ADD NEW FACTION ++')).toBeVisible();
    await expect(page.locator('select[name="factionName"]')).toBeVisible();
    await expect(page.locator('input[name="factionDisplayName"]')).toBeVisible();
    await expect(page.locator('button:has-text("Add Faction")')).toBeVisible();
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
  });

  test('should cancel add faction form', async ({ page }) => {
    // Go to factions tab
    await page.click('button:has-text("Factions")');
    
    // Click add new faction button
    await page.click('button:has-text("Add New Faction")');
    
    // Should show form
    await expect(page.locator('text=++ ADD NEW FACTION ++')).toBeVisible();
    
    // Click cancel
    await page.click('button:has-text("Cancel")');
    
    // Form should be hidden
    await expect(page.locator('text=++ ADD NEW FACTION ++')).not.toBeVisible();
  });

  test('should switch to security tab', async ({ page }) => {
    // Click on security tab
    await page.click('button:has-text("Security")');
    
    // Should show security content
    await expect(page.locator('text=Change Authorization Cipher')).toBeVisible();
    await expect(page.locator('input[name="current-password"]')).toBeVisible();
    await expect(page.locator('input[name="new-password"]')).toBeVisible();
    await expect(page.locator('input[name="confirm-password"]')).toBeVisible();
    await expect(page.locator('button:has-text("UPDATE CIPHER")')).toBeVisible();
    
    // Security tab should be active
    await expect(page.locator('button:has-text("Security")')).toHaveClass(/border-yellow-500/);
  });

  test('should show password fields as hidden by default', async ({ page }) => {
    // Go to security tab
    await page.click('button:has-text("Security")');
    
    // Password fields should be hidden
    await expect(page.locator('input[name="current-password"]')).toHaveAttribute('type', 'password');
    await expect(page.locator('input[name="new-password"]')).toHaveAttribute('type', 'password');
    await expect(page.locator('input[name="confirm-password"]')).toHaveAttribute('type', 'password');
  });

  test('should update username in profile tab', async ({ page }) => {
    // Fill username field
    await page.fill('input[name="username"]', 'TestUser123');
    
    // Click update profile
    await page.click('button:has-text("UPDATE PROFILE")');
    
    // Should show loading state
    await expect(page.locator('text=UPDATING...')).toBeVisible();
    
    // Button should be disabled during update
    await expect(page.locator('button:has-text("UPDATING...")')).toBeDisabled();
  });

  test('should show validation errors for empty username', async ({ page }) => {
    // Clear username field
    await page.fill('input[name="username"]', '');
    
    // Try to submit
    await page.click('button:has-text("UPDATE PROFILE")');
    
    // Should show validation error
    await expect(page.locator('.text-red-400')).toBeVisible();
  });

  test('should fill faction form fields', async ({ page }) => {
    // Go to factions tab
    await page.click('button:has-text("Factions")');
    
    // Click add new faction
    await page.click('button:has-text("Add New Faction")');
    
    // Fill faction display name
    await page.fill('input[name="factionDisplayName"]', 'My Test Faction');
    
    // Select faction type if options are available
    const factionSelect = page.locator('select[name="factionName"]');
    if (await factionSelect.locator('option').count() > 1) {
      await factionSelect.selectOption({ index: 1 });
    }
    
    // Check that fields are filled
    await expect(page.locator('input[name="factionDisplayName"]')).toHaveValue('My Test Faction');
  });

  test('should show faction cards if user has factions', async ({ page }) => {
    // Go to factions tab
    await page.click('button:has-text("Factions")');
    
    // Look for faction cards or empty state
    const factionCards = page.locator('[data-testid="faction-card"]').or(page.locator('.rounded-lg.border-2.border-red-600'));
    const emptyState = page.locator('text=No factions added yet');
    
    // Either should show faction cards or empty state
    await expect(factionCards.or(emptyState)).toBeVisible();
  });

  test('should navigate back to home', async ({ page }) => {
    // Click the X button to go back to home (it's an SVG icon)
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
  });

  test('should show loading states for form submissions', async ({ page }) => {
    // Test profile update loading
    await page.fill('input[name="username"]', 'TestUser');
    await page.click('button:has-text("UPDATE PROFILE")');
    await expect(page.locator('text=UPDATING...')).toBeVisible();
    
    // Test security update loading
    await page.click('button:has-text("Security")');
    await page.fill('input[name="current-password"]', 'oldpass');
    await page.fill('input[name="new-password"]', 'newpass');
    await page.fill('input[name="confirm-password"]', 'newpass');
    await page.click('button:has-text("UPDATE CIPHER")');
    await expect(page.locator('text=UPDATING...')).toBeVisible();
  });

  test('should show edit and delete buttons for existing factions', async ({ page }) => {
    // Go to factions tab
    await page.click('button:has-text("Factions")');
    
    // Look for edit and delete buttons in faction cards
    const editButtons = page.locator('button[title="Edit faction"]');
    const deleteButtons = page.locator('button[title="Delete faction"]');
    
    // If there are faction cards, there should be edit/delete buttons
    const factionCards = page.locator('.rounded-lg.border-2.border-red-600');
    const factionCount = await factionCards.count();
    
    if (factionCount > 0) {
      await expect(editButtons).toBeVisible();
      await expect(deleteButtons).toBeVisible();
    }
  });
});