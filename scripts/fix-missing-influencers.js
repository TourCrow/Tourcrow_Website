/**
 * This script checks for trips without influencers and creates default influencers for them
 * This ensures all trips can be viewed on the frontend
 */

import { supabase } from "../utils/supabase/client";

async function fixMissingInfluencers() {
  console.log("Checking for trips without influencers...");
  
  try {
    // 1. Get all trips
    const { data: trips, error: tripsError } = await supabase
      .from("trips")
      .select("id, title, status");
    
    if (tripsError) {
      console.error("Error fetching trips:", tripsError);
      return;
    }
    
    console.log(`Found ${trips.length} trips total`);
    
    // 2. For each trip, check if it has any influencers
    let tripsWithoutInfluencers = [];
    
    for (const trip of trips) {
      const { data: influencers, error: influencersError } = await supabase
        .from("trip_influencers")
        .select("id")
        .eq("trip_id", trip.id);
      
      if (influencersError) {
        console.error(`Error checking influencers for trip ${trip.id}:`, influencersError);
        continue;
      }
      
      if (!influencers || influencers.length === 0) {
        tripsWithoutInfluencers.push(trip);
      }
    }
    
    console.log(`Found ${tripsWithoutInfluencers.length} trips without influencers`);
    
    // 3. Create default influencers for trips that don't have any
    if (tripsWithoutInfluencers.length > 0) {
      console.log("Creating default influencers for trips...");
      
      const now = new Date();
      const oneYearLater = new Date(now);
      oneYearLater.setFullYear(now.getFullYear() + 1);
      
      const defaultInfluencers = tripsWithoutInfluencers.map(trip => ({
        trip_id: trip.id,
        influcencer_name: trip.title || "Trip Host",
        influencer_category: "Travel",
        start_date: now.toISOString().split('T')[0],
        end_date: oneYearLater.toISOString().split('T')[0],
        price: "Contact for price"
      }));
      
      const { data: insertedInfluencers, error: insertError } = await supabase
        .from("trip_influencers")
        .insert(defaultInfluencers);
      
      if (insertError) {
        console.error("Error creating default influencers:", insertError);
      } else {
        console.log(`Successfully created ${defaultInfluencers.length} default influencers`);
      }
    }
    
    console.log("Completed fixing missing influencers");
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

// Run the function
fixMissingInfluencers()
  .catch(console.error)
  .finally(() => console.log("Script completed"));
