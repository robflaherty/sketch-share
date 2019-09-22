import sketch from 'sketch'
import fs from '@skpm/fs'
import os from '@skpm/os'
import dialog from '@skpm/dialog'

export default function() {

  var document = sketch.getSelectedDocument()
  var page = document.selectedPage

  var exportPath = os.homedir() + '/Documents/Sketch Exports/' + page.name + '/'
  var template = context.plugin.urlForResourceNamed('html.html').path()
  var pasteboard = NSPasteboard.generalPasteboard()

  var indexFile
  var tempHTML = ''
  var artboards = []
  var intro = false

  // Let user choose export directory
  var selected = dialog.showOpenDialogSync({
    title: 'Choose Export Directory',
    properties: ['openDirectory'],
    buttonLabel: 'Export Here'
  });

  // End early if they click cancel
  if (!selected.length) {
    return
  } else {
    exportPath = selected + '/' + page.name + '/'
    indexFile = exportPath + 'index.html'
  }

  // Get artboards
  page.layers.forEach(layer => {
    // Get only artboards and skip if artboard name starts with underscore
    if ( layer.type == 'Artboard' && !layer.name.startsWith('_') ) {
      artboards.push(layer)
    }
  })

  // Check if intro text exists
  var introLayer = sketch.find('[name="*intro"]', page)

  if (introLayer.length) {
    intro = introLayer[0].text
  }

  // Loop through artboards
  artboards.forEach(ab => {
    var name = ab.name
    var filename = name + '.png'
    var description = false

    // Export PNG
    sketch.export(ab, {output: exportPath})

    // Check if description text exists
    var descriptionLayer = sketch.find('[name="*description"]', ab)

    if (descriptionLayer.length) {
      description = descriptionLayer[0].text
    }

    // Add link
    tempHTML += '<li><a href="' + filename + '" target="_blank">' + name + '</a>'

    if (description) {
      tempHTML += '<br />\n' + description + '</li>\n'
    } else {
      tempHTML += '</li>\n'
    }

  })

  // Get HTML template
  var html = fs.readFileSync(template, {encoding: 'utf-8'})

  html = '<html>\n<head>\n<title>' + page.name +'</title>\n' + html
  html += '<h1>' + page.name + '</h1>\n'

  if (intro) {
    html += '<p class="intro">' + intro + '</p>\n'
  }

  html += '<ul>\n' + tempHTML
  html += '</ul>\n</div>\n</body>\n</html>'
  fs.writeFileSync(indexFile, html)

  // Copy file path to clipboard
  pasteboard.clearContents()
  pasteboard.writeObjects(['file://' + indexFile])

  // Open index file in browser
  var fileURL = NSURL.fileURLWithPath(indexFile)
  NSWorkspace.sharedWorkspace().openFile(fileURL.path())

}