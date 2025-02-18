
import React from 'react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu";
import { Search, Crown, Menu, User, Bell, Home } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account."
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const navigateToProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
      
      if (profile?.username) {
        navigate(`/profile/${profile.username}`);
      } else {
        navigate('/profile/edit');
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 md:gap-8">
            <Link to="/" className="text-xl md:text-2xl font-bold neon-text whitespace-nowrap">
              Adult Connect
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="flex gap-4">
                <NavigationMenuItem>
                  <Link to="/" className="flex items-center gap-2 text-white/90 hover:text-primary transition-colors">
                    <Home size={20} />
                    <span>Home</span>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white/90 hover:text-primary hover:bg-transparent data-[state=open]:bg-transparent">
                    Discover
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-[220px] bg-black/95 border border-primary/20">
                    <ul className="p-2 space-y-1">
                      <li>
                        <Link to="/search" className="block px-4 py-2 rounded hover:bg-primary/10 text-white/90 transition-colors">
                          Browse Profiles
                        </Link>
                      </li>
                      <li>
                        <Link to="/categories" className="block px-4 py-2 rounded hover:bg-primary/10 text-white/90 transition-colors">
                          Categories
                        </Link>
                      </li>
                      <li>
                        <Link to="/featured" className="block px-4 py-2 rounded hover:bg-primary/10 text-white/90 transition-colors">
                          Featured
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/search" className="p-2 text-white/90 hover:text-primary transition-colors rounded-full hover:bg-white/5">
              <Search size={20} />
            </Link>
            
            <Link to="/notifications" className="p-2 text-white/90 hover:text-primary transition-colors rounded-full hover:bg-white/5">
              <Bell size={20} />
            </Link>

            <div className="relative">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem className="relative">
                    <NavigationMenuTrigger className="bg-transparent text-white/90 hover:text-primary hover:bg-transparent data-[state=open]:bg-transparent p-2">
                      <User size={20} />
                    </NavigationMenuTrigger>
                    <div className="absolute top-full right-0 transform -translate-x-[90%] pt-2">
                      <NavigationMenuContent className="relative min-w-[220px] bg-black/95 border border-primary/20 shadow-lg">
                        <ul className="p-2 space-y-1">
                          <li>
                            <button 
                              onClick={navigateToProfile}
                              className="w-full text-left px-4 py-2 rounded hover:bg-primary/10 text-white/90 transition-colors"
                            >
                              My Profile
                            </button>
                          </li>
                          <li>
                            <Link to="/settings" className="block px-4 py-2 rounded hover:bg-primary/10 text-white/90 transition-colors">
                              Settings
                            </Link>
                          </li>
                          <li>
                            <Link 
                              to="/membership" 
                              className="block px-4 py-2 rounded hover:bg-primary/10 transition-colors"
                            >
                              <span className="flex items-center gap-2 text-primary">
                                <Crown size={16} />
                                Become a Provider
                              </span>
                            </Link>
                          </li>
                          <li className="border-t border-white/10 mt-2 pt-2">
                            <button 
                              onClick={handleSignOut}
                              className="w-full text-left px-4 py-2 rounded hover:bg-primary/10 transition-colors text-red-400"
                            >
                              Sign Out
                            </button>
                          </li>
                        </ul>
                      </NavigationMenuContent>
                    </div>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="p-2 md:hidden text-white/90 hover:text-primary transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden fixed inset-x-0 top-16 bg-black/95 border-b border-white/10 transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        )}>
          <nav className="px-4 py-4">
            <ul className="space-y-2">
              <li>
                <Link to="/" className="flex items-center gap-2 p-3 hover:bg-primary/10 rounded-lg text-white/90">
                  <Home size={20} />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/search" className="flex items-center gap-2 p-3 hover:bg-primary/10 rounded-lg text-white/90">
                  <Search size={20} />
                  <span>Search</span>
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="flex items-center gap-2 p-3 hover:bg-primary/10 rounded-lg text-white/90">
                  <Bell size={20} />
                  <span>Notifications</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/membership" 
                  className="flex items-center gap-2 p-3 hover:bg-primary/10 rounded-lg text-primary"
                >
                  <Crown size={20} />
                  <span>Become a Provider</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
