import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let subject: string | undefined;
    try {
      const body = await req.json();
      subject = body?.subject as string | undefined;
    } catch (_) {
      // no body provided
    }

    const { publicKey, privateKey } = webpush.generateVAPIDKeys();

    return new Response(
      JSON.stringify({
        publicKey,
        privateKey,
        subject: subject ?? "mailto:admin@example.com",
        note:
          "Store these as VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in Supabase secrets. Use the public key in PushManager.subscribe (Uint8Array).",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error generating VAPID keys:", error);
    return new Response(
      JSON.stringify({ error: error?.message ?? "Unknown error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
