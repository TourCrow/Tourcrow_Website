"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Info, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import type { Trip } from "@/types/trips"

type TravelerInfo = {
  firstName: string
  lastName: string
  email: string
  gender: string
  dateOfBirth: {
    month: string
    day: string
    year: string
  }
  phone: string
  instagramHandle: string
  country: string
  ageError?: string
  phoneError?: string
}

type BookingFormProps = {
  trip: Trip
  onBack: () => void
}

export default function BookingForm({ trip, onBack }: BookingFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [travelers, setTravelers] = useState<TravelerInfo[]>([
    {
      firstName: "",
      lastName: "",
      email: "",
      gender: "",
      dateOfBirth: {
        month: "",
        day: "",
        year: "",
      },
      phone: "",
      instagramHandle: "",
      country: "India",
    },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [keepMeLooped, setKeepMeLooped] = useState(true)
  const [totalPrice, setTotalPrice] = useState(trip.price || 0)

  const handleAddTraveler = () => {
    setTravelers((prevTravelers) => {
      const newTravelers = [
        ...prevTravelers,
        {
          firstName: "",
          lastName: "",
          email: "",
          gender: "",
          dateOfBirth: {
            month: "",
            day: "",
            year: "",
          },
          phone: "",
          instagramHandle: "",
          country: "India",
        },
      ]

      // Update total price after adding a traveler
      setTotalPrice((prevPrice) => prevPrice + (trip.price || 0))

      return newTravelers
    })
  }

  const handleRemoveTraveler = (index: number) => {
    if (travelers.length > 1) {
      setTravelers((prevTravelers) => {
        const updatedTravelers = [...prevTravelers]
        updatedTravelers.splice(index, 1)

        // Update total price after removing a traveler
        setTotalPrice((prevPrice) => prevPrice - (trip.price || 0))

        return updatedTravelers
      })
    }
  }

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedTravelers = [...travelers]

    if (field.includes(".")) {
      const [parent, child] = field.split(".")

      updatedTravelers[index] = {
        ...updatedTravelers[index],
        [parent]: {
          ...(updatedTravelers[index][parent as keyof TravelerInfo] as object),
          [child]: value,
        },
      }

      // ✅ Add age validation logic for traveler 1
      if (parent === "dateOfBirth" && child === "year" && index === 0) {
        const selectedYear = Number.parseInt(value)
        const currentYear = new Date().getFullYear()
        const age = currentYear - selectedYear
        updatedTravelers[0].ageError = age < 18 ? "Age should be greater than 18" : ""
      }
    } else {
      updatedTravelers[index] = {
        ...updatedTravelers[index],
        [field]: value,
      }
    }

    // ✅ Phone number validation
    if (field === "phone") {
      const phonePattern = /^\d{10}$/
      const isValidPhone = phonePattern.test(value)
      updatedTravelers[index].phoneError = isValidPhone ? "" : "Enter a valid 10-digit phone number"
    }

    setTravelers(updatedTravelers)
  }

  const validateForm = () => {
    // Check for validation errors
    for (const traveler of travelers) {
      if (traveler.ageError || traveler.phoneError) {
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    // Validate form before submission
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors in the form before continuing.",
      })
      return
    }
  
    setIsSubmitting(true)
  
    try {
      // First, verify the trip exists by joining trips and trip_influencer tables
      const { data: tripData, error: tripFetchError } = await supabase
        .from("trips")
        .select(`
          *,
          trip_influencer!inner(*)
        `)
        .eq("id", trip.id)
        .single()
  
      if (tripFetchError || !tripData) {
        throw new Error("Could not verify trip details. The trip may no longer be available.")
      }
  
      // Create the booking with the verified trip_id
      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          trip_id: tripData.id,
          total_price: totalPrice,
          booking_date: new Date().toISOString(),
          status: "pending",
          contact_email: travelers[0].email,
          contact_number: travelers[0].phone,
          // Add any other fields that might be needed from trip_influencer
          influencer_id: tripData.trip_influencer?.influencer_id || null,
        })
        .select()
  
      console.log("Creating booking with:", {
        trip_id: tripData.id,
        total_price: totalPrice,
        contact_email: travelers[0].email,
        contact_number: travelers[0].phone,
      })
  
      if (bookingError) throw bookingError
  
      // Get the booking ID from the response
      const bookingId = bookingData[0].id
  
      // Create traveler records
      const travelerPromises = travelers.map(async (traveler) => {
        // Format date of birth
        const dob = `${traveler.dateOfBirth.year}-${traveler.dateOfBirth.month}-${traveler.dateOfBirth.day}`
  
        const { error: travelerError } = await supabase.from("travelers").insert({
          booking_id: bookingId,
          first_name: traveler.firstName,
          last_name: traveler.lastName,
          email: traveler.email,
          gender: traveler.gender,
          date_of_birth: dob,
          phone: traveler.phone,
          instagram_handle: traveler.instagramHandle || null,
          country: traveler.country,
          is_subscribed: traveler.email === travelers[0].email ? keepMeLooped : false,
        })
  
        if (travelerError) throw travelerError
      })
  
      // Wait for all traveler records to be created
      await Promise.all(travelerPromises)
  
      // Success! Show toast and redirect
      toast({
        title: "Booking Created",
        description: "Your booking has been successfully created!",
      })
  
      // Redirect to payment page
      router.push(`/trip/${tripData.id}/payment?booking=${bookingId}`)
    } catch (error: any) {
      console.error("Error creating booking:", error)
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message || "There was a problem creating your booking. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  

  // Calculate deposit amount (25% of total)
  const depositAmount = totalPrice * 0.25

  return (
    <div className="min-h-screen bg-[#fffbe5]">
      {/* Booking Process Navigation */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" /> Trip Page
          </button>
          <div className="ml-auto flex items-center space-x-2">
            <span className="font-medium text-amber-500">TRAVELERS</span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-400">ADD-ONS</span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-400">PAYMENT</span>
          </div>
        </div>

        {/* Trip Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {trip.destination} with {trip.influcencer_name}
        </h1>
        <div className="flex items-center text-gray-600 mb-8">
          <span>
            {trip.start_date &&
              new Date(trip.start_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}{" "}
            -
            {trip.end_date &&
              new Date(trip.end_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </span>
          <span className="mx-2">•</span>
          <span>{trip.destination}</span>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Booking Form */}
          <div className="w-full lg:w-2/3">
            <form onSubmit={handleSubmit}>
              {travelers.map((traveler, index) => (
                <div key={index} className="mb-8 pb-8 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Traveler {index + 1}</h2>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTraveler(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor={`firstName-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id={`firstName-${index}`}
                        value={traveler.firstName}
                        onChange={(e) => handleInputChange(index, "firstName", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`lastName-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id={`lastName-${index}`}
                        value={traveler.lastName}
                        onChange={(e) => handleInputChange(index, "lastName", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor={`email-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id={`email-${index}`}
                        value={traveler.email}
                        onChange={(e) => handleInputChange(index, "email", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`gender-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        id={`gender-${index}`}
                        value={traveler.gender}
                        onChange={(e) => handleInputChange(index, "gender", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-binary</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={traveler.dateOfBirth.month}
                        onChange={(e) => handleInputChange(index, "dateOfBirth.month", e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                        required
                      >
                        <option value="">Month</option>
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="03">March</option>
                        <option value="04">April</option>
                        <option value="05">May</option>
                        <option value="06">June</option>
                        <option value="07">July</option>
                        <option value="08">August</option>
                        <option value="09">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                      </select>
                      <select
                        value={traveler.dateOfBirth.day}
                        onChange={(e) => handleInputChange(index, "dateOfBirth.day", e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                        required
                      >
                        <option value="">Day</option>
                        {[...Array(31)].map((_, i) => (
                          <option key={i} value={(i + 1).toString().padStart(2, "0")}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      <select
                        value={traveler.dateOfBirth.year}
                        onChange={(e) => handleInputChange(index, "dateOfBirth.year", e.target.value)}
                        className="p-2 border border-gray-300 rounded"
                        required
                      >
                        <option value="">Year</option>
                        {[...Array(100)].map((_, i) => {
                          const year = new Date().getFullYear() - i
                          return (
                            <option key={i} value={year.toString()}>
                              {year}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                    {traveler.ageError && <p className="text-red-600 text-sm mt-1">{traveler.ageError}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor={`phone-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id={`phone-${index}`}
                        value={traveler.phone}
                        onChange={(e) => handleInputChange(index, "phone", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                      />
                      {traveler.phoneError && <div className="text-sm text-red-500 mt-1">{traveler.phoneError}</div>}
                    </div>
                    <div>
                      <label htmlFor={`instagram-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Instagram Handle
                      </label>
                      <input
                        type="text"
                        id={`instagram-${index}`}
                        value={traveler.instagramHandle}
                        onChange={(e) => handleInputChange(index, "instagramHandle", e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor={`country-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      id={`country-${index}`}
                      value={traveler.country}
                      onChange={(e) => handleInputChange(index, "country", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    >
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      {/* Add more countries as needed */}
                    </select>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddTraveler}
                className="flex items-center text-amber-500 font-medium mb-6"
              >
                + Add Traveler
              </button>

              <div className="flex items-start mb-8">
                <input
                  type="checkbox"
                  id="keepMeLooped"
                  checked={keepMeLooped}
                  onChange={() => setKeepMeLooped(!keepMeLooped)}
                  className="mt-1 mr-2"
                />
                <label htmlFor="keepMeLooped" className="text-gray-700">
                  Keep me looped in on all things travel
                  <br />
                  <span className="text-sm text-gray-500">Traveler 1 email only</span>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition-colors disabled:bg-red-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                      Processing...
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Price Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Trip Price</h3>

              {/* Price breakdown per traveler */}
              <div className="space-y-2 mb-4">
                {travelers.map((_, index) => (
                  <div key={index} className="flex justify-between">
                    <span>Traveler {index + 1}</span>
                    <span>₹{(trip.price || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center mt-4 mb-2">
                <span className="font-semibold">Due Now</span>
                <div className="flex items-center">
                  <span className="font-semibold">₹{depositAmount.toLocaleString()}</span>
                  <Info className="w-4 h-4 ml-1 text-gray-400" />
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg flex items-start mt-4">
                <div className="text-blue-500 mr-2">
                  <Info className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-blue-700">Fully refundable</p>
                  <p className="text-blue-600">Until trip confirms, then partial refund</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
