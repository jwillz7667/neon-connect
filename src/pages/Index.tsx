import React from 'react';
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import Header from '../components/Header';
import Footer from '../components/Footer';
import PricingSection from '../components/pricing/PricingSection';

const Index = () => {
  const { toast } = useToast()

  const handleSubscribe = async (tier: 'standard' | 'priority') => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to subscribe",
          variant: "destructive",
        })
        return
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { tier }
      })

      if (error) throw error

      if (data?.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Subscription error:', error)
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <PricingSection onSubscribe={handleSubscribe} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;