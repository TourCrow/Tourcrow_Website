// Quick verification script - run AFTER applying the database fix
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function quickVerification() {
  console.log('🔍 Quick Database Verification');
  console.log('==============================\n');
  
  try {
    // Test 1: Check if trip 16 exists
    console.log('1. Checking Trip ID 16...');
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id, destination, title')
      .eq('id', 16)
      .single();
    
    if (tripError || !trip) {
      console.log('❌ Trip 16 not found');
      return;
    }
    console.log(`✅ Trip found: ${trip.id} - ${trip.destination || trip.title}`);
    
    // Test 2: Test booking insert with integer trip_id
    console.log('\n2. Testing booking creation...');
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        trip_id: 16,  // Integer, not UUID
        total_price: 100,
        contact_email: 'test@example.com',
        status: 'pending'
      })
      .select()
      .single();
    
    if (bookingError) {
      console.log('❌ Booking creation failed:', bookingError.message);
      if (bookingError.message.includes('uuid')) {
        console.log('💡 You still need to apply the database fix!');
        console.log('   Run the SQL commands in COMPLETE-FIX-GUIDE.md');
      }
      return;
    }
    
    console.log('✅ Booking created successfully!');
    console.log(`   Booking ID: ${booking.id}`);
    
    // Clean up
    await supabase.from('bookings').delete().eq('id', booking.id);
    console.log('✅ Test booking cleaned up');
    
    console.log('\n🎉 DATABASE FIX SUCCESSFUL!');
    console.log('   You can now test the booking flow at http://localhost:3000/trip/16');
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

quickVerification();
