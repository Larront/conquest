# Conquest - Code Review TODO

## Project Overview
**Conquest** is a SvelteKit-based web application for tracking Warhammer 40K planetary battles and faction control. This document outlines areas for improvement, security considerations, and enhancement opportunities identified during code review.

**Tech Stack:** SvelteKit 2.x + Svelte 5, Supabase, Tailwind CSS 4.x, TypeScript, Vercel deployment

---

## 🔥 High Priority Issues

### Security & Authentication

#### **AUTH-001: Email Redirect URL Hardcoded**
- **File:** `src/routes/auth/+page.server.ts:27`
- **Issue:** Hardcoded redirect URL `http://www.exanimis.larront.com/auth` in signup flow
- **Risk:** Production URL hardcoded, won't work in dev/staging environments
- **Fix:** Use environment variables for redirect URLs
- **Priority:** High
- **Effort:** Low (30 min)

#### **AUTH-002: Missing RLS Policy Verification**
- **Issue:** While RLS is enabled on all tables, need to verify comprehensive policy coverage
- **Action:** Audit all RLS policies to ensure proper user isolation
- **Priority:** High
- **Effort:** Medium (2-3 hours)

#### **AUTH-003: Input Validation Missing**
- **Files:** Battle upload form, user profile forms
- **Issue:** Client-side validation only, no server-side validation
- **Risk:** Malicious data could be inserted
- **Fix:** Add server-side validation for all form submissions
- **Priority:** High
- **Effort:** High (1-2 days)

#### **AUTH-004: Password Reset Flow Missing**
- **Issue:** No password reset functionality implemented
- **Priority:** High
- **Effort:** Medium (4-6 hours)

### Database & Data Integrity

#### **DATA-001: Missing Foreign Key Constraints**
- **Tables:** `control.profile` field references faction name as text instead of profile ID
- **Issue:** Data integrity risk and potential orphaned records
- **Fix:** Update schema to use proper foreign key relationships
- **Priority:** High
- **Effort:** Medium (2-3 hours)

#### **DATA-002: Battle Data Validation**
- **Issue:** No validation for battle point totals or result consistency
- **Fix:** Add database constraints and server-side validation
- **Priority:** High
- **Effort:** Medium (2-3 hours)

---

## 🔶 Medium Priority Issues

### Performance & Optimization

#### **PERF-001: Bundle Size Analysis**
- **Action:** Analyze bundle size and identify optimization opportunities
- **Tools:** Use Vite bundle analyzer
- **Priority:** Medium
- **Effort:** Medium (2-3 hours)

#### **PERF-002: Component Lazy Loading**
- **Files:** Planet visualization components
- **Issue:** All components loaded upfront
- **Fix:** Implement lazy loading for heavy components
- **Priority:** Medium
- **Effort:** Medium (4-6 hours)

#### **PERF-003: Database Query Optimization**
- **Issue:** Multiple separate queries in page loads
- **Fix:** Implement query batching and joins
- **Priority:** Medium
- **Effort:** Medium (3-4 hours)

### Code Quality & Standards

#### **CODE-001: TypeScript Strict Mode**
- **File:** `tsconfig.json`
- **Issue:** Not using strict TypeScript settings
- **Fix:** Enable strict mode and fix type issues
- **Priority:** Medium
- **Effort:** High (1-2 days)

#### **CODE-002: Error Handling Consistency**
- **Issue:** Inconsistent error handling patterns across components
- **Fix:** Standardize error handling with proper error boundaries
- **Priority:** Medium
- **Effort:** Medium (4-6 hours)

#### **CODE-003: Component Props Validation**
- **Issue:** Missing runtime prop validation
- **Fix:** Add prop validation for all components
- **Priority:** Medium
- **Effort:** Medium (2-3 hours)

### UI/UX & Accessibility

#### **A11Y-001: Keyboard Navigation**
- **Issue:** Planet selection not fully keyboard accessible
- **Fix:** Add proper keyboard navigation support
- **Priority:** Medium
- **Effort:** Medium (3-4 hours)

#### **A11Y-002: Screen Reader Support**
- **Issue:** Missing ARIA labels and descriptions
- **Fix:** Add comprehensive ARIA support
- **Priority:** Medium
- **Effort:** Medium (4-6 hours)

#### **A11Y-003: Color Contrast Compliance**
- **Issue:** Some color combinations may not meet WCAG standards
- **Fix:** Audit and fix color contrast issues
- **Priority:** Medium
- **Effort:** Low (1-2 hours)

---

## 🔷 Low Priority Enhancements

### Features & Functionality

