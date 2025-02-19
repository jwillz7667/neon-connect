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
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="NeonMeet" className="h-8" />
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white">
              <Home className="w-5 h-5" />
            </Link>
            <Link to="/search" className="text-gray-300 hover:text-white">
              <Search className="w-5 h-5" />
            </Link>
            <Link to="/featured" className="text-gray-300 hover:text-white">
              <Crown className="w-5 h-5" />
            </Link>
            <Link to="/notifications" className="text-gray-300 hover:text-white">
              <Bell className="w-5 h-5" />
            </Link>
            <button
              onClick={() => navigateToProfile()}
              className="text-gray-300 hover:text-white"
            >
              <User className="w-5 h-5" />
            </button>
          </nav>

          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black/50 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className="text-gray-300 hover:text-white flex items-center space-x-2 p-2"
                onClick={() => setIsOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link
                to="/search"
                className="text-gray-300 hover:text-white flex items-center space-x-2 p-2"
                onClick={() => setIsOpen(false)}
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </Link>
              <Link
                to="/featured"
                className="text-gray-300 hover:text-white flex items-center space-x-2 p-2"
                onClick={() => setIsOpen(false)}
              >
                <Crown className="w-5 h-5" />
                <span>Featured</span>
              </Link>
              <Link
                to="/notifications"
                className="text-gray-300 hover:text-white flex items-center space-x-2 p-2"
                onClick={() => setIsOpen(false)}
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </Link>
              <button
                onClick={() => {
                  navigateToProfile();
                  setIsOpen(false);
                }}
                className="text-gray-300 hover:text-white flex items-center space-x-2 p-2"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
