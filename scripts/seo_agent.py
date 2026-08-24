import os
import json
from datetime import datetime

WEBSITE_DIR = "website"
DOMAIN = "https://aswitchi.lorapok.tech"

def generate_sitemap():
    sitemap = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>{DOMAIN}/</loc>
    <lastmod>{datetime.now().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>"""
    with open(os.path.join(WEBSITE_DIR, "sitemap.xml"), "w") as f:
        f.write(sitemap)
    print("✅ Generated sitemap.xml")

def generate_robots():
    robots = f"""User-agent: *
Allow: /

Sitemap: {DOMAIN}/sitemap.xml
"""
    with open(os.path.join(WEBSITE_DIR, "robots.txt"), "w") as f:
        f.write(robots)
    print("✅ Generated robots.txt")

def optimize_html():
    import urllib.request
    # We will just inject industry-standard SEO tags manually since we know the content
    index_path = os.path.join(WEBSITE_DIR, "index.html")
    with open(index_path, "r") as f:
        html = f.read()

    # If it already has og:title, skip
    if 'property="og:title"' in html:
        print("✅ HTML already optimized")
        return

    seo_tags = """
    <!-- Industry Standard SEO Agent Injection -->
    <meta name="description" content="AswitchI by Lorapok Labs: The ultimate dynamic dock and launcher for AI Desktop IDEs, Web AIs, and CLI Agents on Linux." />
    <meta name="keywords" content="AI, Linux, Dock, App Launcher, Cursor, Claude, ChatGPT, Lorapok Labs, AswitchI" />
    <meta name="author" content="Mohammad Maizied Hasan Majumder" />
    <link rel="canonical" href="https://aswitchi.lorapok.tech/" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://aswitchi.lorapok.tech/" />
    <meta property="og:title" content="AswitchI - The Linux AI Ecosystem Hub" />
    <meta property="og:description" content="AswitchI by Lorapok Labs: The ultimate dynamic dock and launcher for AI Desktop IDEs, Web AIs, and CLI Agents on Linux." />
    <meta property="og:image" content="https://aswitchi.lorapok.tech/icons/aswitchi.svg" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://aswitchi.lorapok.tech/" />
    <meta property="twitter:title" content="AswitchI - The Linux AI Ecosystem Hub" />
    <meta property="twitter:description" content="AswitchI by Lorapok Labs: The ultimate dynamic dock and launcher for AI Desktop IDEs, Web AIs, and CLI Agents on Linux." />
    <meta property="twitter:image" content="https://aswitchi.lorapok.tech/icons/aswitchi.svg" />
    
    <!-- Structured Data (JSON-LD) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "AswitchI",
      "operatingSystem": "Linux",
      "applicationCategory": "UtilitiesApplication",
      "author": {
        "@type": "Organization",
        "name": "Lorapok Labs"
      },
      "description": "Dynamic dock and ecosystem hub for all AI applications on Linux."
    }
    </script>
    """

    # Inject right before </head>
    if "</head>" in html:
        html = html.replace("</head>", seo_tags + "\n</head>")
        with open(index_path, "w") as f:
            f.write(html)
        print("✅ Injected SEO tags and Structured Data into index.html")
    else:
        print("❌ Could not find </head> tag to inject SEO.")

if __name__ == "__main__":
    print("🚀 Running Lorapok Labs SEO Specialist Agent...")
    generate_sitemap()
    generate_robots()
    optimize_html()
    print("✨ SEO Optimization Complete!")
