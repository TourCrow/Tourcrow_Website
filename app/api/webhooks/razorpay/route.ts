import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Extract the raw body for signature verification
    const rawBody = await request.text()
    const payload = JSON.parse(rawBody)
    
    // Get the Razorpay webhook signature from headers
    const razorpaySignature = request.headers.get('x-razorpay-signature')
    
    if (!razorpaySignature) {
      console.error('Webhook Error: Missing Razorpay signature')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }
    
    // Verify the webhook signature
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!secret) {
      console.error('Webhook Error: Missing webhook secret in environment variables')
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
    }
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex')
    
    if (expectedSignature !== razorpaySignature) {
      console.error('Webhook Error: Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
    
    // At this point, we've verified the webhook is authentic
    console.log('Webhook verified successfully', {
      event: payload.event,
      entity: payload.payload?.payment?.entity?.id
    })
    
    // Handle different event types
    switch (payload.event) {
      case 'payment.authorized':
        return await handlePaymentAuthorized(payload.payload.payment.entity)
      
      case 'payment.failed':
        return await handlePaymentFailed(payload.payload.payment.entity)
      
      case 'refund.processed':
        return await handleRefundProcessed(payload.payload.refund.entity)
      
      default:
        console.log(`No handler for event type: ${payload.event}`)
        return NextResponse.json({ status: 'unhandled_event' }, { status: 200 })
    }
  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function handlePaymentAuthorized(payment: any) {
  try {
    const supabase = createClient()
    
    // Extract receipt ID to get booking ID
    const receipt = payment.notes?.receipt || payment.receipt || ''
    let bookingId = ''
    
    if (receipt.startsWith('bk_')) {
      bookingId = receipt.substring(3) // Remove 'bk_' prefix
    } else {
      // Try to get booking ID from notes
      bookingId = payment.notes?.booking_id || ''
    }
    
    if (!bookingId) {
      console.error('Cannot identify booking from payment', payment)
      return NextResponse.json({ error: 'Booking not identified' }, { status: 400 })
    }
    
    // Update booking status and payment details
    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        payment_id: payment.id,
        payment_order_id: payment.order_id,
        payment_date: new Date().toISOString(),
        payment_method: payment.method,
        payment_amount: payment.amount / 100, // Convert paisa to rupees
      })
      .eq('id', bookingId)
    
    if (error) {
      console.error('Error updating booking status:', error)
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
    }
    
    // Send confirmation email (will implement later)
    // await sendBookingConfirmationEmail(bookingId)
    
    return NextResponse.json({ status: 'payment_processed' }, { status: 200 })
  } catch (error: any) {
    console.error('Error processing authorized payment:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function handlePaymentFailed(payment: any) {
  try {
    const supabase = createClient()
    
    // Extract receipt ID to get booking ID (same as above)
    const receipt = payment.notes?.receipt || payment.receipt || ''
    let bookingId = ''
    
    if (receipt.startsWith('bk_')) {
      bookingId = receipt.substring(3)
    } else {
      bookingId = payment.notes?.booking_id || ''
    }
    
    if (!bookingId) {
      console.error('Cannot identify booking from failed payment', payment)
      return NextResponse.json({ error: 'Booking not identified' }, { status: 400 })
    }
    
    // Update booking to show payment failed
    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'payment_failed',
        payment_error: payment.error_description || 'Payment processing failed',
        payment_id: payment.id,
        payment_order_id: payment.order_id,
      })
      .eq('id', bookingId)
    
    if (error) {
      console.error('Error updating booking for failed payment:', error)
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
    }
    
    return NextResponse.json({ status: 'failure_recorded' }, { status: 200 })
  } catch (error: any) {
    console.error('Error processing failed payment:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function handleRefundProcessed(refund: any) {
  try {
    const supabase = createClient()
    
    // Get payment ID from refund
    const paymentId = refund.payment_id
    
    if (!paymentId) {
      console.error('No payment ID in refund data', refund)
      return NextResponse.json({ error: 'Payment not identified' }, { status: 400 })
    }
    
    // Find the booking with this payment ID
    const { data: bookings, error: fetchError } = await supabase
      .from('bookings')
      .select('id')
      .eq('payment_id', paymentId)
      .limit(1)
    
    if (fetchError || !bookings?.length) {
      console.error('Error finding booking for refund:', fetchError)
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    
    // Update booking to reflect the refund
    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'refunded',
        refund_id: refund.id,
        refund_amount: refund.amount / 100, // Convert paisa to rupees
        refund_date: new Date().toISOString(),
      })
      .eq('id', bookings[0].id)
    
    if (error) {
      console.error('Error updating booking for refund:', error)
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
    }
    
    return NextResponse.json({ status: 'refund_recorded' }, { status: 200 })
  } catch (error: any) {
    console.error('Error processing refund:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
