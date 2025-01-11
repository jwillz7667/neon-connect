import React from 'react';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import Header from '../components/Header';
import Footer from '../components/Footer';

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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Choose Your Membership Plan
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <Card className="p-6 flex flex-col">
              <h2 className="text-2xl font-semibold mb-4">Standard Membership</h2>
              <p className="text-3xl font-bold mb-4">$100<span className="text-lg font-normal">/week</span></p>
              <ul className="space-y-3 mb-6 flex-grow">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Verified Profile
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Age Verification
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  KYC Verification
                </li>
              </ul>
              <Button 
                className="w-full mt-auto"
                onClick={() => handleSubscribe('standard')}
              >
                Subscribe Now
              </Button>
            </Card>

            <Card className="p-6 border-2 border-primary flex flex-col">
              <h2 className="text-2xl font-semibold mb-4">Priority Membership</h2>
              <p className="text-3xl font-bold mb-4">$200<span className="text-lg font-normal">/week</span></p>
              <ul className="space-y-3 mb-6 flex-grow">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  All Standard Features
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Priority Profile Visibility
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Enhanced Search Results
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Featured Profile Status
                </li>
              </ul>
              <Button 
                className="w-full mt-auto"
                onClick={() => handleSubscribe('priority')}
              >
                Subscribe Now
              </Button>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;