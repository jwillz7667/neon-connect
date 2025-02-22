import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/profile';
import HeroSection from '@/components/home/HeroSection';

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
      className="glass-card hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all duration-300"
    >
      <div className="px-4 py-5 sm:px-6">
        <div className="flex items-center">
          {profile.avatar_url ? (
            <img
              className="h-16 w-16 rounded-full object-cover ring-2 ring-neon-cyan/50"
              src={profile.avatar_url}
              alt={profile.full_name || ''}
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-black/50 flex items-center justify-center ring-2 ring-neon-cyan/50">
              <span className="text-2xl font-medium text-neon-cyan">
                {(profile.full_name || '?').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="ml-4">
            <h3 className="text-lg font-medium text-neon-cyan">
              {profile.full_name || 'Anonymous'}
            </h3>
            <div className="flex items-center mt-1">
              <p className="text-sm text-neon-cyan/70">
                {profile.city}
              </p>
              {profile.verification_status === 'approved' && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6 border-t border-neon-cyan/20">
        <p className="text-sm text-foreground/80 line-clamp-2">
          {profile.bio || 'No bio provided'}
        </p>
      </div>

      <div className="px-4 py-4 sm:px-6 border-t border-neon-cyan/20">
        <button
          onClick={() => navigate(`/profile/${profile.id}`)}
          className="neon-button w-full justify-center"
        >
          View Profile
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection verifiedCount={verifiedCount} />

      {/* Featured Providers */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold neon-text">Featured Providers</h2>
          <p className="mt-4 text-lg text-foreground/80">
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
              className="neon-button-magenta"
            >
              View All Verified Providers
            </button>
          </div>
        )}
      </div>

      {/* Recent Providers */}
      <div className="border-t border-neon-cyan/20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold neon-text">New Providers</h2>
            <p className="mt-4 text-lg text-foreground/80">
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
                className="neon-button"
              >
                View All Providers
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-neon-cyan/20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            <span className="block text-foreground">Ready to get started?</span>
            <span className="block text-neon-cyan">Join our community today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 gap-4">
            <button
              onClick={() => navigate('/provider/onboarding')}
              className="neon-button"
            >
              Become a Provider
            </button>
            <button
              onClick={() => navigate('/membership')}
              className="neon-button-magenta"
            >
              View Membership Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
