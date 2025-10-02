# Image Compression Guide

## Overview

This guide explains how to compress and optimize images in your Expatstays project to improve performance and reduce page load times.

## Current Image Issues

- **Large file sizes**: Images are 1-5MB each
- **Total media size**: 50-100MB across all images
- **Performance impact**: Slow page loads, high bandwidth usage
- **Target**: Reduce to <128KB per page

## Compression Solutions

### 1. Automated Compression Script

Use the provided compression script to automatically optimize all images:

```bash
# Install Sharp (image processing library)
npm install sharp

# Run compression script
npm run compress-images
```

**What it does:**

- Converts images to WebP format (better compression)
- Resizes images to optimal dimensions (max 1920x1080)
- Reduces quality to 75% (good balance of size vs quality)
- Creates both WebP and JPEG versions
- Generates compression report

### 2. Manual Compression Tools

#### Online Tools (Free)

- **TinyPNG/TinyJPG**: https://tinypng.com/
- **Squoosh**: https://squoosh.app/ (Google's tool)
- **Compressor.io**: https://compressor.io/

#### Desktop Software

- **ImageOptim** (Mac): https://imageoptim.com/
- **RIOT** (Windows): http://luci.criosweb.ro/riot/
- **GIMP** (Free): https://www.gimp.org/

### 3. Web-based Compression

Use the provided web script for browser-based compression:

```html
<script src="scripts/optimize-images-web.js"></script>
<script>
  // The script automatically sets up a file input and button
  // Users can select images and download optimized versions
</script>
```

## Compression Settings

### Recommended Settings

| Format | Quality | Max Width | Max Height | Use Case       |
| ------ | ------- | --------- | ---------- | -------------- |
| WebP   | 80%     | 1920px    | 1080px     | Primary format |
| JPEG   | 75%     | 1920px    | 1080px     | Fallback       |
| PNG    | 85%     | 1920px    | 1080px     | Transparency   |

### Image Dimensions by Use Case

| Use Case       | Width  | Height | Quality |
| -------------- | ------ | ------ | ------- |
| Hero images    | 1920px | 1080px | 80%     |
| Property cards | 800px  | 600px  | 75%     |
| Thumbnails     | 400px  | 300px  | 70%     |
| Icons          | 64px   | 64px   | 90%     |

## Implementation Steps

### Step 1: Install Dependencies

```bash
npm install sharp
```

### Step 2: Run Compression

```bash
npm run compress-images
```

### Step 3: Update Image References

Replace image paths in your code:

```typescript
// Before
<Image src="/media/DSC01806-HDR.jpg" alt="Property" />

// After
<Image src="/media-optimized/DSC01806-HDR.webp" alt="Property" />
```

### Step 4: Update Next.js Config

Ensure your `next.config.ts` supports WebP:

```typescript
images: {
  formats: ['image/webp', 'image/jpeg'],
  quality: 75,
  // ... other settings
}
```

## Expected Results

### Before Compression

- **Total size**: 50-100MB
- **Average image**: 2-5MB
- **Page load time**: 5-10 seconds
- **Bandwidth usage**: High

### After Compression

- **Total size**: 5-15MB (70-85% reduction)
- **Average image**: 100-500KB
- **Page load time**: 1-3 seconds
- **Bandwidth usage**: Low

## Best Practices

### 1. Image Selection

- Use WebP as primary format
- Provide JPEG fallback for older browsers
- Use PNG only for images with transparency

### 2. Responsive Images

```typescript
<Image
  src="/media-optimized/image.webp"
  alt="Description"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  width={800}
  height={600}
  quality={75}
/>
```

### 3. Lazy Loading

```typescript
<Image
  src="/media-optimized/image.webp"
  alt="Description"
  loading="lazy"
  placeholder="blur"
/>
```

### 4. Critical Images

```typescript
<Image src="/media-optimized/hero.webp" alt="Hero" priority quality={80} />
```

## Monitoring Performance

### Tools to Use

- **Lighthouse**: Built into Chrome DevTools
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **WebPageTest**: https://www.webpagetest.org/

### Key Metrics

- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Contentful Paint (FCP)**: < 1.8s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Total Blocking Time (TBT)**: < 200ms

## Troubleshooting

### Common Issues

1. **Sharp installation fails**

   ```bash
   # Try alternative installation
   npm install --platform=linux --arch=x64 sharp
   ```

2. **WebP not supported**

   - Provide JPEG fallback
   - Check browser compatibility

3. **Images still large**
   - Reduce quality further (60-70%)
   - Resize dimensions smaller
   - Use more aggressive compression

### Performance Tips

1. **Preload critical images**

   ```html
   <link rel="preload" href="/media-optimized/hero.webp" as="image" />
   ```

2. **Use appropriate formats**

   - WebP for photos
   - PNG for graphics with transparency
   - SVG for icons and logos

3. **Optimize delivery**
   - Use CDN for image delivery
   - Enable HTTP/2
   - Set proper cache headers

## Scripts Available

- `npm run compress-images`: Compress all images
- `npm run install-sharp`: Install Sharp dependency
- `scripts/optimize-images-web.js`: Browser-based compression

## Support

If you encounter issues:

1. Check the compression report in `public/media-optimized/compression-report.json`
2. Verify Sharp installation: `node -e "console.log(require('sharp'))"`
3. Check file permissions and disk space
4. Review error logs in the console

## Next Steps

1. Run the compression script
2. Test the optimized images
3. Monitor performance improvements
4. Update image references in code
5. Deploy and measure results
