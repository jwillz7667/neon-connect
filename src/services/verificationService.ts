import { createClient } from '@supabase/supabase-js';
import * as faceapi from '@vladmandic/face-api';
import { supabase } from '@/integrations/supabase/client';
import { Buffer } from 'buffer';

// Add model loading state tracking
let modelsLoaded = false;

// Initialize face-api.js models
export const loadModels = async () => {
  try {
    if (modelsLoaded) {
      console.log('Models already loaded, skipping initialization');
      return true;
    }

    console.log('Loading face detection models...');
    const modelPath = '/models';
    
    // First check if models exist
    try {
      const response = await fetch(`${modelPath}/ssd_mobilenetv1_model-weights_manifest.json`);
      if (!response.ok) {
        throw new Error('Face detection models not found. Please ensure models are properly installed.');
      }
    } catch (error) {
      console.error('Error checking for models:', error);
      throw new Error('Face detection models not found or inaccessible. Please ensure models are properly installed.');
    }

    // Load all required models
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath),
      faceapi.nets.faceExpressionNet.loadFromUri(modelPath),
      faceapi.nets.ageGenderNet.loadFromUri(modelPath),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
    ]);
    
    modelsLoaded = true;
    console.log('Face detection models loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading face detection models:', error);
    modelsLoaded = false;
    throw new Error('Failed to load face detection models: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

interface VerificationResult {
  isValid: boolean;
  error?: {
    code: string;
    title: string;
    description: string;
  };
}

interface FaceDetectionResult {
  faceDetected: boolean;
  estimatedAge?: number;
  multipleFaces: boolean;
  error?: string;
}

export const validateAge = async (dateOfBirth: string): Promise<VerificationResult> => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  // Basic validation
  if (isNaN(birthDate.getTime())) {
    return {
      isValid: false,
      error: {
        code: 'INVALID_DATE',
        title: 'Invalid Date',
        description: 'Please provide a valid date of birth'
      }
    };
  }

  // Check if date is in the future
  if (birthDate > today) {
    return {
      isValid: false,
      error: {
        code: 'FUTURE_DATE',
        title: 'Invalid Date',
        description: 'Date of birth cannot be in the future'
      }
    };
  }

  // Calculate age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // Check if age is reasonable (e.g., not over 120 years)
  if (age > 120) {
    return {
      isValid: false,
      error: {
        code: 'UNREASONABLE_AGE',
        title: 'Invalid Age',
        description: 'Please provide a valid date of birth'
      }
    };
  }

  // Check if user is at least 18
  if (age < 18) {
    return {
      isValid: false,
      error: {
        code: 'UNDERAGE',
        title: 'Age Verification Failed',
        description: 'You must be 18 or older to use this service'
      }
    };
  }

  return { isValid: true };
};

