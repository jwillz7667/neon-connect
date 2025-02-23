import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSupabase } from '@/lib/supabase';
import { Profile } from '@/types/profile';

const CategoryPage = () => {
  const [searchParams] = useSearchParams();
  const state = searchParams.get('state');
  const [providers, setProviders] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const supabase = getSupabase();
        
        let query = supabase
          .from('profiles')
          .select('*')
          .eq('role', 'provider');

        if (state) {
          query = query.eq('state', state);
        }

        const { data, error } = await query;

        if (error) throw error;
        setProviders(data || []);
      } catch (err) {
        console.error('Error fetching providers:', err);
        setError('Failed to load providers');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [state]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {state ? `Providers in ${state}` : 'All Providers'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <div 
            key={provider.id} 
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition"
          >
            <img 
              src={provider.avatar_url || '/default-avatar.png'} 
              alt={provider.username || 'Provider'} 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{provider.username}</h2>
            <p className="text-gray-400">{provider.bio}</p>
          </div>
        ))}
      </div>

      {providers.length === 0 && (
        <p className="text-center text-gray-400">No providers found</p>
      )}
    </div>
  );
};

export default CategoryPage; 