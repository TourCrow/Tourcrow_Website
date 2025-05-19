/**
 * Image Reference Fixing Tool for TourCrow Website
 * 
 * This script helps diagnose and fix issues with trip images in the database.
 * It ensures all trips have at least one image and that all trip_images records
 * have valid trip_id references.
 */

const { createClient } = require('@supabase/supabase-js');

// Create Supabase client (use environment variables or enter directly for testing)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fallback to hardcoded values if environment variables are not available (for testing only)
const supabase = createClient(
  supabaseUrl || 'YOUR_SUPABASE_URL', 
  supabaseKey || 'YOUR_SUPABASE_KEY'
);

// Default placeholder image IDs to use when no image is available
const PLACEHOLDER_IMAGES = [
  'destination1.jpg',
  'destination2.jpg',
  'destination3.jpg'
];

async function fixImages(dryRun = true) {
  console.log('🖼️ TourCrow Image Fixing Tool');
  console.log('----------------------------');
  console.log(`Mode: ${dryRun ? 'DRY RUN (no changes will be made)' : 'LIVE (changes will be applied)'}`);
  
  try {
    // 1. Get all trips
    console.log('\n📋 Fetching all trips...');
    const { data: trips, error: tripsError } = await supabase
      .from('trips')
      .select('id, title');
    
    if (tripsError) {
      console.error('Error fetching trips:', tripsError.message);
      return;
    }
    
    console.log(`Found ${trips.length} trips`);
    
    // 2. Get all trip_influencers
    console.log('\n👤 Fetching all trip_influencers...');
    const { data: tripInfluencers, error: tripInfluencersError } = await supabase
      .from('trip_influencers')
      .select('id, trip_id, destination');
      
    if (tripInfluencersError) {
      console.error('Error fetching trip_influencers:', tripInfluencersError.message);
      return;
    }
    
    console.log(`Found ${tripInfluencers.length} trip influencers`);
    
    // 3. Get all trip_images
    console.log('\n🖼️ Fetching all trip_images...');
    const { data: tripImages, error: tripImagesError } = await supabase
      .from('trip_images')
      .select('id, trip_id, image_url, is_main');
      
    if (tripImagesError) {
      console.error('Error fetching trip_images:', tripImagesError.message);
      return;
    }
    
    console.log(`Found ${tripImages.length} trip images`);
    
    // 4. Check for trips without images
    console.log('\n🔍 Checking for trips without images...');
    const tripsWithoutImages = trips.filter(trip => 
      !tripImages.some(image => image.trip_id === trip.id)
    );
    
    console.log(`Found ${tripsWithoutImages.length} trips without images`);
    
    // 5. Check for trip_influencers without valid trip_id
    console.log('\n🔍 Checking for trip_influencers without valid trip_id...');
    const invalidTripInfluencers = tripInfluencers.filter(influencer => 
      !trips.some(trip => trip.id === influencer.trip_id)
    );
    
    console.log(`Found ${invalidTripInfluencers.length} trip_influencers with invalid trip_id`);
    
    // 6. Check for trip_images without valid trip_id
    console.log('\n🔍 Checking for trip_images without valid trip_id...');
    const invalidTripImages = tripImages.filter(image => 
      !trips.some(trip => trip.id === image.trip_id)
    );
    
    console.log(`Found ${invalidTripImages.length} trip_images with invalid trip_id`);
    
    // 7. Fix issues if not in dry run mode
    if (!dryRun) {
      console.log('\n🔧 Applying fixes...');
      
      // Fix trips without images
      if (tripsWithoutImages.length > 0) {
        console.log(`Adding placeholder images for ${tripsWithoutImages.length} trips...`);
        
        for (const trip of tripsWithoutImages) {
          // Choose a placeholder image based on the trip ID for some variety
          const placeholderImage = PLACEHOLDER_IMAGES[trip.id % PLACEHOLDER_IMAGES.length];
          
          const { error } = await supabase
            .from('trip_images')
            .insert({
              trip_id: trip.id,
              image_url: placeholderImage,
              is_main: true
            });
            
          if (error) {
            console.error(`Error adding placeholder image for trip ${trip.id}:`, error.message);
          } else {
            console.log(`✅ Added placeholder image for trip ${trip.id}: ${trip.title}`);
          }
        }
      }
      
      // Fix trip_influencers with invalid trip_id by creating missing trips
      if (invalidTripInfluencers.length > 0) {
        console.log(`Creating missing trips for ${invalidTripInfluencers.length} invalid trip_influencers...`);
        
        for (const influencer of invalidTripInfluencers) {
          if (!influencer.trip_id) continue; // Skip if trip_id is null
          
          // Create a new trip for this influencer
          const { data: newTrip, error: tripError } = await supabase
            .from('trips')
            .insert({
              id: influencer.trip_id, // Use the same ID that was expected
              title: `Trip to ${influencer.destination || 'Unknown Destination'}`,
              status: 'published',
              description: `Trip to ${influencer.destination || 'Unknown Destination'}`
            })
            .select('id')
            .single();
            
          if (tripError) {
            console.error(`Error creating trip for influencer ${influencer.id}:`, tripError.message);
          } else {
            console.log(`✅ Created new trip (ID: ${newTrip.id}) for influencer ${influencer.id}`);
            
            // Add a placeholder image for this new trip
            const placeholderImage = PLACEHOLDER_IMAGES[influencer.id % PLACEHOLDER_IMAGES.length];
            
            await supabase
              .from('trip_images')
              .insert({
                trip_id: newTrip.id,
                image_url: placeholderImage,
                is_main: true
              });
          }
        }
      }
      
      // Fix trip_images with invalid trip_id
      if (invalidTripImages.length > 0) {
        console.log(`Removing ${invalidTripImages.length} trip_images with invalid trip_id...`);
        
        for (const image of invalidTripImages) {
          const { error } = await supabase
            .from('trip_images')
            .delete()
            .eq('id', image.id);
            
          if (error) {
            console.error(`Error removing invalid trip_image ${image.id}:`, error.message);
          } else {
            console.log(`✅ Removed invalid trip_image ${image.id}`);
          }
        }
      }
      
      console.log('\n✅ All fixes applied!');
    } else {
      console.log('\n⚠️ This was a dry run. No changes were made.');
      console.log('Re-run with dryRun = false to apply the fixes.');
    }
    
    console.log('\n📊 Summary:');
    console.log(`- Trips without images: ${tripsWithoutImages.length}`);
    console.log(`- Trip influencers with invalid trip_id: ${invalidTripInfluencers.length}`);
    console.log(`- Trip images with invalid trip_id: ${invalidTripImages.length}`);
    
  } catch (error) {
    console.error('Error fixing images:', error);
  }
}

// Run the script with dry run mode first (set to false to actually apply changes)
fixImages(true);
