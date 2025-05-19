/**
 * Database Schema and Query Diagnostic Tool
 * 
 * This script helps diagnose and fix issues with the TourCrow database schema
 * and queries. Run it to get detailed information about the database structure
 * and relationships.
 */

const { createClient } = require('@supabase/supabase-js');

// Create Supabase client (use environment variables or hardcoded values for testing)
// You'll need to replace these with your actual Supabase URL and key when running the script
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qcxhitelibenzdgbefkh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjeGhpdGVsaWJlbnpkZ2JlZmtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2NjgyOTYsImV4cCI6MjAzMTI0NDI5Nn0.t_NWqcUNEQTKoYQACnCC-tpWq9uoavXEWZArvHHcFrs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseDatabase() {
  console.log('🔍 TourCrow Database Schema Diagnostic Tool');
  console.log('-------------------------------------------');

  try {
    // 1. Check Tables Existence
    console.log('\n📋 Checking Tables:');
    const tables = ['trips', 'trip_influencers', 'trip_images', 'trip_activities', 
                    'trip_inclusions', 'trip_exclusions'];
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`  ❌ ${table}: Error - ${error.message}`);
      } else {
        console.log(`  ✅ ${table}: Found (${count} records)`);
      }
    }

    // 2. Check Foreign Key Relationships
    console.log('\n🔗 Checking Relationships:');
    
    // Check trip_id reference in trip_influencers
    const { data: tripInfluencerData, error: tripInfluencerError } = await supabase
      .from('trip_influencers')
      .select(`
        id,
        trip_id,
        trips:trip_id (id)
      `)
      .limit(5);

    if (tripInfluencerError) {
      console.log(`  ❌ trip_influencers -> trips: Error - ${tripInfluencerError.message}`);
    } else {
      const validRelations = tripInfluencerData.filter(item => item.trips?.id);
      const invalidRelations = tripInfluencerData.filter(item => !item.trips?.id && item.trip_id);
      
      console.log(`  trip_influencers -> trips: ${validRelations.length}/${tripInfluencerData.length} valid`);
      if (invalidRelations.length > 0) {
        console.log(`    ⚠️ Found ${invalidRelations.length} trip_influencers with invalid trip_id references`);
        console.log('    Example invalid trip_ids:', invalidRelations.map(item => item.trip_id));
      }
    }

    // Check trip_id reference in trip_images
    const { data: tripImagesData, error: tripImagesError } = await supabase
      .from('trip_images')
      .select(`
        id,
        trip_id,
        trips:trip_id (id)
      `)
      .limit(5);

    if (tripImagesError) {
      console.log(`  ❌ trip_images -> trips: Error - ${tripImagesError.message}`);
    } else {
      const validRelations = tripImagesData.filter(item => item.trips?.id);
      const invalidRelations = tripImagesData.filter(item => !item.trips?.id && item.trip_id);
      
      console.log(`  trip_images -> trips: ${validRelations.length}/${tripImagesData.length} valid`);
      if (invalidRelations.length > 0) {
        console.log(`    ⚠️ Found ${invalidRelations.length} trip_images with invalid trip_id references`);
        console.log('    Example invalid trip_ids:', invalidRelations.map(item => item.trip_id));
      }
    }

    // 3. Query Test
    console.log('\n🧪 Testing Queries:');
    
    // Test simple query
    console.log('  Testing simple trip_influencers query...');
    const { data: simpleQueryData, error: simpleQueryError } = await supabase
      .from('trip_influencers')
      .select('*')
      .limit(1);
    
    if (simpleQueryError) {
      console.log(`  ❌ Simple query failed: ${simpleQueryError.message}`);
    } else {
      console.log(`  ✅ Simple query successful`);
    }

    // Test join query
    console.log('  Testing join query (trip_influencers with trips)...');
    const { data: joinQueryData, error: joinQueryError } = await supabase
      .from('trip_influencers')
      .select(`
        *,
        trips:trip_id (
          id, 
          group_size_min,
          group_size_max,
          status
        )
      `)
      .limit(1);
    
    if (joinQueryError) {
      console.log(`  ❌ Join query failed: ${joinQueryError.message}`);
    } else {
      console.log(`  ✅ Join query successful`);
    }

    // Test the problematic query
    console.log('  Testing the problematic trip_images join...');
    const { data: problemQueryData, error: problemQueryError } = await supabase
      .from('trip_influencers')
      .select(`
        *,
        trips:trip_id (id),
        trip_images!trip_influencers_trip_id_fkey (
          image_url,
          is_main
        )
      `)
      .limit(1);
    
    if (problemQueryError) {
      console.log(`  ❌ Problem query failed: ${problemQueryError.message}`);
    } else {
      console.log(`  ✅ Problem query successful (unexpected)`);
    }

    // Test fixed query approach
    console.log('  Testing fixed query approach (separate queries)...');
    const { data: fixedQueryData1, error: fixedQueryError1 } = await supabase
      .from('trip_influencers')
      .select('*')
      .limit(1);
    
    if (fixedQueryError1) {
      console.log(`  ❌ First part of fixed query failed: ${fixedQueryError1.message}`);
    } else {
      const tripId = fixedQueryData1[0]?.trip_id;
      
      if (!tripId) {
        console.log(`  ⚠️ No trip_id found in sample data`);
      } else {
        const { data: fixedQueryData2, error: fixedQueryError2 } = await supabase
          .from('trip_images')
          .select('*')
          .eq('trip_id', tripId)
          .limit(1);
        
        if (fixedQueryError2) {
          console.log(`  ❌ Second part of fixed query failed: ${fixedQueryError2.message}`);
        } else {
          console.log(`  ✅ Fixed query approach successful`);
        }
      }
    }

    console.log('\n✅ Diagnostic completed!');
    console.log('-------------------------------------------');
    console.log('Recommendations:');
    console.log('1. Use separate queries for trip_influencers and trip_images');
    console.log('2. Check for null trip_id values in your trip_influencers');
    console.log('3. Verify that trips actually exist for each trip_id');

  } catch (error) {
    console.error('Error running diagnostics:', error);
  }
}

// Run the diagnostic tool
diagnoseDatabase();
