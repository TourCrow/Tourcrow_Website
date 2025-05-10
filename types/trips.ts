// export interface Trip {
//     id: number;
//     influencer_category: string;
//     influcencer_name: string; 
//     destination: string;
//     price: number;
//     start_date: string;
//     end_date: string;
//     description: string;
//   }
  
//   export interface FilterState {
//     destination: string;
//     startDateAfter: Date | null;
//     startDateBefore: Date | null;
//     minPrice: number | null;
//     maxPrice: number | null;
//     selectedDestinations: string[];
//     category: string | null;
//   }

export interface Trip {
  id: number
  influencer_category: string
  influcencer_name: string
  destination: string
  price: number
  start_date: string
  end_date: string
  description: string
  status?: string
  group_size_min?: number
  group_size_max?: number
  meals_included?: string
  accommodation?: string
  host_id?: number
}

export interface TripActivity {
  id: number
  trip_id: number
  name: string
  category: string
  is_optional: boolean
  description: string
}

export interface TripInclusion {
  id: number
  trip_id: number
  item: string
}

export interface TripExclusion {
  id: number
  trip_id: number
  item: string
}

export interface FilterState {
  destination: string
  startDateAfter: Date | null
  startDateBefore: Date | null
  minPrice: number | null
  maxPrice: number | null
  selectedDestinations: string[]
  category: string | null
}
  