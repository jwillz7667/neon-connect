import React from 'react';
import ProfileCard from '../components/ProfileCard';
import PricingSection from '../components/pricing/PricingSection';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { toast } = useToast();

  const handleSubscribe = async (tier: 'standard' | 'priority') => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to subscribe",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Sample data for profile cards
  const profiles = [
    {
      name: "Sarah",
      age: 28,
      location: "New York",
      imageUrl: "/placeholder.svg",
      distance: "2 miles"
    },
    {
      name: "Michael",
      age: 32,
      location: "Los Angeles",
      imageUrl: "/placeholder.svg",
      distance: "5 miles"
    },
    {
      name: "Emma",
      age: 26,
      location: "Chicago",
      imageUrl: "/placeholder.svg",
      distance: "3 miles"
    },
    {
      name: "James",
      age: 30,
      location: "Miami",
      imageUrl: "/placeholder.svg",
      distance: "1 mile"
    }
  ];

  return (
    <div className="container mx-auto px-4">
      {/* Profiles Grid Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 neon-text">Discover New Connections</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {profiles.map((profile, index) => (
            <ProfileCard
              key={index}
              name={profile.name}
              age={profile.age}
              location={profile.location}
              imageUrl={profile.imageUrl}
              distance={profile.distance}
            />
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection onSubscribe={handleSubscribe} />
    </div>
  );
};

export default Index;