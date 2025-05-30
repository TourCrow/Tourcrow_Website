import supabase from '@/utils/supabase/server'

interface EmailData {
  to: string
  subject: string
  html: string
}

/**
 * Send email using Supabase Edge Functions
 * This leverages a custom email function deployed to Supabase Edge Functions
 */
export async function sendEmail(emailData: EmailData) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify(emailData),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Email sending failed: ${errorText}`)
    }

    return true
  } catch (error) {
    console.error('Email sending error:', error)
    return false
  }
}

/**
 * Send booking confirmation email to customer
 */
export async function sendBookingConfirmationEmail(bookingId: string) {
  try {
    
    // Get booking details with traveler and trip information
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        travelers (
          first_name,
          last_name,
          email
        ),
        trip:trips (
          name,
          location,
          start_date,
          end_date,
          price,
          image_url
        )
      `)
      .eq('id', bookingId)
      .single()
    
    if (error || !booking) {
      console.error('Error fetching booking details for email:', error)
      return false
    }
    
    const primaryTraveler = booking.travelers[0]
    const depositAmount = Math.round(booking.total_price * 0.25)
    const remainingAmount = booking.total_price - depositAmount
    
    // Format dates
    const startDate = new Date(booking.trip.start_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    const endDate = new Date(booking.trip.end_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    // Generate HTML email content
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #ef4444; color: white; padding: 20px; text-align: center;">
          <h1>Your Booking is Confirmed!</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9fafb;">
          <p>Dear ${primaryTraveler.first_name},</p>
          
          <p>We're excited to confirm your booking for <strong>${booking.trip.name}</strong>. 
          Your deposit payment has been successfully processed.</p>
          
          <h2>Booking Details</h2>
          <div style="background-color: white; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Trip:</strong> ${booking.trip.name}</p>
            <p><strong>Location:</strong> ${booking.trip.location}</p>
            <p><strong>Dates:</strong> ${startDate} to ${endDate}</p>
            <p><strong>Travelers:</strong> ${booking.travelers.length}</p>
          </div>
          
          <h2>Payment Summary</h2>
          <div style="background-color: white; border-radius: 8px; padding: 15px;">
            <p><strong>Total Trip Cost:</strong> ₹${booking.total_price.toLocaleString()}</p>
            <p><strong>Deposit Paid:</strong> ₹${depositAmount.toLocaleString()}</p>
            <p><strong>Remaining Balance:</strong> ₹${remainingAmount.toLocaleString()}</p>
            <p style="font-size: 14px;">The remaining balance will be due 30 days before the trip start date.</p>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_WEBSITE_URL}/trip/${booking.trip_id}/booking-confirmation?booking=${booking.id}" 
              style="background-color: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Booking Details
            </a>
          </div>
          
          <p style="margin-top: 30px;">
            If you have any questions about your booking, please don't hesitate to contact us.
          </p>
          
          <p>
            Thank you for choosing Tourcrow!<br>
            The Tourcrow Team
          </p>
        </div>
        
        <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
          <p>&copy; ${new Date().getFullYear()} Tourcrow. All rights reserved.</p>
          <p>
            <a href="${process.env.NEXT_PUBLIC_WEBSITE_URL}/contact" style="color: #64748b; text-decoration: underline;">Contact Us</a> |
            <a href="${process.env.NEXT_PUBLIC_WEBSITE_URL}/privacy-policy" style="color: #64748b; text-decoration: underline;">Privacy Policy</a> |
            <a href="${process.env.NEXT_PUBLIC_WEBSITE_URL}/cancellation-refund-policy" style="color: #64748b; text-decoration: underline;">Cancellation Policy</a>
          </p>
        </div>
      </div>
    `
    
    // Send the email to the primary traveler
    await sendEmail({
      to: primaryTraveler.email,
      subject: `Booking Confirmed: ${booking.trip.name}`,
      html
    })
    
    // Update booking to track that confirmation email was sent
    await supabase
      .from('bookings')
      .update({
        confirmation_email_sent: true,
        confirmation_email_date: new Date().toISOString()
      })
      .eq('id', bookingId)
    
    return true
  } catch (error) {
    console.error('Error sending booking confirmation email:', error)
    return false
  }
}
