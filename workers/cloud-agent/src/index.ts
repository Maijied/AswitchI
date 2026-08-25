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

    const url = new URL(request.url);
    if (request.method !== "POST" || (url.pathname !== "/v1/chat/completions" && url.pathname !== "/")) {
      return new Response("Not Found", { status: 404, headers: corsHeaders });
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${env.ADMIN_SECRET}`) {
      return new Response(JSON.stringify({ error: { message: "Unauthorized" } }), { 
        status: 401, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    try {
      const body = await request.json() as any;
      const messages: any[] = body.messages || [];
      
      if (!Array.isArray(messages) || messages.length === 0) {
        return new Response(JSON.stringify({ error: { message: "Messages array is required" } }), { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // Convert OpenAI messages to Gemini contents
      let systemInstruction = "";
      const contents = [];
      
      for (const msg of messages) {
        if (msg.role === "system") {
          systemInstruction += msg.content + "\n";
        } else {
          contents.push({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }]
          });
        }
      }

      const model = "gemini-2.5-flash";
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GOOGLE_API_KEY}`;

      const payload: any = { contents };
      if (systemInstruction) {
        payload.systemInstruction = { parts: [{ text: systemInstruction.trim() }] };
      }

      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        return new Response(JSON.stringify({ error: { message: `Gemini API Error: ${errorText}` } }), { 
          status: response.status, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const data: any = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Construct OpenAI compatible response
      const openAiResponse = {
        id: `chatcmpl-${crypto.randomUUID()}`,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: model,
        choices: [{
          index: 0,
          message: {
            role: "assistant",
            content: text
          },
          finish_reason: "stop"
        }],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      };

      return new Response(JSON.stringify(openAiResponse), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: { message: error.message } }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
