import { createClient } from "@supabase/supabase-js"
import type { Trip } from "@/types/trips"

// Create a single supabase client for the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getTrips(
  destination?: string,
  startDateAfter?: Date | null,
  startDateBefore?: Date | null,
  minPrice?: number | null,
  maxPrice?: number | null,
  selectedDestinations?: string[],
  selectedCategories?: string[],
  group_size_max?: number | null,
  group_size_min?: number | null,
): Promise<Trip[]> {
  console.log("Fetching trips with filters:", {
    group_size_max,
    group_size_min,
    destination,
    selectedCategories,
    selectedDestinations,
    minPrice,
    maxPrice,
    startDateAfter,
    startDateBefore,
  })

  try {
    // First, get all trip_influencers
    let query = supabase
      .from("trip_influencers")
      .select(`
        *,
        trips:trip_id (
          id,
          group_size_min,
          group_size_max,
          status,
          meals_included,
          accommodation
        )
      `)
    
    // Apply filters
    if (destination) {
      query = query.ilike("destination", `%${destination}%`)
    }

    if (startDateAfter) {
      query = query.gte("start_date", startDateAfter.toISOString().split("T")[0])
    }

    if (startDateBefore) {
      query = query.lte("start_date", startDateBefore.toISOString().split("T")[0])
    }

    if (minPrice !== null) {
      query = query.gte("price", minPrice)
    }

    if (maxPrice !== null) {
      query = query.lte("price", maxPrice)
    }

    if (selectedDestinations && selectedDestinations.length > 0) {
      query = query.in("destination", selectedDestinations)
    }

    if (selectedCategories && selectedCategories.length > 0 && selectedCategories[0]) {
      // Use ilike with wildcards for more flexible matching
      const categoryTrimmed = selectedCategories[0].trim()
      console.log(`Filtering by category (trimmed): "${categoryTrimmed}"`)

      // Use wildcards before and after to match the category anywhere in the field
      query = query.ilike("influencer_category", `%${categoryTrimmed}%`)
    }

    console.log("Executing Supabase query for trip_influencers...");
    
    // Execute the first query to get trip_influencers data
    const { data: influencerData, error: influencerError } = await query
    
    if (influencerError) {
      console.error("Error fetching trip_influencers:", influencerError);
      if (influencerError.message) {
        console.error("Error details:", {
          message: influencerError.message,
          code: influencerError.code,
          details: influencerError.details,
          hint: influencerError.hint
        });
      }
      return []
    }
    
        if (!influencerData || influencerData.length === 0) {
      console.log("No trip_influencers data returned from query");
      return []
    }

    console.log(`Successfully fetched ${influencerData.length} trip_influencers`);
    
    // Now get images for all these trips
    const tripIds = influencerData.map(item => item.trip_id).filter(Boolean);
    
    if (tripIds.length === 0) {
      console.warn("No valid trip_ids found in trip_influencers data");
      return [];
    }
    
    console.log("Fetching images for trip_ids:", tripIds);
    
    const { data: imageData, error: imageError } = await supabase
      .from("trip_images")
      .select("*")
      .in("trip_id", tripIds);
      
    if (imageError) {
      console.error("Error fetching trip images:", imageError);
    }
    
    console.log(`Found ${imageData?.length || 0} images for trips`);
    
    // Process and combine the data
    const processedData = influencerData.map((item: any) => {
      // Find images for this trip
      const tripImages = imageData?.filter(img => img.trip_id === item.trip_id) || [];
      console.log(`Trip ID ${item.trip_id} has ${tripImages.length} images`);
      
      // Get main image or first available image
      let mainImage = tripImages.find(img => img.is_main === true);
      if (!mainImage && tripImages.length > 0) {
        mainImage = tripImages[0];
      }
      
      const imageUrl = mainImage?.image_url || null;
      console.log(`Trip ID ${item.trip_id} main image URL:`, imageUrl);

      return {
        ...item,
        group_size_min: item.trips?.group_size_min,
        group_size_max: item.trips?.group_size_max,
        meals_included: item.trips?.meals_included,
        accommodation: item.trips?.accommodation,
        status: item.trips?.status,
        image_url: imageUrl
      };
    });
    
    return processedData as Trip[]
  } catch (err) {
    console.error("Unexpected error in getTrips:", err);
    return [];
  }
}

//----------Trip Details 2nd page 
export async function getTripById(id: string): Promise<Trip | null> {
  try {
    console.log(`Fetching trip with ID: ${id}`);
    
    // Get the trip_influencer record
    const { data: influencerData, error: influencerError } = await supabase
      .from("trip_influencers")
      .select(`
        *,
        trips:trip_id (
          id,
          group_size_min,
          group_size_max,
          status,
          meals_included,
          accommodation,
          description
        )
      `)
      .eq("id", id)
      .single();

    if (influencerError) {
      console.error("Error fetching trip_influencer by ID:", influencerError);
      return null;
    }

    if (!influencerData) {
      console.log(`No trip_influencer found with ID: ${id}`);
      return null;
    }
    
    // Get images for this trip
    const tripId = influencerData.trip_id;
    
    if (!tripId) {
      console.warn(`Trip_influencer ID ${id} has no associated trip_id`);
      return influencerData as Trip;
    }
    
    const { data: imageData, error: imageError } = await supabase
      .from("trip_images")
      .select("*")
      .eq("trip_id", tripId);
      
    if (imageError) {
      console.error("Error fetching trip images:", imageError);
    }
    
    // Find main image or first available image
    let imageUrl = null;
    if (imageData && imageData.length > 0) {
      const mainImage = imageData.find(img => img.is_main === true) || imageData[0];
      imageUrl = mainImage?.image_url || null;
    }
    
    const processedData = {
      ...influencerData,
      group_size_min: influencerData.trips?.group_size_min,
      group_size_max: influencerData.trips?.group_size_max,
      meals_included: influencerData.trips?.meals_included,
      accommodation: influencerData.trips?.accommodation,
      status: influencerData.trips?.status,
      description: influencerData.trips?.description || influencerData.description,
      image_url: imageUrl
    }

    return processedData as Trip
  } catch (err) {
    console.error("Unexpected error in getTripById:", err);
    return null;
  }
}

//------------activities
export async function getTripActivities(tripId: string) {
  const { data, error } = await supabase.from("trip_activities").select("*").eq("trip_id", tripId)

  if (error) {
    console.error("Error fetching trip activities:", error)
    return []
  }

  return data
}

//----------inclusions 
export async function getTripInclusions(tripId: string) {
  const { data, error } = await supabase.from("trip_inclusions").select("*").eq("trip_id", tripId)

  if (error) {
    console.error("Error fetching trip inclusions:", error)
    return []
  }

  return data
}

//----------exclusions
export async function getTripExclusions(tripId: string) {
  const { data, error } = await supabase.from("trip_exclusions").select("*").eq("trip_id", tripId)

  if (error) {
    console.error("Error fetching trip exclusions:", error)
    return []
  }

  return data
}
