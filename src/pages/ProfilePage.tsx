import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserRole = Database['public']['Enums']['user_role'];
type VerificationStatus = Database['public']['Enums']['verification_status'];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function getProfile() {
      // Get current authenticated user
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        navigate('/login');
        return;
      }
      
      setCurrentUserId(authData.user.id);

      // Fetch profile data
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(profileData);
      setLoading(false);
    }

    getProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Profile not found</h2>
          <p className="mt-2 text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and preferences</p>
            </div>
            {currentUserId === profile?.id && (
              <button
                onClick={() => navigate('/profile/edit')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              {/* Basic Information */}
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Username</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.username || 'Not set'}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.full_name || 'Not set'}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.email || 'Not set'}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Bio</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.bio || 'No bio provided'}</dd>
              </div>

              {/* Location Information */}
              <div>
                <dt className="text-sm font-medium text-gray-500">City</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.city || 'Not set'}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">State</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.state || 'Not set'}</dd>
              </div>

              {/* Physical Characteristics */}
              <div>
                <dt className="text-sm font-medium text-gray-500">Height</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.height || 'Not set'}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Body Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.body_type || 'Not set'}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Age</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.age || 'Not set'}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Ethnicity</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.ethnicity || 'Not set'}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Hair Color</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.hair_color || 'Not set'}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Eye Color</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.eye_color || 'Not set'}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Measurements</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.measurements || 'Not set'}</dd>
              </div>

              {/* Professional Information */}
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Languages</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.languages ? profile.languages.join(', ') : 'Not set'}
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Availability</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.availability || 'Not set'}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Services</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.services ? profile.services.join(', ') : 'Not set'}
                </dd>
              </div>

              {/* Contact & Rates */}
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Website</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.website ? (
                    <a href={profile.website} className="text-indigo-600 hover:text-indigo-500" target="_blank" rel="noopener noreferrer">
                      {profile.website}
                    </a>
                  ) : 'Not set'}
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Contact Information</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.contact_info ? (
                    <pre className="whitespace-pre-wrap">{JSON.stringify(profile.contact_info, null, 2)}</pre>
                  ) : 'Not set'}
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Rates</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.rates ? (
                    <pre className="whitespace-pre-wrap">{JSON.stringify(profile.rates, null, 2)}</pre>
                  ) : 'Not set'}
                </dd>
              </div>

              {/* Status Information */}
              <div>
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.role}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Verification Status</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile.verification_status}</dd>
              </div>

              {/* Timestamps */}
              <div>
                <dt className="text-sm font-medium text-gray-500">Provider Since</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.provider_since ? new Date(profile.provider_since).toLocaleDateString() : 'Not set'}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Not set'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
