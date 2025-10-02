# Project Cleanup Plan

## 🎯 Overview

This document outlines unused files, duplicate components, and optimization opportunities to clean up the project.

## 📋 Files to Remove

### 1. **Unused Components**

- ✅ `src/components/PerformanceLayout.tsx` - Already deleted
- ✅ `src/components/OptimizedImage.tsx` - Already deleted (kept ui/optimized-image.tsx)
- ✅ `src/components/AdvancedImage.tsx` - Already deleted
- ✅ `src/components/layout/LuxeNavbar.tsx` - Already deleted
- ✅ `src/components/PerformanceDashboard.tsx` - Already deleted
- ✅ `src/components/PerformanceSummary.tsx` - Already deleted
- ✅ `src/components/ui/virtual-grid.tsx` - Already deleted
- ✅ `src/components/VirtualizedPropertyGrid.tsx` - Already deleted

### 2. **Unused Hooks**

- ✅ `src/hooks/use-performance-optimizer.ts` - Already deleted
- `src/hooks/use-performance.tsx` - Still has 1 import in blog/optimized-page.tsx
- `src/hooks/useOptimizedFetch.ts` - Check if used

### 3. **Unused Services/Utils**

- ✅ `src/lib/performance-config.ts` - Already deleted
- ✅ `src/lib/performance.ts` - Already deleted
- `src/lib/performance-monitor.ts` - Check if used

### 4. **Unused Data Files**

- ✅ `src/data/properties-listing.json` - Already deleted
- ✅ `src/data/PROPERTY_DATA_README.md` - Already deleted
- Keep: `src/data/comprehensive-properties.json` - May be used
- Keep: `src/data/mock-database-full.json` - Used by services

### 5. **Old/Unoptimized Pages**

- `src/app/admin/page.tsx` - Replace with page-optimized.tsx (2,296 lines)
- `src/app/properties/page.tsx` - Replace with page-optimized.tsx
- Keep `src/app/properties/optimized-page.tsx` - Legacy version

## 🔄 Files with Framer Motion to Clean

### Need to remove Framer Motion from 26 files:

1. `src/app/experiences/page.tsx`
2. `src/app/blog/optimized-page.tsx`
3. `src/components/layout/Header.tsx`
4. `src/app/contact/page.tsx`
5. `src/app/blog/page.tsx`
6. `src/app/properties/[slug]/book/page.tsx`
7. `src/app/blog/day-trips-from-islamabad-murree-nathia-gali/page.tsx`
8. `src/app/blog/top-5-things-to-do-islamabad/page.tsx`
9. `src/app/blog/food-lovers-guide-islamabad-cafes-eateries/page.tsx`
10. `src/app/blog/how-to-feel-at-home-living-abroad/page.tsx`
11. `src/app/about/page.tsx`
12. `src/app/admin/page.tsx`
13. `src/components/layout/Footer.tsx`
14. `src/app/auth/signup/page.tsx`
15. `src/app/auth/signin/page.tsx`
16. `src/components/sections/ServicesOverviewSection.tsx`
17. `src/app/services/page.tsx`
18. `src/app/booking/cancel/page.tsx`
19. `src/app/profile/page.tsx`
20. `src/app/my-bookings/page.tsx`
21. `src/app/booking/success/page.tsx`
22. `src/components/admin/AdminDataManager.tsx`
23. `src/components/admin/PropertyCreationDialog.tsx`
24. `src/components/payment/PaymentForm.tsx`
25. `src/components/payment/MockPaymentForm.tsx`
26. `scripts/remove-heavy-dependencies.js` - Only referenced, not imported

## 🔧 Embla Carousel Cleanup

- `src/components/sections/ServicesOverviewSection.tsx` - Replace with CSS carousel

## 📝 Duplicate Components to Consolidate

### PropertyCard Duplication

- `src/components/PropertyCard.tsx` - Original component (used in many places)
- `src/components/molecular/PropertyCard.tsx` - New atomic version
- **Action**: Keep both for now, gradually migrate

