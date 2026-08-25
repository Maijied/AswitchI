#!/usr/bin/env python3
import sys
import os
import json
import warnings
from pathlib import Path

# Suppress PyGObject deprecation notices
warnings.filterwarnings("ignore", category=DeprecationWarning)

# Ensure project path in sys.path
PROJECT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(PROJECT_DIR))

import gi
gi.require_version('Gtk', '3.0')
gi.require_version('WebKit2', '4.1')
from gi.repository import Gtk, WebKit2, GLib, Gdk, Gio

from src.backend import scanner, executor, config

def execute_js(webview, js):
    try:
        if hasattr(webview, "evaluate_javascript"):
            webview.evaluate_javascript(js, -1, None, None, None, None, None)
        else:
            webview.run_javascript(js, None, None, None)
    except Exception:
        try:
            webview.run_javascript(js, None, None, None)
        except Exception:
            pass

class AswitchINativeApp(Gtk.ApplicationWindow):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.set_title("AswitchI")
        self.set_default_size(1220, 800)
        self.set_position(Gtk.WindowPosition.CENTER)
        self.set_icon_from_file(str(PROJECT_DIR / "assets" / "icon.svg"))
        
        # Remove standard GNOME top titlebar / headerbar
        self.set_decorated(False)
        self.set_app_paintable(True)
        screen = self.get_screen()
        visual = screen.get_rgba_visual()
        if visual:
            self.set_visual(visual)

        # Dark Window Styling
        screen = Gdk.Screen.get_default()
        css_provider = Gtk.CssProvider()
        css_provider.load_from_data(b"""
            window {
                background-color: #06102b;
            }
            .inapp-bar {
                background-color: rgba(15, 23, 42, 0.95);
                border-bottom: 1px solid rgba(255, 255, 255, 0.12);
                padding: 6px 14px;
            }
            .inapp-btn {
                background-color: rgba(255, 255, 255, 0.1);
                color: #f1f5f9;
                border-radius: 6px;
                border: 1px solid rgba(255, 255, 255, 0.15);
                padding: 4px 10px;
                font-size: 12px;
                font-weight: 500;
            }
            .inapp-btn:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
            .inapp-btn-back {
                background-color: rgba(239, 68, 68, 0.2);
                border-color: rgba(239, 68, 68, 0.4);
                color: #fca5a5;
            }
            .inapp-btn-back:hover {
                background-color: rgba(239, 68, 68, 0.8);
                color: #ffffff;
            }
            .inapp-title {
                color: #ffffff;
                font-size: 13px;
                font-weight: 600;
            }
        """)
        Gtk.StyleContext.add_provider_for_screen(
            screen, css_provider, Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
        )

        # Gtk Stack to switch between Launchpad and In-App Web AI View
        self.stack = Gtk.Stack()
        self.stack.set_transition_type(Gtk.StackTransitionType.CROSSFADE)
        self.stack.set_transition_duration(250)

        # -------------------------------------------------------------
        # 1. Launchpad View (HTML/CSS UI with 3D Dock & Search)
        # -------------------------------------------------------------
        self.ucm = WebKit2.UserContentManager()
        self.ucm.register_script_message_handler("nativeApp")
        self.ucm.connect("script-message-received::nativeApp", self.on_js_message)

        lp_settings = WebKit2.Settings()
        lp_settings.set_enable_javascript(True)
        lp_settings.set_enable_developer_extras(False)
        lp_settings.set_allow_file_access_from_file_urls(True)
        lp_settings.set_allow_universal_access_from_file_urls(True)

        self.lp_webview = WebKit2.WebView.new_with_user_content_manager(self.ucm)
        self.lp_webview.set_settings(lp_settings)
        self.lp_webview.set_background_color(Gdk.RGBA(0, 0, 0, 0))
        self.lp_webview.connect("load-changed", self.on_lp_load_changed)

        html_path = PROJECT_DIR / "src" / "ui" / "launchpad.html"
        self.lp_webview.load_uri(f"file://{html_path}")
        self.stack.add_named(self.lp_webview, "launchpad")

        # -------------------------------------------------------------
        # 2. Native In-App Web AI View (Full WebKit2 with Persistent Data)
        # -------------------------------------------------------------
        self.web_box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=0)
        
        # In-App Top Navigation Bar
        self.inapp_bar = Gtk.Box(orientation=Gtk.Orientation.HORIZONTAL, spacing=8)
        self.inapp_bar.get_style_context().add_class("inapp-bar")

        self.btn_back_lp = Gtk.Button(label="‹ Launchpad")
        self.btn_back_lp.get_style_context().add_class("inapp-btn")
        self.btn_back_lp.get_style_context().add_class("inapp-btn-back")
        self.btn_back_lp.connect("clicked", lambda b: self.show_launchpad())
        self.inapp_bar.pack_start(self.btn_back_lp, False, False, 0)

        self.btn_nav_back = Gtk.Button(label="‹")
        self.btn_nav_back.get_style_context().add_class("inapp-btn")
        self.btn_nav_back.connect("clicked", lambda b: self.web_view.go_back())
        self.inapp_bar.pack_start(self.btn_nav_back, False, False, 0)

        self.btn_nav_fwd = Gtk.Button(label="›")
        self.btn_nav_fwd.get_style_context().add_class("inapp-btn")
        self.btn_nav_fwd.connect("clicked", lambda b: self.web_view.go_forward())
        self.inapp_bar.pack_start(self.btn_nav_fwd, False, False, 0)

        self.btn_nav_reload = Gtk.Button(label="⟳")
        self.btn_nav_reload.get_style_context().add_class("inapp-btn")
        self.btn_nav_reload.connect("clicked", lambda b: self.web_view.reload())
        self.inapp_bar.pack_start(self.btn_nav_reload, False, False, 0)

        self.lbl_web_title = Gtk.Label(label="Web AI")
        self.lbl_web_title.get_style_context().add_class("inapp-title")
        self.inapp_bar.pack_start(self.lbl_web_title, True, True, 0)

        self.btn_popout = Gtk.Button(label="↗ Standalone")
        self.btn_popout.get_style_context().add_class("inapp-btn")
        self.btn_popout.connect("clicked", self.on_popout_clicked)
        self.inapp_bar.pack_end(self.btn_popout, False, False, 0)

        self.web_box.pack_start(self.inapp_bar, False, False, 0)

        # Persistent Data Manager for Cookies & Login
        profile_path = str(Path.home() / ".config" / "aswitchi" / "webai-profile")
        os.makedirs(profile_path, exist_ok=True)
        self.data_manager = WebKit2.WebsiteDataManager(
            base_data_directory=profile_path,
            base_cache_directory=profile_path + "/cache"
        )
        self.web_context = WebKit2.WebContext.new_with_website_data_manager(self.data_manager)

        web_settings = WebKit2.Settings()
        web_settings.set_enable_javascript(True)
        web_settings.set_enable_developer_extras(False)
        web_settings.set_user_agent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36")
        web_settings.set_enable_webgl(True)
        web_settings.set_enable_smooth_scrolling(True)

        self.web_view = WebKit2.WebView.new_with_context(self.web_context)
        self.web_view.set_settings(web_settings)
        self.web_view.connect("load-changed", self.on_web_load_changed)

        self.web_box.pack_start(self.web_view, True, True, 0)
        self.stack.add_named(self.web_box, "web_viewer")

        self.add(self.stack)
        self.connect("destroy", Gtk.main_quit)
        self.connect("key-press-event", self.on_key_press)

        self.current_web_item = None

        # Periodic refresh for running processes
        GLib.timeout_add_seconds(4, self.periodic_sync)

    def show_launchpad(self):
        self.stack.set_visible_child_name("launchpad")
        self.current_web_item = None
        self.send_scan_data()

    def open_web_ai(self, item):
        self.current_web_item = item
        name = item.get("name", "AswitchI Web AI")
        url = item.get("url", "https://aswitchi.lorapok.tech")
        self.lbl_web_title.set_text(name)
        self.web_view.load_uri(url)
        self.web_box.show_all()
        self.stack.set_visible_child_name("web_viewer")

    def on_popout_clicked(self, btn):
        if self.current_web_item:
            executor.launch_web(self.current_web_item)
            self.show_launchpad()

    def on_web_load_changed(self, webview, event):
        if event == WebKit2.LoadEvent.COMMITTED:
            if self.current_web_item:
                self.lbl_web_title.set_text(f"{self.current_web_item.get('name', 'Web AI')}")

    def on_lp_load_changed(self, webview, event):
        if event == WebKit2.LoadEvent.FINISHED:
            self.send_scan_data()

    def on_key_press(self, widget, event):
        if event.keyval == Gdk.KEY_Escape:
            if self.stack.get_visible_child_name() == "web_viewer":
                self.show_launchpad()
                return True
            else:
                self.destroy()
                return True
        return False

    def send_scan_data(self):
        data = scanner.scan_all()
        data["appVersion"] = config.get_app_version()
        json_str = json.dumps(data)
        js = f"if (window.onNativeDataReceived) {{ window.onNativeDataReceived({json_str}); }}"
        execute_js(self.lp_webview, js)

    def periodic_sync(self):
        self.send_scan_data()
        return True

    def on_js_message(self, ucm, js_result):
        try:
            val = js_result.get_js_value()
            msg_raw = val.to_string()
            msg = json.loads(msg_raw)
            action = msg.get("action")

            if action == "sync":
                self.send_scan_data()

            elif action == "openInAppWeb":
                item = msg.get("item", {})
                self.open_web_ai(item)

            elif action == "launch":
                item_type = msg.get("type")
                item = msg.get("item", {})
                project_path = msg.get("projectPath")

                if not item_type:
                    item_type = item.get("type")

                if item_type == "web" or "url" in item:
                    self.open_web_ai(item)
                elif item_type == "desktop":
                    executor.launch_desktop(item, project_path)
                elif item_type == "cli":
                    executor.launch_cli(item, project_path)
                
                GLib.timeout_add(800, lambda: (self.send_scan_data(), False)[1])

            elif action == "togglePinDock":
                config.toggle_pin_dock(msg.get("id"))
                self.send_scan_data()

            elif action == "addWebAi":
                config.add_custom_web_ai(msg)
                self.send_scan_data()

            elif action == "removeWebAi":
                config.remove_custom_web_ai(msg.get("id"))
                self.send_scan_data()

            elif action == "stopApp":
                executor.stop_process(msg.get("keyword"))
                GLib.timeout_add(800, lambda: (self.send_scan_data(), False)[1])

            elif action == "minimizeWindow":
                self.iconify()

            elif action == "openTrash":
                os.system("xdg-open trash:/// &")

            elif action == "closeWindow":
                self.destroy()

        except Exception as e:
            print("Error handling JS message:", e)

