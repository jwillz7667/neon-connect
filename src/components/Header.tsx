
import React from 'react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu";
import { Search, Crown, Menu, User, Bell, MessageSquare, Home } from "lucide-react";
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold neon-text">
              NeonConnect
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="flex gap-6">
                <NavigationMenuItem>
                  <Link to="/" className="flex items-center gap-2 text-white/90 hover:text-primary transition-colors">
                    <Home size={20} />
                    <span>Home</span>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white/90 hover:text-primary hover:bg-white/5">
                    Discover
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-[220px] glass-card">
                    <ul className="p-2 space-y-1">
                      <li>
                        <Link to="/search" className="block px-4 py-2 rounded hover:bg-white/10 transition-colors">
                          Browse Profiles
                        </Link>
                      </li>
                      <li>
                        <Link to="/categories" className="block px-4 py-2 rounded hover:bg-white/10 transition-colors">
                          Categories
                        </Link>
                      </li>
                      <li>
                        <Link to="/featured" className="block px-4 py-2 rounded hover:bg-white/10 transition-colors">
                          Featured
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/messages" className="flex items-center gap-2 text-white/90 hover:text-primary transition-colors">
                    <MessageSquare size={20} />
                    <span>Messages</span>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/search" className="p-2 text-white/90 hover:text-primary transition-colors rounded-full hover:bg-white/5">
              <Search size={20} />
            </Link>
            
            <Link to="/notifications" className="p-2 text-white/90 hover:text-primary transition-colors rounded-full hover:bg-white/5">
              <Bell size={20} />
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-white/90 hover:text-primary hover:bg-white/5">
                    <User size={20} />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-[220px] glass-card">
                    <ul className="p-2 space-y-1">
                      <li>
                        <Link to="/profile" className="block px-4 py-2 rounded hover:bg-white/10 transition-colors">
                          My Profile
                        </Link>
                      </li>
                      <li>
                        <Link to="/settings" className="block px-4 py-2 rounded hover:bg-white/10 transition-colors">
                          Settings
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/membership" 
                          className="block px-4 py-2 rounded hover:bg-white/10 transition-colors text-primary"
                        >
                          <span className="flex items-center gap-2">
                            <Crown size={16} />
                            Become a Provider
                          </span>
                        </Link>
                      </li>
                      <li className="border-t border-white/10 mt-2 pt-2">
                        <button className="w-full text-left px-4 py-2 rounded hover:bg-white/10 transition-colors text-red-400">
                          Sign Out
                        </button>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

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
          <nav className="container py-4">
            <ul className="space-y-2">
              <li>
                <Link to="/" className="flex items-center gap-2 p-3 hover:bg-white/5 rounded-lg">
                  <Home size={20} />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/search" className="flex items-center gap-2 p-3 hover:bg-white/5 rounded-lg">
                  <Search size={20} />
                  <span>Search</span>
                </Link>
              </li>
              <li>
                <Link to="/messages" className="flex items-center gap-2 p-3 hover:bg-white/5 rounded-lg">
                  <MessageSquare size={20} />
                  <span>Messages</span>
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="flex items-center gap-2 p-3 hover:bg-white/5 rounded-lg">
                  <Bell size={20} />
                  <span>Notifications</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/membership" 
                  className="flex items-center gap-2 p-3 hover:bg-white/5 rounded-lg text-primary"
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
