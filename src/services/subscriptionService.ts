import { supabase } from '@/lib/db-helpers';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export interface Category {
  id: string;
  title: string;
  description: string;
  monthly_price: number;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  category_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export const subscriptionService = {
  // Fetch all categories with pricing
  async getCategories(): Promise<{ data: Category[] | null; error: any }> {
    return await supabase
      .from('categories')
      .select('*')
      .order('id');
  },

  // Check if user has active subscription for a category
  async checkSubscription(categoryId: string): Promise<{ data: boolean; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: false, error: 'No user found' };

    return await supabase
      .rpc('check_subscription_status', {
        user_id: user.id,
        category_id: categoryId
      });
  },

  // Get user's active subscriptions
  async getUserSubscriptions(): Promise<{ data: Subscription[] | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'No user found' };

    return await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active');
  },

  // Initialize subscription checkout
  async createCheckoutSession(categoryId: string): Promise<{ sessionId: string | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Get category details
      const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (!category) throw new Error('Category not found');
      if (category.monthly_price === 0) {
        // Handle free subscription
        const { error } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            category_id: categoryId,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });

        if (error) throw error;
        return { sessionId: null, error: null };
      }

      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId,
          userId: user.id,
          price: category.monthly_price
        }),
      });

      const session = await response.json();
      return { sessionId: session.id, error: null };
    } catch (error) {
      return { sessionId: null, error };
    }
  },

  // Cancel subscription
  async cancelSubscription(categoryId: string): Promise<{ success: boolean; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('user_subscriptions')
        .update({ 
          status: 'canceled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('category_id', categoryId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    }
  },

  // Handle successful subscription
  async handleSubscriptionSuccess(sessionId: string): Promise<{ success: boolean; error: any }> {
    try {
      const response = await fetch('/api/subscription-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const result = await response.json();
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    }
  }
}; 