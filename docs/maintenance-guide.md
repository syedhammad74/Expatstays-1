# Expat Stays Maintenance Guide

This document provides guidelines for maintaining and extending the optimized Expat Stays website.

## Performance Monitoring

### Tools

- **Lighthouse**: Run regular audits to ensure performance scores remain above 90
- **WebPageTest**: Test cross-browser performance quarterly
- **Core Web Vitals**: Monitor via Google Search Console

### Key Metrics to Monitor

- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s
- Total Blocking Time (TBT): < 200ms

## Adding New Pages

When adding new pages:

1. Use the appropriate metadata for SEO:

```tsx
export const metadata: Metadata = {
  title: "Page Title | Expat Stays",
  description: "Page description with keywords",
  // Add other metadata as needed
};
```

2. Include JSON-LD structured data:

```tsx
import { PropertyJsonLd } from "@/components/seo/json-ld";

// In your component
return (
  <>
    <PropertyJsonLd
      name="Property Name"
      description="Property description"
      // Other required props
    />
    {/* Page content */}
  </>
);
```

3. Update the sitemap.xml when adding new pages

## Component Guidelines

### Cards

- Use the standardized Card component
- Maintain consistent padding (p-6)
- Use consistent hover effects
- Follow the shadow hierarchy

### Images

- Always use the OptimizedImage component for automatic lazy loading
- Provide proper alt text
- Use next/image for automatic optimization
- Consider adding width and height to prevent layout shifts

### Decorative Elements

- Only use on larger viewports (≥ 1024px)
- Scale back or hide on mobile and tablet
- Ensure they don't interfere with content
- Use theme-aligned colors

## Theme Updates

### Updating Color Tokens

1. Modify the CSS variables in `src/app/globals.css`
2. Update the tailwind.config.ts if adding new colors
3. Test across light and dark modes

### Adding New Animations

1. Add keyframes to tailwind.config.ts:

```ts
keyframes: {
  "new-animation": {
    "0%": { /* start state */ },
    "100%": { /* end state */ },
  },
},
```

2. Add the animation to the animations object:

```ts
animation: {
  "new-animation": "new-animation 1s ease-in-out",
},
```

## SEO Maintenance

### Regular Tasks

- Update sitemap.xml monthly
- Monitor keyword rankings for "expat stays" and related terms
- Review and update meta descriptions quarterly
- Check for broken links monthly
- Update JSON-LD structured data when content changes

### Content Updates

- Focus on "expat stays" keyword in titles and headings
- Use semantic HTML (h1, h2, etc.)
- Include internal links to key pages
- Add alt text to all images

## Toast Notifications

### Adding New Toast Types

1. Update the toast variants in `src/components/ui/toast.tsx`:

```tsx
const toastVariants = cva(
  // Base styles
  {
    variants: {
      variant: {
        // Existing variants
        "new-variant": "bg-color text-color border-color",
      },
    },
  }
);
```

2. Use the new variant:

```tsx
toast({
  title: "Title",
  description: "Description",
  variant: "new-variant",
});
```

### Customizing Toast Position

- Modify the ToastViewport component in `src/components/ui/toast.tsx`

## Performance Best Practices

- Use code splitting for large components
- Lazy load below-the-fold content
- Optimize images and use WebP/AVIF formats
- Minimize third-party scripts
- Use the bundle analyzer to identify large packages

## Deployment Checklist

Before deploying updates:

1. Run Lighthouse audit
2. Test on multiple browsers
3. Verify responsive behavior
4. Check accessibility
5. Validate SEO elements
6. Test core user flows
7. Verify toast notifications work correctly
8. Ensure decorative elements render properly

## Troubleshooting Common Issues

### Layout Shifts

- Check for missing image dimensions
- Verify font loading strategy
- Look for dynamically injected content

### Performance Regressions

- Review bundle size changes
- Check for render-blocking resources
- Verify lazy loading is working
- Inspect third-party script loading

### SEO Issues

- Verify canonical URLs
- Check robots.txt configuration
- Ensure structured data is valid
- Test meta tags and Open Graph data
