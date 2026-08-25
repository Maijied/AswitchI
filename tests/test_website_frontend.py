#!/usr/bin/env python3
"""
Test Suite: AswitchI Public Website Frontend Verification
Validates HTML5 semantics, Apple-grade design elements, GA4 tags, and assets.
"""

import unittest
import os
import re

WEBSITE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "website"))
INDEX_HTML = os.path.join(WEBSITE_DIR, "index.html")
STYLE_CSS = os.path.join(WEBSITE_DIR, "style.css")
SCRIPT_JS = os.path.join(WEBSITE_DIR, "script.js")

class TestWebsiteFrontend(unittest.TestCase):

    def setUp(self):
        self.assertTrue(os.path.exists(INDEX_HTML), "website/index.html must exist")
        self.assertTrue(os.path.exists(STYLE_CSS), "website/style.css must exist")
        self.assertTrue(os.path.exists(SCRIPT_JS), "website/script.js must exist")
        with open(INDEX_HTML, "r", encoding="utf-8") as f:
            self.html_content = f.read()
        with open(STYLE_CSS, "r", encoding="utf-8") as f:
            self.css_content = f.read()
        with open(SCRIPT_JS, "r", encoding="utf-8") as f:
            self.js_content = f.read()

    def test_meta_and_seo_tags(self):
        """Verify SEO, Open Graph, Twitter Cards, and GA4 tag."""
        self.assertIn("AswitchI — The Linux Hub for AI Engineering", self.html_content)
        self.assertIn("https://aswitchi.lorapok.tech/", self.html_content)
        self.assertIn("G-15CW67JXVH", self.html_content, "GA4 measurement ID G-15CW67JXVH must be embedded")
        self.assertIn('name="twitter:card"', self.html_content)
        self.assertIn('property="og:image"', self.html_content)

    def test_apple_grade_bento_grid(self):
        """Verify Apple-grade Bento feature grid and RAM metric callouts."""
        self.assertIn("bento-grid", self.html_content)
        self.assertIn("45 MB RAM Consumption", self.html_content)
        self.assertIn("Launchpad + 3D Dock", self.html_content)
        self.assertIn("Isolated Web AI Keyring", self.html_content)
        self.assertIn("Wayland & X11 Multi-Arch", self.html_content)

    def test_interactive_hd_showcase_tabs(self):
        """Verify 3 HD showcase switcher tabs and images."""
        self.assertIn("assets/hero_showcase.png", self.html_content)
        self.assertIn("assets/dock_strip.png", self.html_content)
        self.assertIn("assets/webai_view.png", self.html_content)
        self.assertIn("switchShowcaseTab", self.html_content)

    def test_in_browser_dock_simulator(self):
        """Verify the in-browser 3D dock simulation container."""
        self.assertIn('id="sim-dock"', self.html_content)
        self.assertIn("sim-dock-item", self.html_content)
        self.assertIn("initDockSimulator", self.js_content)

    def test_cyber_theme_palette_preserved(self):
        """Verify core cyber colors (--cyan #00f2fe, --purple #a855f7, --bg-dark #04060d) are preserved."""
        self.assertIn("#00f2fe", self.css_content)
        self.assertIn("#a855f7", self.css_content)
        self.assertIn("#04060d", self.css_content)
        self.assertIn("backdrop-filter: blur(28px)", self.css_content)

    def test_mission_control_admin_link(self):
        """Verify footer contains Mission Control Admin entry point."""
        self.assertIn('href="admin/"', self.html_content)
        self.assertIn("Mission Control", self.html_content)

if __name__ == "__main__":
    unittest.main()
