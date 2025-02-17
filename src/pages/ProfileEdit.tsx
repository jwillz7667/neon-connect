
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfileFormData {
  username: string;
  fullName: string;
  bio: string;
  city: string;
  state: string;
  website: string;
  avatarUrl: string;
  height: string;
  bodyType: string;
  age: number;
  ethnicity: string;
  hairColor: string;
  eyeColor: string;
  measurements: string;
  languages: string[];
  availability: string;
  services: string[];
  rates: {
    hourly?: number;
    daily?: number;
  };
  contactInfo: {
    email?: string;
    phone?: string;
    preferred?: string;
  };
}

const bodyTypes = [
  'Slim',
  'Athletic',
  'Average',
  'Curvy',
  'Plus Size',
];

const hairColors = [
  'Black',
  'Brown',
  'Blonde',
  'Red',
  'Other',
];

const eyeColors = [
  'Brown',
  'Blue',
  'Green',
  'Hazel',
  'Other',
];

const ethnicities = [
  'Asian',
  'Black',
  'Caucasian',
  'Hispanic',
  'Middle Eastern',
  'Mixed',
  'Other',
];

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const form = useForm<ProfileFormData>({
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
      age: 0,
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
        navigate('/membership');
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
        age: profile.age || 0,
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
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      let avatarUrl = data.avatarUrl;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);

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
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 neon-text">Edit Profile</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="glass-card p-6 rounded-lg space-y-6">
              <h2 className="text-xl font-semibold neon-text">Basic Information</h2>
              
              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {field.value && (
                          <img
                            src={field.value}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover"
                          />
                        )}
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        required
                      />
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
            </div>

            {/* Physical Characteristics */}
            <div className="glass-card p-6 rounded-lg space-y-6">
              <h2 className="text-xl font-semibold neon-text">Physical Characteristics</h2>
              
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 5'8&quot;" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bodyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select body type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bodyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ethnicity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ethnicity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ethnicity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ethnicities.map((ethnicity) => (
                          <SelectItem key={ethnicity} value={ethnicity}>
                            {ethnicity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hairColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hair Color</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select hair color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {hairColors.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eyeColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Eye Color</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select eye color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {eyeColors.map((color) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="measurements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Measurements</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 34-26-36" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Services and Availability */}
            <div className="glass-card p-6 rounded-lg space-y-6">
              <h2 className="text-xl font-semibold neon-text">Services & Availability</h2>

              <FormField
                control={form.control}
                name="services"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Services (comma-separated)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value?.join(', ') || ''}
                        onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                        placeholder="e.g., Service 1, Service 2, Service 3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="languages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Languages (comma-separated)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value?.join(', ') || ''}
                        onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                        placeholder="e.g., English, Spanish, French"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe your availability..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Bio */}
            <div className="glass-card p-6 rounded-lg space-y-6">
              <h2 className="text-xl font-semibold neon-text">About Me</h2>

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

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileEdit;
