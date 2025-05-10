

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



  const { data, error } = await query

  if (error) {
    console.error("Error fetching trips:", error)
    return []
  }

  const processedData = data.map((item) => ({
    ...item,
    group_size_min: item.trips?.group_size_min,
    group_size_max: item.trips?.group_size_max,
    meals_included: item.trips?.meals_included,
    accommodation: item.trips?.accommodation,
    status: item.trips?.status,
  }))

  return processedData as Trip[]
}


//

//----------Trip Details 2nd page 
export async function getTripById(id: string): Promise<Trip | null> {
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
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching trip by ID:", error)
    return null
  }

  // Process the data to include the nested trips information
  const processedData = {
    ...data,
    group_size_min: data.trips?.group_size_min,
    group_size_max: data.trips?.group_size_max,
    meals_included: data.trips?.meals_included,
    accommodation: data.trips?.accommodation,
    status: data.trips?.status,
    description: data.trips?.description || data.description,
  }

  return processedData as Trip
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
