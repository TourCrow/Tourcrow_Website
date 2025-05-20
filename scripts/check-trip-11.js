/**
 * Check trip details script - quickly verify trip and influencer data
 */
import { supabase } from "../utils/supabase/client";

async function checkTripDetails(tripId) {
  console.log(`Checking trip details for ID: ${tripId}`);
  
  // 1. Check if trip exists
  const { data: tripData, error: tripError } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();
  
  if (tripError) {
    console.error(`❌ Error fetching trip: ${tripError.message}`);
  } else if (!tripData) {
    console.error(`❌ No trip found with ID ${tripId}`);
  } else {
    console.log(`✅ Trip found: "${tripData.title}" (ID: ${tripData.id})`);
  }
  
  // 2. Check trip_influencers
  const { data: influencerData, error: influencerError } = await supabase
    .from("trip_influencers")
    .select("*")
    .eq("trip_id", tripId);
  
  if (influencerError) {
    console.error(`❌ Error fetching trip_influencers: ${influencerError.message}`);
  } else if (!influencerData || influencerData.length === 0) {
    console.error(`❌ No trip_influencers found for trip ID ${tripId}`);
    
    // Let's check if there are any influencers in the system
    const { data: allInfluencers } = await supabase.from("trip_influencers").select("trip_id").limit(5);
    console.log(`ℹ️ Some existing trip_influencers in the system: ${JSON.stringify(allInfluencers?.map(i => i.trip_id) || [])}`);
  } else {
    console.log(`✅ Found ${influencerData.length} trip influencer(s) for trip ID ${tripId}`);
    influencerData.forEach((influencer, i) => {
      console.log(`  Influencer ${i+1}: ${influencer.influcencer_name}, Price: ${influencer.price}, Trip ID: ${influencer.trip_id}`);
    });
  }
  
  // 3. Check trip_images
  const { data: imageData, error: imageError } = await supabase
    .from("trip_images")
    .select("*")
    .eq("trip_id", tripId);
    
  if (imageError) {
    console.error(`❌ Error fetching trip_images: ${imageError.message}`);
  } else if (!imageData || imageData.length === 0) {
    console.error(`❌ No trip_images found for trip ID ${tripId}`);
  } else {
    console.log(`✅ Found ${imageData.length} image(s) for trip ID ${tripId}`);
    const mainImage = imageData.find(img => img.is_main);
    const bannerImage = imageData.find(img => img.is_banner);
    console.log(`  Main image: ${mainImage ? 'Yes' : 'No'}, Banner image: ${bannerImage ? 'Yes' : 'No'}`);
  }
}

// Check the problematic trip ID and a few others for comparison
const tripIdsToCheck = [11, 1, 2, 3];
Promise.all(tripIdsToCheck.map(id => checkTripDetails(id)))
  .then(() => console.log("Check complete!"))
  .catch(err => console.error("Error running checks:", err));
