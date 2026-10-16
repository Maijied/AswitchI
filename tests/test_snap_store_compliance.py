import unittest
import json
import yaml
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent

class TestSnapStoreCompliance(unittest.TestCase):
    def setUp(self):
        self.snapcraft_file = PROJECT_ROOT / "snapcraft.yaml"
        self.desktop_file = PROJECT_ROOT / "aswitchi.desktop"
        self.package_json = PROJECT_ROOT / "package.json"

    def test_snapcraft_yaml_exists_and_valid(self):
        self.assertTrue(self.snapcraft_file.exists())
        with open(self.snapcraft_file, "r") as f:
            data = yaml.safe_load(f)
        
        self.assertEqual(data.get("name"), "aswitchi")
        self.assertEqual(data.get("confinement"), "classic")
        self.assertEqual(data.get("base"), "core22")
        self.assertEqual(data.get("license"), "GPL-3.0-or-later")
        
        # Verify apps entry
        apps = data.get("apps", {})
        self.assertIn("aswitchi", apps)
        self.assertIn("desktop", apps["aswitchi"])
        self.assertEqual(apps["aswitchi"]["desktop"], "usr/share/applications/aswitchi.desktop")

        # Verify craftctl default is used
        build_script = data["parts"]["aswitchi"]["override-build"]
        self.assertIn("craftctl default", build_script)
        self.assertNotIn("snapcraftctl", build_script)

    def test_desktop_file_compliance(self):
        self.assertTrue(self.desktop_file.exists())
        content = self.desktop_file.read_text(encoding="utf-8")
        self.assertIn("[Desktop Entry]", content)
        self.assertIn("Type=Application", content)
        self.assertIn("Name=AswitchI", content)
        self.assertIn("Exec=aswitchi %U", content)
        self.assertIn("Categories=Development;Utility;System;", content)

    def test_license_consistency(self):
        with open(self.package_json, "r") as f:
            pkg = json.load(f)
        self.assertEqual(pkg.get("license"), "GPL-3.0-or-later")

if __name__ == "__main__":
    unittest.main()
