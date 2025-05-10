# TourCrow API Documentation

## Authentication

All API routes that require authentication should include the Supabase session token in the request headers:

```typescript
const headers = {
  'Authorization': `Bearer ${session.access_token}`,
  'Content-Type': 'application/json'
}
```

## API Endpoints

### Trip Management

#### 1. Get All Trips
```typescript
GET /api/trips

// Query Parameters
interface TripQueryParams {
  destination?: string;
  startDateAfter?: string;
  startDateBefore?: string;
  minPrice?: number;
  maxPrice?: number;
  categories?: string[];
}

// Response
interface TripsResponse {
  data: Trip[];
  error?: string;
}
```

#### 2. Get Trip Details
```typescript
GET /api/trips/${tripId}

// Response
interface TripDetailsResponse {
  data: {
    trip: Trip;
    activities: TripActivity[];
    inclusions: TripInclusion[];
    exclusions: TripExclusion[];
  };
  error?: string;
}
```

#### 3. Create Booking
```typescript
POST /api/bookings

// Request Body
interface BookingRequest {
  tripId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: {
    month: string;
    day: string;
    year: string;
  };
  instagramHandle: string;
  country: string;
}

// Response
interface BookingResponse {
  data: {
    bookingId: string;
    status: 'confirmed' | 'pending';
  };
  error?: string;
}
```

### Contact Form

#### 1. Submit Contact Form
```typescript
POST /api/contact

// Request Body
interface ContactFormRequest {
  name: string;
  email: string;
  message: string;
}

// Response
interface ContactFormResponse {
  success: boolean;
  error?: string;
}
```

### Categories

#### 1. Get All Categories
```typescript
GET /api/categories

// Response
interface CategoriesResponse {
  data: string[];
  error?: string;
}
```

## Error Handling

All API endpoints follow this error format:

```typescript
interface APIError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

Common error codes:
- `auth/unauthorized`: User is not authenticated
- `validation/invalid`: Invalid request parameters
- `db/error`: Database operation error
- `not_found`: Requested resource not found

## Rate Limiting

API endpoints are rate limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Example Usage

### Fetching Trip Details
```typescript
async function fetchTripDetails(tripId: string) {
  try {
    const response = await fetch(`/api/trips/${tripId}`, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch trip details');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trip details:', error);
    throw error;
  }
}
```

### Creating a Booking
```typescript
async function createBooking(bookingData: BookingRequest) {
  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create booking');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}
```

## Webhooks

The API provides webhooks for the following events:

### Booking Status Updates
```typescript
POST /webhooks/booking-status

// Payload
interface BookingWebhookPayload {
  bookingId: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  timestamp: string;
}
```

### Trip Availability Updates
```typescript
POST /webhooks/trip-availability

// Payload
interface TripAvailabilityPayload {
  tripId: string;
  availableSpots: number;
  lastUpdated: string;
}
```

## Data Models

### Trip Model
```typescript
interface Trip {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  price: number;
  group_size_min: number;
  group_size_max: number;
  meals_included: string;
  accommodation: string;
  description: string;
  created_at: string;
}
```

### Booking Model
```typescript
interface Booking {
  id: string;
  trip_id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  booking_date: string;
  payment_status: 'pending' | 'paid';
  amount: number;
  traveler_info: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    instagramHandle: string;
    country: string;
  };
}
```
