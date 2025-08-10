import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NearbyRequestBody {
  location: { lat: number; lng: number };
  radius?: number; // meters
  includedTypes?: string[];
  keyword?: string;
  pageToken?: string;
  maxResultCount?: number;
  languageCode?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GOOGLE_MAPS_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const body = (await req.json()) as NearbyRequestBody;
    if (!body?.location) {
      return new Response(JSON.stringify({ error: "Missing location" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const radius = Math.min(Math.max(Number(body.radius) || 16093, 1), 16093); // cap at 5 miles
    const maxResultCount = Math.min(Number(body.maxResultCount) || 20, 20);
    const includedTypes = (body.includedTypes && body.includedTypes.length > 0)
      ? body.includedTypes
      : ["bar", "night_club", "restaurant"];

    const payload: Record<string, unknown> = {
      includedTypes,
      maxResultCount,
      rankPreference: "DISTANCE",
      locationRestriction: {
        circle: {
          center: {
            latitude: body.location.lat,
            longitude: body.location.lng,
          },
          radius,
        },
      },
      languageCode: body.languageCode || "en",
    };

    if (body.keyword) payload.keyword = body.keyword;
    if (body.pageToken) payload.pageToken = body.pageToken;

    const res = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        // Include nextPageToken and requested fields
        "X-Goog-FieldMask": [
          "places.displayName",
          "places.formattedAddress",
          "places.types",
          "places.googleMapsUri",
          "places.location",
          "places.id",
          "nextPageToken",
        ].join(","),
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Places Nearby API error", data);
      return new Response(JSON.stringify({ error: data }), {
        status: res.status,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    console.error("google-places-nearby error", e);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
