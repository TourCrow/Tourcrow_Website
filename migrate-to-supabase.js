/**
 * Migration script to convert Appwrite image IDs to Supabase storage or placeholders
 * Run this to migrate all existing image references from Appwrite to Supabase
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://qcxhitelibenzdgbefkh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjeGhpdGVsaWJlbnpkZ2JlZmtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2NjgyOTYsImV4cCI6MjAzMTI0NDI5Nn0.t_NWqcUNEQTKoYQACnCC-tpWq9uoavXEWZArvHHcFrs';

const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration
const DRY_RUN = true; // Set to false to apply changes
const SUPABASE_STORAGE_BUCKET = 'trip-images';
const SUPABASE_URL = 'https://qcxhitelibenzdgbefkh.supabase.co';

// Known problematic Appwrite IDs that return 404s
const PROBLEMATIC_APPWRITE_IDS = [
  '1748173319809-images.jpeg',
  // Add more as you discover them
];

// Placeholder mapping for consistent fallbacks
const PLACEHOLDER_MAPPING = {
  1: '/destination1.jpg',
  2: '/destination2.jpg',
  3: '/destination3.jpg',
  // Add more specific mappings as needed
};

const DEFAULT_PLACEHOLDER = '/destination1.jpg';

function getPlaceholderForTrip(tripId) {
  if (PLACEHOLDER_MAPPING[tripId]) {
    return PLACEHOLDER_MAPPING[tripId];
  }
  
  // Use modulo to distribute placeholders evenly
  const placeholders = ['/destination1.jpg', '/destination2.jpg', '/destination3.jpg'];
  return placeholders[Math.abs(tripId % placeholders.length)];
}

function isAppwriteId(url) {
  if (!url || typeof url !== 'string') return false;
  
  // Check if it's a full URL
  if (url.startsWith('http')) return false;
  
  // Check if it's a relative path
  if (url.startsWith('/')) return false;
  
  // Check if it contains supabase
  if (url.includes('supabase')) return false;
  
  // If it's just a string without slashes or protocols, likely an Appwrite ID
  return !url.includes('/') || url.match(/^[a-zA-Z0-9\-_.]+$/);
}

function convertAppwriteToSupabase(appwriteId, tripId) {
  // Check if this is a known problematic ID
  if (PROBLEMATIC_APPWRITE_IDS.includes(appwriteId)) {
    return getPlaceholderForTrip(tripId);
  }
  
  // For now, we'll convert all Appwrite IDs to placeholders
  // Later, you can upload images to Supabase and update these
  return getPlaceholderForTrip(tripId);
  
  // Uncomment this when you have images uploaded to Supabase:
  // return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${appwriteId}`;
}

async function migrateImageUrls() {
  console.log('🚀 Starting Appwrite to Supabase migration...');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes will be made)' : 'LIVE (changes will be applied)'}`);
  
  try {
    // 1. Get all trip_images
    console.log('\n📋 Fetching all trip images...');
    const { data: images, error: imagesError } = await supabase
      .from('trip_images')
      .select('id, trip_id, image_url, is_main, is_banner');
    
    if (imagesError) {
      console.error('❌ Error fetching images:', imagesError);
      return;
    }
    
    console.log(`✅ Found ${images.length} images to analyze`);
    
    // 2. Identify images that need migration
    const imagesToMigrate = [];
    const supabaseImages = [];
    const publicImages = [];
    
    for (const image of images) {
      const url = image.image_url;
      
      if (!url) {
        // Add placeholder for missing images
        imagesToMigrate.push({
          ...image,
          currentUrl: null,
          newUrl: getPlaceholderForTrip(image.trip_id),
          reason: 'MISSING_URL'
        });
      } else if (isAppwriteId(url)) {
        // Convert Appwrite ID
        imagesToMigrate.push({
          ...image,
          currentUrl: url,
          newUrl: convertAppwriteToSupabase(url, image.trip_id),
          reason: 'APPWRITE_ID'
        });
      } else if (url.includes('supabase.co')) {
        supabaseImages.push(image);
      } else if (url.startsWith('/')) {
        publicImages.push(image);
      } else {
        // Unknown format, convert to placeholder
        imagesToMigrate.push({
          ...image,
          currentUrl: url,
          newUrl: getPlaceholderForTrip(image.trip_id),
          reason: 'UNKNOWN_FORMAT'
        });
      }
    }
    
    console.log(`\n📊 Analysis Results:`);
    console.log(`  - Images to migrate: ${imagesToMigrate.length}`);
    console.log(`  - Already Supabase URLs: ${supabaseImages.length}`);
    console.log(`  - Public folder images: ${publicImages.length}`);
    
    // 3. Show details of what will be migrated
    if (imagesToMigrate.length > 0) {
      console.log(`\n🔄 Images that will be migrated:`);
      imagesToMigrate.forEach(img => {
        console.log(`  - Image ${img.id} (Trip ${img.trip_id}): ${img.reason}`);
        console.log(`    From: ${img.currentUrl || '(null)'}`);
        console.log(`    To: ${img.newUrl}`);
        console.log('');
      });
    }
    
    // 4. Apply migrations if not in dry run mode
    if (!DRY_RUN && imagesToMigrate.length > 0) {
      console.log('\n🔧 Applying migrations...');
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const img of imagesToMigrate) {
        try {
          const { error } = await supabase
            .from('trip_images')
            .update({ image_url: img.newUrl })
            .eq('id', img.id);
          
          if (error) {
            console.error(`❌ Error updating image ${img.id}:`, error);
            errorCount++;
          } else {
            console.log(`✅ Updated image ${img.id}`);
            successCount++;
          }
        } catch (error) {
          console.error(`❌ Error updating image ${img.id}:`, error);
          errorCount++;
        }
      }
      
      console.log(`\n📊 Migration Results:`);
      console.log(`  - Successfully updated: ${successCount}`);
      console.log(`  - Errors: ${errorCount}`);
    }
    
    // 5. Next steps instructions
    console.log(`\n📝 Next Steps:`);
    console.log(`1. Create a Supabase storage bucket named '${SUPABASE_STORAGE_BUCKET}'`);
    console.log(`2. Upload your trip images to the bucket`);
    console.log(`3. Update the database with the actual image filenames`);
    console.log(`4. Remove Appwrite dependencies from your project`);
    
    if (DRY_RUN) {
      console.log(`\n⚠️ This was a DRY RUN. No changes were made.`);
      console.log(`Set DRY_RUN = false to apply the migration.`);
    }
    
  } catch (error) {
    console.error('❌ Migration error:', error);
  }
}

// Run the migration
migrateImageUrls();
