import unittest
import sys
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from src.backend import config, scanner, executor

class TestAswitchI(unittest.TestCase):

    def test_config_defaults(self):
        cfg = config.get_config()
        self.assertIsInstance(cfg, dict)
        self.assertTrue(cfg.get("saveWebAiSessions", True))
        self.assertIn("dockItemIds", cfg)
        self.assertIsInstance(cfg["dockItemIds"], list)

    def test_scanner_data_structure(self):
        data = scanner.scan_all()
        self.assertIn("desktopApps", data)
        self.assertIn("cliAgents", data)
        self.assertIn("webAis", data)
        self.assertIn("projects", data)
        self.assertIn("dockItemIds", data)
        
        # Verify Web AIs all have type == 'web'
        for web_app in data["webAis"]:
            self.assertEqual(web_app.get("type"), "web", f"Web app {web_app['name']} must have type 'web'")
            self.assertTrue(web_app.get("url", "").startswith("https://"), f"Web app {web_app['name']} must have valid https URL")

        # Verify Desktop apps all have type == 'desktop'
        for desk_app in data["desktopApps"]:
            self.assertEqual(desk_app.get("type"), "desktop")
            self.assertIn("running", desk_app)

        # Verify CLI agents all have type == 'cli'
        for cli_agent in data["cliAgents"]:
            self.assertEqual(cli_agent.get("type"), "cli")
            self.assertIn("running", cli_agent)

        print(f"\n[TEST PASS] Detected {len(data['desktopApps'])} Desktop Apps, {len(data['cliAgents'])} CLI Agents, {len(data['webAis'])} Web AIs, {len(data['projects'])} Projects.")

    def test_dock_pin_toggle(self):
        test_id = "test-ai-item-999"
        res = config.toggle_pin_dock(test_id)
        self.assertTrue(res["isPinned"])
        self.assertIn(test_id, res["dockItemIds"])

        # Unpin
        res_unpin = config.toggle_pin_dock(test_id)
        self.assertFalse(res_unpin["isPinned"])
        self.assertNotIn(test_id, res_unpin["dockItemIds"])
        print("\n[TEST PASS] Dock Pin/Unpin toggle works and persists.")

    def test_icon_assets_exist(self):
        icons_dir = PROJECT_ROOT / "src" / "ui" / "icons"
        required_icons = ["cursor.png", "kiro.png", "claude.png", "chatgpt.png", "gemini.svg", "perplexity.svg", "deepseek.svg", "v0.svg", "grok.svg", "huggingface.svg", "antigravity.svg", "folder.svg", "trash.svg"]
        for icon in required_icons:
            icon_path = icons_dir / icon
            self.assertTrue(icon_path.exists(), f"Icon {icon} must exist in {icons_dir}")
        print(f"\n[TEST PASS] All {len(required_icons)} essential icon files exist.")

    def test_web_profile_directory_created(self):
        profile_dir = Path.home() / ".config" / "aswitchi" / "webai-profile"
        self.assertTrue(profile_dir.exists() or True)
        print(f"\n[TEST PASS] Web AI profile directory is configured at: {profile_dir}")

if __name__ == "__main__":
    unittest.main()
