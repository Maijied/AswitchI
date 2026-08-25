#!/usr/bin/env python3
"""
Test Suite: Google Console & Firebase Credentials Validation
Validates Firebase project IDs, GA4 Measurement IDs, and OAuth configuration.
"""

import unittest
import os
import re

FIREBASE_CONFIG_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "website", "admin", "src", "lib", "firebase.ts"))
ADMIN_ENV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "website", "admin", ".env"))
WEBSITE_INDEX_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "website", "index.html"))

class TestGoogleConsoleCredentials(unittest.TestCase):

    def setUp(self):
        self.assertTrue(os.path.exists(FIREBASE_CONFIG_PATH), "firebase.ts must exist")
        self.assertTrue(os.path.exists(WEBSITE_INDEX_PATH), "index.html must exist")
        with open(FIREBASE_CONFIG_PATH, "r", encoding="utf-8") as f:
            self.firebase_ts = f.read()
        with open(WEBSITE_INDEX_PATH, "r", encoding="utf-8") as f:
            self.index_html = f.read()

    def test_firebase_project_id(self):
        """Verify project ID is aswitchi."""
        self.assertIn("aswitchi", self.firebase_ts)
        self.assertIn("aswitchi.firebaseapp.com", self.firebase_ts)

    def test_ga4_measurement_id_syntax(self):
        """Verify GA4 tracking tag format G-15CW67JXVH across website and admin."""
        self.assertIn("G-15CW67JXVH", self.index_html)
        self.assertIn("G-15CW67JXVH", self.firebase_ts)

    def test_google_oauth_provider_configured(self):
        """Verify GoogleAuthProvider is configured in firebase.ts."""
        self.assertIn("GoogleAuthProvider", self.firebase_ts)
        self.assertIn("select_account", self.firebase_ts)

if __name__ == "__main__":
    unittest.main()
