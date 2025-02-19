import React from 'react';
import { FormSectionProps } from '@/types/profile';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';

const PhotoGallerySection: React.FC<FormSectionProps> = ({ form }) => {
  const photos = form.watch('photos') || [];
  const maxPhotos = 10;

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const remainingSlots = maxPhotos - photos.length;
    const validFiles = files.slice(0, remainingSlots);

    if (validFiles.length > 0) {
      form.setValue('photoFiles', [
        ...(form.getValues('photoFiles') || []),
        ...validFiles
      ]);
    }
  };

  const removePhoto = (index: number) => {
    const currentPhotos = form.getValues('photos');
    const updatedPhotos = [...currentPhotos];
    updatedPhotos.splice(index, 1);
    form.setValue('photos', updatedPhotos);
  };

  const removePhotoFile = (index: number) => {
    const currentFiles = form.getValues('photoFiles') || [];
    const updatedFiles = [...currentFiles];
    updatedFiles.splice(index, 1);
    form.setValue('photoFiles', updatedFiles);
  };

  return (
    <div className="glass-card p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-6 neon-text">Photo Gallery</h2>
      
      <FormField
        control={form.control}
        name="photos"
        render={() => (
          <FormItem>
            <FormLabel>Photos (Max 10)</FormLabel>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {/* Existing Photos */}
              {photos.map((photo, index) => (
                <div key={photo.id} className="relative aspect-square">
                  <img
                    src={photo.url}
                    alt={`Gallery photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {/* Photo Files Preview */}
              {(form.watch('photoFiles') || []).map((file: File, index: number) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => removePhotoFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {/* Upload Button */}
              {photos.length + (form.watch('photoFiles')?.length || 0) < maxPhotos && (
                <label className="aspect-square flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary">
                  <div className="text-center">
                    <ImagePlus className="mx-auto h-8 w-8 mb-2" />
                    <span className="text-sm">Add Photo</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PhotoGallerySection; 