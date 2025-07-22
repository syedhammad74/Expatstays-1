# Expat Stays Style Guide

This document outlines the design system and component patterns used throughout the Expat Stays website.

## Design Tokens

### Colors

- **Primary**: `hsl(var(--primary))` - Forest green (#235347)
- **Secondary**: `hsl(var(--secondary))` - Light forest green
- **Accent**: `hsl(var(--accent))` - Highlight color
- **Background**: `hsl(var(--background))` - Page background
- **Card**: `hsl(var(--card))` - Card background
- **Forest Palette**:
  - Dark: #051F20
  - Medium-Dark: #0B2B26
  - Medium: #163832
  - Primary: #235347
  - Light: #8EB69B
  - Very-Light: #DAF1DE

### Typography

- **Font Family**: Inter, Poppins, Manrope, sans-serif
- **Headings**:
  - H1: 3rem/4rem (48px/64px)
  - H2: 2.25rem (36px)
  - H3: 1.5rem (24px)
- **Body**: 1rem (16px)
- **Small**: 0.875rem (14px)

### Spacing

- **Base Unit**: 0.25rem (4px)
- **Standard Spacing**:
  - xs: 0.5rem (8px)
  - sm: 1rem (16px)
  - md: 1.5rem (24px)
  - lg: 2rem (32px)
  - xl: 3rem (48px)

### Border Radius

- **Small**: 0.5rem (8px)
- **Medium**: 0.75rem (12px)
- **Large**: 1rem (16px)
- **Components**: 1rem (16px)
- **Buttons**: 0.75rem (12px)

### Shadows

- **Minimal**: `0 2px 8px rgba(0, 0, 0, 0.04)`
- **Minimal Hover**: `0 4px 16px rgba(0, 0, 0, 0.08)`
- **Primary**: `0 4px 12px hsl(var(--primary) / 0.3)`
- **Primary Hover**: `0 8px 24px hsl(var(--primary) / 0.4)`
- **Neumorph**: `0 4px 24px 0 rgba(8, 32, 24, 0.12)`
- **Glass**: `0 8px 32px 0 rgba(31, 38, 135, 0.15)`

## Components

### Cards

All cards should use the standardized `Card` component with consistent styling:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent>Content goes here</CardContent>
  <CardFooter>Footer content (optional)</CardFooter>
</Card>
```

**Variants**:

- `default`: Standard card with border and shadow
- `elevated`: Card with stronger shadow
- `outline`: Borderless card with transparent background
- `minimal`: White card with minimal shadow

**Hover State**: Cards should have a subtle hover effect with increased shadow and a slight upward movement.

### Buttons

Use the standardized `Button` component for all clickable actions:

```tsx
<Button variant="default">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
```

**Variants**:

- `default`: Primary action button
- `secondary`: Secondary action button
- `outline`: Outlined button
- `ghost`: Text-only button
- `link`: Link-styled button
- `minimal`: Minimal styled button
- `accent`: Accent-colored button

**Sizes**:

- `default`: Standard size
- `sm`: Small
- `lg`: Large
- `icon`: Icon-only button

### Toast Notifications

Toast notifications should appear in the bottom-right corner of the screen:

```tsx
toast({
  title: "Success",
  description: "Action completed successfully",
  variant: "default",
});
```

**Variants**:

- `default`: Standard toast
- `destructive`: Error toast

**Duration**: 5 seconds by default

### Decorative Elements

Decorative elements should be used sparingly and only on larger viewports:

```tsx
<DecorativeElements variant="default" density="medium" />
```

**Variants**:

- `default`: Forest-themed colors
- `minimal`: Neutral colors
- `accent`: Accent colors

**Density**:

- `low`: Few elements
- `medium`: Medium number of elements
- `high`: Many elements

## Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px

## Accessibility Guidelines

- All images must have descriptive `alt` text
- Color contrast ratio must be at least 4.5:1 for normal text
- Interactive elements must have visible focus states
- Form elements must have associated labels
- Use semantic HTML elements appropriately

## Performance Guidelines

- Lazy load images below the fold
- Use the `OptimizedImage` component for automatic lazy loading
- Keep bundle sizes small with code splitting
- Minimize render-blocking resources
- Ensure animations run at 60fps

## Maintenance

When adding new components or patterns:

1. Follow the existing design tokens
2. Use the standardized components
3. Ensure responsive behavior
4. Test for accessibility
5. Optimize for performance
6. Update this style guide as needed
