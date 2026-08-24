import re

with open("aswitchi_native.py", "r") as f:
    content = f.read()

# Add RGBA visual setting
rgba_patch = """        self.set_app_paintable(True)
        screen = self.get_screen()
        visual = screen.get_rgba_visual()
        if visual:
            self.set_visual(visual)"""

content = content.replace("        self.set_app_paintable(True)", rgba_patch)
content = content.replace("self.lp_webview.set_background_color(Gdk.RGBA(0.02, 0.06, 0.17, 1.0))", "self.lp_webview.set_background_color(Gdk.RGBA(0, 0, 0, 0))")

with open("aswitchi_native.py", "w") as f:
    f.write(content)
