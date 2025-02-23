import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/profile';
import type { NavigationItem } from '@/types';
import { NavLogo } from '@/assets/images/NavLogo';

export default function Header() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Profile | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navigation, setNavigation] = useState<{
    primary: NavigationItem[];
    secondary: NavigationItem[];
  }>({
    primary: [],
    secondary: []
  });

  useEffect(() => {
    fetchNavigation();
    
    // Get initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchNavigation = async () => {
    try {
      const { data: navItems, error } = await supabase
        .from('navigation_items')
        .select('*')
        .order('sort_order');

      if (error) throw error;

      const primary = navItems.filter(item => item.nav_type === 'primary');
      const secondary = navItems.filter(item => item.nav_type === 'secondary');

      setNavigation({ primary, secondary });
    } catch (error) {
      console.error('Error fetching navigation:', error);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-neon-purple/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <NavLogo className="h-14 w-auto" />
              </Link>
            </div>
            
            {/* Primary Navigation */}
            <div className="hidden md:flex md:ml-8 space-x-8">
              {navigation.primary.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="inline-flex items-center px-1 pt-1 text-lg font-medium text-neon-purple hover:text-cyan-400 transition-all duration-300 hover:shadow-[0_0_10px_#00FFFF]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="search"
                placeholder="Search NeonMeet..."
                className="w-64 bg-black/50 text-white px-4 py-2 rounded-lg border border-neon-purple/20 focus:outline-none focus:border-cyan-400 transition-all duration-300"
              />
            </div>

            {/* Secondary Navigation */}
            {navigation.secondary.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  item.isHighlighted
                    ? 'bg-fuchsia-600 text-white hover:bg-fuchsia-500 hover:shadow-[0_0_20px_#FF00FF]'
                    : 'text-neon-purple hover:text-cyan-400 hover:shadow-[0_0_10px_#00FFFF]'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Auth Section */}
            {loading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-neon-purple" />
            ) : user ? (
              <div className="relative ml-3">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-3 focus:outline-none group"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-neon-purple group-hover:text-neon-purple/80 transition-colors">
                      {user.full_name || user.username}
                    </span>
                    <span className="text-xs text-neon-purple/70 capitalize">
                      {user.role}
                    </span>
                  </div>
                  {user.avatar_url ? (
                    <img
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-neon-purple/50"
                      src={user.avatar_url}
                      alt={user.full_name || ''}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-black/50 flex items-center justify-center ring-2 ring-neon-purple/50">
                      <span className="text-sm font-medium text-neon-purple">
                        {(user.full_name || user.username || '?').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-black/95 ring-1 ring-neon-purple/20 backdrop-blur-lg">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-neon-purple hover:bg-neon-purple/10 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      {user.role === 'provider' && (
                        <>
                          <Link
                            to="/dashboard"
                            className="block px-4 py-2 text-sm text-neon-purple hover:bg-neon-purple/10 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/settings"
                            className="block px-4 py-2 text-sm text-neon-purple hover:bg-neon-purple/10 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Settings
                          </Link>
                        </>
                      )}
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-neon-purple hover:bg-neon-purple/10 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-neon-purple hover:text-[#FF00FF] px-3 py-2 rounded-md text-sm font-medium transition-colors hover:shadow-[0_0_10px_#FF00FF]"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-transparent border-2 border-neon-purple text-neon-purple rounded-md transition-all duration-300 hover:bg-neon-purple/10 hover:shadow-[0_0_20px_#FF00FF]"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neon-purple hover:text-cyan-400 hover:bg-neon-purple/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neon-purple transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 border-t border-neon-purple/20">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.primary.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-neon-purple hover:bg-neon-purple/10 hover:border-neon-purple transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {navigation.secondary.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-neon-purple hover:bg-neon-purple/10 hover:border-neon-purple transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {user && (
            <div className="pt-4 pb-3 border-t border-neon-purple/20">
              <div className="flex items-center px-4">
                {user.avatar_url ? (
                  <img
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-neon-purple/50"
                    src={user.avatar_url}
                    alt={user.full_name || ''}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-black/50 flex items-center justify-center ring-2 ring-neon-purple/50">
                    <span className="text-sm font-medium text-neon-purple">
                      {(user.full_name || user.username || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="ml-3">
                  <div className="text-base font-medium text-neon-purple">
                    {user.full_name || user.username}
                  </div>
                  <div className="text-sm font-medium text-neon-purple/70 capitalize">
                    {user.role}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-neon-purple hover:bg-neon-purple/10 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Your Profile
                </Link>
                {user.role === 'provider' && (
                  <>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-base font-medium text-neon-purple hover:bg-neon-purple/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-base font-medium text-neon-purple hover:bg-neon-purple/10 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left block px-4 py-2 text-base font-medium text-neon-purple hover:bg-neon-purple/10 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
