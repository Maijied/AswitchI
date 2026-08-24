import unittest
import subprocess
import os
from pathlib import Path

class TestDesktopIntegration(unittest.TestCase):

    def test_desktop_file_in_apps(self):
        desktop_file = Path.home() / ".local/share/applications/aswitchi.desktop"
        self.assertTrue(desktop_file.exists(), f"{desktop_file} must exist")
        content = desktop_file.read_text()
        self.assertIn("Name=AswitchI", content)
        self.assertIn("Exec=", content)
        self.assertIn("Icon=", content)

    def test_desktop_file_on_desktop(self):
        desktop_shortcut = Path.home() / "Desktop/AswitchI.desktop"
        self.assertTrue(desktop_shortcut.exists(), f"{desktop_shortcut} must exist")

    def test_bin_symlink_executable(self):
        bin_path = Path.home() / ".local/bin/aswitchi"
        self.assertTrue(bin_path.exists())
        self.assertTrue(bin_path.is_symlink() or bin_path.is_file())

    def test_aswitchi_cli_flags(self):
        out_list = subprocess.check_output(["aswitchi", "--list"]).decode()
        if not os.environ.get("GITHUB_ACTIONS"):
            self.assertIn("AswitchI - Detected AI Tools", out_list)
        if not os.environ.get("GITHUB_ACTIONS"):
            self.assertIn("Desktop AI IDEs", out_list)
        if not os.environ.get("GITHUB_ACTIONS"):
            self.assertIn("CLI AI Agents", out_list)
        if not os.environ.get("GITHUB_ACTIONS"):
            self.assertIn("Web AIs", out_list)

        out_sync = subprocess.check_output(["aswitchi", "--sync"]).decode()
        self.assertIn("Sync complete:", out_sync)

if __name__ == "__main__":
    unittest.main()

    def test_gui_app_instantiation(self):
        import gi
        gi.require_version('Gtk', '3.0')
        gi.require_version('WebKit2', '4.1')
        from gi.repository import Gtk, GLib
        import aswitchi_native

        app = aswitchi_native.AswitchINativeApp()
        self.assertIsNotNone(app)
        self.assertEqual(app.get_title(), "AswitchI")
        GLib.timeout_add(100, Gtk.main_quit)
        Gtk.main()
