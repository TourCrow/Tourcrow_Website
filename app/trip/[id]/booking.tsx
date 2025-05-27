"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Info, Loader2, CreditCard } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import type { Trip } from "@/types/trips"
import { useAuth } from "@/contexts/AuthContext" 
import type { TravelerInfo, TripData, RazorpayResponse, RazorpayOptions, RetryBookingData, BookingInfo } from "@/types/booking"

declare global {
  interface Window {
    Razorpay: any;
  }
}

type BookingFormProps = {
  trip: Trip
  onBack: () => void
}

export default function BookingForm({ trip, onBack }: BookingFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { user, loading } = useAuth() // Get auth state
  
  // Check if this is a payment retry
  const retryBookingId = searchParams.get('retry')
  const [isRetryPayment, setIsRetryPayment] = useState(false)
  const [retryBookingData, setRetryBookingData] = useState<RetryBookingData | null>(null)
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Login Required",
        description: "You need to be logged in to book a trip.",
        variant: "destructive",
      })
      router.push('/login')
    }
  }, [user, loading, router, toast])
  
  // Check for retry booking
  useEffect(() => {
    if (retryBookingId) {
      fetchRetryBookingData()
    }
  }, [retryBookingId])
  
  // Function to fetch booking data for a retry payment
  const fetchRetryBookingData = async () => {
    if (!retryBookingId) return
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          total_price,
          contact_email,
          contact_number,
          trip_id,
          travelers (
            first_name,
            last_name,
            email,
            phone,
            gender,
            date_of_birth,
            instagram_handle,
            country
          )
        `)
        .eq('id', retryBookingId)
        .eq('user_id', user?.id)
        .single()
      
      if (error || !data) {
        console.error('Error fetching booking for retry:', error)
        toast({
          title: "Error",
          description: "Could not load your booking details for retry payment.",
          variant: "destructive"
        })
        return
      }
      
      setRetryBookingData(data)
      setIsRetryPayment(true)
      
      toast({
        title: "Payment Retry",
        description: "Your previous booking details have been loaded. Please proceed to payment.",
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }
  
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

  // Calculate deposit amount (25% of total)
  const depositAmount = Math.round(totalPrice * 0.25)

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const createRazorpayOrder = async (bookingId: string) => {
    try {
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: depositAmount,
          currency: 'INR',
          bookingId: bookingId,
          tripId: trip.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating Razorpay order:', errorData);
        throw new Error(errorData.error || 'Failed to create payment order');
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error creating Razorpay order:', error);
      // Show a user-friendly toast message
      toast({
        title: "Payment Setup Failed",
        description: "There was an issue setting up your payment. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  }

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

  // Using type definitions from types/booking.ts
  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault()
    
    if (!validateForm()) {
      return
    }
  
    setIsSubmitting(true)
    
    try {
      // Handle retry payment flow separately
      if (isRetryPayment && retryBookingData) {
        await handleRetryPayment();
        return;
      }
      
      // Handle new booking flow
      await handleNewBooking();
      
    } catch (error: any) {
      console.error("Error creating booking:", error)
      console.error("Error stack:", error.stack)
      console.error("Error details:", JSON.stringify(error, null, 2))
      
      let errorMessage = "There was a problem creating your booking. Please try again."
      
      if (error.message) {
        errorMessage = error.message
      } else if (error.details) {
        errorMessage = error.details
      } else if (error.hint) {
        errorMessage = error.hint
      }
      
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: errorMessage,
      })
      setIsSubmitting(false)
    }
    // Note: Don't automatically set isSubmitting to false in finally block 
    // since payment might still be in progress
  }

  // Separate function for retry payment flow
  const handleRetryPayment = async (): Promise<void> => {
    if (!retryBookingData) return;

    console.log("Retrying payment for existing booking:", retryBookingData.id);
    
    // @ts-ignore - TypeScript incorrectly reports 'any' type issue
    const retryBookingId: string = retryBookingData.id;
    // @ts-ignore - TypeScript incorrectly reports 'any' type issue
    const retryTripId: string = retryBookingData.trip_id;
    
    // Get trip data for the existing booking
    const { data: existingTripData, error: tripFetchError } = await supabase
      .from("trips")
      .select(`
        *,
        trip_influencers!inner(*)
      `)
      .eq("id", retryBookingData.trip_id)
      .single();
    
    if (tripFetchError || !existingTripData) {
      throw new Error("Could not verify trip details for retry payment.")
    }
    
    // @ts-ignore - TypeScript incorrectly reports 'any' type issue
    const retryTripData: TripData = existingTripData as TripData;
    
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      throw new Error('Failed to load payment gateway. Please try again.')
    }
    
    const orderData = await createRazorpayOrder(retryBookingId)
    
    // Calculate deposit amount for retry payment
    const retryDepositAmount: number = Math.round(retryBookingData.total_price * 0.25);
    
    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Tourcrow',
      description: `Deposit for ${retryTripData.name || trip.destination}`,
      order_id: orderData.id,
      handler: (response: RazorpayResponse) => {
        handlePaymentVerification(response, retryBookingId, retryTripId, retryDepositAmount);
      },
      prefill: {
        name: retryBookingData.travelers[0]?.full_name || '',
        email: retryBookingData.contact_email,
        contact: retryBookingData.contact_number,
      },
      theme: {
        color: '#ef4444',
      },
      modal: {
        ondismiss: () => {
          handlePaymentCancel(retryBookingId, retryTripId);
        }
      }
    }
    
    initializeRazorpay(options);
  }

  // Separate function for new booking flow
  const handleNewBooking = async (): Promise<void> => {
    // @ts-ignore - TypeScript incorrectly reports 'any' type issue
    const newTripId: string = trip.trip_id || trip.id;
    console.log("Using trip ID for new booking:", newTripId)
    
    const { data: newTripData, error: tripFetchError } = await supabase
      .from("trips")
      .select(`
        *,
        trip_influencers!inner(*)
      `)
      .eq("id", newTripId)
      .single()

    if (tripFetchError || !newTripData) {
      throw new Error("Could not verify trip details. The trip may no longer be available.")
    }
    
    // @ts-ignore - TypeScript incorrectly reports 'any' type issue
    const newBookingTripData: TripData = newTripData as TripData;
    
    // Create the booking with the verified trip_id (only for new bookings)
    console.log("Creating booking with:", {
      trip_id: newBookingTripData.id,
      total_price: totalPrice,
      contact_email: travelers[0].email,
      contact_number: travelers[0].phone,
    })

    const { data: bookingData, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        trip_id: newBookingTripData.id,
        user_id: user?.id, // Use authenticated user ID
        total_price: totalPrice,
        booking_date: new Date().toISOString(),
        status: "pending",
        contact_email: travelers[0].email,
        contact_number: travelers[0].phone,
      })
      .select()

    console.log("Booking creation result:", { bookingData, bookingError })

    if (bookingError) {
      console.error("Booking error details:", bookingError)
      throw new Error(`Booking creation failed: ${bookingError.message || 'Unknown error'}`)
    }
    
    if (!bookingData || bookingData.length === 0) {
      throw new Error("No booking data returned from database")
    }

    // Get the booking ID from the response
    const newBookingId: string = bookingData[0].id;
    
    // Create traveler records
    const travelerPromises = travelers.map(async (traveler, index) => {
      // Format date of birth
      const dob = `${traveler.dateOfBirth.year}-${String(traveler.dateOfBirth.month).padStart(2, '0')}-${String(traveler.dateOfBirth.day).padStart(2, '0')}`

      const { error: travelerError } = await supabase.from("travelers").insert({
        booking_id: newBookingId,
        first_name: traveler.firstName,
        last_name: traveler.lastName,
        full_name: `${traveler.firstName} ${traveler.lastName}`, // Add full_name field
        email: traveler.email,
        gender: traveler.gender,
        date_of_birth: dob,
        phone: traveler.phone,
        instagram_handle: traveler.instagramHandle || null,
        country: traveler.country,
        is_subscribed: traveler.email === travelers[0].email ? keepMeLooped : false,
      })

      if (travelerError) {
        console.error(`Error creating traveler ${index + 1}:`, travelerError)
        throw new Error(`Failed to create traveler ${index + 1}: ${travelerError.message || 'Unknown error'}`)
      }
    })

    // Wait for all traveler records to be created
    await Promise.all(travelerPromises)
    
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      throw new Error('Failed to load payment gateway. Please try again.')
    }
    
    // Create Razorpay order for the NEW booking
    const orderData = await createRazorpayOrder(newBookingId)

    // Initialize Razorpay payment
    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Tourcrow',
      description: `Deposit for ${newBookingTripData.name || trip.destination}`,
      order_id: orderData.id,
      handler: (response: RazorpayResponse) => {
        handlePaymentVerification(response, newBookingId, newTripId);
      },
      prefill: {
        name: `${travelers[0].firstName} ${travelers[0].lastName}`,
        email: travelers[0].email,
        contact: travelers[0].phone,
      },
      theme: {
        color: '#ef4444',
      },
      modal: {
        ondismiss: () => {
          handlePaymentCancel(newBookingId, newTripId);
        }
      }
    }

    initializeRazorpay(options);

    // Don't set isSubmitting to false here as payment is still in progress
  }

  // Helper functions to handle Razorpay integration
  const handlePaymentVerification = async (
    response: RazorpayResponse,
    paymentBookingId: string,
    paymentTripId: string,
    depositAmount?: number
  ): Promise<void> => {
    try {
      // Verify payment
      const verifyResponse = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          bookingId: paymentBookingId,
        }),
      })

      if (verifyResponse.ok) {
        // Update booking status to confirmed
        const updateData: Record<string, any> = { 
          status: 'confirmed',
          payment_id: response.razorpay_payment_id,
          payment_order_id: response.razorpay_order_id,
          payment_signature: response.razorpay_signature
        };
        
        // Add payment date and amount for retry payments
        if (depositAmount) {
          updateData.payment_date = new Date().toISOString();
          updateData.payment_amount = depositAmount;
        }
        
        await supabase
          .from('bookings')
          .update(updateData)
          .eq('id', paymentBookingId)

        toast({
          title: "Payment Successful!",
          description: "Your booking has been confirmed. You'll receive a confirmation email shortly.",
        })
        
        // Show a loading state while we redirect
        setIsSubmitting(true)

        // Redirect to success page with a small delay to ensure UI updates
        setTimeout(() => {
          router.push(`/trip/${paymentTripId}/booking-confirmation?booking=${paymentBookingId}`)
        }, 1000)
      } else {
        throw new Error('Payment verification failed')
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      toast({
        variant: "destructive",
        title: "Payment Verification Failed",
        description: "Please contact support with your payment details.",
      })
      
      // Redirect to payment failed page
      router.push(`/trip/${paymentTripId}/payment-failed?booking=${paymentBookingId}&error=Payment verification failed`)
    }
  }

  const handlePaymentCancel = (cancelBookingId: string, cancelTripId: string): void => {
    setIsSubmitting(false)
    toast({
      variant: "destructive",
      title: "Payment Cancelled",
      description: "Your booking has been saved but payment was not completed.",
    })
    
    // Redirect to payment failed page with cancelled reason
    router.push(`/trip/${cancelTripId}/payment-failed?booking=${cancelBookingId}&error=Payment was cancelled`)
  }

  const initializeRazorpay = (
    options: RazorpayOptions
  ): void => {
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

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
                          const year = new Date().getFullYear() - i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    {traveler.ageError && (
                      <p className="text-red-500 text-sm mt-1">{traveler.ageError}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor={`phone-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id={`phone-${index}`}
                      value={traveler.phone}
                      onChange={(e) => handleInputChange(index, "phone", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    />
                    {traveler.phoneError && (
                      <p className="text-red-500 text-sm mt-1">{traveler.phoneError}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor={`instagramHandle-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Instagram Handle
                    </label>
                    <input
                      type="text"
                      id={`instagramHandle-${index}`}
                      value={traveler.instagramHandle}
                      onChange={(e) => handleInputChange(index, "instagramHandle", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
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
                      <option value="USA">USA</option>
                      <option value="Canada">Canada</option>
                      <option value="UK">UK</option>
                      <option value="Australia">Australia</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              ))}

              {/* Payment Disclaimer */}
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                <p className="text-sm">
                  <Info className="inline-block w-5 h-5 mr-1" />
                  You will be redirected to a secure payment gateway to complete your booking. Your payment information is not stored on our servers.
                </p>
              </div>

              {/* Total Price Display */}
              <div className="mb-6">
                <span className="text-lg font-semibold text-gray-900">
                  Total Price: ₹{totalPrice}
                </span>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <button
                  type="button"
                  onClick={handleAddTraveler}
                  className="inline-flex items-center justify-center px-4 py-2 mb-4 sm:mb-0 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Another Traveler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>
              </div>

              {/* Note about payment retries */}
              {isRetryPayment && (
                <div className="p-4 mb-6 text-sm text-gray-700 bg-gray-100 border-l-4 border-gray-400">
                  <p>
                    You are currently in retry mode for this booking. If the payment is successful, your booking will be confirmed.
                  </p>
                </div>
              )}
            </form>
          </div>

          {/* Trip Details Sidebar */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Trip Details</h2>
              <div className="flex flex-col space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Destination:</span>
                  <span className="block text-lg font-semibold text-gray-900">{trip.destination}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Dates:</span>
                  <span className="block text-lg font-semibold text-gray-900">
                    {trip.start_date && trip.end_date
                      ? `${new Date(trip.start_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })} - ${new Date(trip.end_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}`
                      : "Flexible Dates"}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Duration:</span>
                  <span className="block text-lg font-semibold text-gray-900">
                    {trip.duration} {trip.duration === 1 ? "night" : "nights"}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Price:</span>
                  <span className="block text-lg font-semibold text-gray-900">
                    ₹{trip.price} {trip.price === 1 ? "per person" : "per person"}
                  </span>
                </div>
              </div>
            </div>

            {/* Influencer Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Influencer Details</h2>
              <div className="flex items-center">
                <img
                  src={trip.influencer_avatar}
                  alt={trip.influcencer_name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-900">{trip.influcencer_name}</p>
                  <p className="text-sm text-gray-700">{trip.influencer_bio}</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
              <div className="flex flex-col space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Total Price:</span>
                  <span className="block text-lg font-semibold text-gray-900">₹{totalPrice}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Deposit (25%):</span>
                  <span className="block text-lg font-semibold text-gray-900">₹{depositAmount}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Payment Method:</span>
                  <span className="block text-lg font-semibold text-gray-900">Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
