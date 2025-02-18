
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Heart, Sparkles, Star, Coffee, Music, Camera, Globe, Book } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    title: "New Members",
    icon: Sparkles,
    description: "Recently joined profiles",
    link: "/search?category=new"
  },
  {
    title: "Featured",
    icon: Star,
    description: "Our top rated profiles",
    link: "/search?category=featured"
  },
  {
    title: "Most Active",
    icon: Heart,
    description: "Frequently active members",
    link: "/search?category=active"
  },
  {
    title: "Coffee Dates",
    icon: Coffee,
    description: "Looking for casual meetups",
    link: "/search?category=casual"
  },
  {
    title: "Artists",
    icon: Music,
    description: "Creative souls",
    link: "/search?category=artists"
  },
  {
    title: "Photographers",
    icon: Camera,
    description: "Visual storytellers",
    link: "/search?category=photographers"
  },
  {
    title: "Travelers",
    icon: Globe,
    description: "Adventure seekers",
    link: "/search?category=travelers"
  },
  {
    title: "Intellectuals",
    icon: Book,
    description: "Deep thinkers",
    link: "/search?category=intellectuals"
  }
];

const CategoriesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-8 neon-text">Browse Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Link key={category.title} to={category.link}>
              <Card className="glass-card hover:bg-primary/5 transition-colors cursor-pointer border-primary/20 rounded-xl backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesPage;
