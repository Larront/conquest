# User Settings Restructure Plan

## Current State Analysis

### User Settings Page (`/private/user/`)

- Already has a tabbed interface with 4 tabs: Profile, Statistics, Factions, Security
- Profile tab: Username and faction selection
- Statistics tab: Battle stats, account info
- Factions tab: Currently just links to `/private/user/factions` page
- Security tab: Password change functionality

### Standalone Factions Page (`/private/user/factions/`)

- Full faction management interface
- Add/edit/delete user factions
- Faction statistics display
- Independent page with its own layout

## Issues to Address

1. **Redundant Navigation**: Users have to navigate to separate page for faction management
2. **Inconsistent UX**: Faction tab just links out instead of providing inline functionality
3. **Poor Information Architecture**: Related settings are scattered across different pages
4. **Mobile Unfriendly**: Extra navigation steps on mobile devices

## Proposed Solution

### 1. Integrate Faction Management into User Settings

- Move all faction management functionality into the "Factions" tab
- Remove the separate `/private/user/factions/` page
- Create a more intuitive, single-page experience

### 2. Enhanced Faction Tab Structure

- **Overview Section**: Quick summary of all user factions
- **Management Section**: Add/edit/delete functionality inline
- **Statistics Section**: Per-faction battle statistics

### 3. Improved User Experience

- Modal/drawer for add/edit faction forms
- Better visual hierarchy and spacing
- Responsive design for mobile devices
- Consistent styling with existing tabs

## Implementation Steps

1. **Migrate Server Logic**: Move faction management actions to user page server
2. **Integrate UI Components**: Move faction management UI into the factions tab
3. **Update Navigation**: Remove links to separate factions page
4. **Enhance UX**: Add modal/drawer for forms instead of inline editing
5. **Clean up**: Remove obsolete factions page files
6. **Update Routes**: Ensure proper redirects if any external links exist

## Files to Modify

### Primary Changes

- `src/routes/private/user/+page.svelte` - Integrate faction management UI
- `src/routes/private/user/+page.server.ts` - Add faction management actions
- `src/routes/private/user/+layout.svelte` - Update if needed for new functionality

### Files to Remove

- `src/routes/private/user/factions/+page.svelte`
- `src/routes/private/user/factions/+page.server.ts`

### Additional Considerations

- Add proper form validation schemas to main user validation file
- Ensure all faction management functionality is preserved
- Maintain existing security and data integrity checks
- Test responsive behavior on mobile devices
