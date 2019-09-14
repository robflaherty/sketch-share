import sketch from 'sketch'
import fs from '@skpm/fs'
import os from '@skpm/os'

export default function() {

  var document = sketch.getSelectedDocument()
  var page = document.selectedPage;

  var exportPath = os.homedir() + '/Documents/Sketch Exports/' + page.name + '/'
  var template = context.plugin.urlForResourceNamed('html.html').path()
  var indexFile = exportPath + 'index.html'

  var tempHTML = '';

  var artboards = []

  var pasteboard = NSPasteboard.generalPasteboard();

  page.layers.forEach(layer => {
    // Get only artboards and skip if artboard name starts with underscore
    if ( layer.type == 'Artboard' && !layer.name.startsWith('_') ) {
      artboards.push(layer)
    }
  });

  artboards.forEach(ab => {
    var name = ab.name;
    var filename = name + '.png'
    var description = false

    sketch.export(ab, {output: exportPath})

    var descriptionLayer = sketch.find('[name="*description"]', ab)

    if (descriptionLayer.length) {
      description = descriptionLayer[0].text
    }

    if (description) {
      tempHTML += '<li><a href="' + filename + '" target="_blank">' + name + '</a><br />\n'
      tempHTML += description + '</li>\n'
    } else {
      tempHTML += '<li><a href="' + filename + '" target="_blank">' + name + '</a></li>\n'
    }


  });

  var html = fs.readFileSync(template, {encoding: 'utf-8'})

  html = '<html>\n<head>\n<title>' + page.name +'</title>\n' + html;
  html += '<h1>' + page.name + '</h1>\n<ul>\n';
  html += tempHTML;
  html += '</ul>\n</div>\n</body>\n</html>'
  fs.writeFileSync(indexFile, html)

  // Copy file path to clipboard
  pasteboard.clearContents()
  pasteboard.writeObjects([indexFile]);

}