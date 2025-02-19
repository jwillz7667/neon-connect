import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BasicInfoSection from '@/components/profile/BasicInfoSection';
import PhysicalCharacteristicsSection from '@/components/profile/PhysicalCharacteristicsSection';
import ServicesSection from '@/components/profile/ServicesSection';
import AboutSection from '@/components/profile/AboutSection';
import { profileFormSchema } from '@/lib/validations/profile';
import type { ProfileFormData } from '@/types/profile';
import { Loader2 } from 'lucide-react';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: '',
      fullName: '',
      bio: '',
      city: '',
      state: '',
      website: '',
      avatarUrl: '',
      height: '',
      bodyType: '',
      age: undefined,
      ethnicity: '',
      hairColor: '',
      eyeColor: '',
      measurements: '',
      languages: [],
      availability: '',
      services: [],
      rates: {},
      contactInfo: {},
    },
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      form.reset({
        username: profile.username || '',
        fullName: profile.full_name || '',
        bio: profile.bio || '',
        city: profile.city || '',
        state: profile.state || '',
        website: profile.website || '',
        avatarUrl: profile.avatar_url || '',
        height: profile.height || '',
        bodyType: profile.body_type || '',
        age: profile.age || undefined,
        ethnicity: profile.ethnicity || '',
        hairColor: profile.hair_color || '',
        eyeColor: profile.eye_color || '',
        measurements: profile.measurements || '',
        languages: profile.languages || [],
        availability: profile.availability || '',
        services: profile.services || [],
        rates: profile.rates || {},
        contactInfo: profile.contact_info || {},
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      let avatarUrl = data.avatarUrl;
      if (data.avatarFile) {
        const fileExt = data.avatarFile.name.split('.').pop();
        const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, data.avatarFile);

        if (uploadError) throw uploadError;
        
        avatarUrl = filePath;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: data.username,
          full_name: data.fullName,
          bio: data.bio,
          city: data.city,
          state: data.state,
          website: data.website,
          avatar_url: avatarUrl,
          height: data.height,
          body_type: data.bodyType,
          age: data.age,
          ethnicity: data.ethnicity,
          hair_color: data.hairColor,
          eye_color: data.eyeColor,
          measurements: data.measurements,
          languages: data.languages,
          availability: data.availability,
          services: data.services,
          rates: data.rates,
          contact_info: data.contactInfo,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });

      navigate(`/profile/${data.username}`);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 neon-text">Edit Profile</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-8">
              <BasicInfoSection form={form} />
              <PhysicalCharacteristicsSection form={form} />
              <ServicesSection form={form} />
              <AboutSection form={form} />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileEdit;
