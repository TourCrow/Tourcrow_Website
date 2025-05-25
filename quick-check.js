/**
 * Quick diagnostic to check current image URL status
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://qcxhitelibenzdgbefkh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjeGhpdGVsaWJlbnpkZ2JlZmtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2NjgyOTYsImV4cCI6MjAzMTI0NDI5Nn0.t_NWqcUNEQTKoYQACnCC-tpWq9uoavXEWZArvHHcFrs'
);

(async () => {
  console.log('🔍 Quick Image Status Check');
  console.log('===========================');
  
  try {
    const { data, error } = await supabase
      .from('trip_images')
      .select('id, trip_id, image_url')
      .limit(10);
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log(`\nFound ${data.length} sample images:`);
    
    let appwriteCount = 0;
    let supabaseCount = 0;
    let publicCount = 0;
    let nullCount = 0;
    
    data.forEach(img => {
      const url = img.image_url;
      if (!url) {
        nullCount++;
        console.log(`${img.id}: (null) - Trip ${img.trip_id}`);
      } else if (url.includes('supabase')) {
        supabaseCount++;
        console.log(`${img.id}: SUPABASE - ${url}`);
      } else if (url.startsWith('/')) {
        publicCount++;
        console.log(`${img.id}: PUBLIC - ${url}`);
      } else {
        appwriteCount++;
        console.log(`${img.id}: APPWRITE - ${url}`);
      }
    });
    
    console.log(`\nSummary:`);
    console.log(`- Appwrite IDs: ${appwriteCount}`);
    console.log(`- Supabase URLs: ${supabaseCount}`);
    console.log(`- Public URLs: ${publicCount}`);
    console.log(`- Null/Empty: ${nullCount}`);
    
    // Check for the specific problematic image
    const { data: specific, error: specificError } = await supabase
      .from('trip_images')
      .select('*')
      .ilike('image_url', '%1748173319809%');
    
    if (specific && specific.length > 0) {
      console.log(`\n🎯 Found the problematic image:`);
      specific.forEach(img => {
        console.log(`- ID: ${img.id}, Trip: ${img.trip_id}, URL: ${img.image_url}`);
      });
    } else {
      console.log(`\n❌ Problematic image "1748173319809-images.jpeg" not found`);
    }
    
  } catch (err) {
    console.error('Script error:', err);
  }
})();
