
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
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
  bio: string;
}

const ProviderOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const form = useForm<VerificationFormData>({
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      address: '',
      city: '',
      state: '',
      idDocument: null,
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

      // Check age (must be 18 or older)
      const birthDate = new Date(data.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (age < 18 || (age === 18 && monthDiff < 0)) {
        toast({
          title: "Age Verification Failed",
          description: "You must be 18 or older to become a provider.",
          variant: "destructive",
        });
        return;
      }

      // Upload ID document
      let documentUrl = null;
      if (data.idDocument) {
        const fileExt = data.idDocument.name.split('.').pop();
        const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('verification-documents')
          .upload(filePath, data.idDocument);

        if (uploadError) throw uploadError;
        documentUrl = filePath;
      }

      // Update profile with verification data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          city: data.city,
          state: data.state,
          bio: data.bio,
          verification_documents: {
            id_document: documentUrl,
            date_of_birth: data.dateOfBirth,
            address: data.address,
          },
          verification_status: 'pending',
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Verification submitted",
        description: "Your verification documents have been submitted for review.",
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
    return null; // Will redirect in useEffect
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
                  <FormLabel>Full Legal Name</FormLabel>
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
                    <Input type="date" {...field} required />
                  </FormControl>
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
                      accept="image/*,.pdf"
                      onChange={(e) => onChange(e.target.files?.[0] || null)}
                      {...field}
                      required
                    />
                  </FormControl>
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
