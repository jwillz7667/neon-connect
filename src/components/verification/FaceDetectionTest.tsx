import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { detectFaceInImage, validateVerificationPhotos } from '@/services/verificationService';
import * as faceapi from '@vladmandic/face-api';

interface TestResult {
  type: 'single' | 'verification';
  data: any;
  imageUrl?: string;
}

const FaceDetectionTest = () => {
  const [result, setResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testType, setTestType] = useState<'single' | 'verification'>('single');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idFileRef = useRef<HTMLInputElement>(null);
  const selfieFileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleSingleImageTest = async (file: File) => {
    setIsLoading(true);
    setResult(null);

    try {
      const detectionResult = await detectFaceInImage(file);
      const imageUrl = URL.createObjectURL(file);

      setResult({
        type: 'single',
        data: detectionResult,
        imageUrl
      });

      // If we have a successful detection, draw face landmarks
      if (detectionResult.faceDetected && imageRef.current) {
        const img = await faceapi.bufferToImage(file);
        const canvas = faceapi.createCanvasFromMedia(img);
        canvas.style.position = 'absolute';
        canvas.style.left = '0';
        canvas.style.top = '0';
        
        const container = imageRef.current.parentElement;
        if (container) {
          container.appendChild(canvas);
          const displaySize = { width: img.width, height: img.height };
          faceapi.matchDimensions(canvas, displaySize);
          
          const detections = await faceapi
            .detectAllFaces(img)
            .withFaceLandmarks()
            .withAgeAndGender();
          
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          
          // Draw the detections
          resizedDetections.forEach(detection => {
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, { 
              label: `Age: ~${Math.round(detection.age)} years`
            });
            drawBox.draw(canvas);
          });
        }
      }
    } catch (error) {
      setResult({
        type: 'single',
        data: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationTest = async (idFile: File, selfieFile: File) => {
    setIsLoading(true);
    setResult(null);

    try {
      const verificationResult = await validateVerificationPhotos(idFile, selfieFile);
      setResult({
        type: 'verification',
        data: verificationResult,
        imageUrl: URL.createObjectURL(selfieFile)
      });
    } catch (error) {
      setResult({
        type: 'verification',
        data: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleSingleImageTest(file);
  };

  const handleVerificationFiles = async () => {
    const idFile = idFileRef.current?.files?.[0];
    const selfieFile = selfieFileRef.current?.files?.[0];
    
    if (!idFile || !selfieFile) {
      alert('Please select both ID and selfie images');
      return;
    }
    
    await handleVerificationTest(idFile, selfieFile);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Face Detection Test Suite</h2>
        
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Button
              variant={testType === 'single' ? 'default' : 'outline'}
              onClick={() => setTestType('single')}
            >
              Single Image Test
            </Button>
            <Button
              variant={testType === 'verification' ? 'default' : 'outline'}
              onClick={() => setTestType('verification')}
            >
              Verification Test
            </Button>
          </div>

          {testType === 'single' ? (
            <div className="space-y-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Select Image'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Button
                  onClick={() => idFileRef.current?.click()}
                  variant="outline"
                  className="mr-2"
                >
                  Select ID Photo
                </Button>
                <Button
                  onClick={() => selfieFileRef.current?.click()}
                  variant="outline"
                >
                  Select Selfie
                </Button>
                <Button
                  onClick={handleVerificationFiles}
                  disabled={isLoading}
                  className="ml-2"
                >
                  {isLoading ? 'Processing...' : 'Verify Photos'}
                </Button>
              </div>
              <input
                ref={idFileRef}
                type="file"
                accept="image/*"
                className="hidden"
              />
              <input
                ref={selfieFileRef}
                type="file"
                accept="image/*"
                className="hidden"
              />
            </div>
          )}
        </div>

        {result && (
          <div className="mt-6 space-y-4">
            {result.imageUrl && (
              <div className="relative inline-block">
                <img
                  ref={imageRef}
                  src={result.imageUrl}
                  alt="Test"
                  className="max-w-full h-auto rounded-lg"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            )}
            <pre className="p-4 bg-gray-800 rounded-lg overflow-auto max-h-96 text-sm">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FaceDetectionTest; 