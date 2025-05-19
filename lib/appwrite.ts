import { Client, Storage } from 'appwrite';

// Fill these with your Appwrite project details (match the Admin config)
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT || '6829e6ff000346c36cca';
const APPWRITE_BUCKET = process.env.NEXT_PUBLIC_APPWRITE_BUCKET || '6829e729001004328039';

const client = new Client();
client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT);

export const appwriteStorage = new Storage(client);
export { APPWRITE_BUCKET };

// Helper function to get image URL from Appwrite or other sources
export function getAppwriteImageUrl(imageId: string): string {
  // Handle missing or empty values
  if (!imageId || imageId.trim() === '') {
    return '/destination1.jpg';
  }
  
  // If it's a Supabase URL
  if (typeof imageId === 'string' && imageId.includes('supabase.co')) {
    return imageId;
  }
  
  // If it's another URL (for backward compatibility)
  if (typeof imageId === 'string' && imageId.startsWith('http')) {
    return imageId;
  }

  // Identify known problematic image IDs that have caused 403 errors in the past
  const problematicImageIds = ['682b38bc0018539b47d2'];
  if (problematicImageIds.includes(imageId)) {
    return '/destination1.jpg';
  }
  
  try {
    // Generate a preview URL from Appwrite with more parameters for better compatibility
    const cacheBuster = new Date().getTime();
    const width = 800;  // Using a larger size for frontend display
    const height = 600;
    const previewUrl = appwriteStorage
      .getFilePreview(
        APPWRITE_BUCKET, 
        imageId, 
        width,    // Set width explicitly
        height,   // Set height explicitly
        'center', // Gravity
        90,       // Quality
        undefined, // borderWidth
        undefined, // borderColor
        undefined, // borderRadius
        undefined, // opacity
        undefined, // rotation
        undefined, // background
        `v=${cacheBuster}` // output
      )
      .toString();
    
    return previewUrl;
  } catch (error) {
    // Determine placeholder based on input to ensure consistent fallbacks per image ID
    const placeholders = ['/destination1.jpg', '/destination2.jpg', '/destination3.jpg'];
    
    if (typeof imageId === 'string' && imageId.length > 0) {
      const index = Math.abs(imageId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % placeholders.length;
      return placeholders[index];
    }
    
    return '/destination1.jpg';
  }
}
