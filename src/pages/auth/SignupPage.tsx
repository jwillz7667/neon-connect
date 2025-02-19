import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { validateAge, detectFaceInImage } from '@/services/verificationService';
import { Card } from '@/components/ui/card';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  fullName: z.string().min(2, 'Full name is required'),
  dateOfBirth: z.string().refine(val => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, 'Please enter a valid date'),
  selfiePhoto: z.any()
    .refine((file) => file instanceof File, 'Please upload a selfie photo')
    .refine((file) => file?.size <= 10 * 1024 * 1024, 'File size should be less than 10MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file?.type),
      'Only .jpg, .png, and .webp formats are supported'
    ),
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      dateOfBirth: '',
      selfiePhoto: undefined,
    },
  });

  const handleSelfieUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create preview
      const preview = URL.createObjectURL(file);
      setSelfiePreview(preview);

      // Validate face in image
      const faceDetection = await detectFaceInImage(file);
      if (!faceDetection.faceDetected) {
        toast({
          title: 'Face Detection Failed',
          description: 'No face detected in the image. Please try again with a clearer photo.',
          variant: 'destructive',
        });
        setSelfiePreview(null);
        return;
      }

      if (faceDetection.multipleFaces) {
        toast({
          title: 'Multiple Faces Detected',
          description: 'Please upload a photo with only your face.',
          variant: 'destructive',
        });
        setSelfiePreview(null);
        return;
      }

      form.setValue('selfiePhoto', file);
    } catch (error) {
      console.error('Error processing selfie:', error);
      toast({
        title: 'Error Processing Photo',
        description: 'There was an error processing your photo. Please try again.',
        variant: 'destructive',
      });
      setSelfiePreview(null);
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      // Validate age
      const ageValidation = await validateAge(data.dateOfBirth);
      if (!ageValidation.isValid) {
        toast({
          title: ageValidation.error!.title,
          description: ageValidation.error!.description,
          variant: 'destructive',
        });
        return;
      }

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            date_of_birth: data.dateOfBirth,
          },
        },
      });

      if (authError) throw authError;

      if (!authData.user) throw new Error('No user data returned');

      // Upload selfie photo
      const selfieExt = data.selfiePhoto.name.split('.').pop();
      const selfiePath = `${authData.user.id}/signup_selfie_${crypto.randomUUID()}.${selfieExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('verification-photos')
        .upload(selfiePath, data.selfiePhoto, {
          cacheControl: '0',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: data.fullName,
          signup_selfie: selfiePath,
          date_of_birth: data.dateOfBirth,
        });

      if (profileError) throw profileError;

      toast({
        title: 'Account Created Successfully',
        description: 'Please check your email to verify your account.',
      });

      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Error Creating Account',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      const emailValid = await form.trigger(['email', 'password']);
      if (!emailValid) return;
    } else if (currentStep === 2) {
      const personalInfoValid = await form.trigger(['fullName', 'dateOfBirth']);
      if (!personalInfoValid) return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 neon-text">Create Account</h1>
        <Card className="p-6">
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-1/3 h-2 rounded-full mx-1 ${
                    step <= currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-gray-500">
              Step {currentStep} of 3: {' '}
              {currentStep === 1 ? 'Account Details' :
               currentStep === 2 ? 'Personal Information' :
               'Face Verification'}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {currentStep === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {currentStep === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="selfiePhoto"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Verification Selfie</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                handleSelfieUpload(e);
                              }}
                              {...field}
                            />
                            {selfiePreview && (
                              <div className="mt-4">
                                <img
                                  src={selfiePreview}
                                  alt="Selfie preview"
                                  className="max-w-full h-auto rounded-lg"
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="flex justify-between mt-6">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="ml-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage; 