
// "use client"

// import { useState, useEffect } from "react"
// import { Search, Calendar, DollarSign, Filter } from "lucide-react"
// import Link from "next/link"
// import Image from "next/image"
// import { getTrips, supabase } from "@/utils/supabase/client"
// import type { Trip } from "@/types/trips"
// import { formatDate, calculateDuration } from "@/utils/format-date"

// interface FilterState {
//   destination: string
//   startDateAfter: string | null
//   startDateBefore: Date | null
//   minPrice: string
//   maxPrice: string
//   category: string
// }

// export default function JoinTrip() {
//   const [categories, setCategories] = useState<string[]>([])
//   const [trips, setTrips] = useState<Trip[]>([])
//   const [loading, setLoading] = useState(true)
//   const [filters, setFilters] = useState<FilterState>({
//     destination: "",
//     startDateAfter: "",
//     startDateBefore: null,
//     minPrice: "",
//     maxPrice: "",
//     category: "",
//   })

//   const [debouncedFilters, setDebouncedFilters] = useState(filters)

//   // Debounce filter changes (wait 500ms before applying)
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedFilters(filters)
//     }, 500)

//     return () => clearTimeout(handler)
//   }, [filters])

//   // Fetch trips when debounced filters change
//   useEffect(() => {
//     const fetchTrips = async () => {
//       setLoading(true)
//       console.log("Fetching with category:", debouncedFilters.category)
//       const data = await getTrips(
//         debouncedFilters.destination,
//         debouncedFilters.startDateAfter ? new Date(debouncedFilters.startDateAfter) : null,
//         debouncedFilters.startDateBefore,
//         debouncedFilters.minPrice ? Number.parseFloat(debouncedFilters.minPrice) : null,
//         debouncedFilters.maxPrice ? Number.parseFloat(debouncedFilters.maxPrice) : null,
//         undefined,
//         debouncedFilters.category ? [debouncedFilters.category] : [],
//       )
//       setTrips(data)
//       setLoading(false)
//     }
//     fetchTrips()
//   }, [debouncedFilters])

//   // influcencer category

//   useEffect(() => {
//     const fetchCategories = async () => {
//       const { data, error } = await supabase.from("trips").select("influencer_category")

//       if (error) {
//         console.error("Error fetching categories:", error.message)
//         return
//       }

//       // Trim whitespace from categories
//       const uniqueCategories = Array.from(new Set(data.map((item) => item.influencer_category?.trim()).filter(Boolean)))

//       setCategories(uniqueCategories)
//     }

//     fetchCategories()
//   }, [])

//   return (
//     <div className="min-h-screen bg-[#fffbe5] p-6">
//       <div className="container mx-auto">
//         {/* Hero Section */}
//         <div className="relative rounded-xl overflow-hidden mb-12 bg-[url('/jointrip.png')] bg-cover bg-center  h-[500px]">
//           <div className="flex flex-col md:flex-row items-center p-6">
//             {/* Left side with navigation and content */}
//             <div className="w-full md:w-1/2 z-10">
//               {/* Logo and content */}
//               <div className="mb-8">
//                 <img src="/TourCrowText.svg" alt="TourCrow" className="h-32 w-auto ml-[600px] mt-28 block" />

//                 {/* Search bar */}
//                 <div className="ml-[600px] mb-4">
//                   <div className="relative w-96">
//                     <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
//                     <input
//                       type="text"
//                       placeholder="Where to"
//                       className="w-full border p-2 pl-10 rounded-full"
//                       value={filters.destination}
//                       onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
//                     />
//                   </div>
//                 </div>

//                 {/* Stats */}
//                 <div className="flex space-x-6 ml-[600px]">
//                   <div className="flex items-center space-x-2 whitespace-nowrap">
//                     <span>⭐</span>
//                     <span className="font-medium">4.8 Star Rating</span>
//                   </div>
//                   <div className="flex items-center space-x-2 whitespace-nowrap">
//                     <span>📊</span>
//                     <span className="font-medium">120+ Trips</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Existing code continues below */}

