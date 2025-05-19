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

  let query = supabase
    .from("trip_influencers")
    .select(`
      *,
      trips (
        group_size_min,
        group_size_max,
        status,
        meals_included,
        accommodation
      ),
      trip_images!trip_influencers_trip_id_fkey (
        image_url,
        is_main
      )
    `)

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

  console.log("Executing Supabase query...");

  try {
    const { data, error } = await query
    
    // More detailed error logging
    if (error) {
      console.error("Error fetching trips:", error);
      if (error.message) {
        console.error("Error details:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
      }
      return []
    }
    
    if (!data || data.length === 0) {
      console.log("No trips data returned from query");
      return []
    }

    console.log(`Successfully fetched ${data.length} trips`);
    
    const processedData = data.map((item) => {
      // More robust handling of trip_images
      let mainImage = null;
      
      console.log(`Processing trip ID ${item.id}, trip_images:`, item.trip_images);
      
      if (item.trip_images) {
        if (Array.isArray(item.trip_images)) {
          mainImage = item.trip_images.find((img: any) => 
            img && typeof img === 'object' && img.is_main === true
          );
          
          if (!mainImage && item.trip_images.length > 0) {
            // If no main image is found but images exist, use the first one
            mainImage = item.trip_images[0];
          }
        } else if (typeof item.trip_images === 'object' && item.trip_images !== null) {
          // Handle case where trip_images might be a single object
          mainImage = item.trip_images;
        }
      }
      
      const imageUrl = mainImage?.image_url || null;
      console.log(`Trip ID ${item.id} image URL:`, imageUrl);

      return {
        ...item,
        group_size_min: item.trips?.group_size_min,
        group_size_max: item.trips?.group_size_max,
        meals_included: item.trips?.meals_included,
        accommodation: item.trips?.accommodation,
        status: item.trips?.status,
        // Add the image URL from trip_images if available
        image_url: imageUrl
      };
    })
    
    return processedData as Trip[]
  } catch (err) {
    console.error("Unexpected error in getTrips:", err);
    return [];
  }
}

//----------Trip Details 2nd page 
export async function getTripById(id: string): Promise<Trip | null> {
  try {
    const { data, error } = await supabase
      .from("trip_influencers")
      .select(`
        *,
        trips:trip_id (
          group_size_min,
          group_size_max,
          status,
          meals_included,
          accommodation,
          description
        ),
        trip_images!trip_influencers_trip_id_fkey (
          image_url,
          is_main
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching trip by ID:", error)
      return null
    }

    if (!data) {
      console.log(`No trip found with ID: ${id}`);
      return null;
    }

    // Process the data to include the nested trips information
    // Find the main image if available
    let mainImage = null;
    
    if (data.trip_images) {
      if (Array.isArray(data.trip_images)) {
        mainImage = data.trip_images.find((img: any) => 
          img && typeof img === 'object' && img.is_main === true
        );
        
        if (!mainImage && data.trip_images.length > 0) {
          // If no main image is found but images exist, use the first one
          mainImage = data.trip_images[0];
        }
      } else if (typeof data.trip_images === 'object' && data.trip_images !== null) {
        // Handle case where trip_images might be a single object
        mainImage = data.trip_images;
      }
    }
    
    const imageUrl = mainImage?.image_url || null;
      
    const processedData = {
      ...data,
      group_size_min: data.trips?.group_size_min,
      group_size_max: data.trips?.group_size_max,
      meals_included: data.trips?.meals_included,
      accommodation: data.trips?.accommodation,
      status: data.trips?.status,
      description: data.trips?.description || data.description,
      // Add the image URL from trip_images if available
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
