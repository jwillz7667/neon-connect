
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VerificationFormData {
  fullName: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  idDocument: File | null;
  selfieWithId: File | null;
  bio: string;
}

const ProviderOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const currentDate = new Date().toISOString().split('T')[0];

  const form = useForm<VerificationFormData>({
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      address: '',
      city: '',
      state: '',
      idDocument: null,
      selfieWithId: null,
      bio: '',
    },
  });

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/membership');
        return;
      }

      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (!subscription) {
        navigate('/membership');
        return;
      }

      setIsSubscribed(true);
    } catch (error) {
      console.error('Error checking subscription:', error);
      navigate('/membership');
    }
  };

  const validateAge = (dateOfBirth: string): boolean => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18;
  };

  const validateImageFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or WebP image",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Image must be less than 10MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const onSubmit = async (data: VerificationFormData) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Validate age
      if (!validateAge(data.dateOfBirth)) {
        toast({
          title: "Age Verification Failed",
          description: "You must be 18 or older to become a provider.",
          variant: "destructive",
        });
        return;
      }

      // Validate required files
      if (!data.idDocument || !data.selfieWithId) {
        toast({
          title: "Missing Documents",
          description: "Both ID document and verification selfie are required.",
          variant: "destructive",
        });
        return;
      }

      // Validate file types and sizes
      if (!validateImageFile(data.idDocument) || !validateImageFile(data.selfieWithId)) {
        return;
      }

      // Upload ID document
      const idExt = data.idDocument.name.split('.').pop();
      const idPath = `${user.id}/id_${crypto.randomUUID()}.${idExt}`;
      const { error: idUploadError } = await supabase.storage
        .from('verification-documents')
        .upload(idPath, data.idDocument);

      if (idUploadError) throw idUploadError;

      // Upload selfie with ID
      const selfieExt = data.selfieWithId.name.split('.').pop();
      const selfiePath = `${user.id}/selfie_${crypto.randomUUID()}.${selfieExt}`;
      const { error: selfieUploadError } = await supabase.storage
        .from('verification-documents')
        .upload(selfiePath, data.selfieWithId);

      if (selfieUploadError) throw selfieUploadError;

      // Update profile with verification data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          city: data.city,
          state: data.state,
          bio: data.bio,
          verification_documents: {
            id_document: idPath,
            selfie_with_id: selfiePath,
            date_of_birth: data.dateOfBirth,
            address: data.address,
            submission_date: new Date().toISOString(),
          },
          verification_status: 'pending',
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Verification submitted",
        description: "Your verification documents have been submitted for review. Please allow 24-48 hours for processing.",
      });

      navigate('/profile/edit');
    } catch (error) {
      console.error('Error submitting verification:', error);
      toast({
        title: "Error",
        description: "Failed to submit verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSubscribed) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 neon-text">Become a Provider</h1>
        <p className="text-gray-300 mb-8">
          Please complete this verification form to become a provider. We'll review your information
          and get back to you within 24-48 hours.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Legal Name (as shown on ID)</FormLabel>
                  <FormControl>
                    <Input {...field} required />
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
                    <Input type="date" max={currentDate} {...field} required />
                  </FormControl>
                  <FormDescription>
                    You must be 18 or older to register as a provider
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="idDocument"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Government-Issued ID</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files?.[0] || null)}
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a clear photo of your government-issued ID
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="selfieWithId"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Verification Selfie</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files?.[0] || null)}
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a selfie of yourself holding:
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Your government-issued ID (visible in the photo)</li>
                      <li>A paper with today's date ({currentDate})</li>
                      <li>Your username written on the paper</li>
                      <li>The site name written on the paper</li>
                    </ul>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      placeholder="Tell potential clients about yourself..."
                      className="h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Submitting...' : 'Submit for Verification'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProviderOnboarding;
