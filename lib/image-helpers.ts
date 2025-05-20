/**
 * Image handling utilities for consistent image path management
 */

/**
 * Cleans an image path by normalizing slashes and handling URLs properly
 */
function cleanImagePath(path: string): string {
  if (!path) {
    return '';
  }
  
  // If it's already a full URL, only fix double slashes after the domain
  if (path.startsWith('http')) {
    const [protocol, ...rest] = path.split('://');
    const domain = rest.join('://');
    // Fix double slashes but preserve // after protocol
    return `${protocol}://${domain.replace(/([^:])\/+/g, '$1/')}`;
  }

  // For relative paths, remove leading slashes and normalize consecutive slashes
  return path.replace(/^\/+/, '').replace(/\/+/g, '/');
}

/**
 * Get the URL for a trip image, with fallback handling
 */
export function getTripImageUrl(imageUrl: string | null | undefined, tripId?: number): string {
  // Default fallback images
  const placeholders = ['/destination1.jpg', '/destination2.jpg', '/destination3.jpg'];
  
  // If no image URL, use a placeholder based on trip ID
  if (!imageUrl) {
    const index = Math.abs((tripId || 0) % placeholders.length);
    return placeholders[index];
  }

  // Clean the image URL
  const cleaned = cleanImagePath(imageUrl);

  // If it's already a full URL, return it as is after cleaning
  if (cleaned.startsWith('http')) {
    return cleaned;
  }

  // If it's a Supabase URL, return it as is after cleaning
  if (cleaned.includes('supabase.co')) {
    return cleaned;
  }

  // For other cases, treat it as a relative path
  return `/${cleaned}`;
}

/**
 * Gets a safe image URL for display in the frontend
 * Handles both Supabase and Appwrite images, with fallbacks
 */
export function getSafeImageUrl(url?: string | null, fallbackId?: number): string {
  if (!url) {
    // Use a fallback image with visual variety based on the provided ID
    const placeholders = ['/destination1.jpg', '/destination2.jpg', '/destination3.jpg'];
    const index = fallbackId ? Math.abs(fallbackId % placeholders.length) : 0;
    return placeholders[index];
  }

  // Clean the path to prevent double-slash issues
  const cleanedUrl = cleanImagePath(url);
  
  try {
    // If it's a Supabase URL, ensure it's properly formatted
    if (cleanedUrl.includes('supabase.co')) {
      if (!cleanedUrl.includes('storage/v1/object/public/')) {
        if (cleanedUrl.includes('/')) {
          const parts = cleanedUrl.split('/');
          const bucket = parts[0];
          const filename = parts.slice(1).join('/');
          return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${filename}`;
        }
      }
      return cleanedUrl;
    }
    
    // If it's a relative URL, return as is
    if (cleanedUrl.startsWith('/')) {
      return cleanedUrl;
    }
    
    // If it's another absolute URL (http/https), return as is
    if (cleanedUrl.startsWith('http')) {
      return cleanedUrl;
    }
    
    // Otherwise, let the appwrite getFilePreview handle it
    return cleanedUrl;
  } catch (error) {
    console.error("Error processing image URL:", error);
    // Use fallback image with visual variety
    const placeholders = ['/destination1.jpg', '/destination2.jpg', '/destination3.jpg'];
    const index = fallbackId ? Math.abs(fallbackId % placeholders.length) : 0;
    return placeholders[index];
  }
}
