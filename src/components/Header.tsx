import React from 'react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Search, Crown } from "lucide-react";
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card backdrop-blur-md py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold neon-text">
          NeonConnect
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="flex gap-6">
            <NavigationMenuItem>
              <Link to="/search" className="flex items-center gap-2 text-white/90 hover:text-primary transition-colors">
                <Search size={20} />
                <span className="hidden sm:inline">Search</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link 
                to="/membership" 
                className="flex items-center gap-2 text-white/90 hover:text-primary transition-colors neon-text"
              >
                <Crown size={20} />
                <span className="hidden sm:inline">Become a Provider</span>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Header;