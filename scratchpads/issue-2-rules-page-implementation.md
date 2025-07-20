# Issue #2: Add a Rules Page Implementation Plan

**Issue Link**: https://github.com/Larront/conquest/issues/2

## Problem Summary

Create a publicly accessible rules page at `/rules` that displays campaign rules from the existing `RULES.md` file with a space-themed aesthetic matching the main application.

## Current State Analysis

### ✅ What We Have
- Well-formatted `RULES.md` file with all required content (69 lines)
- Existing space-themed aesthetics (dark backgrounds, yellow accents, starfields)
- `@tailwindcss/typography` for markdown styling
- SvelteKit server-side rendering capabilities
- Public routing structure

### ❌ What We Need
- Markdown processing library (e.g., `marked`)
- `/rules` route implementation
- Server-side file reading logic
- Space-themed page layout
- Last updated timestamp functionality

## Implementation Breakdown

### Phase 1: Setup Dependencies
1. **Install markdown processor**
   - Add `marked` library for markdown-to-HTML conversion
   - Configure proper types if needed

### Phase 2: Create Route Structure
2. **Create `/rules` route**
   - `src/routes/rules/+page.svelte` - Rules page component
   - `src/routes/rules/+page.server.ts` - Server-side data loading

### Phase 3: Server-Side Implementation
3. **Implement file reading logic**
   - Read `RULES.md` from filesystem using Node.js `fs`
   - Convert markdown to HTML using `marked`
   - Get file modification timestamp for "last updated"
   - Handle errors gracefully (file not found, etc.)

### Phase 4: Frontend Implementation
4. **Create rules page component**
   - Space-themed layout matching main page aesthetic
   - Responsive design for mobile/desktop
   - Typography styling using `@tailwindcss/typography`
   - Display last updated timestamp

### Phase 5: Styling & Polish
5. **Apply space theme styling**
   - Dark background with starfield effects
   - Yellow accent colors for headings
   - Properly styled tables for control thresholds and scoring
   - Consistent spacing and typography hierarchy

### Phase 6: Testing & Validation
6. **Ensure functionality**
   - Test route accessibility (no auth required)
   - Verify markdown conversion accuracy
   - Test responsive design
   - Validate last updated timestamp
   - Check table formatting

## Technical Requirements

### Dependencies to Add
```bash
npm install marked
npm install --save-dev @types/marked
```

### Files to Create/Modify
- Create: `src/routes/rules/+page.svelte`
- Create: `src/routes/rules/+page.server.ts`

### Acceptance Criteria Checklist
- [ ] Page loads at `/rules` route
- [ ] Content generated from `RULES.md` file
- [ ] Displays last updated timestamp
- [ ] Maintains space-themed styling
- [ ] Works on mobile devices
- [ ] Tables properly formatted
- [ ] No authentication required
- [ ] Fast loading performance

## Risk Assessment

### Low Risk
- Markdown processing is well-established
- File reading is straightforward
- Existing space theme can be replicated

### Considerations
- Ensure proper error handling for file reading
- Cache processed content for performance
- Sanitize HTML output (though `marked` handles this)

## Estimated Complexity
**Medium** - Involves new dependencies, server-side logic, and styling coordination, but follows established patterns in the codebase.