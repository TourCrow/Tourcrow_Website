const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupSupabaseStorage() {
  console.log('🚀 Setting up Supabase storage...');
  
  try {
    // Check if bucket exists
    const { data: existingBucket, error: listError } = await supabase
      .storage
      .getBucket('trip-images');
    
    if (existingBucket) {
      console.log('✅ Bucket "trip-images" already exists');
    } else {
      // Create the bucket
      const { data: bucket, error: createError } = await supabase
        .storage
        .createBucket('trip-images', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
          fileSizeLimit: 10485760 // 10MB
        });
      
      if (createError) {
        console.error('❌ Error creating bucket:', createError);
        throw createError;
      }
      
      console.log('✅ Successfully created bucket "trip-images"');
    }
    
    // Test the storage configuration
    console.log('\n🔍 Testing storage configuration...');
    
    // List existing files to verify access
    const { data: files, error: listFilesError } = await supabase
      .storage
      .from('trip-images')
      .list('', {
        limit: 5
      });
    
    if (listFilesError) {
      console.error('❌ Error accessing storage:', listFilesError);
      throw listFilesError;
    }
    
    console.log(`✅ Storage access verified. Found ${files.length} existing files.`);
    
    // Display S3 endpoint information
    console.log('\n📁 Storage Configuration:');
    console.log(`   Bucket: trip-images`);
    console.log(`   S3 Endpoint: ${supabaseUrl}/storage/v1/s3`);
    console.log(`   Region: ap-south-1`);
    console.log(`   Public URL Base: ${supabaseUrl}/storage/v1/object/public/trip-images/`);
    
    // Test image URL generation
    const testImageUrl = `${supabaseUrl}/storage/v1/object/public/trip-images/test-image.jpg`;
    console.log(`\n🔗 Example image URL: ${testImageUrl}`);
    
    console.log('\n✅ Supabase storage setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Run the migration script: node migrate-to-supabase.js');
    console.log('   2. Upload actual images to replace placeholders');
    console.log('   3. Test the application to verify image loading');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupSupabaseStorage();