export const detectFaceInImage = async (imageFile: File): Promise<FaceDetectionResult> => {
  try {
    if (!modelsLoaded) {
      console.log('Models not loaded, loading now...');
      await loadModels();
    }

    console.log('Processing image for face detection...');
    const img = await faceapi.bufferToImage(imageFile);
    
    console.log('Running face detection...');
    const detections = await faceapi
      .detectAllFaces(img)
      .withFaceLandmarks()
      .withAgeAndGender();

    console.log('Face detection results:', {
      facesFound: detections.length,
      hasDetections: detections && detections.length > 0
    });

    if (detections.length === 0) {
      return {
        faceDetected: false,
        multipleFaces: false,
        error: 'No face detected in the image'
      };
    }

    if (detections.length > 1) {
      return {
        faceDetected: true,
        multipleFaces: true,
        error: 'Multiple faces detected in the image'
      };
    }

    return {
      faceDetected: true,
      multipleFaces: false,
      estimatedAge: Math.round(detections[0].age)
    };
  } catch (error) {
    console.error('Face detection error:', error);
    throw new Error('Face detection failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

export const validateVerificationPhotos = async (
  idDocument: File,
  selfieWithId: File
): Promise<VerificationResult> => {
  try {
    console.log('Starting verification process...');
    
    // 1. Basic file validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    console.log('Validating file types and sizes...');
    if (!validTypes.includes(idDocument.type) || !validTypes.includes(selfieWithId.type)) {
      return {
        isValid: false,
        error: {
          code: 'INVALID_FILE_TYPE',
          title: 'Invalid File Type',
          description: 'Please upload JPEG, PNG, or WebP images'
        }
      };
    }

    if (idDocument.size > maxSize || selfieWithId.size > maxSize) {
      return {
        isValid: false,
        error: {
          code: 'FILE_TOO_LARGE',
          title: 'File Too Large',
          description: 'Images must be less than 10MB'
        }
      };
    }

    // Ensure models are loaded before proceeding
    if (!modelsLoaded) {
      console.log('Loading models before verification...');
      await loadModels();
    }

    // 2. Face detection in ID document
    console.log('Processing ID document...');
    const idFaceResult = await detectFaceInImage(idDocument);
    console.log('ID document processing result:', idFaceResult);
    
    if (!idFaceResult.faceDetected || idFaceResult.multipleFaces) {
      return {
        isValid: false,
        error: {
          code: 'INVALID_ID_PHOTO',
          title: 'Invalid ID Photo',
          description: idFaceResult.error || 'Please provide a clear photo of your ID with a single visible face'
        }
      };
    }

    // 3. Face detection in selfie
    console.log('Processing selfie...');
    const selfieFaceResult = await detectFaceInImage(selfieWithId);
    console.log('Selfie processing result:', selfieFaceResult);
    
    if (!selfieFaceResult.faceDetected || selfieFaceResult.multipleFaces) {
      return {
        isValid: false,
        error: {
          code: 'INVALID_SELFIE',
          title: 'Invalid Selfie',
          description: selfieFaceResult.error || 'Please provide a clear selfie with a single visible face'
        }
      };
    }

    // 4. Age estimation comparison
    if (selfieFaceResult.estimatedAge && idFaceResult.estimatedAge) {
      const ageDifference = Math.abs(selfieFaceResult.estimatedAge - idFaceResult.estimatedAge);
      console.log('Age estimation comparison:', {
        selfieAge: selfieFaceResult.estimatedAge,
        idAge: idFaceResult.estimatedAge,
        difference: ageDifference
      });
      
      if (ageDifference > 10) { // Increased from 5 to 10 years
        return {
          isValid: false,
          error: {
            code: 'AGE_MISMATCH',
            title: 'Age Verification Failed',
            description: 'The estimated ages in the photos differ significantly'
          }
        };
      }
    }

    // 5. Face similarity check
    const idFaceDescriptor = await getFaceDescriptor(idDocument);
    const selfieFaceDescriptor = await getFaceDescriptor(selfieWithId);
    
    if (idFaceDescriptor && selfieFaceDescriptor) {
      const similarity = faceapi.euclideanDistance(idFaceDescriptor, selfieFaceDescriptor);
      console.log('Face similarity check:', {
        similarity,
        threshold: 0.8, // Logging the threshold
        passed: similarity <= 0.8
      });
      
      if (similarity > 0.8) { // Relaxed from 0.6 to 0.8
        return {
          isValid: false,
          error: {
            code: 'FACE_MISMATCH',
            title: 'Verification Failed',
            description: `Face similarity check failed (score: ${similarity.toFixed(2)})`
          }
        };
      }
    }

    return { isValid: true };
  } catch (error) {
    console.error('Verification error:', error);
    return {
      isValid: false,
      error: {
        code: 'VERIFICATION_ERROR',
        title: 'Verification Error',
        description: 'An error occurred during verification. Please try again.'
      }
    };
  }
};

const getFaceDescriptor = async (imageFile: File): Promise<Float32Array | null> => {
  try {
    if (!modelsLoaded) {
      console.log('Models not loaded, loading now...');
      await loadModels();
    }

    console.log('Getting face descriptor for image...');
    const img = await faceapi.bufferToImage(imageFile);
    
    console.log('Running face detection and generating descriptor...');
    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      console.log('No face detected for descriptor generation');
      return null;
    }

    console.log('Face descriptor generated successfully');
    return detection.descriptor;
  } catch (error) {
    console.error('Error getting face descriptor:', error);
    throw new Error('Failed to generate face descriptor: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

export const checkForDuplicateVerification = async (userId: string): Promise<boolean> => {
  try {
    // Check for existing verification attempts
    const { data: existingVerifications, error } = await supabase
      .from('verification_requests')
      .select('id, status, submitted_at')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    if (existingVerifications && existingVerifications.length > 0) {
      const lastVerification = existingVerifications[0];
      
      // If the last verification was rejected, require a waiting period
      if (lastVerification.status === 'rejected') {
        const waitingPeriod = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        const lastAttempt = new Date(lastVerification.submitted_at).getTime();
        const now = new Date().getTime();
        
        if (now - lastAttempt < waitingPeriod) {
          return true;
        }
      }
      
      // If verification is pending or approved, don't allow new submission
      if (['pending', 'approved'].includes(lastVerification.status)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking for duplicate verification:', error);
    return true; // Fail safe: prevent submission if check fails
  }
};
