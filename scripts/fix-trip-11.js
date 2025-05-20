/**
 * This script adds a default trip influencer for trip ID 11
 * which seems to be having issues displaying on the frontend
 */
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hpqxtdzzbqjuseyvvpoi.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwcXh0ZHp6YnFqdXNleXZ2cG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM2OTgyMzksImV4cCI6MjAyOTI3NDIzOX0.VuDuEjLFbO5Hf8NLzfODtZlWJ4SfvIOWjQSSQYsSYVM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTripInfluencerForTrip11() {
  try {
    console.log('Starting fix for trip ID 11...');
    
    // Check if trip ID 11 exists
    const { data: tripData, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', 11)
      .single();
    
    if (tripError) {
      console.error('Error fetching trip ID 11:', tripError);
      return;
    }
    
    if (!tripData) {
      console.error('Trip ID 11 does not exist in the database');
      return;
    }
    
    console.log('Found trip ID 11:', tripData);
    
    // Check if trip already has influencers
    const { data: existingInfluencers, error: influencerError } = await supabase
      .from('trip_influencers')
      .select('*')
      .eq('trip_id', 11);
    
    if (influencerError) {
      console.error('Error checking for existing influencers:', influencerError);
      return;
    }
    
    if (existingInfluencers && existingInfluencers.length > 0) {
      console.log(`Trip ID 11 already has ${existingInfluencers.length} influencers, no need to add more.`);
      return;
    }
    
    // Create a default influencer for trip ID 11
    const defaultInfluencer = {
      trip_id: 11,
      influcencer_name: tripData.title || 'Trip Host',
      influencer_category: 'Travel',
      price: '2500',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    
    const { data: newInfluencer, error: createError } = await supabase
      .from('trip_influencers')
      .insert(defaultInfluencer)
      .select();
    
    if (createError) {
      console.error('Error creating default influencer for trip ID 11:', createError);
      return;
    }
    
    console.log('Successfully created default influencer for trip ID 11:', newInfluencer);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the fix
createTripInfluencerForTrip11();
