import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/db-helpers';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserRole = Database['public']['Enums']['user_role'];
type VerificationStatus = Database['public']['Enums']['verification_status'];

export default function IndexPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [featuredProfiles, setFeaturedProfiles] = useState<Profile[]>([]);
  const [recentProfiles, setRecentProfiles] = useState<Profile[]>([]);
  const [verifiedCount, setVerifiedCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      // Fetch featured verified providers
      const { data: featured, error: featuredError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'provider')
        .eq('verification_status', 'approved')
        .order('created_at', { ascending: false })
        .limit(6);

      if (featuredError) {
        console.error('Error fetching featured profiles:', featuredError);
      } else {
        setFeaturedProfiles(featured || []);
      }

      // Fetch recent providers
      const { data: recent, error: recentError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'provider')
        .order('created_at', { ascending: false })
        .limit(8);

      if (recentError) {
        console.error('Error fetching recent profiles:', recentError);
      } else {
        setRecentProfiles(recent || []);
      }

      // Get count of verified providers
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'provider')
        .eq('verification_status', 'approved');

      if (countError) {
        console.error('Error fetching verified count:', countError);
      } else {
        setVerifiedCount(count || 0);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const renderProfileCard = (profile: Profile) => (
    <div
      key={profile.id}
      className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center">
          {profile.avatar_url && (
            <img
              className="h-16 w-16 rounded-full object-cover"
              src={profile.avatar_url}
              alt={profile.full_name || ''}
            />
          )}
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              {profile.full_name || profile.username || 'Anonymous'}
            </h3>
            <div className="flex items-center mt-1">
              <p className="text-sm text-gray-500">
                {profile.city}, {profile.state}
              </p>
              {profile.verification_status === 'approved' && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6">
        <p className="text-sm text-gray-500 line-clamp-2">
          {profile.bio || 'No bio provided'}
        </p>
        {profile.services && profile.services.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">
              {profile.services.slice(0, 3).map((service, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {service}
                </span>
              ))}
              {profile.services.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  +{profile.services.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-4 sm:px-6">
        <button
          onClick={() => navigate(`/profile/${profile.id}`)}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View Profile
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              Find Verified Providers
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100">
              Connect with {verifiedCount.toLocaleString()} verified providers in your area
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <button
                onClick={() => navigate('/location')}
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
              >
                Search by Location
              </button>
              <button
                onClick={() => navigate('/provider/onboarding')}
                className="px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-500 md:py-4 md:text-lg md:px-10"
              >
                Become a Provider
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Providers */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Featured Providers</h2>
          <p className="mt-4 text-lg text-gray-500">
            Discover our top verified providers
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProfiles.map(renderProfileCard)}
        </div>

        {featuredProfiles.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/location?verification_status=approved')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              View All Verified Providers
            </button>
          </div>
        )}
      </div>

      {/* Recent Providers */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">New Providers</h2>
            <p className="mt-4 text-lg text-gray-500">
              Recently joined professionals
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recentProfiles.map(renderProfileCard)}
          </div>

          {recentProfiles.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/location')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                View All Providers
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-indigo-600">Join our community today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button
                onClick={() => navigate('/provider/onboarding')}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Become a Provider
              </button>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <button
                onClick={() => navigate('/membership')}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                View Membership Plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
