import re

with open("aswitchi_native.py", "r") as f:
    content = f.read()

if "Gio" not in content:
    content = content.replace("from gi.repository import Gtk, Gdk, GLib", "from gi.repository import Gtk, Gdk, GLib, Gio")

content = content.replace("class AswitchINativeApp(Gtk.Window):", "class AswitchINativeApp(Gtk.ApplicationWindow):")
content = content.replace(
    "def __init__(self):\n        super().__init__(type=Gtk.WindowType.TOPLEVEL)",
    "def __init__(self, *args, **kwargs):\n        super().__init__(*args, **kwargs)"
)

new_app_class = """class AswitchIApplication(Gtk.Application):
    def __init__(self):
        super().__init__(application_id="com.lorapok.aswitchi", flags=Gio.ApplicationFlags.FLAGS_NONE)
        self.window = None

    def do_activate(self):
        if not self.window:
            self.window = AswitchINativeApp(application=self)
            self.window.show_all()
        self.window.present()

def main():"""

content = content.replace("def main():", new_app_class)
content = content.replace("    app = AswitchINativeApp()\n    app.show_all()\n    Gtk.main()", "    app = AswitchIApplication()\n    app.run(sys.argv)")

with open("aswitchi_native.py", "w") as f:
    f.write(content)
