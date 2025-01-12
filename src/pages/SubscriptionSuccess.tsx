import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const tier = searchParams.get('tier');

  useEffect(() => {
    const updateSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('No user found');

        // Update subscription in the new subscriptions table
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: user.id,
            tier: tier || 'standard',
            status: 'active',
            current_period_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          });

        if (error) throw error;

        toast({
          title: "Success!",
          description: "Your subscription has been activated.",
        });
      } catch (error) {
        console.error('Error updating subscription:', error);
        toast({
          title: "Error",
          description: "Failed to activate subscription. Please contact support.",
          variant: "destructive",
        });
      }
    };

    updateSubscription();
  }, [tier, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
        <p className="text-xl mb-8">Your subscription has been processed successfully.</p>
        <Button onClick={() => navigate('/')}>
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;