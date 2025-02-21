import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/db-helpers';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserRole = Database['public']['Enums']['user_role'];
type VerificationStatus = Database['public']['Enums']['verification_status'];

interface SearchFilters {
  query?: string;
  city?: string;
  state?: string;
  role?: UserRole;
  verification_status?: VerificationStatus;
  services?: string[];
  age_min?: number;
  age_max?: number;
  ethnicity?: string;
  body_type?: string;
  hair_color?: string;
  eye_color?: string;
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('query') || undefined,
    city: searchParams.get('city') || undefined,
    state: searchParams.get('state') || undefined,
    role: (searchParams.get('role') as UserRole) || undefined,
    verification_status: (searchParams.get('verification_status') as VerificationStatus) || undefined,
    services: searchParams.get('services')?.split(',') || undefined,
    age_min: searchParams.get('age_min') ? parseInt(searchParams.get('age_min')!) : undefined,
    age_max: searchParams.get('age_max') ? parseInt(searchParams.get('age_max')!) : undefined,
    ethnicity: searchParams.get('ethnicity') || undefined,
    body_type: searchParams.get('body_type') || undefined,
    hair_color: searchParams.get('hair_color') || undefined,
    eye_color: searchParams.get('eye_color') || undefined
  });

  const [uniqueValues, setUniqueValues] = useState<{
    cities: string[];
    states: string[];
    ethnicities: string[];
    body_types: string[];
    hair_colors: string[];
    eye_colors: string[];
    services: string[];
  }>({
    cities: [],
    states: [],
    ethnicities: [],
    body_types: [],
    hair_colors: [],
    eye_colors: [],
    services: []
  });

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    async function fetchUniqueValues() {
      const fetchDistinct = async (column: string) => {
        const { data, error } = await supabase
          .from('profiles')
          .select(column)
          .not(column, 'is', null)
          .order(column);

        if (error) {
          console.error(`Error fetching ${column}:`, error);
          return [];
        }

        return Array.from(new Set(data.map(item => item[column]).filter(Boolean)));
      };

      const [
        cities,
        states,
        ethnicities,
        body_types,
        hair_colors,
        eye_colors,
        servicesData
      ] = await Promise.all([
        fetchDistinct('city'),
        fetchDistinct('state'),
        fetchDistinct('ethnicity'),
        fetchDistinct('body_type'),
        fetchDistinct('hair_color'),
        fetchDistinct('eye_color'),
        supabase
          .from('profiles')
          .select('services')
          .not('services', 'is', null)
      ]);

      const allServices = new Set<string>();
      servicesData.data?.forEach(profile => {
        profile.services?.forEach(service => allServices.add(service));
      });

      setUniqueValues({
        cities: cities as string[],
        states: states as string[],
        ethnicities: ethnicities as string[],
        body_types: body_types as string[],
        hair_colors: hair_colors as string[],
        eye_colors: eye_colors as string[],
        services: Array.from(allServices).sort()
      });
    }

    fetchUniqueValues();
  }, []);

  useEffect(() => {
    async function fetchProfiles() {
      setLoading(true);
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.role) {
        query = query.eq('role', filters.role);
      }
      if (filters.verification_status) {
        query = query.eq('verification_status', filters.verification_status);
      }
      if (filters.city) {
        query = query.eq('city', filters.city);
      }
      if (filters.state) {
        query = query.eq('state', filters.state);
      }
      if (filters.ethnicity) {
        query = query.eq('ethnicity', filters.ethnicity);
      }
      if (filters.body_type) {
        query = query.eq('body_type', filters.body_type);
      }
      if (filters.hair_color) {
        query = query.eq('hair_color', filters.hair_color);
      }
      if (filters.eye_color) {
        query = query.eq('eye_color', filters.eye_color);
      }
      if (filters.age_min) {
        query = query.gte('age', filters.age_min);
      }
      if (filters.age_max) {
        query = query.lte('age', filters.age_max);
      }
      if (filters.services?.length) {
        query = query.contains('services', filters.services);
      }
      if (filters.query) {
        query = query.or(`username.ilike.%${filters.query}%,full_name.ilike.%${filters.query}%,bio.ilike.%${filters.query}%`);
      }

      // Add pagination
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query
        .order('created_at', { ascending: false })
        .range(from, to);

      const { data, count, error } = await query;

      if (error) {
        console.error('Error fetching profiles:', error);
        return;
      }

      setProfiles(data || []);
      setTotalCount(count || 0);
      setLoading(false);
    }

    fetchProfiles();

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          params.set(key, value.join(','));
        } else {
          params.set(key, value.toString());
        }
      }
    });
    if (page > 1) {
      params.set('page', page.toString());
    }
    setSearchParams(params);
  }, [filters, page, setSearchParams]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
    setPage(1);
  };

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
        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          {profile.age && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Age</dt>
              <dd className="mt-1 text-sm text-gray-900">{profile.age}</dd>
            </div>
          )}
          {profile.ethnicity && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Ethnicity</dt>
              <dd className="mt-1 text-sm text-gray-900">{profile.ethnicity}</dd>
            </div>
          )}
          {profile.body_type && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Body Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{profile.body_type}</dd>
            </div>
          )}
          {profile.height && (
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Height</dt>
              <dd className="mt-1 text-sm text-gray-900">{profile.height}</dd>
            </div>
          )}
        </dl>

        <div className="mt-4">
          <p className="text-sm text-gray-500 line-clamp-2">
            {profile.bio || 'No bio provided'}
          </p>
        </div>

        {profile.services && profile.services.length > 0 && (
          <div className="mt-4">
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

  if (loading && !profiles.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Search Profiles</h2>
          <p className="mt-2 text-lg text-gray-600">
            {totalCount} profiles found
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-8">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="query" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                name="query"
                id="query"
                value={filters.query || ''}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                placeholder="Search by name, username, or bio"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <select
                id="state"
                value={filters.state || ''}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All States</option>
                {uniqueValues.states.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <select
                id="city"
                value={filters.city || ''}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All Cities</option>
                {uniqueValues.cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="ethnicity" className="block text-sm font-medium text-gray-700">
                Ethnicity
              </label>
              <select
                id="ethnicity"
                value={filters.ethnicity || ''}
                onChange={(e) => handleFilterChange('ethnicity', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All Ethnicities</option>
                {uniqueValues.ethnicities.map((ethnicity) => (
                  <option key={ethnicity} value={ethnicity}>{ethnicity}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="body_type" className="block text-sm font-medium text-gray-700">
                Body Type
              </label>
              <select
                id="body_type"
                value={filters.body_type || ''}
                onChange={(e) => handleFilterChange('body_type', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All Body Types</option>
                {uniqueValues.body_types.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="verification_status" className="block text-sm font-medium text-gray-700">
                Verification Status
              </label>
              <select
                id="verification_status"
                value={filters.verification_status || ''}
                onChange={(e) => handleFilterChange('verification_status', e.target.value as VerificationStatus)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="hair_color" className="block text-sm font-medium text-gray-700">
                Hair Color
              </label>
              <select
                id="hair_color"
                value={filters.hair_color || ''}
                onChange={(e) => handleFilterChange('hair_color', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All Hair Colors</option>
                {uniqueValues.hair_colors.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="eye_color" className="block text-sm font-medium text-gray-700">
                Eye Color
              </label>
              <select
                id="eye_color"
                value={filters.eye_color || ''}
                onChange={(e) => handleFilterChange('eye_color', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All Eye Colors</option>
                {uniqueValues.eye_colors.map((color) => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="age_min" className="block text-sm font-medium text-gray-700">
                Age Range
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="number"
                  id="age_min"
                  min="18"
                  max="99"
                  value={filters.age_min || ''}
                  onChange={(e) => handleFilterChange('age_min', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Min"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <input
                  type="number"
                  id="age_max"
                  min="18"
                  max="99"
                  value={filters.age_max || ''}
                  onChange={(e) => handleFilterChange('age_max', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Max"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">Services</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {uniqueValues.services.map((service) => (
                  <button
                    key={service}
                    onClick={() => {
                      const currentServices = filters.services || [];
                      const newServices = currentServices.includes(service)
                        ? currentServices.filter(s => s !== service)
                        : [...currentServices, service];
                      handleFilterChange('services', newServices.length ? newServices : undefined);
                    }}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      filters.services?.includes(service)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map(renderProfileCard)}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === pageNum
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}

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