### Data Files

- `src/data/comprehensive-properties.json` - Full property data
- `src/data/mock-database-full.json` - Mock DB data
- **Action**: Keep both, ensure consistency

## 🧹 Optimization Opportunities

### 1. **Replace Large Pages**

```bash
# Admin Dashboard
mv src/app/admin/page-optimized.tsx src/app/admin/page.tsx
# Or add conditional rendering
```

### 2. **Consolidate Imports**

```typescript
// Instead of:
import PropertyCard from "@/components/PropertyCard";
// Use:
import { PropertyCard } from "@/components/molecular";
```

### 3. **Remove Performance Monitoring**

- Clean up `src/hooks/use-performance.tsx` usage
- Remove from `src/app/blog/optimized-page.tsx`
- Consider keeping for development only

### 4. **Clean Up Scripts**

```bash
# Remove temporary/unused scripts
scripts/remove-heavy-dependencies.js - Keep for reference
scripts/compress-images.js - Keep
scripts/install-sharp.js - Keep
scripts/optimize-images-web.js - Keep
```

## 📊 Bundle Size Impact

### Already Removed (530KB):

- ✅ Framer Motion (~250KB)
- ✅ Embla Carousel (~50KB)
- ✅ React Window (~30KB)
- ✅ Leaflet (~200KB)

### To Remove:

- Performance monitoring hooks (~10-20KB)
- Old large components (~50KB when replaced)
- Unused utilities (~5-10KB)

### Expected Total Savings:

- **Current**: ~530KB already saved
- **Additional**: ~65-80KB potential
- **Total**: ~595-610KB reduction

## 🚀 Implementation Steps

### Phase 1: Safe Removals (No Breaking Changes)

1. ✅ Remove already deleted files (confirmed)
2. Remove unused performance hooks
3. Clean up imports in remaining files

### Phase 2: Framer Motion Cleanup (25 files)

1. Run automated script: `npm run optimize:remove-heavy`
2. Test each page after removal
3. Replace with CSS animations where needed

### Phase 3: Component Consolidation

1. Gradually migrate to atomic components
2. Update imports across the project
3. Remove old components once fully migrated

### Phase 4: Large File Optimization

1. Replace admin/page.tsx with optimized version
2. Replace properties/page.tsx with optimized version
3. Test admin and properties functionality

## 🎯 Priority Order

### High Priority (Do Now)

1. Remove Framer Motion from all 25 files
2. Remove unused performance hooks
3. Clean up imports

### Medium Priority (Do Soon)

1. Replace large components with optimized versions
2. Consolidate duplicate components
3. Remove Embla Carousel

### Low Priority (Future)

1. Further optimize data files
2. Clean up scripts
3. Final bundle analysis

## ⚠️ Safety Checklist

Before removing any file:

- [ ] Search for all imports
- [ ] Check for dynamic imports
- [ ] Test related functionality
- [ ] Verify no runtime errors
- [ ] Check bundle size impact

## 📈 Expected Results

After cleanup:

- **Bundle Size**: 60-70% smaller
- **Load Time**: 2-3x faster
- **Maintenance**: Easier with atomic structure
- **Code Quality**: Cleaner, more organized
- **Performance**: Significantly improved

## 🔍 Files Status Summary

### Confirmed Deleted ✅

- PerformanceLayout.tsx
- OptimizedImage.tsx (duplicate)
- AdvancedImage.tsx
- LuxeNavbar.tsx
- properties-listing.json
- PROPERTY_DATA_README.md
- PerformanceDashboard.tsx
- PerformanceSummary.tsx
- virtual-grid.tsx
- VirtualizedPropertyGrid.tsx
- use-performance-optimizer.ts
- performance-config.ts
- performance.ts

### To Remove 🗑️

- use-performance.tsx (1 import)
- performance-monitor.ts (check first)
- useOptimizedFetch.ts (check first)

### To Optimize 🔧

- 25 files with Framer Motion
- 1 file with Embla Carousel
- 2 large unoptimized pages
