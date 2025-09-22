/**
 * Image Utilities for Dynamic Image Generation
 * Provides functions to get relevant images from various free sources
 */

// Local Image Management for Expat Stays Properties
// Uses actual property photos from /media folder

// HDR Property Images (30 high-quality images)
const hdrImages = [
  "DSC01806-HDR.jpg",
  "DSC01812-HDR.jpg",
  "DSC01817-HDR.jpg",
  "DSC01822-HDR.jpg",
  "DSC01840-HDR.jpg",
  "DSC01846-HDR.jpg",
  "DSC01856-HDR.jpg",
  "DSC01861-HDR.jpg",
  "DSC01866-HDR.jpg",
  "DSC01871-HDR.jpg",
  "DSC01884-HDR.jpg",
  "DSC01889-HDR.jpg",
  "DSC01897-HDR.jpg",
  "DSC01902-HDR.jpg",
  "DSC01904-HDR.jpg",
  "DSC01909-HDR.jpg",
  "DSC01914-HDR.jpg",
  "DSC01919-HDR.jpg",
  "DSC01929-HDR.jpg",
  "DSC01934-HDR.jpg",
  "DSC01939-HDR.jpg",
  "DSC01944-HDR.jpg",
  "DSC01949-HDR.jpg",
  "DSC01959-HDR.jpg",
  "DSC01970-HDR.jpg",
  "DSC01978-HDR.jpg",
  "DSC01987-HDR.jpg",
  "DSC01992-HDR.jpg",
  "DSC01997-HDR.jpg",
  "DSC02002-HDR.jpg",
];

// Close-up Detail Images (8 images)
const closeUpImages = [
  "DSC01827.jpg",
  "DSC01831.jpg",
  "DSC01832.jpg",
  "DSC01833.jpg",
  "DSC01835.jpg",
  "DSC01964.jpg",
  "DSC01965.jpg",
  "DSC01969.jpg",
];

// Farmhouse Images (8 images)
const farmhouseImages = [
  "DSC02226.jpg",
  "DSC02227.jpg",
  "DSC02228.jpg",
  "DSC02229.jpg",
  "DSC02231.jpg",
  "DSC02232.jpg",
  "DSC02235.jpg",
  "DSC02239 (1).jpg",
];

// Content type to image mapping
const contentImageMap = {
  // Property types - use HDR images
  villa: hdrImages.slice(0, 8),
  luxury: hdrImages.slice(8, 16),
  property: hdrImages.slice(16, 24),
  mansion: hdrImages.slice(24, 30),
  apartment: hdrImages.slice(0, 6),
  penthouse: hdrImages.slice(6, 12),
  // Farmhouse - use farmhouse images
  farmhouse: farmhouseImages,

  // Detail categories - use close-up images
  interior: closeUpImages.slice(0, 4),
  details: closeUpImages.slice(4, 8),
  amenities: closeUpImages,

  // Service types - use a mix
  concierge: [hdrImages[0], hdrImages[5], hdrImages[10]],
  laundry: [closeUpImages[0], closeUpImages[2], closeUpImages[4]],
  technical: [hdrImages[15], hdrImages[20], hdrImages[25]],
  chef: [closeUpImages[1], closeUpImages[3], closeUpImages[5]],
  transport: [hdrImages[8], hdrImages[18], hdrImages[28]],
  travel: [hdrImages[12], hdrImages[22], hdrImages[29]],

  // Experience types
  desert: [hdrImages[3], hdrImages[13], hdrImages[23]],
  yacht: [hdrImages[7], hdrImages[17], hdrImages[27]],
  dining: [closeUpImages[2], closeUpImages[6], hdrImages[11]],
  shopping: [hdrImages[9], hdrImages[19], closeUpImages[7]],
  heritage: [hdrImages[14], hdrImages[24], hdrImages[4]],
  spa: [closeUpImages[1], closeUpImages[5], hdrImages[16]],

  // Default fallbacks
  default: hdrImages.slice(0, 10),
  hero: [hdrImages[0], hdrImages[10], hdrImages[20]],
  featured: hdrImages.slice(0, 15),
};

/**
 * Get a local image path for specific content with optimization
 * @param content - Content type or description
 * @param index - Optional index for multiple images of same type
 * @param options - Image optimization options
 * @returns Local image path with optimization parameters
 */
export const getLocalImage = (
  content: string,
  index: number = 0,
  options: { width?: number; height?: number; quality?: number } = {}
): string => {
  const cleanContent = content.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");

  // Find matching content type
  let imageArray = contentImageMap.default;

  for (const [key, images] of Object.entries(contentImageMap)) {
    if (cleanContent.includes(key)) {
      imageArray = images;
      break;
    }
  }

  // Get image at index, with fallback
  const imageIndex = index % imageArray.length;
  const imageName = imageArray[imageIndex];

  // Determine folder based on image type
  const isHDR = imageName.includes("-HDR");
  const isFarmhouse = imageArray === farmhouseImages;
  let folder;

  if (isFarmhouse) {
    folder = "famhouse";
  } else if (isHDR) {
    folder = "DSC01806 HDR June 25 2025";
  } else {
    folder = "Close Ups June 25 2025";
  }

  let imagePath = `/media/${folder}/${imageName}`;

  // Add optimization parameters if provided
  if (options.width || options.height || options.quality) {
    const params = new URLSearchParams();
    if (options.width) params.append("w", options.width.toString());
    if (options.height) params.append("h", options.height.toString());
    if (options.quality) params.append("q", options.quality.toString());
    imagePath += `?${params.toString()}`;
  }

  return imagePath;
};

/**
 * Get multiple local images for a content type
 * @param content - Content type
 * @param count - Number of images to return
 * @returns Array of local image paths
 */
export const getLocalImages = (
  content: string,
  count: number = 3
): string[] => {
  const images: string[] = [];
  for (let i = 0; i < count; i++) {
    images.push(getLocalImage(content, i));
  }
  return images;
};

/**
 * Get a random local image
 * @param preferHDR - Prefer HDR images over close-ups
 * @returns Random local image path
 */
export const getRandomLocalImage = (preferHDR: boolean = true): string => {
  const sourceArray = preferHDR ? hdrImages : [...hdrImages, ...closeUpImages];
  const randomIndex = Math.floor(Math.random() * sourceArray.length);
  const imageName = sourceArray[randomIndex];

  const isHDR = imageName.includes("-HDR");
  const folder = isHDR ? "DSC01806 HDR June 25 2025" : "Close Ups June 25 2025";

  return `/media/${folder}/${imageName}`;
};

/**
 * Get property card image based on property details
 * @param propertyType - Type of property
 * @param propertyIndex - Index for variety
 * @returns Property image path
 */
export const getPropertyImage = (
  propertyType: string = "villa",
  propertyIndex: number = 0
): string => {
  return getLocalImage(propertyType, propertyIndex);
};

/**
 * Get hero/banner image
 * @param section - Section name for variety
 * @returns Hero image path
 */
export const getHeroImage = (section: string = "main"): string => {
  return getLocalImage("hero", section.length % 3);
};

const imageUtils = {
  getLocalImage,
  getLocalImages,
  getRandomLocalImage,
  getPropertyImage,
  getHeroImage,
};

export default imageUtils;
