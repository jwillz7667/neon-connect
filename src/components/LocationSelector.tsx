import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { State } from '@/types';

interface LocationSelectorProps {
  layout?: 'grid' | 'list';
  className?: string;
  selectedState: string;
  onStateChange: (state: string) => void;
}

interface CategoryCount {
  all: number;
  new: number;
  vip: number;
  xxxStars: number;
  visiting: number;
  availableNow: number;
  verified: number;
  superBusty: number;
  mature: number;
  collegeGirls: number;
  video: number;
}

export default function LocationSelector({ 
  layout = 'grid', 
  className,
  selectedState,
  onStateChange 
}: LocationSelectorProps) {
  const navigate = useNavigate();
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount>({
    all: 0,
    new: 0,
    vip: 0,
    xxxStars: 0,
    visiting: 0,
    availableNow: 0,
    verified: 0,
    superBusty: 0,
    mature: 0,
    collegeGirls: 0,
    video: 0
  });

  useEffect(() => {
    fetchStates();
    fetchCategoryCounts();
  }, [selectedState]);

  const fetchStates = async () => {
    try {
      const { data, error } = await supabase
        .from('states')
        .select('*')
        .order('name');

      if (error) throw error;
      setStates(data || []);
    } catch (error) {
      console.error('Error fetching states:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryCounts = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'provider')
        .eq(selectedState ? 'state' : 'id', selectedState || 'id');

      if (error) throw error;

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      setCategoryCounts({
        all: profiles.length,
        new: profiles.filter(p => new Date(p.created_at) > oneWeekAgo).length,
        vip: profiles.filter(p => p.is_vip).length,
        xxxStars: profiles.filter(p => p.is_xxx_star).length,
        visiting: profiles.filter(p => p.is_visiting).length,
        availableNow: profiles.filter(p => p.is_available).length,
        verified: profiles.filter(p => p.verification_status === 'approved').length,
        superBusty: profiles.filter(p => p.body_type === 'busty').length,
        mature: profiles.filter(p => p.age >= 40).length,
        collegeGirls: profiles.filter(p => p.age <= 25).length,
        video: profiles.filter(p => p.has_video).length
      });
    } catch (error) {
      console.error('Error fetching category counts:', error);
    }
  };

  const handleStateSelect = (path: string) => {
    navigate(`/category?state=${path}`);
    onStateChange(path);
  };

  if (loading) {
    return (
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-pulse">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-black/50 rounded-lg border border-neon-purple/20"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Categories */}
        <div className="md:w-1/4 space-y-2">
          <h3 className="text-xl font-bold text-neon-purple mb-4">Categories</h3>
          <button
            onClick={() => navigate('/category/all')}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-black/50 text-neon-purple hover:text-cyan-400 transition-all duration-300"
          >
            All Escorts ({categoryCounts.all})
          </button>
          <button
            onClick={() => navigate('/category/new')}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-black/50 text-neon-purple hover:text-cyan-400 transition-all duration-300"
          >
            What's New ({categoryCounts.new})
          </button>
          <button
            onClick={() => navigate('/category/vip')}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-black/50 text-neon-purple hover:text-cyan-400 transition-all duration-300"
          >
            VIP ({categoryCounts.vip})
          </button>
          <button
            onClick={() => navigate('/category/xxx-stars')}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-black/50 text-neon-purple hover:text-cyan-400 transition-all duration-300"
          >
            XXX Stars ({categoryCounts.xxxStars})
          </button>
          <button
            onClick={() => navigate('/category/visiting')}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-black/50 text-neon-purple hover:text-cyan-400 transition-all duration-300"
          >
            Visiting ({categoryCounts.visiting})
          </button>
          <button
            onClick={() => navigate('/category/available')}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-black/50 text-neon-purple hover:text-cyan-400 transition-all duration-300"
          >
            Available Now ({categoryCounts.availableNow})
          </button>
          <button
            onClick={() => navigate('/category/verified')}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-black/50 text-neon-purple hover:text-cyan-400 transition-all duration-300"
          >
            Verified ({categoryCounts.verified})
          </button>
          <button
            onClick={() => navigate('/category/busty')}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-black/50 text-neon-purple hover:text-cyan-400 transition-all duration-300"
          >
            Super Busty ({categoryCounts.superBusty})
          </button>
          <button
            onClick={() => navigate('/category/mature')}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-black/50 text-neon-purple hover:text-cyan-400 transition-all duration-300"
          >
            Mature ({categoryCounts.mature})
          </button>
          <button
            onClick={() => navigate('/category/college')}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-black/50 text-neon-purple hover:text-cyan-400 transition-all duration-300"
          >
            College Girls ({categoryCounts.collegeGirls})
          </button>
          <button
            onClick={() => navigate('/category/video')}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-black/50 text-neon-purple hover:text-cyan-400 transition-all duration-300"
          >
            Video ({categoryCounts.video})
          </button>
        </div>

        {/* States Grid */}
        <div className="md:w-3/4">
          <h2 className="text-2xl font-bold text-center mb-8 text-neon-purple">
            Select a location below to see beautiful entertainers across the NeonMeet network!
          </h2>
          
          {layout === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {states.map((state) => (
                <button
                  key={state.id}
                  onClick={() => handleStateSelect(state.path)}
                  className="group relative flex flex-col items-center justify-center p-6 rounded-lg border border-neon-purple/20 bg-black/50 hover:bg-black/70 transition-all duration-300 hover:shadow-[0_0_20px_#00FFFF]"
                >
                  <span className="text-lg font-medium text-neon-purple group-hover:text-cyan-400 transition-colors">
                    {state.name}
                  </span>
                  {state.providerCount > 0 && (
                    <span className="mt-1 text-sm text-neon-purple/70">
                      {state.providerCount} Providers
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {states.map((state) => (
                <button
                  key={state.id}
                  onClick={() => handleStateSelect(state.path)}
                  className="w-full flex items-center justify-between p-4 rounded-lg border border-neon-purple/20 bg-black/50 hover:bg-black/70 transition-all duration-300 hover:shadow-[0_0_20px_#00FFFF]"
                >
                  <span className="text-lg font-medium text-neon-purple">
                    {state.name}
                  </span>
                  {state.providerCount > 0 && (
                    <span className="text-sm text-neon-purple/70">
                      {state.providerCount} Providers
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
