import unittest
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from src.backend import executor

class TestExecutor(unittest.TestCase):

    def test_launch_desktop_dry(self):
        fake_app = {
            "name": "Test IDE",
            "exec": "true"
        }
        res = executor.launch_desktop(fake_app, "/home/maizied")
        self.assertTrue(res.get("success"))

    def test_launch_web_dry(self):
        fake_web = {
            "id": "web-test-unit",
            "name": "Test Web",
            "url": "https://example.com"
        }
        res = executor.launch_web(fake_web)
        self.assertTrue(res.get("success"))

    def test_stop_process_dry(self):
        res = executor.stop_process("non_existent_process_xyz_999")
        self.assertTrue(res.get("success"))

if __name__ == "__main__":
    unittest.main()
