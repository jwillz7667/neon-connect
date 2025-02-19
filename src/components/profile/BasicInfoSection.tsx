import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { validateImage, optimizeImage } from '@/lib/image-utils';
import { useToast } from '@/components/ui/use-toast';
import { ProfileFormData } from '@/types/profile';

interface BasicInfoSectionProps {
  form: UseFormReturn<ProfileFormData>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
  const { toast } = useToast();
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    try {
      // Validate image
      const validationError = await validateImage(file);
      if (validationError) {
        toast({
          title: 'Invalid Image',
          description: validationError.message,
          variant: 'destructive',
        });
        return;
      }

      // Optimize image
      const optimizedFile = await optimizeImage(file);
      form.setValue('avatarFile', optimizedFile);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(optimizedFile);
      form.setValue('avatarUrl', previewUrl);

      toast({
        title: 'Image Processed',
        description: 'Your profile picture has been optimized and is ready to upload.',
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: 'Error',
        description: 'Failed to process image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessingImage(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

      <div className="flex items-center space-x-4 mb-6">
        {form.watch('avatarUrl') && (
          <img
            src={form.watch('avatarUrl')}
            alt="Profile preview"
            className="w-24 h-24 rounded-full object-cover"
          />
        )}
        <div>
          <Button
            type="button"
            variant="outline"
            disabled={isProcessingImage}
            onClick={() => document.getElementById('avatar-upload')?.click()}
          >
            {isProcessingImage ? 'Processing...' : 'Upload Photo'}
          </Button>
          <input
            id="avatar-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleImageChange}
            disabled={isProcessingImage}
          />
          <p className="text-sm text-gray-400 mt-2">
            Supported formats: JPEG, PNG, WebP. Max size: 5MB
          </p>
        </div>
      </div>

      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input {...field} />
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
              <Input {...field} />
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
              <Textarea {...field} />
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
                <Input {...field} />
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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
  );
};

export default BasicInfoSection;
