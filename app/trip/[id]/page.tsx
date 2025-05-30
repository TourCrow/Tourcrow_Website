"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, Users, Utensils, Home, Check, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/utils/supabase/client"
import { formatDate, calculateDuration } from "@/utils/format-date"
import type { Trip, TripActivity, TripInclusion, TripExclusion } from "@/types/trips"
import { use } from "react"
import BookingForm from "./booking"
import { getTripImageUrl } from "@/lib/image-helpers"

export default function TripDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [trip, setTrip] = useState<Trip | null>(null)
    const [tripDetails, setTripDetails] = useState<any | null>(null)
    const [activities, setActivities] = useState<TripActivity[]>([])
    const [inclusions, setInclusions] = useState<TripInclusion[]>([])
    const [exclusions, setExclusions] = useState<TripExclusion[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("overview")
    const [showBookingForm, setShowBookingForm] = useState(false)

    useEffect(() => {
        const fetchTripDetails = async () => {
            setLoading(true)

            try {
                console.log(`Fetching trip details for ID: ${id}`);
                
                // Fetch trip details from trip_influencers table
                const { data: influencerData, error: tripInfluencerError } = await supabase
                    .from("trip_influencers")
                    .select(`
                        *,
                        trips:trip_id (
                            id,
                            group_size_min,
                            group_size_max,
                            meals_included,
                            accommodation,
                            description
                        )
                    `)
                    .eq("trip_id", id);

                if (tripInfluencerError) {
                    console.error("Error fetching trip_influencers:", tripInfluencerError);
                    throw tripInfluencerError;
                }

                console.log("Trip influencers data:", influencerData);
                
                // Use this variable to store either the original data or our default
                let influencersData = influencerData;
                
                if (!influencersData || influencersData.length === 0) {
                    console.log(`No trip influencers found for trip ID: ${id}, fetching trip directly`);
                    
                    try {
                        // Make sure we have a valid ID - could be string or number
                        let numericId;
                        try {
                            numericId = parseInt(id, 10);
                            if (isNaN(numericId)) {
                                console.error(`Invalid trip ID: ${id} - not a number`);
                                setLoading(false);
                                return;
                            }
                            // Log valid numeric ID for debugging
                            console.log(`Converted trip ID: ${id} to numeric ID: ${numericId}`);
                        } catch (e) {
                            console.error(`Error parsing trip ID: ${id}`, e);
                            setLoading(false);
                            return;
                        }
                        
                        console.log(`Fetching trip with numeric ID: ${numericId}`);
                        
                        // Try fetching without using eq filter first (common cause of issues)
                        const { data: allTripsData, error: allTripsError } = await supabase
                            .from("trips")
                            .select("*");
                            
                        if (allTripsError) {
                            console.error("Error fetching all trips:", allTripsError);
                        } else {
                            console.log(`Found ${allTripsData?.length || 0} total trips in database`);
                            
                            // Find the trip with matching ID manually to debug
                            const matchingTrip = allTripsData?.find(t => t.id === numericId);
                            if (matchingTrip) {
                                console.log(`Trip with ID ${numericId} exists in database:`, matchingTrip);
                            } else {
                                console.log(`No trip with ID ${numericId} found in database`);
                            }
                        }
                        
                        // Attempt to fetch the trip directly with the numeric ID
                        const { data: directTripData, error: directTripError } = await supabase
                            .from("trips")
                            .select("*")
                            .eq("id", numericId)
                            .maybeSingle();
                        
                        if (directTripError) {
                            console.error(`Error fetching trip ${id} directly:`, directTripError);
                            setLoading(false);
                            return;
                        }
                        
                        if (!directTripData) {
                            console.log(`No trip found with ID: ${numericId}`);
                            console.error("Trip not found - Setting trip state to null");
                            setTrip(null);
                            setLoading(false);
                            return;
                        }
                        
                        console.log("Found trip directly:", directTripData);
                        
                        // Create a default trip influencer if none exists
                        // This will allow the trip to display even without influencers
                        const defaultTripInfluencer = {
                            trip_id: directTripData.id,
                            influcencer_name: directTripData.title || "Trip Host",
                            influencer_category: "Travel",
                            price: "Contact for price",
                            start_date: new Date().toISOString().split('T')[0],
                            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            trips: directTripData
                        };
                        
                        // Continue with this default influencer data
                        influencersData = [defaultTripInfluencer];
                    } catch (error) {
                        console.error(`Unexpected error fetching trip ${id}:`, error);
                        setTrip(null);
                        setLoading(false);
                        return;
                    }
                }

                // Make sure we have influencer data before proceeding
                if (!influencersData || influencersData.length === 0) {
                    console.error("No trip or influencer data found");
                    setLoading(false);
                    return;
                }

                // Use the first trip influencer for display
                const tripInfluencerData = influencersData[0];

                // Convert tripId to number for consistency in all remaining queries
                const tripId = typeof tripInfluencerData.trip_id === 'string' ? 
                    parseInt(tripInfluencerData.trip_id, 10) : tripInfluencerData.trip_id;

                console.log(`Associated trip ID: ${tripId}`);

                if (!tripId) {
                    console.error("No trip_id found in trip_influencer data");
                    setLoading(false);
                    return;
                }

                // Fetch trip images
                const { data: imagesData, error: imagesError } = await supabase
                    .from("trip_images")
                    .select("*")
                    .eq("trip_id", tripId);
                
                if (imagesError) {
                    console.error("Error fetching trip images:", imagesError);
                }
                
                console.log(`Found ${imagesData?.length || 0} images for trip`);
                
                // Find banner image, fallback to main image, and clean any double slashes in URLs
                let imageUrl = null;
                if (imagesData && imagesData.length > 0) {
                    const bannerImage = imagesData.find(img => img.is_banner);
                    const mainImage = imagesData.find(img => img.is_main);
                    const rawImageUrl = bannerImage?.image_url || mainImage?.image_url || imagesData[0].image_url;
                    
                    // Clean image URL to prevent double-slash issues
                    if (rawImageUrl) {
                        if (rawImageUrl.startsWith('http')) {
                            // For URLs, only fix double slashes after the domain part
                            const urlParts = rawImageUrl.split('://');
                            if (urlParts.length >= 2) {
                                const protocol = urlParts[0]; // http or https
                                const rest = urlParts.slice(1).join('://');
                                // Replace multiple slashes with single slash, but preserve // after protocol
                                const cleanedRest = rest.replace(/([^:])\/+/g, '$1/');
                                imageUrl = `${protocol}://${cleanedRest}`;
                            } else {
                                imageUrl = rawImageUrl;
                            }
                        } else {
                            // For relative paths or storage paths, replace consecutive slashes
                            imageUrl = rawImageUrl.replace(/\/+/g, '/').replace(/^\/+/, '');
                        }
                    }
                }

                // Fetch trip activities
                const { data: activitiesData, error: activitiesError } = await supabase
                    .from("trip_activities")
                    .select("*")
                    .eq("trip_id", tripId);

                if (activitiesError) {
                    console.error("Error fetching trip activities:", activitiesError);
                    throw activitiesError;
                }

                // Fetch trip inclusions
                const { data: inclusionsData, error: inclusionsError } = await supabase
                    .from("trip_inclusions")
                    .select(`
                        *,
                        trips:trip_id (
                            title
                        )
                    `)
                    .eq("trip_id", tripId);

                if (inclusionsError) {
                    console.error("Error fetching trip inclusions:", inclusionsError);
                    throw inclusionsError;
                }

                // Fetch trip exclusions
                const { data: exclusionsData, error: exclusionsError } = await supabase
                    .from("trip_exclusions")
                    .select("*")
                    .eq("trip_id", tripId);

                if (exclusionsError) {
                    console.error("Error fetching trip exclusions:", exclusionsError);
                    throw exclusionsError;
                }

                // Combine trip data with related trip details
                const tripData = {
                    ...tripInfluencerData,
                    group_size_min: tripInfluencerData.trips?.group_size_min,
                    group_size_max: tripInfluencerData.trips?.group_size_max,
                    meals_included: tripInfluencerData.trips?.meals_included,
                    accommodation: tripInfluencerData.trips?.accommodation,
                    description: tripInfluencerData.trips?.description || tripInfluencerData.description,
                    image_url: imageUrl
                }


                //debugging 
                console.log("Trip data:", tripData)
                console.log("Activities:", activitiesData)
                console.log("Inclusions:", inclusionsData)
                console.log("Exclusions:", exclusionsData)

                setTrip(tripData as Trip)
                setTripDetails(tripInfluencerData.trips)
                setActivities(activitiesData as TripActivity[])
                setInclusions(inclusionsData as TripInclusion[])
                setExclusions(exclusionsData as TripExclusion[])
            } catch (error) {
                console.error("Error fetching trip details:", error)
                setTrip(null)
                setTripDetails(null)
                setActivities([])
                setInclusions([])
                setExclusions([])
            } finally {
                setLoading(false)
            }
        }

        fetchTripDetails()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fffbe5] p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        )
    }

    if (!trip) {
        return (
            <div className="min-h-screen bg-[#fffbe5] p-6 flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Trip not found</h2>
                <p className="text-gray-600 mb-6">The trip you're looking for might not exist or could have been removed.</p>
                <Link
                    href="/join-trip" className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-full transition-colors flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Browse available trips
                </Link>
            </div>
        )
    }

    //booking 
    if (showBookingForm) {
        return <BookingForm trip={trip} onBack={() => setShowBookingForm(false)} />
    }

    return (
        <div className="min-h-screen bg-[#fffbe5]">
            {/* Hero Section */}
            <div className="relative h-[50vh] md:h-[60vh]">
                <Image 
                    src={getTripImageUrl(trip.image_url, trip.id)}
                    alt={trip.destination || `Trip to amazing destination`}
                    fill 
                    className="object-cover"
                    priority
                    unoptimized
                    onError={(e) => {
                        // Avoid repeated console messages
                        if (!(e.currentTarget as HTMLImageElement).dataset.errorLogged) {
                            console.warn(`Hero image failed to load for trip ${trip.id}. Image ID: ${trip.image_url}`);
                            (e.currentTarget as HTMLImageElement).dataset.errorLogged = 'true';
                        }
                        
                        // Use consistent placeholder for the same trip ID
                        const placeholders = ['/destination1.jpg', '/destination2.jpg', '/destination3.jpg'];
                        const placeholderIndex = Math.abs((trip.id || 0) % placeholders.length);
                        e.currentTarget.src = placeholders[placeholderIndex];
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white">
                    <Link href="/join-trip" className="inline-block">
                        <button className="bg-gradient-to-r from-white/40 to-white/20 text-white px-4 py-2 mb-3 rounded-full text-sm shadow-md flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                            <ArrowLeft className="w-4 h-4" /> Back to trips
                        </button>
                    </Link>

                    <h1 className="text-3xl md:text-5xl font-bold mb-2">{trip.destination}</h1>
                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>
                                {formatDate(trip.start_date)} - {formatDate(trip.end_date)} |{" "}
                                {calculateDuration(trip.start_date, trip.end_date)}
                            </span>
                        </div>
                        <div className="flex items-center bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                            <span className="font-bold bg-gradient-to-r from-white/40 to-white/20 text-white px-4 py-2 rounded-full text-sm shadow-md flex items-center gap-2 hover:scale-105 transition-transform duration-200">₹{trip.price}</span>
                        </div>
                    </div>
                    <p className="text-lg">
                        <span className="font-semibold">Hosted by:</span> {trip.influcencer_name} ({trip.influencer_category})
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto p-6">
                {/* Navigation Tabs */}
                <div className="flex overflow-x-auto space-x-2 border-b border-gray-200 mb-6 pb-2">
                    <button
                        className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "overview" ? "text-amber-500 border-b-2 border-amber-500" : "text-gray-600"
                            }`}
                        onClick={() => setActiveTab("overview")}
                    >
                        Overview
                    </button>
                    <button
                        className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "activities" ? "text-amber-500 border-b-2 border-amber-500" : "text-gray-600"
                            }`}
                        onClick={() => setActiveTab("activities")}
                    >
                        Activities
                    </button>
                    <button
                        className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "inclusions" ? "text-amber-500 border-b-2 border-amber-500" : "text-gray-600"
                            }`}
                        onClick={() => setActiveTab("inclusions")}
                    >
                        What's Included
                    </button>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Trip Overview</h2>
                                <p className="text-gray-700 whitespace-pre-line">
                                    {trip.description || "No description available for this trip."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <Calendar className="w-5 h-5 text-amber-500 mr-2" />
                                        <h3 className="font-semibold">Duration</h3>
                                    </div>
                                    <p>{calculateDuration(trip.start_date, trip.end_date)}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <Users className="w-5 h-5 text-amber-500 mr-2" />
                                        <h3 className="font-semibold">Group Size</h3>
                                    </div>
                                    <p>
                                        {trip.group_size_min !== null && trip.group_size_min !== undefined
                                            ? `Min: ${trip.group_size_min}`
                                            : "Min: N/A"}{" "}
                                        -{" "}
                                        {trip.group_size_max !== null && trip.group_size_max !== undefined
                                            ? `Max: ${trip.group_size_max}`
                                            : "Max: N/A"}{" "}
                                        people
                                    </p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <Utensils className="w-5 h-5 text-amber-500 mr-2" />
                                        <h3 className="font-semibold">Meals</h3>
                                    </div>
                                    <p>{trip.meals_included || "Not specified"}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center mb-2">
                                        <Home className="w-5 h-5 text-amber-500 mr-2" />
                                        <h3 className="font-semibold">Accommodation</h3>
                                    </div>
                                    <p>{trip.accommodation || "Not specified"}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Activities Tab */}
                    {activeTab === "activities" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Trip Activities</h2>
                            {activities.length === 0 ? (
                                <p className="text-gray-500">No activities listed for this trip.</p>
                            ) : (
                                <div className="space-y-4">
                                    {activities.map((activity) => (
                                        <div key={activity.id} className="border-b pb-4 last:border-b-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-semibold">{activity.name}</h3>
                                                    <p className="text-sm text-gray-500 mb-2">Category: {activity.category}</p>
                                                </div>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${activity.is_optional ? "bg-gray-100" : "bg-amber-100 text-amber-800"
                                                        }`}
                                                >
                                                    {activity.is_optional ? "Optional" : "Included"}
                                                </span>
                                            </div>
                                            <p className="text-gray-700">{activity.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Inclusions Tab */}
                    {activeTab === "inclusions" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-4 flex items-center">
                                    <Check className="w-5 h-5 text-green-500 mr-2" />
                                    What's Included
                                </h2>
                                {inclusions.length === 0 ? (
                                    <p className="text-gray-500">No inclusions listed for this trip.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {inclusions.map((inclusion) => (
                                            <li key={inclusion.id} className="flex items-start">
                                                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                                <span>{inclusion.item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4 flex items-center">
                                    <X className="w-5 h-5 text-red-500 mr-2" />
                                    What's Not Included
                                </h2>
                                {exclusions.length === 0 ? (
                                    <p className="text-gray-500">No exclusions listed for this trip.</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {exclusions.map((exclusion) => (
                                            <li key={exclusion.id} className="flex items-start">
                                                <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                                <span>{exclusion.item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Booking Section */}
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Ready to Book?</h2>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div>
                            <p className="text-gray-700 mb-2">
                                Join {trip.influcencer_name} on this amazing trip to {trip.destination}
                            </p>
                            <p className="text-2xl font-bold">
                                ₹{trip.price} <span className="text-sm font-normal text-gray-500">per person</span>
                            </p>
                        </div>
                        <button
                            className="mt-4 md:mt-0 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full transition-colors"
                            onClick={() => setShowBookingForm(true)}
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