#### **FEAT-001: Real-time Updates**
- **Issue:** No real-time updates for battle results or planet control
- **Enhancement:** Implement Supabase real-time subscriptions
- **Priority:** Low
- **Effort:** High (2-3 days)

#### **FEAT-002: Advanced Filtering**
- **Enhancement:** Add filtering by faction, planet type, date range
- **Priority:** Low
- **Effort:** Medium (1-2 days)

#### **FEAT-003: Battle Statistics Dashboard**
- **Enhancement:** Add comprehensive statistics and charts
- **Priority:** Low
- **Effort:** High (3-4 days)

#### **FEAT-004: Data Export**
- **Enhancement:** Export battle history and statistics
- **Priority:** Low
- **Effort:** Medium (1 day)

### Testing & Reliability

#### **TEST-001: Unit Test Coverage**
- **Issue:** No test suite implemented
- **Fix:** Add comprehensive test coverage
- **Priority:** Low
- **Effort:** Very High (1-2 weeks)

#### **TEST-002: E2E Testing**
- **Enhancement:** Add end-to-end test suite
- **Priority:** Low
- **Effort:** High (3-5 days)

#### **TEST-003: Error Boundary Implementation**
- **Issue:** No error boundaries for graceful error handling
- **Fix:** Add error boundaries to prevent app crashes
- **Priority:** Low
- **Effort:** Medium (2-3 hours)

### Documentation & Maintenance

#### **DOC-001: API Documentation**
- **Issue:** No API documentation
- **Fix:** Document all server actions and database schemas
- **Priority:** Low
- **Effort:** Medium (1 day)

#### **DOC-002: Component Documentation**
- **Issue:** Components lack documentation
- **Fix:** Add JSDoc comments and usage examples
- **Priority:** Low
- **Effort:** Medium (4-6 hours)

#### **DOC-003: Deployment Documentation**
- **Issue:** No deployment procedures documented
- **Fix:** Document deployment process and environment setup
- **Priority:** Low
- **Effort:** Low (2-3 hours)

---

## 🔧 Technical Debt

### Configuration & Setup

#### **CONFIG-001: Environment Variables**
- **Issue:** Limited environment variable usage
- **Fix:** Move all configuration to environment variables
- **Priority:** Medium
- **Effort:** Medium (2-3 hours)

#### **CONFIG-002: Tailwind Configuration**
- **Issue:** Using Tailwind 4.x without proper configuration
- **Fix:** Properly configure Tailwind 4.x features
- **Priority:** Low
- **Effort:** Low (1-2 hours)

#### **CONFIG-003: ESLint Configuration**
- **Issue:** Basic ESLint setup
- **Fix:** Add comprehensive ESLint rules for SvelteKit
- **Priority:** Low
- **Effort:** Low (1 hour)

### Code Organization

#### **ORG-001: Utils Library**
- **Issue:** Utility functions scattered across components
- **Fix:** Create centralized utils library
- **Priority:** Low
- **Effort:** Medium (2-3 hours)

#### **ORG-002: Constants Management**
- **Issue:** Magic numbers and strings throughout codebase
- **Fix:** Create constants file for all magic values
- **Priority:** Low
- **Effort:** Medium (2-3 hours)

---

## 🎯 Quick Wins (< 1 hour each)

1. **Fix hardcoded redirect URL** (AUTH-001)
2. **Add proper TypeScript imports** for better tree-shaking
3. **Implement loading states** for all async operations
4. **Add proper alt text** for all images
5. **Update README** with proper setup instructions
6. **Add .env.example** file
7. **Fix console.log statements** in production code
8. **Add proper error messages** for form validation

---

## 📋 Implementation Roadmap

### Phase 1: Security & Critical Issues (1-2 weeks)
- AUTH-001 through AUTH-004
- DATA-001 through DATA-002
- Input validation implementation

### Phase 2: Performance & Quality (2-3 weeks)
- PERF-001 through PERF-003
- CODE-001 through CODE-003
- A11Y-001 through A11Y-003

### Phase 3: Features & Enhancements (4-6 weeks)
- FEAT-001 through FEAT-004
- TEST-001 through TEST-003
- DOC-001 through DOC-003

### Phase 4: Polish & Optimization (1-2 weeks)
- Technical debt cleanup
- Performance optimizations
- Final testing and documentation

---

## 🚀 Next Steps

1. **Immediate:** Fix hardcoded redirect URL and add input validation
2. **Short-term:** Complete security audit and implement RLS policies
3. **Medium-term:** Add comprehensive testing and improve performance
4. **Long-term:** Implement real-time features and advanced functionality

---

*Generated during code review session - prioritize security and data integrity issues first*