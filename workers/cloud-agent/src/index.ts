export interface Env {
  GOOGLE_API_KEY: string;
  ADMIN_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${env.ADMIN_SECRET}`) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    try {
      const { prompt, systemInstruction } = await request.json() as { prompt: string, systemInstruction?: string };
      
      if (!prompt) {
        return new Response("Bad Request: Missing prompt", { status: 400, headers: corsHeaders });
      }

      const model = "gemini-2.5-flash"; // A fast, low-latency model perfect for general tasks
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GOOGLE_API_KEY}`;

      const payload: any = {
        contents: [{ parts: [{ text: prompt }] }]
      };
      
      if (systemInstruction) {
        payload.systemInstruction = { parts: [{ text: systemInstruction }] };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        return new Response(`Gemini API Error: ${errorText}`, { status: response.status, headers: corsHeaders });
      }

      const data: any = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      return new Response(JSON.stringify({ text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }
  }
};
