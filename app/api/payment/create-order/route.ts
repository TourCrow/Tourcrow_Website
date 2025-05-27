import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, bookingId, tripId } = await request.json()

    // Validate required fields
    if (!amount || !currency || !bookingId || !tripId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }    // Create Razorpay order
    // Ensure receipt length is less than 40 characters (Razorpay requirement)
    // Truncate bookingId if needed to fit within limit
    const receiptId = bookingId.length > 30 ? bookingId.substring(0, 30) : bookingId;
    
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Razorpay expects amount in paisa
      currency: currency,
      receipt: `bk_${receiptId}`, // Shortened prefix to ensure total length < 40
      notes: {
        booking_id: bookingId,
        trip_id: tripId,
      },
    })

    return NextResponse.json(order)  } catch (error: any) {
    console.error('Error creating Razorpay order:', error)
    
    // Provide more detailed error information
    return NextResponse.json(
      { 
        error: 'Failed to create payment order',
        details: error.error || error.message || 'Unknown error'
      },
      { status: error.statusCode || 500 }
    )
  }
}
