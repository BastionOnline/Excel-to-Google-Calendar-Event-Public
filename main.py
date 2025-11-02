import webview

from modules.apiModule import Api
from modules.pyinstallerBoilerplate import pyinstallerboilerplate

# how to add colour
# add reminders in time

html_file, css_file, js_file = pyinstallerboilerplate()

if __name__ == '__main__':
    api = Api(None)

    # Open the HTML file in a webview window
    window = webview.create_window("Google Calendar Event Maker", f"file://{html_file}", js_api=api)
    
    # Set the api self.window so python can push to it
    # webview.start()
    webview.start(debug=True)