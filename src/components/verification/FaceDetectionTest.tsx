import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { detectFaceInImage, validateVerificationPhotos } from '@/services/verificationService';
import { testModelLoading } from '../../utils/modelTest';
import * as faceapi from '@vladmandic/face-api';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface TestResult {
  type: 'single' | 'verification';
  data: any;
  imageUrl?: string;
}

interface ModelStatus {
  loading: boolean;
  initialized: boolean;
  error?: string;
  details?: {
    ssdMobilenet: boolean;
    faceLandmark: boolean;
    faceRecognition: boolean;
    faceExpression: boolean;
    ageGender: boolean;
  };
}

const FaceDetectionTest = () => {
  const [result, setResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testType, setTestType] = useState<'single' | 'verification'>('single');
  const [modelStatus, setModelStatus] = useState<ModelStatus>({
    loading: true,
    initialized: false
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idFileRef = useRef<HTMLInputElement>(null);
  const selfieFileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    initializeModels();
  }, []);

  const initializeModels = async () => {
    setModelStatus(prev => ({ ...prev, loading: true }));
    try {
      const testResult = await testModelLoading();
      setModelStatus({
        loading: false,
        initialized: testResult.success,
        error: testResult.errors?.join('\n'),
        details: testResult.results
      });
    } catch (error) {
      setModelStatus({
        loading: false,
        initialized: false,
        error: error instanceof Error ? error.message : 'Failed to initialize face detection models'
      });
    }
  };

  const validateFile = (file: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
    }

    if (file.size > maxSize) {
      throw new Error('File is too large. Maximum size is 10MB.');
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current && canvasRef.current.parentNode) {
      canvasRef.current.parentNode.removeChild(canvasRef.current);
      canvasRef.current = null;
    }
  };

  const handleSingleImageTest = async (file: File) => {
    if (!modelStatus.initialized) {
      alert('Face detection models are not initialized. Please wait or refresh the page.');
      return;
    }

    setIsLoading(true);
    setResult(null);
    clearCanvas();

    try {
      validateFile(file);
      const detectionResult = await detectFaceInImage(file);
      const imageUrl = URL.createObjectURL(file);

      setResult({
        type: 'single',
        data: detectionResult,
        imageUrl
      });

      // Draw face landmarks if detection successful
      if (detectionResult.faceDetected && imageRef.current) {
        const img = await faceapi.bufferToImage(file);
        const canvas = faceapi.createCanvasFromMedia(img);
        canvas.style.position = 'absolute';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvasRef.current = canvas;
        
        const container = imageRef.current.parentElement;
        if (container) {
          container.appendChild(canvas);
          const displaySize = { width: img.width, height: img.height };
          faceapi.matchDimensions(canvas, displaySize);
          
          const detections = await faceapi
            .detectAllFaces(img)
            .withFaceLandmarks()
            .withAgeAndGender()
            .withFaceExpressions();
          
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          
          // Draw detections with more information
          resizedDetections.forEach(detection => {
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, { 
              label: `Age: ~${Math.round(detection.age)} years\n${detection.gender} (${Math.round(detection.genderProbability * 100)}%)`
            });
            drawBox.draw(canvas);
            
            // Draw face landmarks
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            
            // Draw expressions
            const expressions = detection.expressions;
            const mainExpression = Object.entries(expressions)
              .reduce((a, b) => a[1] > b[1] ? a : b)[0];
            
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.font = '16px Arial';
              ctx.fillStyle = '#00ff00';
              ctx.fillText(`Expression: ${mainExpression}`, box.x, box.y - 30);
            }
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
    if (!modelStatus.initialized) {
      alert('Face detection models are not initialized. Please wait or refresh the page.');
      return;
    }

    setIsLoading(true);
    setResult(null);
    clearCanvas();

    try {
      validateFile(idFile);
      validateFile(selfieFile);
      
      const verificationResult = await validateVerificationPhotos(idFile, selfieFile);
      setResult({
        type: 'verification',
        data: verificationResult,
        imageUrl: URL.createObjectURL(selfieFile)
      });

      // If verification successful, show both images side by side
      if (verificationResult.isValid) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '1rem';
        
        const idImg = await faceapi.bufferToImage(idFile);
        const selfieImg = await faceapi.bufferToImage(selfieFile);
        
        [idImg, selfieImg].forEach(img => {
          img.style.maxHeight = '200px';
          img.style.width = 'auto';
          container.appendChild(img);
        });
        
        imageRef.current?.parentElement?.appendChild(container);
      }
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
        
        {/* Model Status */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Model Status</h3>
          {modelStatus.loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Initializing models...</span>
            </div>
          ) : modelStatus.initialized ? (
            <Alert className="bg-green-500/10 border-green-500">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle>Models Loaded Successfully</AlertTitle>
              {modelStatus.details && (
                <AlertDescription>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.entries(modelStatus.details).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        {value ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span>{key}</span>
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              )}
            </Alert>
          ) : (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Model Initialization Failed</AlertTitle>
              <AlertDescription>{modelStatus.error}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex space-x-4">
            <Button
              variant={testType === 'single' ? 'default' : 'outline'}
              onClick={() => setTestType('single')}
              disabled={!modelStatus.initialized}
            >
              Single Image Test
            </Button>
            <Button
              variant={testType === 'verification' ? 'default' : 'outline'}
              onClick={() => setTestType('verification')}
              disabled={!modelStatus.initialized}
            >
              Verification Test
            </Button>
          </div>

          {testType === 'single' ? (
            <div className="space-y-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || !modelStatus.initialized}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Select Image'
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
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
                  disabled={!modelStatus.initialized}
                >
                  Select ID Photo
                </Button>
                <Button
                  onClick={() => selfieFileRef.current?.click()}
                  variant="outline"
                  disabled={!modelStatus.initialized}
                >
                  Select Selfie
                </Button>
                <Button
                  onClick={handleVerificationFiles}
                  disabled={isLoading || !modelStatus.initialized}
                  className="ml-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Verify Photos'
                  )}
                </Button>
              </div>
              <input
                ref={idFileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
              <input
                ref={selfieFileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
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
            <Alert variant={result.data.error ? 'destructive' : 'default'}>
              <AlertTitle>
                {result.data.error ? 'Error' : 'Detection Results'}
              </AlertTitle>
              <AlertDescription>
                <pre className="mt-2 p-4 bg-gray-800 rounded-lg overflow-auto max-h-96 text-sm">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FaceDetectionTest; 