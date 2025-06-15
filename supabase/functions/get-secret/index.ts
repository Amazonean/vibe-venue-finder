import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name } = await req.json()
    
    if (name === 'GOOGLE_MAPS_API_KEY') {
      const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
      
      return new Response(
        JSON.stringify({ GOOGLE_MAPS_API_KEY: apiKey }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }
    
    return new Response(
      JSON.stringify({ error: 'Secret not found' }),
      { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})