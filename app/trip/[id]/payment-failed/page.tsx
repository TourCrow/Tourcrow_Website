"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"
import { supabase } from "@/utils/supabase/client"

// Define the BookingInfo type inline
interface LocalBookingInfo {
  id: string;
  trip_name: string;
  total_price: number;
  contact_email: string;
}

// Define trip data structure for proper type handling
interface TripData {
  name?: string;
  [key: string]: any;
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
  const bookingId = searchParams.get('booking')
  const errorMessage = searchParams.get('error') || 'Your payment was not successful'
  const [bookingInfo, setBookingInfo] = useState<LocalBookingInfo | null>(null)
  const tripId = params.id as string

  useEffect(() => {
    if (bookingId) {
      fetchBookingBasicInfo()
    }
  }, [bookingId])

  const fetchBookingBasicInfo = async () => {
    if (!bookingId) return
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          total_price,
          contact_email,
          trip:trip_id (
            name
          )
        `)
        .eq('id', bookingId)
        .single()

      if (error) {
        console.error('Error fetching booking info:', error)
        return
      }      // Extract trip name with proper type handling
      let tripName = 'your trip';
      
      if (data.trip) {
        const trip = data.trip as TripData | TripData[];
        
        if (Array.isArray(trip) && trip.length > 0) {
          // If it's an array, use the first item's name property
          const firstTrip = trip[0] as TripData;
          if (firstTrip && typeof firstTrip === 'object' && 'name' in firstTrip) {
            tripName = String(firstTrip.name || tripName);
          }
        } else if (typeof trip === 'object' && trip !== null && 'name' in trip) {
          // If it's an object with a name property, use it
          const tripObject = trip as TripData;
          tripName = String(tripObject.name || tripName);
        }
      }

      const bookingInfo: LocalBookingInfo = {
        id: data.id,
        trip_name: tripName,
        total_price: data.total_price,
        contact_email: data.contact_email
      };

      setBookingInfo(bookingInfo)
    } catch (error) {
      console.error('Error:', error)
    }
  }
  const handleRetryPayment = async () => {
    if (!bookingId || !tripId) return
    
    setLoading(true)
    router.push(`/trip/${tripId}/booking?retry=${bookingId}`)
  }

  const handleReturnToTrip = () => {
    router.push(`/trip/${tripId}`)
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
              <RefreshCw className="h-4 w-4" /> Retry Payment
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
