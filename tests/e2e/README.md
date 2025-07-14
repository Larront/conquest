# E2E Tests for Conquest

This directory contains end-to-end (e2e) tests for the Conquest application using Playwright.

## Test Files

- `auth.spec.ts` - Authentication flow tests (login, signup, password reset)
- `battle-submission.spec.ts` - Battle report submission form tests
- `home-page.spec.ts` - Main page, planet display, and faction control tests
- `user-profile.spec.ts` - User profile management tests
- `example.spec.ts` - Default Playwright example tests

## Running Tests

### Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Set up Supabase environment variables in `.env.local` (required for authentication tests)

### Running Tests

Run all tests:
```bash
npx playwright test
```

Run tests in headed mode (to see browser):
```bash
npx playwright test --headed
```

Run tests for a specific file:
```bash
npx playwright test auth.spec.ts
```

Run tests for a specific browser:
```bash
npx playwright test --project=chromium
```

Run with UI mode:
```bash
npx playwright test --ui
```

## Test Coverage

### Authentication Tests
- ✅ Login form display and validation
- ✅ Signup/signin mode switching
- ✅ Password visibility toggle
- ✅ Navigation between auth and home pages
- ✅ Protected route redirection

### Home Page Tests
- ✅ Main solar system view
- ✅ Authentication prompts
- ✅ Planet and faction display
- ✅ Responsive design
- ✅ Background effects

### Battle Submission Tests
- ⚠️ Form display and validation (requires authentication)
- ⚠️ Battle result selection
- ⚠️ Form field validation
- ⚠️ Loading states

### User Profile Tests
- ⚠️ Profile tabs navigation (requires authentication)
- ⚠️ Username updates
- ⚠️ Faction management
- ⚠️ Security settings

## Known Issues

1. **Authentication Required**: Many tests require proper authentication setup and may fail without valid Supabase credentials
2. **Route Protection**: Protected routes (`/private/*`) redirect to auth page when not authenticated
3. **Form Validation**: Some form validation tests may fail due to server-side validation differences
4. **Loading States**: Some tests may be timing-sensitive and require adjusted timeouts

## Configuration

The tests are configured in `playwright.config.ts` with:
- Base URL: `http://localhost:5173`
- Automatic dev server startup
- Cross-browser testing (Chromium, Firefox, WebKit)
- HTML reporter

## Tips

1. Use `--timeout` flag to adjust test timeouts if needed
2. Use `--headed` to debug failing tests visually
3. Check the HTML report for detailed test results
4. Consider using test fixtures for authentication in future improvements