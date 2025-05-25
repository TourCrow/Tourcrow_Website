/**
 * Image helper functions for handling image URLs consistently across the app
 * Updated to use Supabase storage exclusively (no more Appwrite)
 */

import { supabase } from '@/utils/supabase/client';

// Supabase storage configuration
const SUPABASE_STORAGE_BUCKET = 'trip-images'; // Main bucket for trip images
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qcxhitelibenzdgbefkh.supabase.co';

/**
 * Clean image path by removing double slashes and handling URLs properly
 */
export function cleanImagePath(imagePath: string): string {
  if (!imagePath) return '';
  
  // Handle URLs that start with http/https - return as is after cleaning double slashes
  if (imagePath.startsWith('http')) {
    return imagePath.replace(/([^:]\/)\/+/g, '$1');
  }
  
  // For relative paths, normalize slashes
  return imagePath.replace(/\/+/g, '/').replace(/^\/+/, '');
}

/**
 * Get Supabase storage URL for an image
 */
export function getSupabaseImageUrl(imagePath: string): string {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Clean the path
  const cleanPath = cleanImagePath(imagePath);
  
  // Generate Supabase storage URL
  return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${cleanPath}`;
}

/**
 * Upload an image to Supabase storage
 */
export async function uploadImageToSupabase(file: File, fileName?: string): Promise<string | null> {
  try {
    const finalFileName = fileName || `${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(finalFileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    return getSupabaseImageUrl(data.path);
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

/**
 * Get the URL for a trip image, with fallback handling using Supabase storage
 */
export function getTripImageUrl(imageUrl: string | null | undefined, tripId?: number): string {
  // Default fallback images (these should be uploaded to your public folder or Supabase storage)
  const placeholders = ['/destination1.jpg', '/destination2.jpg', '/destination3.jpg'];
  
  // If no image URL, use a placeholder based on trip ID
  if (!imageUrl) {
    const index = Math.abs((tripId || 0) % placeholders.length);
    return placeholders[index];
  }

  // Clean the image URL
  const cleaned = cleanImagePath(imageUrl);

  // If it's already a full URL (including existing Supabase URLs), return it as is
  if (cleaned.startsWith('http')) {
    return cleaned;
  }

  // If it looks like an old Appwrite ID or file name, construct Supabase URL
  if (cleaned && !cleaned.startsWith('/')) {
    return getSupabaseImageUrl(cleaned);
  }

  // For relative paths that start with /, use as is (public folder)
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
}

/**
 * Gets a safe image URL for display in the frontend
 * Migrated from Appwrite to Supabase storage
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
    // If it's already a Supabase URL, ensure it's properly formatted
    if (cleanedUrl.includes('supabase.co')) {
      return cleanedUrl;
    }
    
    // If it's a relative URL in public folder, return as is
    if (cleanedUrl.startsWith('/')) {
      return cleanedUrl;
    }
    
    // If it's another absolute URL (http/https), return as is
    if (cleanedUrl.startsWith('http')) {
      return cleanedUrl;
    }
    
    // For old Appwrite IDs or file names, convert to Supabase URL
    return getSupabaseImageUrl(cleanedUrl);
  } catch (error) {
    console.error("Error processing image URL:", error);
    // Use fallback image with visual variety
    const placeholders = ['/destination1.jpg', '/destination2.jpg', '/destination3.jpg'];
    const index = fallbackId ? Math.abs(fallbackId % placeholders.length) : 0;
    return placeholders[index];
  }
}