//         {/* Banner */}
//         <div className="relative w-full h-48 mb-12 rounded-[50] overflow-hidden">
//           <Image
//             src="/holidaybanner.png"
//             alt="Holiday Banner"
//             width={1024}
//             height={192}
//             className="object-cover w-full h-full"
//           />
//           <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent"></div>
//           <div className="absolute inset-0 flex items-center justify-center">
//             <h2 className="text-3xl lg:text-4xl font-bold text-[#E3FFAA] drop-shadow-lg">HOLIDAY HAPPINESS</h2>
//           </div>
//         </div>

//         <h2 className="text-3xl font-bold text-center mb-8">Our Upcoming Trips</h2>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Trips List - Takes 3 columns */}
//           <div className="lg:col-span-3">
//             {loading ? (
//               // Skeleton Loader
//               <div className="animate-pulse space-y-4">
//                 {[...Array(4)].map((_, index) => (
//                   <div key={index} className="h-64 bg-gray-200 rounded-lg"></div>
//                 ))}
//               </div>
//             ) : trips.length === 0 ? (
//               <p className="text-center text-lg p-8 bg-white rounded-lg shadow">No trips found</p>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {trips.map((trip) => (
//                   <div key={trip.id} className="relative bg-black rounded-lg overflow-hidden shadow-md h-[300]">
//                     {/* Background Image */}
//                     <Image
//                       src="/destination1.jpg"
//                       alt={trip.destination}
//                       width={384}
//                       height={192}
//                       className="w-full h-64 object-cover"
//                     />

//                     {/* Gradient Overlay for Readability */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

//                     <div className="absolute top-0 mt-2 left-4 text-white z-10 bg-black bg-opacity-50 px-2 py-1 rounded-tl-lg">
//                       <p className="text-sm flex items-center gap-2">
//                         📅 {formatDate(trip.start_date)} - {formatDate(trip.end_date)} |{" "}
//                         {calculateDuration(trip.start_date, trip.end_date)}
//                       </p>
//                     </div>
//                     {/* Text Overlay */}
//                     <div className="absolute bottom-4 left-4 text-white z-10">
//                       <h3 className="text-xl font-bold">{trip.destination}</h3>
//                       <h2 className="text-base text-white mt-2">
//                         <b>Influencer: </b>
//                         <span className="font-semibold">{trip.influcencer_name}</span>
//                       </h2>
//                       <p className="font-bold text-lg">₹ {trip.price}</p>
//                       <p className="text-sm opacity-80">{trip.influencer_category} Influencer Trip</p>
//                     </div>

//                     {/* View Details Button */}
//                     <Link href={`/trip/${trip.id}`}>
//                       <button
//                         className="absolute bottom-4 right-4 bg-gradient-to-r from-white/30 to-white/10 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md shadow-md flex items-center gap-2 transition-all duration-300 ease-in-out 
//   hover:from-white/50 hover:to-white/20 hover:scale-105 hover:shadow-lg"
//                       >
//                         View Details{" "}
//                         <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">➤</span>
//                       </button>
//                     </Link>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Filters - Takes 1 column on the right */}
//           <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-md h-fit">
//             <div className="mb-4">
//               <h3 className="text-lg font-semibold mb-3 flex items-center">
//                 <Filter className="w-5 h-5 mr-2" />
//                 Filters
//               </h3>
//               <div className="h-0.5 bg-gray-200 mb-4"></div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Destination</label>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
//                   <input
//                     type="text"
//                     placeholder="Where to"
//                     className="w-full border p-2 pl-10 rounded"
//                     value={filters.destination}
//                     onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1 flex items-center">
//                   <Calendar className="w-4 h-4 mr-1" />
//                   Start Date (After)
//                 </label>
//                 <input
//                   type="date"
//                   className="w-full border p-2 rounded"
//                   value={filters.startDateAfter || ""}
//                   onChange={(e) => setFilters({ ...filters, startDateAfter: e.target.value })}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1 flex items-center">
//                   <Calendar className="w-4 h-4 mr-1" />
//                   Start Date (Before)
//                 </label>
//                 <input
//                   type="date"
//                   className="w-full border p-2 rounded"
//                   value={filters.startDateBefore ? filters.startDateBefore.toISOString().split("T")[0] : ""}
//                   onChange={(e) =>
//                     setFilters({ ...filters, startDateBefore: e.target.value ? new Date(e.target.value) : null })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1 flex items-center">
//                   <DollarSign className="w-4 h-4 mr-1" />
//                   Price Range
//                 </label>
//                 <div className="grid grid-cols-2 gap-2">
//                   <input
//                     type="number"
//                     placeholder="Min"
//                     className="w-full border p-2 rounded"
//                     value={filters.minPrice}
//                     onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
//                   />
//                   <input
//                     type="number"
//                     placeholder="Max"
//                     className="w-full border p-2 rounded"
//                     value={filters.maxPrice}
//                     onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
//                   />
//                 </div>
//               </div>
//               {/*Influcener filter  */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">Influencer Category</label>
//                 <select
//                   className="w-full border p-2 rounded"
//                   value={filters.category}
//                   onChange={(e) => {
//                     console.log("Selected category:", e.target.value)
//                     setFilters({ ...filters, category: e.target.value })
//                   }}
//                 >
//                   <option value="">All Categories</option>
//                   {categories.map((cat) => (
//                     <option key={cat} value={cat}>
//                       {cat}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <button
//                 className="w-full bg-amber-500 text-white py-2 rounded-md font-medium mt-4"
//                 onClick={() =>
//                   setFilters({
//                     destination: "",
//                     startDateAfter: "",
//                     startDateBefore: null,
//                     minPrice: "",
//                     maxPrice: "",
//                     category: "",
//                   })
//                 }
//               >
//                 Reset Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// Place this above your component



