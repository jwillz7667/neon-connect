import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface BasicInfoSectionProps {
  profile: Profile;
}

export function BasicInfoSection({ profile }: BasicInfoSectionProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Basic Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and contact information</p>
      </div>

      <div className="border-t border-gray-200">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 p-6">
          {/* Username */}
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Username</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.username || 'Not specified'}</dd>
          </div>

          {/* Full Name */}
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Full Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.full_name || 'Not specified'}</dd>
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.email || 'Not specified'}</dd>
          </div>

          {/* Bio */}
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Bio</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{profile.bio || 'No bio provided'}</dd>
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

          {/* Website */}
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

          {/* Languages */}
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Languages</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {profile.languages ? profile.languages.join(', ') : 'Not specified'}
            </dd>
          </div>

          {/* Role and Verification Status */}
          <div>
            <dt className="text-sm font-medium text-gray-500">Role</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.role}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Verification Status</dt>
            <dd className="mt-1 text-sm text-gray-900">{profile.verification_status}</dd>
          </div>

          {/* Provider Since */}
          <div>
            <dt className="text-sm font-medium text-gray-500">Provider Since</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {profile.provider_since 
                ? new Date(profile.provider_since).toLocaleDateString()
                : 'Not specified'}
            </dd>
          </div>

          {/* Last Updated */}
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

export default BasicInfoSection;
