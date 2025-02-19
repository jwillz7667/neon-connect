import imageCompression from 'browser-image-compression';

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGE_DIMENSION = 1200; // Maximum width or height in pixels

export interface ImageValidationError {
  code: 'invalid_type' | 'invalid_size' | 'invalid_dimension';
  message: string;
}

export const validateImage = async (file: File): Promise<ImageValidationError | null> => {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      code: 'invalid_type',
      message: `Invalid file type. Allowed types are: ${ALLOWED_IMAGE_TYPES.map(type => type.split('/')[1]).join(', ')}`
    };
  }

  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > MAX_IMAGE_SIZE_MB) {
    return {
      code: 'invalid_size',
      message: `File size must be less than ${MAX_IMAGE_SIZE_MB}MB`
    };
  }

  // Check image dimensions
  try {
    const dimensions = await getImageDimensions(file);
    if (dimensions.width > MAX_IMAGE_DIMENSION || dimensions.height > MAX_IMAGE_DIMENSION) {
      return {
        code: 'invalid_dimension',
        message: `Image dimensions must be ${MAX_IMAGE_DIMENSION}x${MAX_IMAGE_DIMENSION} pixels or smaller`
      };
    }
  } catch (error) {
    return {
      code: 'invalid_type',
      message: 'Could not process image. Please try another file.'
    };
  }

  return null;
};

export const optimizeImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: MAX_IMAGE_SIZE_MB,
    maxWidthOrHeight: MAX_IMAGE_DIMENSION,
    useWebWorker: true,
    fileType: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
    initialQuality: 0.8,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return new File([compressedFile], file.name, {
      type: file.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('Error optimizing image:', error);
    return file; // Return original file if optimization fails
  }
};

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}; 