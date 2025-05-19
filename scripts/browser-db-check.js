/**
 * TourCrow Database Schema Diagnostic - Browser Console Version
 * 
 * This script can be pasted into the browser console on your TourCrow website
 * to check the database structure and identify issues with images.
 * 
 * INSTRUCTIONS:
 * 1. Open your TourCrow website in the browser
 * 2. Open Developer Tools (F12 or Ctrl+Shift+I)
 * 3. Go to the Console tab
 * 4. Copy and paste this entire script and press Enter
 */

async function diagnoseDatabase() {
  console.clear();
  console.log('%c🔍 TourCrow Database Schema Diagnostic', 'font-size: 16px; font-weight: bold; color: blue;');
  console.log('%c-------------------------------------------', 'color: blue;');

  try {
    console.log('\n📋 Checking Tables:');
    const tables = ['trips', 'trip_influencers', 'trip_images', 'trip_activities', 
                    'trip_inclusions', 'trip_exclusions'];
    
    for (const table of tables) {
      try {
        const { count, error } = await window.supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`  %c❌ ${table}: Error - ${error.message}`, 'color: red;');
        } else {
          console.log(`  %c✅ ${table}: Found (${count} records)`, 'color: green;');
        }
      } catch (e) {
        console.log(`  %c❌ ${table}: ${e.message}`, 'color: red;');
      }
    }

    // 2. Check Foreign Key Relationships
    console.log('\n%c🔗 Checking Relationships:', 'font-weight: bold;');
    
    // Check trip_id reference in trip_influencers
    try {
      const { data: tripInfluencerData, error: tripInfluencerError } = await window.supabase
        .from('trip_influencers')
        .select(`
          id,
          trip_id,
          trips:trip_id (id)
        `)
        .limit(10);

      if (tripInfluencerError) {
        console.log(`  %c❌ trip_influencers -> trips: Error - ${tripInfluencerError.message}`, 'color: red;');
      } else {
        const validRelations = tripInfluencerData.filter(item => item.trips?.id);
        const invalidRelations = tripInfluencerData.filter(item => !item.trips?.id && item.trip_id);
        
        console.log(`  %ctrip_influencers -> trips: ${validRelations.length}/${tripInfluencerData.length} valid`, 
                    validRelations.length === tripInfluencerData.length ? 'color: green;' : 'color: orange;');
        
        if (invalidRelations.length > 0) {
          console.log(`    %c⚠️ Found ${invalidRelations.length} trip_influencers with invalid trip_id references`, 'color: orange;');
          console.table(invalidRelations.map(item => ({ id: item.id, trip_id: item.trip_id })));
        }
      }
    } catch (e) {
      console.log(`  %c❌ Error checking trip_influencers: ${e.message}`, 'color: red;');
    }

    // Check Images
    try {
      console.log('\n%c🖼️ Checking Trip Images:', 'font-weight: bold;');
      
      const { data: imageData, error: imageError } = await window.supabase
        .from('trip_images')
        .select('*')
        .limit(20);
        
      if (imageError) {
        console.log(`  %c❌ Error fetching images: ${imageError.message}`, 'color: red;');
      } else {
        console.log(`  %c✅ Found ${imageData.length} images`, 'color: green;');
        
        // Analyze image URL formats
        const urlTypes = {
          appwriteIds: 0,
          supabaseUrls: 0,
          otherUrls: 0,
          emptyUrls: 0,
        };
        
        imageData.forEach(img => {
          if (!img.image_url) {
            urlTypes.emptyUrls++;
          } else if (img.image_url.startsWith('http')) {
            if (img.image_url.includes('supabase.co')) {
              urlTypes.supabaseUrls++;
            } else {
              urlTypes.otherUrls++;
            }
          } else {
            urlTypes.appwriteIds++;
          }
        });
        
        console.log('  %cImage URL types:', 'font-weight: bold;');
        console.log(`    - Appwrite IDs: ${urlTypes.appwriteIds}`);
        console.log(`    - Supabase URLs: ${urlTypes.supabaseUrls}`);
        console.log(`    - Other URLs: ${urlTypes.otherUrls}`);
        console.log(`    - Empty URLs: ${urlTypes.emptyUrls}`);
        
        // Show sample of each type
        console.log('\n  %cSample images:', 'font-weight: bold;');
        console.table(imageData.slice(0, 5).map(img => ({ 
          id: img.id, 
          trip_id: img.trip_id, 
          image_url: img.image_url,
          is_main: img.is_main 
        })));
      }
    } catch (e) {
      console.log(`  %c❌ Error analyzing images: ${e.message}`, 'color: red;');
    }

    console.log('\n%c✅ Diagnostic completed!', 'color: green; font-weight: bold;');
    console.log('%c-------------------------------------------', 'color: blue;');
    console.log('Recommendations:');
    console.log('1. Make sure all trip_influencers have valid trip_id values');
    console.log('2. Check that all trip_images are correctly associated with trips');
    console.log('3. Ensure images are properly stored in either Appwrite or Supabase');

  } catch (error) {
    console.error('Error running diagnostics:', error);
  }
}

// Check if supabase client is available
if (typeof window.supabase === 'undefined') {
  console.error('%cError: Supabase client not found in window object. This script must be run on a page that includes the Supabase client.', 'color: red; font-weight: bold;');
} else {
  diagnoseDatabase().catch(console.error);
}
