import unittest
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from src.backend import scanner

class TestScanner(unittest.TestCase):

    def setUp(self):
        self.data = scanner.scan_all()

    def test_summary_and_counts(self):
        summary = self.data.get("summary", {})
        self.assertGreater(summary.get("totalInstalledAIs", 0), 0)
        self.assertGreaterEqual(summary.get("desktopCount", 0), 1)
        self.assertGreaterEqual(summary.get("cliCount", 0), 1)
        self.assertGreaterEqual(summary.get("webCount", 0), 1)
        self.assertGreaterEqual(summary.get("projectCount", 0), 1)

    def test_desktop_apps_structure(self):
        desktop_apps = self.data.get("desktopApps", [])
        for app in desktop_apps:
            self.assertEqual(app.get("type"), "desktop")
            self.assertIn("id", app)
            self.assertIn("name", app)
            self.assertIn("exec", app)
            self.assertIn("icon", app)
            self.assertIn("running", app)
            self.assertIsInstance(app["running"], bool)

    def test_cli_agents_structure(self):
        cli_agents = self.data.get("cliAgents", [])
        for agent in cli_agents:
            self.assertEqual(agent.get("type"), "cli")
            self.assertIn("id", agent)
            self.assertIn("name", agent)
            self.assertIn("cmd", agent)
            self.assertIn("binaryPath", agent)
            self.assertTrue(Path(agent["binaryPath"]).exists(), f"Binary {agent['binaryPath']} must exist")
            self.assertIn("running", agent)
            self.assertIsInstance(agent["running"], bool)

    def test_web_ais_structure(self):
        web_ais = self.data.get("webAis", [])
        for web in web_ais:
            self.assertEqual(web.get("type"), "web")
            self.assertIn("id", web)
            self.assertIn("name", web)
            self.assertIn("url", web)
            self.assertTrue(web["url"].startswith("https://"), f"URL {web['url']} must be https")

    def test_strict_process_regex_matching(self):
        # Ensure false positives are prevented
        fake_ps_cursor_only = "1000 /usr/share/cursor/cursor --type=renderer"
        self.assertTrue(scanner.is_pattern_running([r"\bcursor\b"], fake_ps_cursor_only))
        self.assertFalse(scanner.is_pattern_running([r"dcursor-gui\b", r"\bdcursor\b"], fake_ps_cursor_only))

        fake_ps_claude_desktop = "2000 /usr/lib/claude-desktop/claude-desktop"
        self.assertTrue(scanner.is_pattern_running([r"\bclaude-desktop\b"], fake_ps_claude_desktop))
        self.assertFalse(scanner.is_pattern_running([r"\bclaude\s", r"bin/claude\b"], fake_ps_claude_desktop))

    def test_projects_detection(self):
        projects = self.data.get("projects", [])
        self.assertIsInstance(projects, list)
        self.assertGreater(len(projects), 0)
        for proj in projects[:5]:
            self.assertIn("name", proj)
            self.assertIn("path", proj)
            self.assertTrue(Path(proj["path"]).exists(), f"Project path {proj['path']} must exist")

if __name__ == "__main__":
    unittest.main()
