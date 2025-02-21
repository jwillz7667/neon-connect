import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AboutSectionProps {
  profile: Profile;
}

export function AboutSection({ profile }: AboutSectionProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">About</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and information</p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          {/* Basic Information */}
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Bio</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.bio || 'No bio provided'}</dd>
          </div>

          {/* Location */}
          <div>
            <dt className="text-sm font-medium text-gray-500">City</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.city || 'Not specified'}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">State</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.state || 'Not specified'}</dd>
          </div>

          {/* Physical Characteristics */}
          <div>
            <dt className="text-sm font-medium text-gray-500">Height</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.height || 'Not specified'}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Body Type</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.body_type || 'Not specified'}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Age</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.age || 'Not specified'}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Ethnicity</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.ethnicity || 'Not specified'}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Hair Color</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.hair_color || 'Not specified'}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Eye Color</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.eye_color || 'Not specified'}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Measurements</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.measurements || 'Not specified'}</dd>
          </div>

          {/* Languages & Services */}
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Languages</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {profile.languages ? profile.languages.join(', ') : 'Not specified'}
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Services</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {profile.services ? profile.services.join(', ') : 'Not specified'}
            </dd>
          </div>

          {/* Availability */}
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Availability</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.availability || 'Not specified'}</dd>
          </div>

          {/* Contact Information */}
          {profile.website && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Website</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <a 
                  href={profile.website} 
                  className="text-indigo-600 hover:text-indigo-500"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {profile.website}
                </a>
              </dd>
            </div>
          )}

          {/* Provider Information */}
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Provider Since</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {profile.provider_since 
                ? new Date(profile.provider_since).toLocaleDateString() 
                : 'Not specified'}
            </dd>
          </div>

          {/* Status Information */}
          <div>
            <dt className="text-sm font-medium text-gray-500">Verification Status</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.verification_status}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {profile.updated_at 
                ? new Date(profile.updated_at).toLocaleDateString() 
                : 'Not specified'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default AboutSection;
