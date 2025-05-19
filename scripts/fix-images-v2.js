/**
 * Fix Image URL References in TourCrow Database - NEW IMPLEMENTATION
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
      console.error('❌ Error fetching images:', imagesError);
      return;
    }
    
    console.log(`✅ Found ${images.length} image records`);
    
    // 2. Identify issues
    const imagesToFix = [];
    
    for (const image of images) {
      const url = image.image_url;
      const imageId = image.id;
      const tripId = image.trip_id;
      
      // Handle missing URLs
      if (!url) {
        console.log(`⚠️ Image ID ${imageId} has no URL - will add placeholder`);
        const placeholder = PLACEHOLDER_MAPPING[tripId] || PLACEHOLDER_IMAGE;
        imagesToFix.push({
          id: imageId,
          trip_id: tripId,
          currentUrl: null,
          newUrl: placeholder,
          reason: 'MISSING_URL'
        });
        continue;
      }
      
      // Handle problematic image IDs
      if (problematicIds.includes(url)) {
        console.log(`⚠️ Image ID ${imageId} uses known problematic Appwrite ID: ${url}`);
        const placeholder = PLACEHOLDER_MAPPING[tripId] || PLACEHOLDER_IMAGE;
        imagesToFix.push({
          id: imageId,
          trip_id: tripId,
          currentUrl: url,
          newUrl: placeholder,
          reason: 'PROBLEMATIC_APPWRITE_ID'
        });
        continue;
      }
      
      // Handle full URLs incorrectly stored
      if (url.includes('supabase.co/storage/v1/object') || url.includes('appwrite.io')) {
        // This appears to be a full URL, not an ID
        console.log(`⚠️ Image ID ${imageId} has a full URL instead of an ID: ${url}`);
        
        // Try to extract just the ID from the URL
        let newUrl = url;
        
        // Extract Appwrite ID from URL if possible
        if (url.includes('appwrite.io')) {
          const match = url.match(/files\/([^/]+)\/([^/]+)/);
          if (match && match[2]) {
            newUrl = match[2];
            console.log(`  Extracted Appwrite ID: ${newUrl}`);
          }
        }
        
        imagesToFix.push({
          id: imageId,
          trip_id: tripId,
          currentUrl: url,
          newUrl: newUrl, 
          reason: 'FULL_URL_AS_ID'
        });
      }
    }
    
    console.log(`\n📊 Found ${imagesToFix.length} images to fix`);
    
    // 3. Apply fixes
    if (imagesToFix.length > 0) {
      console.log('\n📝 Fix details:');
      
      for (const fix of imagesToFix) {
        console.log(`- Image ${fix.id} (Trip: ${fix.trip_id}): ${fix.reason}`);
        console.log(`  Current: ${fix.currentUrl || '(none)'}`);
        console.log(`  New: ${fix.newUrl}`);
        
        if (!DRY_RUN) {
          try {
            // Apply the fix
            const { error } = await supabase
              .from('trip_images')
              .update({ image_url: fix.newUrl })
              .eq('id', fix.id);
            
            if (error) {
              console.error(`  ❌ Error fixing image ${fix.id}:`, error);
            } else {
              console.log(`  ✅ Fixed!`);
            }
          } catch (err) {
            console.error(`  ❌ Unexpected error fixing image ${fix.id}:`, err);
          }
        }
      }
      
      // Save a record of the fixes
      const fixesReport = {
        timestamp: new Date().toISOString(),
        dryRun: DRY_RUN,
        fixesCount: imagesToFix.length,
        fixes: imagesToFix
      };
      
      fs.writeFileSync(
        path.join(__dirname, 'image-fixes-report.json'),
        JSON.stringify(fixesReport, null, 2)
      );
      
      if (DRY_RUN) {
        console.log('\n⚠️ DRY RUN: No changes were made.');
        console.log('Set DRY_RUN = false in the script to apply fixes.');
        console.log('Review image-fixes-report.json before making changes.');
      } else {
        console.log('\n✅ All fixes applied! Report saved to image-fixes-report.json');
      }
    } else {
      console.log('\n✅ No issues found that need fixing!');
    }
  } catch (error) {
    console.error('\n❌ Error in image fixing process:', error);
  } finally {
    console.log('\nProcess complete.');
  }
}

// Run the fixer
fixImageUrls();
