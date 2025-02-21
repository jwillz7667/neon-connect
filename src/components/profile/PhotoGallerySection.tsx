import type { Database } from '@/types/supabase';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { supabase } from '@/lib/db-helpers';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfilePhoto = Database['public']['Tables']['profile_photos']['Row'];

interface PhotoGallerySectionProps {
  profile: Profile;
  photos: ProfilePhoto[];
}

export function PhotoGallerySection({ profile, photos }: PhotoGallerySectionProps) {
  const getImageUrl = (url: string | null) => {
    if (!url) return '/default-avatar.jpg';
    if (url.startsWith('http')) return url;
    return supabase.storage
      .from('avatars')
      .getPublicUrl(url)
      .data.publicUrl;
  };

  // If no photos and no avatar, don't render the section
  if (!photos?.length && !profile.avatar_url) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <Carousel className="w-full">
        <CarouselContent>
          {/* Avatar photo if it exists */}
          {profile.avatar_url && (
            <CarouselItem>
              <div className="aspect-[3/4] relative">
                <img
                  src={getImageUrl(profile.avatar_url)}
                  alt={`${profile.full_name || profile.username}'s profile`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </CarouselItem>
          )}
          
          {/* Gallery photos */}
          {photos?.map((photo) => (
            <CarouselItem key={photo.id}>
              <div className="aspect-[3/4] relative">
                <img
                  src={getImageUrl(photo.url)}
                  alt={`${profile.full_name || profile.username}'s gallery photo`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Only show navigation if there's more than one photo */}
        {(photos?.length > 1 || (photos?.length > 0 && profile.avatar_url)) && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>
      
      {/* Photo count indicator */}
      <div className="text-center mt-2 text-sm text-gray-500">
        {photos?.length} photo{photos?.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

export default PhotoGallerySection;
