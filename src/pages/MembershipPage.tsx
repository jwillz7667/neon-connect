import React from 'react';
import { useNavigate } from 'react-router-dom';
import PricingSection from '../components/pricing/PricingSection';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MembershipPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async (tier: 'standard' | 'priority') => {
    try {
      console.log('MembershipPage: handleSubscribe called with tier:', tier);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to subscribe",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      console.log('User is authenticated, creating subscription...');

      // For development: directly update subscription status
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: session.user.id,
          tier: tier.toUpperCase(),
          status: 'active',
          current_period_end: futureDate.toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (subscriptionError) {
        console.error('Subscription error:', subscriptionError);
        throw subscriptionError;
      }

      console.log('Subscription created successfully');

      // Update profile provider status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          provider_since: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      toast({
        title: "Subscription activated",
        description: "You can now proceed with verification",
      });

      // Redirect to provider onboarding
      navigate('/provider-onboarding');
      
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12 neon-text">Membership Plans</h1>
      <PricingSection onSubscribe={handleSubscribe} />
    </div>
  );
};

export default MembershipPage;