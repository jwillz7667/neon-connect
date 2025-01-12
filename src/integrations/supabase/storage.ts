import { supabase } from './client';

export const createStorageBuckets = async () => {
  // Create verification-documents bucket
  const { error: verificationError } = await supabase
    .storage
    .createBucket('verification-documents', {
      public: false,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf']
    });

  if (verificationError) {
    console.error('Error creating verification-documents bucket:', verificationError);
  }

  // Create avatars bucket
  const { error: avatarsError } = await supabase
    .storage
    .createBucket('avatars', {
      public: true,
      fileSizeLimit: 2097152, // 2MB
      allowedMimeTypes: ['image/jpeg', 'image/png']
    });

  if (avatarsError) {
    console.error('Error creating avatars bucket:', avatarsError);
  }
};

// Call this function when the app initializes
createStorageBuckets();