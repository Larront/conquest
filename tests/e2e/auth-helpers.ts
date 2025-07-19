import { type Page, expect } from '@playwright/test';

/**
 * Test authentication helpers for e2e tests
 * These utilities handle user authentication without modifying the site's auth system
 */

export interface TestUser {
  email: string;
  password: string;
  username?: string;
}

// Test user credentials - in a real app, these would be in environment variables
export const TEST_USERS = {
  basic: {
    email: 'test@example.com',
    password: 'TestPassword123!',
    username: 'TestUser'
  },
  faction: {
    email: 'faction@example.com',  
    password: 'FactionPassword123!',
    username: 'FactionUser'
  }
} as const;

/**
 * Authenticate a user by going through the normal auth flow
 * This mimics what a real user would do
 */
export async function authenticateUser(page: Page, user: TestUser = TEST_USERS.basic) {
  // Go to auth page
  await page.goto('/auth');
  
  // Fill in credentials
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Wait for successful authentication and redirect
  await page.waitForURL('/', { timeout: 10000 });
  
  // Verify we're authenticated by checking for user menu or auth-specific elements
  await expect(page.locator('text=Report Battle').or(page.locator('[data-testid="user-menu"]'))).toBeVisible({ timeout: 5000 });
}

/**
 * Sign up a new test user - useful for tests that need fresh users
 */
export async function signUpUser(page: Page, user: TestUser) {
  await page.goto('/auth');
  
  // Switch to signup mode
  await page.click('text=New Recruit? Request Enlistment Authorization');
  
  // Wait for signup form to appear
  await expect(page.locator('text=RECRUITMENT PROTOCOL')).toBeVisible();
  
  // Fill signup form
  if (user.username) {
    await page.fill('input[name="username"]', user.username);
  }
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  
  // Submit signup
  await page.click('button[type="submit"]');
  
  // Note: In a real test environment, you'd need to handle email confirmation
  // For now, we'll assume the test environment bypasses this
}

/**
 * Logout the current user
 */
export async function logoutUser(page: Page) {
  // Look for user menu and logout option
  const userMenu = page.locator('[data-testid="user-menu"]').or(page.locator('button').filter({ hasText: /menu|profile|user/i }));
  
  if (await userMenu.isVisible()) {
    await userMenu.click();
    await page.click('text=Sign Out').or(page.click('text=Logout'));
  }
  
  // Wait for redirect to home with no auth
  await page.waitForURL('/');
  await expect(page.locator('text=ACCESS')).toBeVisible();
}

/**
 * Check if user is currently authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    // Look for elements that only appear when authenticated
    const authElements = page.locator('text=Report Battle').or(page.locator('[data-testid="user-menu"]'));
    return await authElements.isVisible({ timeout: 1000 });
  } catch {
    return false;
  }
}

/**
 * Ensure user is authenticated, authenticate if not
 */
export async function ensureAuthenticated(page: Page, user: TestUser = TEST_USERS.basic) {
  if (!(await isAuthenticated(page))) {
    await authenticateUser(page, user);
  }
}