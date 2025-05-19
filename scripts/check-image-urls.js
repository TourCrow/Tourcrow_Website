/**
 * Script to check image URLs in the database and detect any formatting issues
 * 
 * Updated: May 19, 2025 - Added Appwrite compatibility checking
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const axios = require('axios');
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

// Initialize Appwrite
const client = new Client();
client.setEndpoint(appwriteEndpoint).setProject(appwriteProject);
const appwriteStorage = new Storage(client);

// Helper function to get Appwrite image URL (matching the one in lib/appwrite.ts)
function getAppwriteImageUrl(imageId) {
  // Handle missing or empty values
  if (!imageId || imageId.trim() === '') {
    return null;
  }
  
  // If it's already a Supabase URL
  if (typeof imageId === 'string' && imageId.includes('supabase.co')) {
    return imageId;
  }
  
  // If it's another URL
  if (typeof imageId === 'string' && imageId.startsWith('http')) {
    return imageId;
  }
  
  try {
    // Define known problematic image IDs
    const problematicImageIds = ['682b38bc0018539b47d2'];
    if (problematicImageIds.includes(imageId)) {
      return null; // This would fall back to placeholder in the real app
    }
    
    // Generate a preview URL with cache busting
    const cacheBuster = new Date().getTime();
    const width = 800;
    const height = 600;
    
    const previewUrl = appwriteStorage
      .getFilePreview(
        appwriteBucket, 
        imageId, 
        width,
        height,
        'center',
        90,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        `v=${cacheBuster}`
      )
      .toString();
    
    return previewUrl;
  } catch (error) {
    console.error(`Error generating URL for image ID ${imageId}:`, error);
    return null;
  }
}

// Test if an image URL is accessible
async function testImageUrl(url) {
  if (!url) return { accessible: false, status: 'INVALID_URL' };
  
  try {
    const response = await axios.head(url, { timeout: 5000 });
    return {
      accessible: response.status >= 200 && response.status < 300,
      status: response.status
    };
  } catch (error) {
    return {
      accessible: false,
      status: error.response?.status || 'ERROR',
      error: error.message
    };
  }
}

async function checkImageUrls() {
  console.log('🔍 TourCrow Image URL Checker v2.0');
  console.log('--------------------------------');

  try {
    // Get all trip_images
    console.log('\n📋 Fetching image records...');
    const { data: images, error: imagesError } = await supabase
      .from('trip_images')
      .select('id, trip_id, image_url, is_main');
    
    if (imagesError) {
      console.error('❌ Error fetching images:', imagesError.message);
      return;
    }
    
    console.log(`✅ Found ${images.length} image records`);
    
    // Analyze image URLs
    const urlTypes = {
      appwriteIds: [],
      supabaseUrls: [],
      otherUrls: [],
      emptyUrls: []
    };

    for (const image of images) {
      const url = image.image_url;
      
      if (!url) {
        urlTypes.emptyUrls.push(image);
      } else if (url.startsWith('http')) {
        if (url.includes('supabase.co')) {
          urlTypes.supabaseUrls.push(image);
        } else {
          urlTypes.otherUrls.push(image);
        }
      } else {
        // Assuming non-URL strings are Appwrite IDs
        urlTypes.appwriteIds.push(image);
      }
    }
      // Print summary
    console.log('\n📊 Image URL Summary:');
    console.log(`- Appwrite IDs: ${urlTypes.appwriteIds.length}`);
    console.log(`- Supabase URLs: ${urlTypes.supabaseUrls.length}`);
    console.log(`- Other URLs: ${urlTypes.otherUrls.length}`);
    console.log(`- Empty URLs: ${urlTypes.emptyUrls.length}`);
    
    // Show examples of each type
    if (urlTypes.appwriteIds.length > 0) {
      console.log('\n🔹 Example Appwrite IDs:');
      urlTypes.appwriteIds.slice(0, 3).forEach(img => {
        console.log(`  - ${img.image_url} (Trip ID: ${img.trip_id})`);
      });
    }
    
    // Check accessibility of a sample of Appwrite image URLs
    if (urlTypes.appwriteIds.length > 0) {
      console.log('\n🔍 Testing Appwrite image URLs...');
      
      // Limit to 10 images for testing
      const samplesToCheck = Math.min(10, urlTypes.appwriteIds.length);
      const sampleImages = urlTypes.appwriteIds.slice(0, samplesToCheck);
      
      const results = [];
      let accessibleCount = 0;
      let problematicIds = [];
      
      for (const image of sampleImages) {
        const imageId = image.image_url;
        console.log(`  Testing image ID: ${imageId}`);
        
        // Generate Appwrite URL
        const url = getAppwriteImageUrl(imageId);
        
        if (!url) {
          console.warn(`  ⚠️ Could not generate URL for image ID: ${imageId}`);
          problematicIds.push(imageId);
          continue;
        }
        
        // Test URL accessibility
        const test = await testImageUrl(url);
        results.push({
          imageId,
          tripId: image.trip_id,
          url,
          ...test
        });
        
        if (test.accessible) {
          accessibleCount++;
          console.log(`  ✅ Image accessible (Status: ${test.status})`);
        } else {
          console.error(`  ❌ Image not accessible: ${test.error || test.status}`);
          problematicIds.push(imageId);
        }
      }
      
      // Summary of results
      console.log(`\n📊 Results: ${accessibleCount}/${samplesToCheck} images accessible`);
      
      if (problematicIds.length > 0) {
        console.log('\n⚠️ Problematic image IDs:');
        console.log(`const problematicImageIds = ['${problematicIds.join("', '")}'];`);
        console.log('Add these to the problematicImageIds array in lib/appwrite.ts');
      }
      
      // Save results
      const diagnosticData = {
        timestamp: new Date().toISOString(),
        appwrite: {
          endpoint: appwriteEndpoint,
          project: appwriteProject,
          bucket: appwriteBucket
        },
        results,
        problematicIds
      };
      
      fs.writeFileSync(
        path.join(__dirname, 'image-url-diagnostic.json'),
        JSON.stringify(diagnosticData, null, 2)
      );
      
      console.log('\n✅ Diagnostic data saved to image-url-diagnostic.json');
    }
    
    if (urlTypes.supabaseUrls.length > 0) {
      console.log('\n🔹 Example Supabase URLs:');
      urlTypes.supabaseUrls.slice(0, 3).forEach(img => {
        console.log(`  - ${img.image_url} (Trip ID: ${img.trip_id})`);
      });
    }
    
    if (urlTypes.otherUrls.length > 0) {
      console.log('\n🔹 Example Other URLs:');
      urlTypes.otherUrls.slice(0, 3).forEach(img => {
        console.log(`  - ${img.image_url} (Trip ID: ${img.trip_id})`);
      });
    }
    
    console.log('\n✅ Image URL check completed!');
    
  } catch (error) {
    console.error('Error checking image URLs:', error);
  }
}

// Run the checker
checkImageUrls();
