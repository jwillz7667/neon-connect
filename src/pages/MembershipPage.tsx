import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

type SubscriptionTier = Database['public']['Enums']['subscription_tier'];
type SubscriptionStatus = Database['public']['Enums']['subscription_status'];
type Subscription = Database['public']['Tables']['subscriptions']['Row'];

interface PricingTier {
  tier: SubscriptionTier;
  name: string;
  price: number;
  description: string;
  features: string[];
}

const pricingTiers: PricingTier[] = [
  {
    tier: 'free',
    name: 'Basic',
    price: 0,
    description: 'Essential features for getting started',
    features: [
      'Basic profile listing',
      'Limited messages',
      'Standard support'
    ]
  },
  {
    tier: 'basic',
    name: 'Standard',
    price: 29,
    description: 'Everything you need for a professional presence',
    features: [
      'Enhanced profile visibility',
      'Unlimited messages',
      'Priority support',
      'Basic analytics'
    ]
  },
  {
    tier: 'premium',
    name: 'Premium',
    price: 79,
    description: 'Advanced features for serious professionals',
    features: [
      'Featured profile placement',
      'Advanced analytics',
      'Custom branding',
      'VIP support',
      'Verified badge'
    ]
  },
  {
    tier: 'professional',
    name: 'Professional',
    price: 149,
    description: 'Ultimate package for top providers',
    features: [
      'Global profile visibility',
      'Custom domain support',
      'Dedicated account manager',
      'Marketing tools',
      'API access',
      'White-glove support'
    ]
  }
];

export default function MembershipPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    async function getSubscription() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching subscription:', error);
        return;
      }

      setCurrentSubscription(data);
      setLoading(false);
    }

    getSubscription();
  }, [navigate]);

  const handleSubscribe = async (tier: SubscriptionTier) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate('/login');
      return;
    }

    // Create a new subscription record
    const newSubscription = {
      user_id: user.id,
      tier: tier,
      status: 'active' as SubscriptionStatus,
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    const { error } = await supabase
      .from('subscriptions')
      .upsert(newSubscription);

    if (error) {
      console.error('Error creating subscription:', error);
      setLoading(false);
      return;
    }

    // Redirect to success page
    navigate(`/subscription/success?tier=${tier}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Membership Plans
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the perfect plan for your needs
          </p>
          {currentSubscription && (
            <div className="mt-4 inline-flex items-center px-4 py-2 rounded-md bg-indigo-50 text-indigo-700">
              <span className="font-medium">
                Current Plan: {pricingTiers.find(t => t.tier === currentSubscription.tier)?.name}
              </span>
              <span className="ml-2 text-indigo-500">
                (Active until {new Date(currentSubscription.current_period_end).toLocaleDateString()})
              </span>
            </div>
          )}
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4">
          {pricingTiers.map((tier) => (
            <div
              key={tier.tier}
              className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{tier.name}</h3>
                <p className="mt-4 text-sm text-gray-500">{tier.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">${tier.price}</span>
                  <span className="text-base font-medium text-gray-500">/mo</span>
                </p>
                <button
                  onClick={() => handleSubscribe(tier.tier)}
                  disabled={loading || (currentSubscription?.tier === tier.tier)}
                  className={`mt-8 block w-full py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white ${
                    currentSubscription?.tier === tier.tier
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50`}
                >
                  {currentSubscription?.tier === tier.tier ? 'Current Plan' : 'Subscribe'}
                </button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide">Features</h4>
                <ul className="mt-4 space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-3 text-sm text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
