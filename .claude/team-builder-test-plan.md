# Team Builder Modal Visual Test Plan

**Target URL:** http://localhost:3005/bulk-orders
**Test Date:** 2026-01-09
**Viewport:** Desktop (1280x800)
**Browser:** Chromium

## Test Scenario Overview

This test validates the Team Builder modal workflow, focusing on:
- Individual item customization interface
- Bulk discount tier progression (5+ items = 10% discount)
- Cart integration with all items as separate line items
- Discount application in cart sidebar

## Expected Test Flow

### Step 1: Open Team Builder Modal
**Action:** Click "Open Team Builder" button on bulk-orders page

**Expected Screenshot Elements:**
1. Modal overlay with backdrop blur effect
2. Header section with:
   - Users icon in gold badge
   - Title: "TEAM ORDER BUILDER"
   - Subtitle: "Customize each item individually"
   - Close (X) button in top-right
3. Left panel showing:
   - Empty state message: "No items yet"
   - "Add First Item" button (primary gold styling)
4. Right panel showing:
   - "ORDER SUMMARY" heading
   - "No items added yet" text
   - Disabled "Add All to Cart" button

**Screenshot Name:** `team-builder-01-empty-modal.png`

---

### Step 2: Add First Item Form
**Action:** Click "Add First Item" button

**Expected Screenshot Elements:**
1. Expanded form in gold-highlighted box showing:
   - "New Item" label with Cancel link
   - Product selection (2 buttons):
     - Crown: $19.99 (4 sizes available)
     - Medal: $9.99 (Gold, Silver, Bronze)
   - Size selection (for Crown):
     - Kids, Small, Medium (selected), Large
   - Color selection:
     - Green (selected), Pink, Gold
     - Color swatches visible
   - Custom text input field:
     - Placeholder: "e.g., Player name, team name"
     - Character counter: 0/20
   - "Add to Order" button (primary gold)

**Screenshot Name:** `team-builder-02-add-item-form.png`

---

### Step 3: Add 5 Items with Different Names
**Actions:**
1. Add Item 1: Crown, Medium, Green, "Player 1"
2. Add Item 2: Crown, Medium, Green, "Player 2"
3. Add Item 3: Crown, Medium, Green, "Player 3"
4. Add Item 4: Crown, Medium, Green, "Player 4"
5. Add Item 5: Crown, Medium, Green, "Player 5"

**Expected Screenshot Elements:**

