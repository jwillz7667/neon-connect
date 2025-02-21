import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/db-helpers';
import type { Database } from '@/types/supabase';

type SubscriptionTier = Database['public']['Enums']['subscription_tier'];
type SubscriptionStatus = Database['public']['Enums']['subscription_status'];
type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert'];

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const createSubscription = async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        navigate('/login');
        return;
      }

      const tier = searchParams.get('tier') as SubscriptionTier || 'basic';
      
      const newSubscription: SubscriptionInsert = {
        user_id: user.data.user.id,
        tier: tier,
        status: 'active' as SubscriptionStatus,
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      const { error } = await supabase
        .from('subscriptions')
        .upsert(newSubscription);

      if (error) {
        console.error('Error creating subscription:', error);
        // Handle error appropriately
        return;
      }

      // Redirect to dashboard or appropriate page
      navigate('/dashboard');
    };

    createSubscription();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Setting up your subscription...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we configure your account.
          </p>
        </div>
      </div>
    </div>
  );
}
