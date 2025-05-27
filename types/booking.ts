export interface TravelerInfo {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: {
    month: string;
    day: string;
    year: string;
  };
  phone: string;
  instagramHandle: string;
  country: string;
  ageError?: string;
  phoneError?: string;
}

export interface TripData {
  id: string;
  name?: string;
  destination?: string;
  trip_id?: string;
  price?: number;
  [key: string]: any;
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface BookingInfo {
  id: string;
  trip_name: string;
  total_price: number;
  contact_email: string;
}

export interface RetryBookingData {
  id: string;
  total_price: number;
  contact_email: string;
  contact_number: string;
  trip_id: string;
  travelers: Array<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    gender: string;
    date_of_birth: string;
    instagram_handle: string;
    country: string;
    full_name?: string;
  }>;
}
