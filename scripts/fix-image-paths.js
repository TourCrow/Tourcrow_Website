/**
 * This script will scan the Supabase database for image URLs with double slashes
 * and fix them by replacing consecutive slashes with a single slash.
 */

import { supabase } from "../utils/supabase/client";

function cleanImagePath(path) {
  if (!path) return "";
  
  // Handle full URLs separately to preserve http:// and https://
  if (path.startsWith('http')) {
    // For URLs, only fix double slashes after the domain part
    const urlParts = path.split('://');
    if (urlParts.length >= 2) {
      const protocol = urlParts[0]; // http or https
      const rest = urlParts.slice(1).join('://');
      // Replace multiple slashes with single slash, but preserve // after protocol
      const cleanedRest = rest.replace(/([^:])\/+/g, '$1/');
      return `${protocol}://${cleanedRest}`;
    }
    return path;
  }

  // For relative paths or storage paths:
  // 1. Remove any leading slashes
  let cleaned = path.replace(/^\/+/, '');
  // 2. Replace any consecutive slashes with a single slash
  cleaned = cleaned.replace(/\/+/g, '/');
  return cleaned;
}

async function fixImagePaths() {
  console.log("Starting image path cleanup...");
  
  // 1. Fix trip_images table
  const { data: tripImages, error: tripImagesError } = await supabase
    .from("trip_images")
    .select("id, image_url");
  
  if (tripImagesError) {
    console.error("Error fetching trip_images:", tripImagesError);
    return;
  }
  
  console.log(`Found ${tripImages.length} images to check in trip_images table`);
  
  let fixedCount = 0;
  for (const image of tripImages) {
    if (!image.image_url) continue;
    
    // Check if the URL contains consecutive slashes
    if (image.image_url.includes('//')) {
      const cleanedPath = cleanImagePath(image.image_url);
      
      // Only update if there's a change
      if (cleanedPath !== image.image_url) {
        console.log(`Fixing image URL: ${image.image_url} -> ${cleanedPath}`);
        
        const { error: updateError } = await supabase
          .from("trip_images")
          .update({ image_url: cleanedPath })
          .eq("id", image.id);
        
        if (updateError) {
          console.error(`Error updating image ${image.id}:`, updateError);
        } else {
          fixedCount++;
        }
      }
    }
  }
  
  console.log(`Fixed ${fixedCount} images in trip_images table`);
  
  // You can add more tables that contain image URLs here if needed
  
  console.log("Image path cleanup completed");
}

// Run the fix function
fixImagePaths().catch(error => {
  console.error("Error in fix script:", error);
});
