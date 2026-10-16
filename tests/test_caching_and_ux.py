import os
import unittest
import time
from pathlib import Path
from src.backend.cache_manager import save_cached_state, load_cached_state, clear_cache, CACHE_FILE
from src.backend.scanner import scan_all, invalidate_cache

class TestCachingAndUX(unittest.TestCase):
    def setUp(self):
        clear_cache()
        invalidate_cache()

    def tearDown(self):
        clear_cache()
        invalidate_cache()

    def test_cache_save_and_load(self):
        test_payload = {
            "desktopApps": [{"id": "test-app", "name": "Test App", "running": False}],
            "cliAgents": [],
            "projects": []
        }
        success = save_cached_state(test_payload)
        self.assertTrue(success)
        self.assertTrue(CACHE_FILE.exists())

        loaded = load_cached_state()
        self.assertIsNotNone(loaded)
        self.assertEqual(loaded["desktopApps"][0]["name"], "Test App")

    def test_cache_clear(self):
        save_cached_state({"test": 123})
        self.assertTrue(CACHE_FILE.exists())
        clear_cache()
        self.assertFalse(CACHE_FILE.exists())
        self.assertIsNone(load_cached_state())

    def test_scanner_integrates_cache(self):
        data = scan_all()
        self.assertIn("desktopApps", data)
        self.assertTrue(CACHE_FILE.exists())

        # Sub-second reload via cache
        t0 = time.time()
        cached_data = scan_all(force_refresh=False)
        duration = time.time() - t0
        self.assertLess(duration, 0.5)
        self.assertEqual(len(data["desktopApps"]), len(cached_data["desktopApps"]))

    def test_html_navigation_chevrons(self):
        html_path = Path("src/ui/launchpad.html")
        content = html_path.read_text(encoding="utf-8")
        self.assertIn('id="nav-prev"', content)
        self.assertIn('id="nav-next"', content)
        self.assertIn('class="page-nav-btn nav-prev"', content)
        self.assertIn('class="page-nav-btn nav-next"', content)

    def test_css_draggable_and_nav_styling(self):
        css_path = Path("src/ui/launchpad_v2.css")
        content = css_path.read_text(encoding="utf-8")
        self.assertIn("cursor: grab;", content)
        self.assertIn("cursor: grabbing;", content)
        self.assertIn(".page-nav-btn", content)
        self.assertIn(".pagination-dots .dot.active", content)

    def test_js_mouse_drag_wheel_and_local_cache(self):
        js_path = Path("src/ui/launchpad_v2.js")
        content = js_path.read_text(encoding="utf-8")
        self.assertIn("aswitchi_frontend_cache_v2", content)
        self.assertIn("pointerdown", content)
        self.assertIn("pointermove", content)
        self.assertIn("pointerup", content)
        self.assertIn("deltaY", content)
        self.assertIn("deltaX", content)
        self.assertIn("state.dragJustFinished", content)

    def test_window_movement_and_maximize_support(self):
        html = Path("src/ui/launchpad.html").read_text(encoding="utf-8")
        self.assertIn('id="window-drag-bar"', html)
        self.assertIn('id="btn-maximize"', html)

        css = Path("src/ui/launchpad_v2.css").read_text(encoding="utf-8")
        self.assertIn(".window-drag-bar", css)
        self.assertIn(".ctrl-btn.btn-max", css)

        js = Path("src/ui/launchpad_v2.js").read_text(encoding="utf-8")
        self.assertIn("startWindowDrag", js)
        self.assertIn("toggleMaximize", js)

        py = Path("aswitchi_native.py").read_text(encoding="utf-8")
        self.assertIn("startWindowDrag", py)
        self.assertIn("toggleMaximize", py)
        self.assertIn("begin_move_drag", py)

if __name__ == "__main__":
    unittest.main()
