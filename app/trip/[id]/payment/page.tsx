"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, CreditCard, Shield, Clock, CheckCircle } from "lucide-react"
import { supabase } from "@/utils/supabase/client"
import { useToast } from "@/components/ui/use-toast"

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface BookingDetails {
  id: string
  trip_id: string
  total_price: number
  contact_email: string
  contact_number: string
  status: string
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
  }>
}

export default function PaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const bookingId = searchParams.get('booking')

  // Calculate deposit amount (25% of total)
  const depositAmount = booking ? booking.total_price * 0.25 : 0

  useEffect(() => {
    if (!bookingId) {
      toast({
        variant: "destructive",
        title: "Invalid Booking",
        description: "No booking ID found. Please start the booking process again.",
      })
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
            last_name
          )
        `)
        .eq("id", bookingId)
        .single()

      if (error) throw error

      setBooking(data)
    } catch (error: any) {
      console.error("Error fetching booking:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load booking details. Please try again.",
      })
      router.push(`/trip/${params.id}`)
    } finally {
      setLoading(false)
    }
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const createRazorpayOrder = async () => {
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
          tripId: params.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment order')
      }

      return await response.json()
    } catch (error) {
      console.error('Error creating Razorpay order:', error)
      throw error
    }
  }

  const handlePayment = async () => {
    try {
      setProcessing(true)

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script')
      }

      // Create order
      const orderData = await createRazorpayOrder()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your Razorpay key_id
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Tourcrow',
        description: `Deposit for ${booking?.trip.name}`,
        order_id: orderData.id,
        handler: async function (response: any) {
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
                bookingId: bookingId,
              }),
            })

            if (verifyResponse.ok) {
              // Update booking status to confirmed
              await supabase
                .from('bookings')
                .update({ 
                  status: 'confirmed',
                  payment_id: response.razorpay_payment_id 
                })
                .eq('id', bookingId)

              toast({
                title: "Payment Successful!",
                description: "Your booking has been confirmed. You'll receive a confirmation email shortly.",
              })

              // Redirect to success page
              router.push(`/trip/${params.id}/booking-confirmation?booking=${bookingId}`)
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
          }
        },
        prefill: {
          name: booking?.travelers[0] ? `${booking.travelers[0].first_name} ${booking.travelers[0].last_name}` : '',
          email: booking?.contact_email || '',
          contact: booking?.contact_number || '',
        },
        notes: {
          booking_id: bookingId,
          trip_id: params.id,
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function() {
            setProcessing(false)
          }
        }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (error: any) {
      console.error('Payment error:', error)
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message || "Failed to initiate payment. Please try again.",
      })
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">Could not find your booking details.</p>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Booking
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
          <p className="text-gray-600 mt-2">Secure your spot with a 25% deposit</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
              
              {/* Security Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-800">Secure Payment</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-800">Multiple Payment Options</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-800">Instant Confirmation</span>
                </div>
              </div>

              {/* Deposit Information */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Deposit Payment</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Pay 25% now to secure your booking. The remaining amount will be collected closer to the trip date.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Deposit Amount (25%)</span>
                  <span className="text-xl font-bold text-gray-900">₹{depositAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay ₹{depositAmount.toLocaleString()} Now
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By clicking "Pay Now", you agree to our terms and conditions and privacy policy.
              </p>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div>
                  <h4 className="font-medium text-gray-900">{booking.trip.name}</h4>
                  <p className="text-sm text-gray-600">{booking.trip.location}</p>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {new Date(booking.trip.start_date).toLocaleDateString()} - {new Date(booking.trip.end_date).toLocaleDateString()}
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Travelers</span>
                    <span className="text-gray-900">{booking.travelers.length}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Price per person</span>
                    <span className="text-gray-900">₹{booking.trip.price_per_person.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Total amount</span>
                    <span className="text-gray-900">₹{booking.total_price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Deposit due now</span>
                    <span className="font-bold text-gray-900">₹{depositAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Remaining amount</span>
                    <span className="text-gray-900">₹{(booking.total_price - depositAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                <p className="mb-2">• Secure payment powered by Razorpay</p>
                <p className="mb-2">• Instant booking confirmation</p>
                <p>• 24/7 customer support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
