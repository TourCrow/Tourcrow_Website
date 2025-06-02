"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"
import { supabase } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { PostgrestError } from '@supabase/supabase-js'

// Define types for the trip influencer data
interface TripInfluencer {
  id: string;
  title?: string;
  destination?: string;
  name?: string;
}

// Define the trip data structure
interface TripDataResponse {
  id: string;
  destination: string;
}

// Define the booking data structure
interface BookingDataResponse {
  id: string;
  total_price: number;
  contact_email: string;
  status?: string;
  trip_id?: string;
  trips?: TripDataResponse;
  payment_id?: string;
  payment_date?: string;
}

// Define the BookingInfo type with all possible fields
interface LocalBookingInfo {
  id: string;
  trip_name: string;
  total_price: number;
  contact_email: string;
  status?: string;
  payment_id?: string;
  payment_date?: string;
}

// Define UI components inline to avoid import issues
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: string;
  disabled?: boolean;
}

const Button = ({ children, onClick, className = "", variant = "default", disabled = false }: ButtonProps) => {
  const getButtonClasses = () => {
    const baseClasses = "inline-flex items-center justify-center px-4 py-2 rounded font-medium focus:outline-none transition-colors";
    if (variant === "destructive") {
      return `${baseClasses} bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 ${className}`;
    }
    if (variant === "outline") {
      return `${baseClasses} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 ${className}`;
    }
    return `${baseClasses} bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 ${className}`;
  };
  
  return (
    <button className={getButtonClasses()} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

const Card = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`rounded-lg border bg-white text-gray-900 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <p className={`text-sm text-gray-500 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>
    {children}
  </div>
);

export default function PaymentFailedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const bookingId = searchParams.get('booking')
  const errorMessage = searchParams.get('error') || 'Your payment was not successful'
  const [bookingInfo, setBookingInfo] = useState<LocalBookingInfo | null>(null)
  const tripId = params.id as string

  useEffect(() => {
    if (!bookingId) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "No booking ID was provided. Please start a new booking.",
      })
      router.push(`/trip/${tripId}`)
      return
    }
    
    fetchBookingBasicInfo()
  }, [bookingId, tripId])
  const handleDatabaseError = (error: PostgrestError | Error | unknown): string => {
    // First log the complete error object for debugging
    console.error('Raw error object:', JSON.stringify(error, null, 2));

    // Handle standard Error objects
    if (error instanceof Error) {
      const errorDetails = {
        name: error.name,
        message: error.message || 'No error message available',
        stack: error.stack
      };
      console.error('Standard Error:', errorDetails);
      
      const description = error.message || "An unexpected error occurred while fetching booking information";
      toast({
        variant: "destructive",
        title: "Error",
        description
      });
      return description;
    } 
    
    // Handle Supabase PostgrestError objects
    if (typeof error === 'object' && error !== null) {
      const pgError = error as PostgrestError;
      if (pgError.message || pgError.code || pgError.details) {
        const errorDetails = {
          message: pgError.message || 'No message available',
          code: pgError.code || 'No code available',
          details: pgError.details || 'No details available'
        };
        console.error('Database Error:', errorDetails);
        
        const description = [
          pgError.message,
          pgError.details,
          `Code: ${pgError.code}`
        ].filter(Boolean).join(' - ') || "A database error occurred";
        
        toast({
          variant: "destructive",
          title: "Database Error",
          description
        });
        return description;
      }
    }
    
    // Handle completely empty error objects or undefined/null errors
    const fallbackMessage = "An unexpected error occurred while fetching booking information";
    console.error('Unknown or Empty Error:', {
      errorType: typeof error,
      errorValue: error,
      errorJSON: JSON.stringify(error)
    });
    
    toast({
      variant: "destructive",
      title: "Error",
      description: fallbackMessage,
    });
    return fallbackMessage;
  }

  const fetchBookingBasicInfo = async () => {
    if (!bookingId) return;
    
    setLoading(true)
    try {
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          id,
          total_price,
          contact_email,
          status,
          trip_id,
          payment_id,
          payment_date,
          trips:trip_id (
            id,
            destination
          )
        `)
        .eq('id', bookingId)
        .single()

      if (bookingError) {
        handleDatabaseError(bookingError);
        return;
      }

      if (!bookingData) {
        const message = `No booking found with ID: ${bookingId}`;
        toast({
          variant: "destructive",
          title: "Booking Not Found",
          description: message,
        });
        return;
      }

      const typedBookingData = bookingData as unknown as BookingDataResponse;
      let tripName = 'your trip';

      // Use destination as trip name, since that's what we have in the trips table
      if (typedBookingData.trips) {
        tripName = typedBookingData.trips.destination || tripName;
      }

      const bookingInfo: LocalBookingInfo = {
        id: typedBookingData.id,
        trip_name: tripName,
        total_price: typedBookingData.total_price,
        contact_email: typedBookingData.contact_email,
        status: typedBookingData.status,
        payment_id: typedBookingData.payment_id,
        payment_date: typedBookingData.payment_date
      };

      setBookingInfo(bookingInfo);

      // Show additional info if there's a payment ID
      if (typedBookingData.payment_id) {
        toast({
          variant: "destructive",
          title: "Previous Payment Details",
          description: `Payment ID: ${typedBookingData.payment_id}`,
        });
      }
    } catch (error) {
      handleDatabaseError(error);
    } finally {
      setLoading(false)
    }
  }

  const handleRetryPayment = async () => {
    if (!bookingId || !tripId) return
    
    setLoading(true)
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'pending' })
        .eq('id', bookingId)

      if (error) {
        throw error;
      }

      router.push(`/trip/${tripId}/booking?retry=${bookingId}`)
    } catch (error) {
      handleDatabaseError(error);
      setLoading(false);
    }
  }

  const handleReturnToTrip = () => {
    router.push(`/trip/${tripId}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-red-50">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-center">Payment Failed</CardTitle>
            <CardDescription className="text-center text-red-500">
              {errorMessage}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-4">
            <p className="text-gray-700">
              We're sorry, but your payment could not be processed successfully. This could be due to:
            </p>
            
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Insufficient funds in your account</li>
              <li>Payment was declined by your bank</li>
              <li>Connection issues during the payment process</li>
              <li>Technical issues with the payment gateway</li>
            </ul>
            
            {bookingInfo && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Booking Details</h3>
                <p>Trip: {bookingInfo.trip_name}</p>
                <p>Amount: ₹{bookingInfo.total_price.toLocaleString()}</p>
                <p>Contact Email: {bookingInfo.contact_email}</p>
                {bookingInfo.payment_id && (
                  <p className="text-red-500 text-sm mt-2">Error details: {bookingInfo.payment_id}</p>
                )}
                <p className="text-sm mt-2">Your booking information has been saved. You can retry payment or contact support.</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
              onClick={handleReturnToTrip}
            >
              <ArrowLeft className="h-4 w-4" /> Return to Trip
            </Button>
            
            <Button 
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
              onClick={handleRetryPayment}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Processing...' : 'Retry Payment'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
