import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PersonalInfoSection from '@/components/onboarding/PersonalInfoSection';
import AddressSection from '@/components/onboarding/AddressSection';
import VerificationDocumentsSection from '@/components/onboarding/VerificationDocumentsSection';
import BioSection from '@/components/onboarding/BioSection';
import { validateAge, validateVerificationPhotos, checkForDuplicateVerification } from '@/services/verificationService';

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

  const onSubmit = async (data: VerificationFormData) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Check for duplicate verification attempts
      const hasDuplicate = await checkForDuplicateVerification(user.id);
      if (hasDuplicate) {
        toast({
          title: "Verification Restricted",
          description: "You have a pending verification or must wait before submitting a new one.",
          variant: "destructive",
        });
        return;
      }

      // Validate age
      const ageValidation = await validateAge(data.dateOfBirth);
      if (!ageValidation.isValid) {
        toast({
          title: ageValidation.error!.title,
          description: ageValidation.error!.description,
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

      // Validate verification photos
      const photoValidation = await validateVerificationPhotos(data.idDocument, data.selfieWithId);
      if (!photoValidation.isValid) {
        toast({
          title: photoValidation.error!.title,
          description: photoValidation.error!.description,
          variant: "destructive",
        });
        return;
      }

      // Upload ID document with encryption
      const idExt = data.idDocument.name.split('.').pop();
      const idPath = `${user.id}/id_${crypto.randomUUID()}.${idExt}`;
      const { error: idUploadError } = await supabase.storage
        .from('verification-documents')
        .upload(idPath, data.idDocument, {
          cacheControl: '0',
          upsert: false,
          contentType: data.idDocument.type,
        });

      if (idUploadError) throw idUploadError;

      // Upload selfie with encryption
      const selfieExt = data.selfieWithId.name.split('.').pop();
      const selfiePath = `${user.id}/selfie_${crypto.randomUUID()}.${selfieExt}`;
      const { error: selfieUploadError } = await supabase.storage
        .from('verification-documents')
        .upload(selfiePath, data.selfieWithId, {
          cacheControl: '0',
          upsert: false,
          contentType: data.selfieWithId.type,
        });

      if (selfieUploadError) throw selfieUploadError;

      // Create verification request
      const { error: verificationError } = await supabase
        .from('verification_requests')
        .insert({
          user_id: user.id,
          status: 'pending',
          documents: {
            id_document: idPath,
            selfie_with_id: selfiePath,
            date_of_birth: data.dateOfBirth,
            address: data.address,
            full_name: data.fullName,
            submission_date: new Date().toISOString(),
            ip_address: await fetch('https://api.ipify.org?format=json').then(r => r.json()).then(data => data.ip),
            user_agent: navigator.userAgent,
          },
        });

      if (verificationError) throw verificationError;

      // Update profile status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          city: data.city,
          state: data.state,
          bio: data.bio,
          verification_status: 'pending',
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Show success message
      toast({
        title: "Verification Submitted Successfully",
        description: "Thank you for submitting your verification documents. Our team will review your information within 24-48 hours. You will receive an email notification once the review is complete.",
        duration: 6000, // Show for 6 seconds
      });

      // Wait for 2 seconds to let user read the message
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Redirect to dashboard or home page
      window.location.href = '/dashboard';
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
            <PersonalInfoSection form={form} currentDate={currentDate} />
            <AddressSection form={form} />
            <VerificationDocumentsSection form={form} currentDate={currentDate} />
            <BioSection form={form} />

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
