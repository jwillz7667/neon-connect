import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/db-helpers';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserRole = Database['public']['Enums']['user_role'];
type VerificationStatus = Database['public']['Enums']['verification_status'];

interface LocationFilters {
  city?: string;
  state?: string;
  role?: UserRole;
  verification_status?: VerificationStatus;
}

export default function LocationPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filters, setFilters] = useState<LocationFilters>({
    city: searchParams.get('city') || undefined,
    state: searchParams.get('state') || undefined,
    role: (searchParams.get('role') as UserRole) || undefined,
    verification_status: (searchParams.get('verification_status') as VerificationStatus) || undefined
  });
  const [uniqueLocations, setUniqueLocations] = useState<{
    cities: string[];
    states: string[];
  }>({ cities: [], states: [] });

  useEffect(() => {
    async function fetchLocations() {
      // Fetch unique cities and states
      const { data: cities, error: citiesError } = await supabase
        .from('profiles')
        .select('city')
        .not('city', 'is', null)
        .order('city');

      const { data: states, error: statesError } = await supabase
        .from('profiles')
        .select('state')
        .not('state', 'is', null)
        .order('state');

      if (citiesError || statesError) {
        console.error('Error fetching locations:', citiesError || statesError);
        return;
      }

      setUniqueLocations({
        cities: Array.from(new Set(cities?.map(p => p.city).filter(Boolean) as string[])),
        states: Array.from(new Set(states?.map(p => p.state).filter(Boolean) as string[]))
      });
    }

    fetchLocations();
  }, []);

  useEffect(() => {
    async function fetchProfiles() {
      setLoading(true);

      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.city) {
        query = query.eq('city', filters.city);
      }
      if (filters.state) {
        query = query.eq('state', filters.state);
      }
      if (filters.role) {
        query = query.eq('role', filters.role);
      }
      if (filters.verification_status) {
        query = query.eq('verification_status', filters.verification_status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching profiles:', error);
        return;
      }

      setProfiles(data || []);
      setLoading(false);
    }

    fetchProfiles();

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = (key: keyof LocationFilters, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Find by Location</h2>
          <p className="mt-2 text-lg text-gray-600">
            Search profiles by location and filters
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-8">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-4">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <select
                id="state"
                value={filters.state || ''}
                onChange={(e) => handleFilterChange('state', e.target.value || undefined)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All States</option>
                {uniqueLocations.states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <select
                id="city"
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All Cities</option>
                {uniqueLocations.cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                value={filters.role || ''}
                onChange={(e) => handleFilterChange('role', e.target.value as UserRole || undefined)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="provider">Provider</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label htmlFor="verification_status" className="block text-sm font-medium text-gray-700">
                Verification Status
              </label>
              <select
                id="verification_status"
                value={filters.verification_status || ''}
                onChange={(e) => handleFilterChange('verification_status', e.target.value as VerificationStatus || undefined)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
            >
              <div className="px-4 py-5 sm:px-6">
                {/* Avatar and Name */}
                <div className="flex items-center">
                  {profile.avatar_url && (
                    <img
                      className="h-12 w-12 rounded-full"
                      src={profile.avatar_url}
                      alt={profile.full_name || ''}
                    />
                  )}
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {profile.full_name || profile.username || 'Anonymous'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {profile.city}, {profile.state}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-4 sm:px-6">
                {/* Profile Details */}
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.role}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.verification_status}</dd>
                  </div>
                  {profile.services && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Services</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {profile.services.join(', ')}
                      </dd>
                    </div>
                  )}
                </dl>
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
          ))}
        </div>

        {profiles.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No profiles found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your filters to find more results
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
