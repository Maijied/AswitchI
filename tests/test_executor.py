import unittest
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from src.backend import executor

class TestExecutor(unittest.TestCase):

    @patch("subprocess.Popen")
    def test_launch_desktop_dry(self, mock_popen):
        mock_popen.return_value = MagicMock(pid=12345)
        fake_app = {
            "name": "Test IDE",
            "exec": "true"
        }
        res = executor.launch_desktop(fake_app, "/home/maizied")
        self.assertTrue(res.get("success"))
        mock_popen.assert_called_once()

    @patch("subprocess.Popen")
    def test_launch_web_dry(self, mock_popen):
        mock_popen.return_value = MagicMock(pid=12346)
        fake_web = {
            "id": "web-test-unit",
            "name": "AswitchI Web",
            "url": "https://aswitchi.lorapok.tech"
        }
        res = executor.launch_web(fake_web)
        self.assertTrue(res.get("success"))
        mock_popen.assert_called_once()
        # Verify the args passed to Chrome/browser include our domain
        called_args = mock_popen.call_args[0][0]
        self.assertTrue(any("https://aswitchi.lorapok.tech" in arg for arg in called_args))

    def test_stop_process_dry(self):
        res = executor.stop_process("non_existent_process_xyz_999")
        self.assertTrue(res.get("success"))

if __name__ == "__main__":
    unittest.main()
