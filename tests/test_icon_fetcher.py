import unittest
from pathlib import Path
from src.backend import icon_fetcher, config

class TestIconFetcher(unittest.TestCase):
    def test_sanitize_filename(self):
        self.assertEqual(icon_fetcher.sanitize_filename("https://chatgpt.com:443"), "https___chatgpt_com_443")
        self.assertEqual(icon_fetcher.sanitize_filename("valid_name-123"), "valid_name-123")
        self.assertEqual(icon_fetcher.sanitize_filename(""), "webai")

    def test_cache_directory_exists(self):
        self.assertTrue(icon_fetcher.ICONS_CACHE_DIR.exists())
        self.assertTrue(icon_fetcher.ICONS_CACHE_DIR.is_dir())

    def test_fetch_icon_for_known_domain(self):
        cached = icon_fetcher.fetch_and_cache_icon("https://perplexity.ai", "test_perplexity_unit")
        self.assertIsNotNone(cached)
        self.assertTrue(Path(cached).exists())
        self.assertGreater(Path(cached).stat().st_size, 0)

    def test_author_ai_avatar(self):
        cached = icon_fetcher.fetch_author_ai_icon("Maijied")
        self.assertIsNotNone(cached)
        self.assertTrue(Path(cached).exists())

    def test_config_add_web_ai_fetches_icon(self):
        entry = {
            "name": "Midjourney Studio",
            "url": "https://midjourney.com",
            "description": "Generative Art AI"
        }
        item = config.add_custom_web_ai(entry)
        self.assertIn("id", item)
        self.assertTrue(item["icon"].startswith("file://") or item["icon"] == "globe")
        # Cleanup
        config.remove_custom_web_ai(item["id"])

if __name__ == "__main__":
    unittest.main()
