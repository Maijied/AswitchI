import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk, Gio, GLib

class MyApp(Gtk.Application):
    def __init__(self):
        super().__init__(application_id="com.lorapok.aswitchi", flags=Gio.ApplicationFlags.FLAGS_NONE)
        self.window = None

    def do_activate(self):
        print("Activate called")
        if not self.window:
            self.window = Gtk.ApplicationWindow(application=self)
            self.window.set_title("Test")
            self.window.set_default_size(200, 200)
            self.window.show_all()
        self.window.present()

app = MyApp()
import sys
app.run(sys.argv)
