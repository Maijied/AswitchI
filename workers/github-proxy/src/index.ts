export interface Env {
  GITHUB_PAT: string;
  ADMIN_SECRET: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Or "https://aswitchi.lorapok.tech"
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${env.ADMIN_SECRET}`) {
      return new Response(JSON.stringify({ error: "Unauthorized. Invalid Admin Secret." }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    try {
      const body: any = await request.json();
      
      // We will proxy this to GitHub Actions workflow_dispatch
      const githubUrl = "https://api.github.com/repos/Maijied/AswitchI/actions/workflows/main-pipeline.yml/dispatches";
      
      const githubPayload = {
        ref: "main",
        inputs: {
          manual_trigger: "true",
          operation: body.operation,
          target_revision: body.target_revision,
          target_channel: body.target_channel,
          progressive_percent: body.progressive_percent
        }
      };

      const ghResponse = await fetch(githubUrl, {
        method: "POST",
        headers: {
          "Accept": "application/vnd.github+json",
          "Authorization": `Bearer ${env.GITHUB_PAT}`,
          "User-Agent": "Cloudflare-Worker-AswitchI",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(githubPayload)
      });

      if (!ghResponse.ok) {
        const errText = await ghResponse.text();
        return new Response(JSON.stringify({ error: "GitHub API Failed", details: errText }), {
          status: ghResponse.status,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      return new Response(JSON.stringify({ success: true, message: "Workflow dispatched successfully!" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });

    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }
  },
};
