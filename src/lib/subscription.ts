import { supabase } from './db-helpers';
import type { Database } from '@/types/supabase';

export type Category = Database['public']['Tables']['categories']['Row'];

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
    const result = await supabase
      .from('categories')
      .select('*')
      .order('id');
    
    return { data: result.data as Category[] | null, error: result.error };
  },

  // Check if user has active subscription for a category
  async checkSubscription(categoryId: string): Promise<{ data: boolean; error: any }> {
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { data: false, error: 'No user found' };

    return await supabase
      .rpc('check_subscription_status', {
        user_id: user.user.id,
        category_id: categoryId
      });
  },

  // Get user's active subscriptions
  async getUserSubscriptions(): Promise<{ data: Subscription[] | null; error: any }> {
    const { data: user } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'No user found' };

    return await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('status', 'active');
  },

  // Initialize subscription
  async createSubscription(categoryId: string): Promise<{ success: boolean; error: any }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Get category details
      const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (!category) throw new Error('Category not found');

      // Create subscription
      const { error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.user.id,
          category_id: categoryId,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    }
  },

  // Cancel subscription
  async cancelSubscription(categoryId: string): Promise<{ success: boolean; error: any }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'canceled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.user.id)
        .eq('category_id', categoryId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    }
  }
}; 