Left Panel (Items List):
1. 5 item cards, each showing:
   - Item number (#1 through #5)
   - Crown product thumbnail
   - Product name: "Pickleball Crown"
   - Specs: "Medium • Green • "Player X""
   - Price: $19.99
   - Edit and Delete buttons

2. "Add Another Item" button (dashed border)

Right Panel (Order Summary):
1. Tier Progress Indicator:
   - Progress bar showing 5/5 items (unlocked tier)
   - "10% OFF" badge visible
   - Next tier preview: "Add 5 more for 15% off"

2. Items Summary:
   - #1 Crown - Player 1: $19.99
   - #2 Crown - Player 2: $19.99
   - #3 Crown - Player 3: $19.99
   - #4 Crown - Player 4: $19.99
   - #5 Crown - Player 5: $19.99

3. Totals Section:
   - Subtotal (5 items): $99.95 (strikethrough)
   - Bulk Discount (10% OFF): -$9.99 (green text)
   - Total: $89.96 (large, bold)
   - "You save $9.99!" message (green)

**Screenshot Name:** `team-builder-03-five-items-with-discount.png`

**Critical Validation Points:**
- Discount is NOT applied until 5th item is added
- At 4 items: No discount, total = $79.96
- At 5 items: 10% discount applied, total = $89.96
- Helper text appears: "Add 5 more for 15% off"

---

### Step 4: Click "Add All to Cart"
**Action:** Click the "Add All to Cart" button in right panel

**Expected Behavior:**
1. Button changes to: "Added to Cart!" with checkmark icon
2. Modal closes after 500ms delay
3. Cart sidebar automatically opens (right side of screen)

**Screenshot Name:** (Modal will be closed, capture cart in next step)

---

### Step 5: Cart Sidebar with Bulk Discount
**Expected Screenshot Elements:**

Cart Sidebar (Right side overlay):
1. Cart Header:
   - "Your Cart (5)" title
   - Close button

2. Line Items (scrollable):
   - Item 1: Pickleball Crown
     - Medium • Green
     - Custom: "Player 1"
     - Price: $19.99
   - Item 2: Pickleball Crown
     - Medium • Green
     - Custom: "Player 2"
     - Price: $19.99
   - Item 3: Pickleball Crown
     - Medium • Green
     - Custom: "Player 3"
     - Price: $19.99
   - Item 4: Pickleball Crown
     - Medium • Green
     - Custom: "Player 4"
     - Price: $19.99
   - Item 5: Pickleball Crown
     - Medium • Green
     - Custom: "Player 5"
     - Price: $19.99

3. Cart Totals Section:
   - Subtotal (5 items): $99.95
   - Bulk Discount (10% OFF): -$9.99 (green text)
   - Shipping: FREE (calculated at checkout)
   - Total: $89.96 (large, bold)

4. Discount Badge:
   - Visible indicator: "5+ items - 10% OFF applied"

5. Action Buttons:
   - "Checkout" button (primary)
   - "Continue Shopping" link

**Screenshot Name:** `team-builder-04-cart-sidebar-with-discount.png`

**Critical Validation Points:**
- Each item appears as separate line item (not grouped)
- Each item shows its individual customization
- Bulk discount is clearly shown as a line item deduction
- Subtotal reflects original total ($99.95)
- Final total reflects discounted amount ($89.96)
- Savings amount is clearly communicated

---

## Edge Cases to Test

### Test Case A: Mixed Products (Crowns + Medals)
- Add 3 Crowns ($19.99 each) = $59.97
- Add 2 Medals ($9.99 each) = $19.98
- Total: 5 items = $79.95
- Expected discount: 10% = -$8.00
- Final total: $71.95

### Test Case B: Discount Tier Boundaries
- 4 items: No discount ($79.96)
- 5 items: 10% discount ($89.96)
- 10 items: 15% discount ($169.92)
- 25 items: 20% discount ($399.80)
- 50 items: 25% discount ($749.63)
- 100+ items: 30% discount ($1,399.30 for 100 crowns)

### Test Case C: Edit Item After Adding
**Action:** Click Edit button on item #3
**Expected:**
- Item expands to show full edit form
- Can change product type, size, color, text
- "Done" button to save changes
- Changes reflected in summary panel totals

---

## Console Monitoring

**Expected Console Activity:**
- No errors during modal open/close
- No errors during item addition
- No errors during cart update
- Possible React hydration warnings (non-critical)

**Network Requests:**
- No network calls (pure client-side operation)
- Cart state managed in React Context
- LocalStorage updates for cart persistence

---

## Responsive Behavior Notes

At 1280x800 viewport:
- Modal should use fixed positioning with inset-4 md:inset-8 lg:inset-16
- Two-column layout: items list (flex-1) + summary panel (320px fixed)
- No horizontal scrolling
- Summary panel should be fully visible
- "Add Item" form should not overflow

---

## Accessibility Checklist

- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Escape key closes modal
- [ ] Focus trap within modal when open
- [ ] Color contrast meets WCAG AA standards
- [ ] Form inputs have proper labels
- [ ] Buttons have clear hover/focus states

---

## Known Issues / Technical Debt

1. **MCP Browser Cannot Access Localhost:**
   - Docker networking prevents browser container from reaching host
   - Workaround: Manual testing or deploy to accessible URL

2. **Discount Calculation:**
   - Currently rounds to nearest cent: `Math.round(total * (1 - discount))`
   - May cause penny differences in large orders

3. **Cart Persistence:**
   - Items stored in localStorage
   - Bulk discount NOT persisted as separate entity
   - Recalculated on cart open based on quantity

---

## Test Execution Commands

```bash
# Start dev server
cd /Users/matthewrundle/Documents/BigDill
npm run dev

# Access in browser
open http://localhost:3005/bulk-orders

# Manual screenshot capture locations
.claude/screenshots/team-builder-01-empty-modal.png
.claude/screenshots/team-builder-02-add-item-form.png
.claude/screenshots/team-builder-03-five-items-with-discount.png
.claude/screenshots/team-builder-04-cart-sidebar-with-discount.png
```

---

## Component Architecture Analysis

### Key Files:
- **Page:** `/Users/matthewrundle/Documents/BigDill/app/bulk-orders/page.tsx`
- **Modal:** `/Users/matthewrundle/Documents/BigDill/components/bulk/TeamBuilder.tsx`
- **Cart Context:** Implied from import `@/lib/cart-context`
- **Products Data:** `@/lib/products`

### State Management:
```typescript
// Team Builder Local State
items: TeamItem[]           // Array of configured items
editingItem: string | null  // ID of item being edited
isAddingNew: boolean        // New item form visibility
isSubmitting: boolean       // Cart submission state

// Cart Global State (Context)
addItem(sku, options, quantity)  // Adds to cart
```

### Discount Tiers (from code):
```typescript
export const discountTiers = [
  { min: 0, max: 4, discount: 0, label: '0% OFF' },
  { min: 5, max: 9, discount: 0.10, label: '10% OFF', badge: 'Most Popular' },
  { min: 10, max: 24, discount: 0.15, label: '15% OFF' },
  { min: 25, max: 49, discount: 0.20, label: '20% OFF', badge: 'Best Value' },
  { min: 50, max: 99, discount: 0.25, label: '25% OFF' },
  { min: 100, max: Infinity, discount: 0.30, label: '30% OFF' },
]
```

---

## Success Criteria

✅ Modal opens with correct initial state
✅ Individual item form shows all customization options
✅ 5 items trigger 10% bulk discount
✅ Tier progress indicator reflects current discount level
✅ All 5 items appear as separate line items in cart
✅ Bulk discount shown as line item deduction in cart
✅ Total reflects correct discounted amount ($89.96)
✅ Savings message displays correct amount ($9.99)
✅ No console errors or network failures
✅ UI is responsive and no layout breaks at 1280x800

---

## Manual Testing Instructions

Since automated browser testing cannot access localhost from Docker:

1. **Open browser to:** http://localhost:3005/bulk-orders
2. **Set viewport:** 1280x800 (use DevTools)
3. **Click:** "Open Team Builder" button
4. **Capture screenshot 1:** Empty modal state
5. **Click:** "Add First Item"
6. **Capture screenshot 2:** Add item form
7. **Fill form:**
   - Select: Crown
   - Size: Medium
   - Color: Green
   - Text: "Player 1"
8. **Click:** "Add to Order"
9. **Repeat steps 7-8** for Players 2, 3, 4, 5
10. **Capture screenshot 3:** All 5 items with discount visible
11. **Click:** "Add All to Cart"
12. **Capture screenshot 4:** Cart sidebar showing all items + discount

Save all screenshots to:
```
/Users/matthewrundle/Documents/BigDill/.claude/screenshots/
```

---

## Test Report Template

```markdown
# Team Builder Test Results
**Tested:** [Date]
**Browser:** Chromium
**Viewport:** 1280x800
**Status:** [PASS/FAIL/NEEDS REVIEW]

## Test Results
- [ ] Modal opens correctly
- [ ] Item form displays all fields
- [ ] 5 items unlocks 10% discount
- [ ] Cart shows all items separately
- [ ] Discount applied to cart total
- [ ] No console errors

## Issues Found
[List any visual bugs or functional issues]

## Screenshots
- ![Empty Modal](.claude/screenshots/team-builder-01-empty-modal.png)
- ![Add Form](.claude/screenshots/team-builder-02-add-item-form.png)
- ![Five Items](.claude/screenshots/team-builder-03-five-items-with-discount.png)
- ![Cart](.claude/screenshots/team-builder-04-cart-sidebar-with-discount.png)
```