"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, DollarSign, Filter, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getTrips, supabase } from "@/utils/supabase/client"
import type { Trip } from "@/types/trips"
import { formatDate, calculateDuration } from "@/utils/format-date"

interface FilterState {
  destination: string
  startDateAfter: string | null
  startDateBefore: Date | null
  minPrice: string
  maxPrice: string
  category: string
}

export default function JoinTrip() {
  const [categories, setCategories] = useState<string[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    destination: "",
    startDateAfter: "",
    startDateBefore: null,
    minPrice: "",
    maxPrice: "",
    category: "",
  })

  const handleApplyFilters = () => {
    setDebouncedFilters(filters)
    setIsMobileFilterOpen(false)
  }

  const [debouncedFilters, setDebouncedFilters] = useState(filters)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters)
    }, 500)

    return () => clearTimeout(handler)
  }, [filters])

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true)
      const data = await getTrips(
        debouncedFilters.destination,
        debouncedFilters.startDateAfter ? new Date(debouncedFilters.startDateAfter) : null,
        debouncedFilters.startDateBefore,
        debouncedFilters.minPrice ? Number.parseFloat(debouncedFilters.minPrice) : null,
        debouncedFilters.maxPrice ? Number.parseFloat(debouncedFilters.maxPrice) : null,
        undefined,
        debouncedFilters.category ? [debouncedFilters.category] : []
      )
      setTrips(data)
      setLoading(false)
    }
    fetchTrips()
  }, [debouncedFilters])

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("trip_influencers").select("influencer_category")

      if (error) {
        console.error("Error fetching categories:", error.message)
        return
      }

      const uniqueCategories = Array.from(
        new Set(data.map((item) => item.influencer_category?.trim()).filter(Boolean))
      )

      setCategories(uniqueCategories)
    }

    fetchCategories()
  }, [])

  const FilterSidebar = (
    <div className="space-y-4 p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </h3>
        <div className="h-0.5 bg-gray-200 mb-4"></div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Destination</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Where to"
            className="w-full border p-2 pl-10 rounded"
            value={filters.destination}
            onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          Start Date (After)
        </label>
        <input
          type="date"
          className="w-full border p-2 rounded"
          value={filters.startDateAfter || ""}
          onChange={(e) => setFilters({ ...filters, startDateAfter: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          Start Date (Before)
        </label>
        <input
          type="date"
          className="w-full border p-2 rounded"
          value={filters.startDateBefore ? filters.startDateBefore.toISOString().split("T")[0] : ""}
          onChange={(e) =>
            setFilters({ ...filters, startDateBefore: e.target.value ? new Date(e.target.value) : null })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 flex items-center">
          <DollarSign className="w-4 h-4 mr-1" />
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-full border p-2 rounded"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-full border p-2 rounded"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Influencer Category</label>
        <select
          className="w-full border p-2 rounded"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <button
        className="w-full bg-amber-500 text-white py-2 rounded-md font-medium mt-4"
        onClick={() =>
          setFilters({
            destination: "",
            startDateAfter: "",
            startDateBefore: null,
            minPrice: "",
            maxPrice: "",
            category: "",
          })
        }
      >
        Reset Filters
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#fffbe5] p-6 relative">
      {/* illustration and searchbar*/}

      <div className="container mx-auto">
        <div className="relative rounded-xl overflow-hidden mb-12 bg-[url('/jointrip.png')] bg-cover bg-center h-[500px]">
          <div className="flex flex-col md:flex-row items-center p-6">
            <div className="w-full md:w-1/2 z-10">
              <div className="mb-8">
                <img src="/TourCrowText.svg" alt="TourCrow" className="h-32 w-auto ml-[600px] mt-28 block" />

                <div className="ml-[600px] mb-4">
                  <div className="relative w-96">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Where to"
                      className="w-full border p-2 pl-10 rounded-full"
                      value={filters.destination}
                      onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex space-x-6 ml-[600px]">
                  <div className="flex items-center space-x-2 whitespace-nowrap">
                    <span>⭐</span>
                    <span className="font-medium">4.8 Star Rating</span>
                  </div>
                  <div className="flex items-center space-x-2 whitespace-nowrap">
                    <span>📊</span>
                    <span className="font-medium">120+ Trips</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full h-48 mb-12 rounded-[50] overflow-hidden">
          <Image
            src="/holidaybanner.png"
            alt="Holiday Banner"
            width={1024}
            height={192}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#E3FFAA] drop-shadow-lg">HOLIDAY HAPPINESS</h2>
          </div>
        </div>
      </div>







      {/* Mobile Filter Sidebar */}
      {isMobileFilterOpen && (
        <div className="fixed top-0 right-0 w-4/5 h-full bg-white shadow-lg z-50 transition-transform transform translate-x-0">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button onClick={() => setIsMobileFilterOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          {FilterSidebar}
          <div className="p-4 border-t mt-auto">
            <button
              className="w-full bg-black text-white py-2 rounded-md"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}


      {/* Mobile Filter Button */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 md:hidden z-40">
        <button
          className="bg-black text-white px-6 py-3 rounded-full shadow-lg"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <Filter className="inline w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      <div className="container mx-auto">
        {/* Hero and Banner Section here (your existing code stays unchanged) */}

        <h2 className="text-3xl font-bold text-center mb-8">Our Upcoming Trips</h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Trips List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-64 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            ) : trips.length === 0 ? (
              <p className="text-center text-lg p-8 bg-white rounded-lg shadow">No trips found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trips.map((trip) => (
                  <div key={trip.id} className="relative bg-black rounded-lg overflow-hidden shadow-md h-[300px]">
                    <Image
                      src="/destination1.jpg"
                      alt={trip.destination}
                      width={384}
                      height={192}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-0 mt-2 left-4 text-white z-10 bg-black bg-opacity-50 px-2 py-1 rounded-tl-lg">
                      <p className="text-sm flex items-center gap-2">
                        📅 {formatDate(trip.start_date)} - {formatDate(trip.end_date)} |{" "}
                        {calculateDuration(trip.start_date, trip.end_date)}
                      </p>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white z-10">
                      <h3 className="text-xl font-bold">{trip.destination}</h3>
                      <h2 className="text-base text-white mt-2">
                        <b>Influencer: </b>
                        <span className="font-semibold">{trip.influcencer_name}</span>
                      </h2>
                      <p className="font-bold text-lg">₹ {trip.price}</p>
                      <p className="text-sm opacity-80">{trip.influencer_category} Influencer Trip</p>
                    </div>
                    <Link href={`/trip/${trip.id}`}>
                      <button className="absolute bottom-4 right-4 bg-gradient-to-r from-white/40 to-white/20 text-white px-4 py-2 rounded-full text-sm  shadow-md flex items-center gap-2 hover:scale-105">
                        View Details ➤
                      </button> 
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filters for Desktop */}
          <div className="hidden lg:block bg-white p-4 rounded-lg shadow-md h-fit">
            {FilterSidebar}
          </div>
        </div>
      </div>
    </div>
  )
}