class AswitchIApplication(Gtk.Application):
    def __init__(self):
        super().__init__(application_id="com.lorapok.aswitchi", flags=Gio.ApplicationFlags.FLAGS_NONE)
        self.window = None

    def do_activate(self):
        if not self.window:
            self.window = AswitchINativeApp(application=self)
            self.window.show_all()
        self.window.present()

def main():
    if len(sys.argv) > 1:
        flag = sys.argv[1]
        if flag in ["--list", "-l"]:
            data = scanner.scan_all()
            print("\n=== AswitchI - Detected AI Tools (Native Ubuntu) ===")
            print("--- Desktop AI IDEs ---")
            for a in data["desktopApps"]:
                status = "🟢 RUNNING" if a["running"] else "⚪ STOPPED"
                print(f"  • {a['name']} [{status}] -> {a.get('exec')}")
            print("--- CLI AI Agents ---")
            for a in data["cliAgents"]:
                status = "🟢 RUNNING" if a["running"] else "⚪ STOPPED"
                print(f"  • {a['name']} [{status}] -> {a.get('cmd')}")
            print("--- Web AIs ---")
            for a in data["webAis"]:
                print(f"  • {a['name']} -> {a.get('url')}")
            print(f"\nTotal: {data['summary']['totalInstalledAIs']} installed tools, {data['summary']['projectCount']} workspace projects.\n")
            sys.exit(0)
        
        elif flag in ["--sync", "-s"]:
            data = scanner.scan_all()
            print(f"Sync complete: Detected {data['summary']['totalInstalledAIs']} AI tools and {data['summary']['projectCount']} projects.")
            sys.exit(0)

    app = AswitchIApplication()
    app.run(sys.argv)

if __name__ == "__main__":
    main()
