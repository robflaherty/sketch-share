# Sketch Share

## About
This plugin exports all of the artboards on the current page and generates an HTML index file that links to each one.

It's very beta.

## Installation
- [Download](../../releases/latest/download/sketch-share.sketchplugin.zip) the latest release of the plugin
- Un-zip
- Double-click on sketch-share.sketchplugin

### Usage
- Export your artboards with the shortcut CTRL+Shift+E or by selecting the Sketch Share command in the plugin menu
- The artboards will be exported as PNGs and saved to `~/Documents/Sketch Exports/`
- The path to the index file will be copied to the clipboard so after exporting you can just paste into a browser
- All artboards on the current page will be exported. You can exclude artboards from export by adding an underscore to the beginning of the artboard name
- The name of the Sketch Page will be used for the title of the HTML page
- The artboard names will be used as the link names on the HTML page
- You can include description text on the HTML page by adding a hidden text layer to each artboard. The name of the layer must be "*description"
