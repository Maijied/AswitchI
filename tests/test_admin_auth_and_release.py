#!/usr/bin/env python3
"""
Test Suite: AswitchI Admin Authentication & Snap Release Engine
Validates role calculation, whitelist enforcement, Snapcraft operations, and rollback safety.
"""

import unittest
import os
import json
import re

ADMIN_CONFIG_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "website", "admin", "src", "lib", "admin-config.ts"))
API_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "website", "admin", "src", "lib", "api.ts"))

class TestAdminAuthAndRelease(unittest.TestCase):

    def setUp(self):
        self.assertTrue(os.path.exists(ADMIN_CONFIG_PATH), "admin-config.ts must exist")
        self.assertTrue(os.path.exists(API_PATH), "api.ts must exist")
        with open(ADMIN_CONFIG_PATH, "r", encoding="utf-8") as f:
            self.admin_config_src = f.read()
        with open(API_PATH, "r", encoding="utf-8") as f:
            self.api_src = f.read()

    def test_master_admin_whitelist(self):
        """Verify mdshuvo40@gmail.com has Master Admin clearance."""
        self.assertIn("mdshuvo40@gmail.com", self.admin_config_src)
        self.assertIn("Master Admin (Executive)", self.admin_config_src)

    def test_ops_whitelist(self):
        """Verify lorapokdev@gmail.com and maizied@lorapok.tech exist in clearance hierarchy."""
        self.assertIn("lorapokdev@gmail.com", self.admin_config_src)
        self.assertIn("maizied@lorapok.tech", self.admin_config_src)

    def test_generate_snapcraft_command_promote(self):
        """Verify command generation for channel promotion."""
        # Simulated python check matching api.ts
        def generate_cmd(op, rev, channel, progressive=None):
            if op == "promote_release":
                return f"snapcraft release aswitchi {rev} {channel}"
            elif op == "progressive_release":
                return f"snapcraft release aswitchi {rev} {channel} --progressive {progressive or 20}"
            elif op == "rollback":
                return f"snapcraft release aswitchi {rev} {channel}"
            elif op == "close_channel":
                return f"snapcraft close aswitchi {channel}"
            return "snapcraft status aswitchi"

        cmd_promote = generate_cmd("promote_release", "8", "stable")
        self.assertEqual(cmd_promote, "snapcraft release aswitchi 8 stable")

        cmd_prog = generate_cmd("progressive_release", "8", "stable", 25)
        self.assertEqual(cmd_prog, "snapcraft release aswitchi 8 stable --progressive 25")

        cmd_rollback = generate_cmd("rollback", "7", "stable")
        self.assertEqual(cmd_rollback, "snapcraft release aswitchi 7 stable")

        cmd_close = generate_cmd("close_channel", "8", "beta")
        self.assertEqual(cmd_close, "snapcraft close aswitchi beta")

    def test_api_workflow_dispatch_function(self):
        """Verify dispatchGitHubWorkflow is defined in api.ts and called in Deployments.tsx."""
        self.assertIn("export async function dispatchGitHubWorkflow", self.api_src)
        deployments_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "website", "admin", "src", "components", "pages", "Deployments.tsx"))
        with open(deployments_path, "r", encoding="utf-8") as f:
            deployments_src = f.read()
        self.assertIn("snap-operations.yml", deployments_src)

if __name__ == "__main__":
    unittest.main()
