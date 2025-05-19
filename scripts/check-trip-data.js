// Check if trips are being properly loaded from the database
console.log('Starting trip data diagnostic script...');

(async () => {
  try {
    // Import required modules
    const fs = require('fs');
    const path = require('path');
    const dotenv = require('dotenv');

    // Load environment variables from .env.local
    dotenv.config({ path: '.env.local' });

    console.log('🔍 Testing Supabase connection...');
    
    // Create Supabase client
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Supabase environment variables not found!');
      console.log('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Check connection by fetching trip_influencers
    console.log('📊 Fetching trip_influencers...');
    const { data: tripInfluencers, error: tripInfluencersError } = await supabase
      .from('trip_influencers')
      .select('*')
      .limit(5);
      
    if (tripInfluencersError) {
      console.error('❌ Error fetching trip_influencers:', tripInfluencersError);
      return;
    }
    
    console.log(`✅ Successfully fetched ${tripInfluencers.length} trip_influencers`);
    
    // Check if there are any trip_influencers
    if (tripInfluencers.length === 0) {
      console.warn('⚠️ No trip_influencers found in the database!');
      console.log('This explains why "No trips found" is showing on the frontend.');
      return;
    }
    
    // Get trip IDs from trip_influencers
    const tripIds = tripInfluencers.map(item => item.trip_id).filter(Boolean);
    console.log(`📋 Trip IDs found: ${tripIds.join(', ')}`);
    
    if (tripIds.length === 0) {
      console.warn('⚠️ No valid trip_ids found in trip_influencers!');
      return;
    }
    
    // Check for trip images
    console.log('🖼️ Checking for trip images...');
    const { data: imageData, error: imageError } = await supabase
      .from('trip_images')
      .select('*')
      .in('trip_id', tripIds);
      
    if (imageError) {
      console.error('❌ Error fetching trip images:', imageError);
    } else {
      console.log(`✅ Found ${imageData?.length || 0} images for trips`);
      
      // Check if there are images for each trip
      for (const tripId of tripIds) {
        const tripImages = imageData?.filter(img => img.trip_id === tripId) || [];
        console.log(`🔹 Trip ID ${tripId}: ${tripImages.length} images`);
        
        if (tripImages.length === 0) {
          console.warn(`⚠️ No images found for trip ID ${tripId}!`);
        } else {
          // Check if main image exists
          const mainImage = tripImages.find(img => img.is_main === true);
          if (!mainImage) {
            console.warn(`⚠️ No main image set for trip ID ${tripId}!`);
          } else {
            console.log(`✅ Main image found for trip ID ${tripId}: ${mainImage.image_url}`);
          }
        }
      }
    }
    
    // Save diagnostic data to a file
    const diagnosticData = {
      timestamp: new Date().toISOString(),
      tripInfluencers: tripInfluencers,
      tripImages: imageData || []
    };
    
    fs.writeFileSync(
      path.join(__dirname, 'trip-data-diagnostic.json'),
      JSON.stringify(diagnosticData, null, 2)
    );
    
    console.log('✅ Diagnostic complete! Data saved to trip-data-diagnostic.json');
    
  } catch (error) {
    console.error('❌ Error running diagnostic script:', error);
  }
})();
