/**
 * Check specific image "1748173319809-images.jpeg" in the database
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://qcxhitelibenzdgbefkh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjeGhpdGVsaWJlbnpkZ2JlZmtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2NjgyOTYsImV4cCI6MjAzMTI0NDI5Nn0.t_NWqcUNEQTKoYQACnCC-tpWq9uoavXEWZArvHHcFrs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSpecificImage() {
  console.log('🔍 Checking for image "1748173319809-images.jpeg"...');
  
  try {
    // Check if this image exists in trip_images table
    const { data: imageData, error: imageError } = await supabase
      .from('trip_images')
      .select('*')
      .ilike('image_url', '%1748173319809%');
    
    if (imageError) {
      console.error('❌ Error searching for image:', imageError);
      return;
    }
    
    if (!imageData || imageData.length === 0) {
      console.log('❌ No images found with "1748173319809" in the URL');
      
      // Check for similar patterns
      console.log('\n🔍 Searching for similar image URLs...');
      const { data: similarImages, error: similarError } = await supabase
        .from('trip_images')
        .select('*')
        .ilike('image_url', '%images.jpeg%');
        
      if (similarError) {
        console.error('❌ Error searching for similar images:', similarError);
      } else if (similarImages && similarImages.length > 0) {
        console.log(`✅ Found ${similarImages.length} images with "images.jpeg" in the URL:`);
        similarImages.forEach(img => {
          console.log(`  - ID: ${img.id}, Trip ID: ${img.trip_id}, URL: ${img.image_url}`);
        });
      } else {
        console.log('❌ No similar images found');
      }
    } else {
      console.log(`✅ Found ${imageData.length} matching image(s):`);
      imageData.forEach(img => {
        console.log(`  - ID: ${img.id}, Trip ID: ${img.trip_id}, URL: ${img.image_url}, Main: ${img.is_main}`);
      });
      
      // Check what trip this belongs to
      for (const img of imageData) {
        console.log(`\n🔍 Checking trip details for trip ID ${img.trip_id}...`);
        
        const { data: tripData, error: tripError } = await supabase
          .from('trips')
          .select('*')
          .eq('id', img.trip_id)
          .single();
          
        if (tripError) {
          console.error(`❌ Error fetching trip ${img.trip_id}:`, tripError);
        } else if (tripData) {
          console.log(`✅ Trip ${img.trip_id}: ${tripData.title || 'No title'}`);
        }
        
        // Check if there's a trip_influencer for this trip
        const { data: influencerData, error: influencerError } = await supabase
          .from('trip_influencers')
          .select('*')
          .eq('trip_id', img.trip_id);
          
        if (influencerError) {
          console.error(`❌ Error fetching influencers for trip ${img.trip_id}:`, influencerError);
        } else if (influencerData && influencerData.length > 0) {
          console.log(`✅ Found ${influencerData.length} influencer(s) for trip ${img.trip_id}`);
          influencerData.forEach(inf => {
            console.log(`  - Influencer: ${inf.influcencer_name}, Price: ${inf.price}`);
          });
        } else {
          console.log(`❌ No influencers found for trip ${img.trip_id}`);
        }
      }
    }
    
    // Also check for any 404 patterns in the logs or console
    console.log('\n🔍 Checking for any image URL patterns that might cause 404s...');
    
    // Get a sample of all images to check URL patterns
    const { data: allImages, error: allImagesError } = await supabase
      .from('trip_images')
      .select('id, trip_id, image_url')
      .limit(10);
      
    if (allImagesError) {
      console.error('❌ Error fetching sample images:', allImagesError);
    } else if (allImages) {
      console.log('📊 Sample image URL patterns:');
      allImages.forEach(img => {
        console.log(`  - ID: ${img.id}, Trip: ${img.trip_id}, URL: ${img.image_url}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the check
checkSpecificImage();
