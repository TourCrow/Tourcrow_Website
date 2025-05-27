"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, Download, Mail, Calendar, MapPin, Users, CreditCard } from "lucide-react"
import { supabase } from "@/utils/supabase/client"

interface BookingDetails {
  id: string
  trip_id: string
  total_price: number
  contact_email: string
  contact_number: string
  status: string
  payment_id: string
  payment_date: string
  booking_date: string
  trip: {
    name: string
    location: string
    start_date: string
    end_date: string
    price_per_person: number
  }
  travelers: Array<{
    first_name: string
    last_name: string
    email: string
  }>
}

const BookingConfirmationPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const bookingId = searchParams.get('booking')

  useEffect(() => {
    if (!bookingId) {
      router.push(`/trip/${params.id}`)
      return
    }

    fetchBookingDetails()
  }, [bookingId, params.id])

  const fetchBookingDetails = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          trips (
            name,
            location,
            start_date,
            end_date,
            price_per_person
          ),
          travelers (
            first_name,
            last_name,
            email
          )
        `)
        .eq("id", bookingId)
        .single()

      if (error) throw error
      setBooking(data)
    } catch (error: any) {
      console.error("Error fetching booking:", error)
      router.push(`/trip/${params.id}`)
    } finally {
      setLoading(false)
    }
  }

  const depositAmount = booking ? booking.total_price * 0.25 : 0
  const remainingAmount = booking ? booking.total_price - depositAmount : 0

  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    
    return new Date(dateString).toLocaleString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading confirmation details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <button
            onClick={() => router.push(`/trip/${params.id}`)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Trip
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with success message */}
          <div className="bg-green-50 px-6 py-8 border-b border-green-100 flex items-center">
            <CheckCircle className="h-12 w-12 text-green-500 mr-6" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
              <p className="text-gray-600 mt-1">
                Your payment has been successfully processed and your spot has been reserved.
              </p>
            </div>
          </div>

          {/* Booking details */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between mb-8 gap-6">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="min-w-8">
                      <Calendar className="h-5 w-5 text-red-500 mt-0.5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Trip Dates</p>
                      <p className="font-medium">
                        {formatDate(booking.trip?.start_date)} - {formatDate(booking.trip?.end_date)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="min-w-8">
                      <MapPin className="h-5 w-5 text-red-500 mt-0.5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Destination</p>
                      <p className="font-medium">{booking.trip?.location || "Unknown location"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="min-w-8">
                      <Users className="h-5 w-5 text-red-500 mt-0.5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Travelers</p>
                      <p className="font-medium">{booking.travelers?.length || 0} travelers</p>
                      <div className="text-sm text-gray-600 mt-1">
                        {booking.travelers?.map((traveler, i) => (
                          <p key={i}>{traveler.first_name} {traveler.last_name}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="min-w-8">
                      <CreditCard className="h-5 w-5 text-red-500 mt-0.5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Status</p>
                      <p className="font-medium text-green-600">Paid (Deposit)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="min-w-8">
                      <div className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount Paid</p>
                      <p className="font-medium">₹{depositAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="min-w-8">
                      <div className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Remaining Balance</p>
                      <p className="font-medium">₹{remainingAmount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">Due 30 days before trip</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="min-w-8">
                      <div className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Date</p>
                      <p className="font-medium">{formatDateTime(booking.payment_date || '')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What's Next?</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span>Check your email for a booking confirmation with all details</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span>Our team will reach out soon with more information about your trip</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span>Prepare for your adventure and get ready for an amazing experience!</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Save Receipt
                </button>
                
                <button
                  onClick={() => router.push('/')}
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600"
                >
                  Explore More Trips
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-gray-500 text-sm">
          Booking ID: {booking.id} • Reference: {booking.payment_id?.substring(0, 8) || 'N/A'}
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmationPage
