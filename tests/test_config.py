import unittest
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from src.backend import config

class TestConfig(unittest.TestCase):

    def test_config_initialization(self):
        cfg = config.get_config()
        self.assertIn("dockItemIds", cfg)
        self.assertIn("saveWebAiSessions", cfg)
        self.assertTrue(cfg.get("saveWebAiSessions"))

    def test_add_and_remove_custom_web_ai(self):
        custom_entry = {
            "name": "AutoTest AI",
            "url": "https://autotest.ai",
            "description": "Test AI Endpoint",
            "icon": "globe"
        }
        added = config.add_custom_web_ai(custom_entry)
        self.assertEqual(added["name"], "AutoTest AI")
        self.assertEqual(added["type"], "web")
        self.assertTrue(added.get("custom"))

        # Verify it appears in get_all_web_ais()
        all_web = config.get_all_web_ais()
        self.assertTrue(any(w["id"] == added["id"] for w in all_web))

        # Remove it
        config.remove_custom_web_ai(added["id"])
        all_web_after = config.get_all_web_ais()
        self.assertFalse(any(w["id"] == added["id"] for w in all_web_after))

    def test_dock_pin_and_unpin(self):
        test_id = "test-pin-tool-123"
        # Pin
        res1 = config.toggle_pin_dock(test_id)
        self.assertTrue(res1["isPinned"])
        self.assertIn(test_id, res1["dockItemIds"])

        # Unpin
        res2 = config.toggle_pin_dock(test_id)
        self.assertFalse(res2["isPinned"])
        self.assertNotIn(test_id, res2["dockItemIds"])

    def test_webai_profile_directory_exists(self):
        profile_dir = config.WEBAI_PROFILE_DIR
        self.assertTrue(profile_dir.exists())

if __name__ == "__main__":
    unittest.main()
