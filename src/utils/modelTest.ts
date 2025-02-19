import * as faceapi from '@vladmandic/face-api';

export const testModelLoading = async () => {
  const results = {
    ssdMobilenet: false,
    faceLandmark: false,
    faceRecognition: false,
    faceExpression: false,
    ageGender: false,
  };

  const errors: string[] = [];

  try {
    // Test SSD MobileNet
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      results.ssdMobilenet = true;
    } catch (error) {
      errors.push(`SSD MobileNet loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test Face Landmark
    try {
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      results.faceLandmark = true;
    } catch (error) {
      errors.push(`Face Landmark loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test Face Recognition
    try {
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      results.faceRecognition = true;
    } catch (error) {
      errors.push(`Face Recognition loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test Face Expression
    try {
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      results.faceExpression = true;
    } catch (error) {
      errors.push(`Face Expression loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test Age Gender
    try {
      await faceapi.nets.ageGenderNet.loadFromUri('/models');
      results.ageGender = true;
    } catch (error) {
      errors.push(`Age Gender loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return {
      success: Object.values(results).every(result => result),
      results,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error) {
    return {
      success: false,
      results,
      errors: [`Global error: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}; 