import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { tier } = await req.json()
    
    // This is a placeholder price - in production, you'd use real Stripe price IDs
    const price_id = tier === 'priority' ? 'price_priority_placeholder' : 'price_standard_placeholder'
    
    // Simulate Stripe checkout session creation
    const checkoutUrl = `/subscription-success?tier=${tier}`
    
    console.log('Creating mock checkout session for tier:', tier)
    
    return new Response(
      JSON.stringify({ url: checkoutUrl }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})