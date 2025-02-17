
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
        console.log('No session found, redirecting to login...');
        toast({
          title: "Authentication required",
          description: "Please sign in to subscribe",
          variant: "destructive",
        });
        // Store the selected tier and return URL in localStorage
        localStorage.setItem('selectedTier', tier);
        localStorage.setItem('redirectAfterLogin', '/membership');
        navigate('/login');
        return;
      }

      console.log('User is authenticated, checking existing subscription...');

      // Check for existing subscription
      const { data: existingSubscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      if (existingSubscription) {
        console.log('Updating existing subscription...');
        // Update existing subscription
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            tier: tier.toUpperCase(),
            status: 'active',
            current_period_end: futureDate.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', session.user.id);

        if (updateError) {
          console.error('Subscription update error:', updateError);
          throw updateError;
        }
      } else {
        console.log('Creating new subscription...');
        // Create new subscription
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: session.user.id,
            tier: tier.toUpperCase(),
            status: 'active',
            current_period_end: futureDate.toISOString()
          });

        if (subscriptionError) {
          console.error('Subscription creation error:', subscriptionError);
          throw subscriptionError;
        }
      }

      console.log('Subscription processed successfully');

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

      // Clear stored tier and redirect after successful subscription
      localStorage.removeItem('selectedTier');
      localStorage.removeItem('redirectAfterLogin');
      
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

  // Check for stored tier on component mount
  React.useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const storedTier = localStorage.getItem('selectedTier') as 'standard' | 'priority' | null;
        if (storedTier) {
          handleSubscribe(storedTier);
        }
      }
    };
    
    checkSession();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12 neon-text">Membership Plans</h1>
      <PricingSection onSubscribe={handleSubscribe} />
    </div>
  );
};

export default MembershipPage;
