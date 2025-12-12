# Admin CMS UI Guidelines

## Design Principles

### 1. Clean & Minimal
- Use plenty of whitespace
- Avoid clutter - only show necessary elements
- Group related items together

### 2. Intuitive Navigation
- Clear sidebar with icons + labels
- Breadcrumbs for deep navigation
- Active state clearly visible

### 3. Immediate Feedback
- Loading states for all async operations
- Success/error toasts for actions
- Confirm before destructive actions (delete)

### 4. Mobile Responsive
- Collapsible sidebar on mobile
- Touch-friendly buttons (min 44px tap target)
- Stack forms vertically on small screens

---

## Color Scheme

```css
/* Admin Dashboard Colors */
--admin-bg: #f8fafc;           /* Light gray background */
--admin-sidebar: #1e293b;      /* Dark slate sidebar */
--admin-sidebar-hover: #334155;
--admin-accent: #6366f1;       /* Indigo accent */
--admin-accent-hover: #4f46e5;
--admin-success: #22c55e;
--admin-error: #ef4444;
--admin-warning: #f59e0b;
```

---

## Component Standards

### Buttons
- Primary: Indigo background, white text
- Secondary: White background, gray border
- Danger: Red background for delete actions
- Disabled: Reduced opacity (50%)

### Forms
- Labels above inputs
- Placeholder text for hints
- Error messages below inputs in red
- Required fields marked with asterisk

### Cards
- White background
- Subtle shadow
- Rounded corners (8px)
- Padding: 24px

### Tables
- Alternating row colors
- Hover state on rows
- Action buttons on right side

---

## Page Layouts

### Admin Dashboard
```
┌─────────────────────────────────────────────────┐
│  Logo          Dashboard Title       [Logout]   │
├──────────┬──────────────────────────────────────┤
│          │ Page Title                           │
│ Sidebar  │ ─────────────────────────────        │
│          │                                      │
│ [icon]   │   Main Content Area                  │
│  Home    │                                      │
│          │                                      │
│ [icon]   │                                      │
│  Gallery │                                      │
│          │                                      │
│ [icon]   │                                      │
│  Pages   │                                      │
│          │                                      │
│ [icon]   │                                      │
│  Reviews │                                      │
│          │                                      │
└──────────┴──────────────────────────────────────┘
```

### Gallery Management
- Grid layout for images
- Drag handles for reordering
- Overlay with edit/delete on hover
- Upload button prominent at top

### Content Editor
- Page selector dropdown at top
- List of sections with expand/collapse
- Rich text editor inline
- Auto-save indicator

### Testimonials
- Card layout for each testimonial
- Star rating display
- Edit/delete buttons visible
- Add new button at top

---

## Accessibility

- All interactive elements keyboard accessible
- ARIA labels on icon-only buttons
- Focus visible states
- Color contrast minimum 4.5:1

---

## Testing Checklist

Before each feature is complete:
- [ ] Desktop view looks clean
- [ ] Mobile view is usable
- [ ] All buttons have hover states
- [ ] Loading states display correctly
- [ ] Error handling works
- [ ] Success feedback shows
- [ ] No console errors
