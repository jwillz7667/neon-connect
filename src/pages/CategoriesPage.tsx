import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { subscriptionService, Category } from '@/services/subscriptionService';
import { useToast } from '@/components/ui/use-toast';
import { loadStripe } from '@stripe/stripe-js';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const state = searchParams.get('state');
  const { toast } = useToast();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data, error } = await subscriptionService.getCategories();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      });
      return;
    }
    setCategories(data || []);
    setLoading(false);
  };

  const handleCategorySelect = async (category: Category) => {
    try {
      setProcessingId(category.id);
      
      // Check if already subscribed
      const { data: isSubscribed } = await subscriptionService.checkSubscription(category.id);
      if (isSubscribed) {
        navigate(`/${category.id}?state=${state}`);
        return;
      }

      // Handle subscription
      if (category.monthly_price > 0) {
        const { sessionId, error } = await subscriptionService.createCheckoutSession(category.id);
        if (error) throw error;
        
        if (sessionId) {
          // Redirect to Stripe checkout
          const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
          await stripe?.redirectToCheckout({ sessionId });
        }
      } else {
        // Handle free subscription
        const { error } = await subscriptionService.createCheckoutSession(category.id);
        if (error) throw error;
        
        navigate(`/${category.id}?state=${state}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process subscription",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center neon-text">
          Select Category
        </h1>
        {state && (
          <p className="text-center text-primary/60 mb-8">
            Location: {state}
          </p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="glass-card hover:bg-primary/5 transition-colors cursor-pointer border-primary/20"
              onClick={() => handleCategorySelect(category)}
            >
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-primary">
                    {category.monthly_price > 0 
                      ? `$${category.monthly_price}/month`
                      : 'Free'}
                  </span>
                  <Button 
                    variant="outline"
                    className="neon-border"
                    disabled={processingId === category.id}
                  >
                    {processingId === category.id ? (
                      <span className="animate-pulse">Processing...</span>
                    ) : (
                      'Select'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
