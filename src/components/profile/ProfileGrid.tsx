import { Link } from 'react-router-dom';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileGridProps {
  profiles: Profile[];
  loading?: boolean;
}

export function ProfileGrid({ profiles, loading = false }: ProfileGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white shadow rounded-lg p-4 animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!profiles?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No profiles found</h3>
        <p className="mt-2 text-sm text-gray-500">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {profiles.map((profile) => (
        <Link
          key={profile.id}
          to={`/profile/${profile.username}`}
          className="group bg-white shadow hover:shadow-lg rounded-lg overflow-hidden transition-shadow duration-200"
        >
          {/* Profile Card */}
          <div className="relative">
            {/* Avatar/Main Image */}
            <div className="aspect-[3/4] bg-gray-100">
              <img
                src={profile.avatar_url || '/default-avatar.jpg'}
                alt={`${profile.full_name || profile.username}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Verification Badge */}
            {profile.verification_status === 'verified' && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                Verified
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="p-4">
            {/* Basic Info */}
            <h3 className="font-medium text-gray-900 truncate">
              {profile.full_name || profile.username}
            </h3>
            
            <div className="mt-1 text-sm text-gray-500 space-y-1">
              {/* Location */}
              {(profile.city || profile.state) && (
                <p className="truncate">
                  {[profile.city, profile.state].filter(Boolean).join(', ')}
                </p>
              )}
              
              {/* Age */}
              {profile.age && (
                <p>Age: {profile.age}</p>
              )}

              {/* Languages */}
              {profile.languages && profile.languages.length > 0 && (
                <p className="truncate">
                  Speaks: {profile.languages.join(', ')}
                </p>
              )}
            </div>

            {/* Services Preview */}
            {profile.services && profile.services.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 truncate">
                  Services: {profile.services.slice(0, 2).join(', ')}
                  {profile.services.length > 2 && '...'}
                </p>
              </div>
            )}

            {/* Provider Status */}
            {profile.provider_since && (
              <div className="mt-2 text-xs text-gray-400">
                Provider since {new Date(profile.provider_since).getFullYear()}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ProfileGrid; 