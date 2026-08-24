import unittest
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent

class TestUIAssets(unittest.TestCase):
    def test_icon_assets_all_present(self):
        icon_dir = PROJECT_DIR / "src" / "ui" / "icons"
        required_icons = [
            "aswitchi.svg", "lorapok.svg", "cursor.png", "dcursor.png", "kiro.png", "claude.png", "chatgpt.png",
            "devin.png", "gemini.svg", "perplexity.svg", "deepseek.svg",
            "v0.svg", "grok.svg", "huggingface.svg", "antigravity.svg",
            "windsurf.svg", "whatsapp.svg", "teams.svg", "folder.svg", "trash.svg"
        ]
        for icon in required_icons:
            icon_path = icon_dir / icon
            self.assertTrue(icon_path.exists(), f"Icon {icon} must exist in {icon_dir}")
            self.assertGreater(icon_path.stat().st_size, 0, f"Icon {icon} must not be empty")

    def test_launchpad_html_structure(self):
        html_file = PROJECT_DIR / "src" / "ui" / "launchpad.html"
        self.assertTrue(html_file.exists())
        content = html_file.read_text(encoding="utf-8")
        self.assertIn('id="category-pills"', content)
        self.assertIn('id="pages-viewport"', content)
        self.assertIn('id="dock-shelf"', content)
        self.assertIn('id="btn-help"', content)
        self.assertIn('id="btn-minimize"', content)
        self.assertIn('id="btn-close"', content)
        self.assertIn('id="launchpad-splash"', content)
        self.assertIn('icons/aswitchi.svg', content)
        self.assertIn('Lorapok Labs', content)

    def test_launchpad_css_integrity(self):
        css_file = PROJECT_DIR / "src" / "ui" / "launchpad_v2.css"
        self.assertTrue(css_file.exists())
        content = css_file.read_text(encoding="utf-8")
        self.assertIn('grid-template-columns: repeat(7, 1fr)', content)
        self.assertIn('@keyframes macGridBounce', content)
        self.assertIn('@keyframes macDockBounce', content)
        self.assertIn('.corner-badge', content)
        self.assertIn('.dock-corner-badge', content)
        self.assertIn('.launchpad-splash', content)

    def test_launchpad_js_chunking_logic(self):
        js_file = PROJECT_DIR / "src" / "ui" / "launchpad_v2.js"
        self.assertTrue(js_file.exists())
        content = js_file.read_text(encoding="utf-8")
        self.assertIn('ITEMS_PER_PAGE = 14', content)
        self.assertIn('onNativeDataReceived', content)
        self.assertIn('modal-body-about', content)

if __name__ == "__main__":
    unittest.main()
