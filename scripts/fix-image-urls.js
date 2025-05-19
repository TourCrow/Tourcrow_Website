/**
 * Fix Image URL References in TourCrow Database
 * 
 * This script helps fix issues with image URLs in the database by:
 * 1. Detecting problematic Appwrite IDs that don't work
 * 2. Loading problematic IDs from image-url-diagnostic.json
 * 3. Applying fixes to the database by either:
 *    - Adding placeholders for problematic images
 *    - Setting a consistent format for image IDs
 *
 * Updated: May 19, 2025 - Improved with diagnostic data integration
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { Client, Storage } = require('appwrite');

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qcxhitelibenzdgbefkh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjeGhpdGVsaWJlbnpkZ2JlZmtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2NjgyOTYsImV4cCI6MjAzMTI0NDI5Nn0.t_NWqcUNEQTKoYQACnCC-tpWq9uoavXEWZArvHHcFrs';

// Create Appwrite client
const appwriteEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const appwriteProject = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || '6829e6ff000346c36cca';
const appwriteBucket = process.env.NEXT_PUBLIC_APPWRITE_BUCKET || '6829e729001004328039';

const supabase = createClient(supabaseUrl, supabaseKey);

// Known problematic IDs (add any you discover to this list)
let problematicIds = ['682b38bc0018539b47d2'];

// Try to load problematic IDs from the diagnostic file
try {
  const diagnosticPath = path.join(__dirname, 'image-url-diagnostic.json');
  if (fs.existsSync(diagnosticPath)) {
    const diagnosticData = JSON.parse(fs.readFileSync(diagnosticPath, 'utf8'));
    if (diagnosticData.problematicIds && Array.isArray(diagnosticData.problematicIds)) {
      problematicIds = [...new Set([...problematicIds, ...diagnosticData.problematicIds])];
      console.log(`Loaded ${diagnosticData.problematicIds.length} problematic IDs from diagnostic data`);
    }
  }
} catch (error) {
  console.error('Error loading diagnostic data:', error);
}

// Configuration
const DRY_RUN = true; // Set to false to apply fixes
const PLACEHOLDER_IMAGE = '/destination1.jpg'; // Default placeholder
const PLACEHOLDER_MAPPING = {
  // Use consistent placeholders for specific trip types
  // tripId: placeholderImage
  1: '/destination1.jpg',
  2: '/destination2.jpg',
  3: '/destination3.jpg'
};

async function fixImageUrls() {
  console.log('🔧 TourCrow Image URL Fixer v2.0');
  console.log('-------------------------------');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes will be made)' : 'LIVE MODE (changes will be applied)'}`);
  console.log(`Found ${problematicIds.length} known problematic image IDs`);
  
  try {
    // 1. Get all trip_images
    console.log('\n📋 Fetching image records...');
    const { data: images, error: imagesError } = await supabase
      .from('trip_images')
      .select('id, trip_id, image_url, is_main');
    
    if (imagesError) {
      console.error('Error fetching images:', imagesError.message);
      return;
    }
    
    console.log(`Found ${images.length} image records`);

    // 2. Identify problematic images
    const problematicImages = [];
    const supabaseUrlImages = [];
    const appwriteIdImages = [];
    const otherImages = [];
    
    for (const image of images) {
      const url = image.image_url;
      
      if (!url) {
        problematicImages.push({ ...image, issue: 'empty_url' });
      } else if (url.startsWith('http') && url.includes('supabase.co')) {
        // Extract the actual filename from the Supabase URL for use with Appwrite
        const fileName = url.split('/').pop();
        if (fileName) {
          supabaseUrlImages.push({ 
            ...image, 
            originalUrl: url,
            fileName: fileName
          });
        } else {
          problematicImages.push({ ...image, issue: 'invalid_supabase_url' });
        }
      } else if (url.startsWith('http')) {
        otherImages.push({ ...image, issue: 'external_url' });
      } else {
        // This is likely an Appwrite ID, which is good
        appwriteIdImages.push(image);
      }
    }
    
    console.log('\n📊 Image URL Analysis:');
    console.log(`- Supabase URLs (need fixing): ${supabaseUrlImages.length}`);
    console.log(`- Proper Appwrite IDs: ${appwriteIdImages.length}`);
    console.log(`- Other external URLs: ${otherImages.length}`);
    console.log(`- Problematic images (empty/invalid): ${problematicImages.length}`);
    
    // 3. Fix Supabase URLs (either by updating them directly or converting to Appwrite IDs)
    if (supabaseUrlImages.length > 0) {
      console.log('\n🔧 Fixing Supabase URLs...');
      
      // Only show examples in dry run mode
      if (DRY_RUN) {
        console.log('\nExample conversions (first 5):');
        supabaseUrlImages.slice(0, 5).forEach(image => {
          console.log(`- ID: ${image.id}, Trip: ${image.trip_id}`);
          console.log(`  From: ${image.originalUrl}`);
          console.log(`  To: Keep as is, we now handle these URLs directly`);
          console.log('');
        });
        
        console.log('⚠️ This was a dry run. No changes were made.');
        console.log('To apply fixes, set DRY_RUN = false');
      } else {
        console.log('Keeping Supabase URLs as is since our getAppwriteImageUrl function now handles them correctly.');
        
        // If there are any other fixes needed, we would apply them here
      }
    }
    
    // 4. Fix empty or invalid URLs
    if (problematicImages.length > 0 && !DRY_RUN) {
      console.log('\n🔧 Fixing empty/invalid URLs...');
      
      for (const image of problematicImages) {
        // Assign a placeholder image
        const placeholderImage = `destination${(image.id % 3) + 1}.jpg`;
        
        const { error } = await supabase
          .from('trip_images')
          .update({ image_url: placeholderImage })
          .eq('id', image.id);
        
        if (error) {
          console.error(`Error fixing image ${image.id}:`, error.message);
        } else {
          console.log(`✅ Fixed image ${image.id} for trip ${image.trip_id}`);
        }
      }
    }
    
    console.log('\n✅ Image URL fixing process complete!');
    
  } catch (error) {
    console.error('Error fixing image URLs:', error);
  }
}

// Run the fixer
fixImageUrls();
