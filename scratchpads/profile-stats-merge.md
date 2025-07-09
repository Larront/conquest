# Profile and Statistics Tab Merge Plan

## Current State Analysis

### Profile Tab

- **Username editing**: Allows users to change their servitor designation
- **Faction selection**: Dropdown to change primary allegiance (redundant)
- **Form submission**: Updates profile with username and faction
- **Validation**: Username rules and faction requirement

### Statistics Tab

- **Combat Record**: Battle statistics (wins, losses, draws, win rate)
- **Account Information**: Enlisted date, servitor ID, security clearance
- **Calculated Metrics**: Total battles, average points per battle, account age
- **Read-only data**: All information is display-only

## Identified Issues

1. **Redundant Faction Selection**: The profile faction selector is redundant since users now manage multiple factions in the dedicated factions tab
2. **Unnecessary Tab Separation**: Profile editing and statistics viewing could coexist in a single tab
3. **Limited Profile Fields**: Only username can be edited, making the profile tab quite sparse
4. **UX Inefficiency**: Users need to switch tabs to see their stats while editing profile

## Proposed Solution

### 1. Merge Profile and Statistics into "Profile" Tab

- Combine both functionalities into a single, comprehensive profile view
- Create a layout with profile editing on the left and statistics on the right (desktop)
- Stack vertically on mobile for better responsive behavior

### 2. Remove Redundant Faction Selection

- Remove the "ALLEGIANCE" field from profile editing
- Update validation schema to only require username
- Update server action to only handle username updates
- Remove faction-related form fields and validation

### 3. Enhanced Layout Structure

```
Profile Tab:
├── Profile Information (Left/Top)
│   ├── Username editing form
│   ├── Account information (read-only)
│   └── Update button
└── Battle Statistics (Right/Bottom)
    ├── Combat record metrics
    ├── Battle statistics grid
    └── Performance calculations
```

### 4. Improved Information Architecture

- **Editable Profile Data**: Username only
- **Account Information**: ID, enlisted date, security status
- **Battle Performance**: Wins, losses, draws, win rate, total points
- **Calculated Metrics**: Account age, battles reported, average points

## Implementation Steps

1. **Update Tab Structure**: Remove "Statistics" tab, enhance "Profile" tab
2. **Update Validation Schema**: Remove faction requirement from userUpdateSchema
3. **Redesign Profile Tab Layout**: Create two-column layout for desktop, stacked for mobile
4. **Update Server Actions**: Remove faction handling from updateuser action
5. **Merge UI Components**: Combine profile form and statistics display
6. **Update State Management**: Remove faction-related reactive variables
7. **Test Responsive Behavior**: Ensure mobile layout works properly

## Files to Modify

### Primary Changes

- `src/routes/private/user/+page.svelte` - Merge tab content and remove faction field
- `src/lib/validation.ts` - Update userUpdateSchema to remove faction requirement
- `src/routes/private/user/+page.server.ts` - Update updateuser action

### Expected Benefits

- **Simplified UX**: Single tab for profile management and statistics viewing
- **Reduced Redundancy**: No conflicting faction selections
- **Better Information Density**: More useful information in fewer tabs
- **Improved Mobile Experience**: Better responsive layout
- **Cleaner Code**: Less tab switching logic and state management
