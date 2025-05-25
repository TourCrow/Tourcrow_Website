# Supabase Storage Migration Guide

This guide will help you migrate from Appwrite to Supabase storage for all images.

## Step 1: Set up Supabase Storage

1. **Create Storage Bucket**
   - Go to your Supabase dashboard: https://app.supabase.com/project/qcxhitelibenzdgbefkh
   - Navigate to Storage section
   - Create a new bucket named `trip-images`
   - Set it as public
   - Allow image uploads (MIME types: image/*)

2. **Set Storage Policies**
   ```sql
   -- Allow public read access
   CREATE POLICY "Public read access" ON storage.objects
   FOR SELECT USING (bucket_id = 'trip-images');

   -- Allow authenticated uploads (for admin)
   CREATE POLICY "Authenticated upload access" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'trip-images' AND auth.uid() IS NOT NULL);
   ```

## Step 2: Upload Your Images

1. **Collect Your Current Images**
   - Download all images from your Appwrite storage
   - Organize them by trip ID or name them consistently

2. **Upload to Supabase**
   - Upload images to the `trip-images` bucket
   - Use consistent naming: `trip-{id}-main.jpg`, `trip-{id}-banner.jpg`, etc.
   - Or use the original Appwrite filenames if you have them

## Step 3: Update Database References

Run the migration script to update all image URLs:

```bash
# First, run in dry-run mode to see what will change
node migrate-to-supabase.js

# Then set DRY_RUN = false in the script and run again
node migrate-to-supabase.js
```

## Step 4: Update Frontend Code

The following files have been updated to use Supabase storage:

1. **lib/image-helpers.ts** - Updated with Supabase storage functions
2. **All image loading** - Now uses consistent fallback system

## Step 5: Test the Migration

1. **Test Image Loading**
   ```bash
   npm run dev
   ```

2. **Check Console for Errors**
   - Look for any 404 errors
   - Verify images load correctly
   - Check fallback images work

## Step 6: Remove Appwrite Dependencies

1. **Remove Appwrite from package.json**
   ```bash
   npm uninstall appwrite
   ```

2. **Clean up Appwrite files**
   - Remove or clean `lib/appwrite.ts`
   - Remove any Appwrite API keys from `.env`

## Step 7: Upload Missing Images

For any images showing placeholders:

1. **Upload the actual images to Supabase storage**
2. **Update the database with correct filenames**
   ```sql
   UPDATE trip_images 
   SET image_url = 'actual-filename.jpg'
   WHERE id = [image_id];
   ```

## Benefits of Supabase Storage

- ✅ Integrated with your existing Supabase database
- ✅ No separate API keys or configuration needed
- ✅ Built-in CDN and optimization
- ✅ Consistent with your data storage
- ✅ Better performance and reliability
- ✅ No more 404 errors from broken Appwrite IDs

## Current Image Status

The problematic image "1748173319809-images.jpeg" will be replaced with a placeholder until you upload the actual image to Supabase storage.

## Next Steps

1. Create the Supabase storage bucket
2. Run the migration script
3. Upload your images to Supabase
4. Update database with correct filenames
5. Test everything works
6. Remove Appwrite dependencies
