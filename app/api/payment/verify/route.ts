import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import supabase from '@/utils/supabase/server'
import { sendBookingConfirmationEmail } from '@/utils/email-service'

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = await request.json()

    console.log('Payment verification request:', {
      razorpay_order_id,
      razorpay_payment_id,
      bookingId,
      hasSignature: !!razorpay_signature
    })
    
    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
      console.error('Missing required fields for payment verification')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Verify the payment signature
    const key_secret = process.env.RAZORPAY_KEY_SECRET!
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body.toString())
      .digest('hex')

    console.log('Signature verification:', {
      expectedSignature: expectedSignature.substring(0, 10) + '...',
      receivedSignature: razorpay_signature.substring(0, 10) + '...',
      isValid: expectedSignature === razorpay_signature
    })

    if (expectedSignature !== razorpay_signature) {
      console.error('Payment signature verification failed')
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }
    
    // Update the booking with payment details
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        payment_id: razorpay_payment_id,
        payment_order_id: razorpay_order_id,
        payment_signature: razorpay_signature,
        payment_date: new Date().toISOString(),
      })
      .eq('id', bookingId)

    if (updateError) {
      console.error('Error updating booking:', updateError)
      return NextResponse.json(
        { error: 'Failed to update booking status' },
        { status: 500 }
      )
    }
    
    // Send confirmation email to customer
    try {
      await sendBookingConfirmationEmail(bookingId)
    } catch (emailError) {
      // Log the error but don't fail the payment verification
      console.error('Failed to send confirmation email:', emailError)
    }

    // Log successful payment
    console.log(`Payment verified successfully for booking: ${bookingId}`)

    return NextResponse.json({ 
      success: true, 
      message: 'Payment verified successfully' 
    })
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}
