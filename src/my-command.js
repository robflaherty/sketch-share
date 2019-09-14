import sketch from 'sketch'
import fs from '@skpm/fs'

export default function() {

  var document = sketch.getSelectedDocument()
  var page = document.selectedPage;

  var exportPath = '/Users/robflaherty/Documents/Sketch Exports/' + page.name + '/'
  var resourcesPath = `/Users/robflaherty/Desktop/test1/test1.sketchplugin/Contents/Resources/`

  var tempHTML = '';

  log(page.name)

  var data = {};
  data.files = [];

  var artboards = []

  page.layers.forEach(layer => {
    if (layer.type == 'Artboard') {
      artboards.push(layer)
    }
  });

  artboards.forEach(ab => {
    sketch.export(ab, {output: exportPath})
    data.files.push(ab.name + '.png')
    tempHTML += '<li><a href="' + ab.name + '.png" target="_blank">' + ab.name + '</a></li>\n'
  });

  var html = fs.readFileSync(resourcesPath + 'html.html', {encoding: 'utf-8'})

  // Add Title
  //fs.appendFileSync(resourcesPath + 'html.html', '<h1>' + page.name + '</h1>\n<ul>\n')

  //fs.appendFileSync(resourcesPath + 'html.html', tempHTML)

  //var html = fs.readFileSync(resourcesPath + 'html.html', {encoding: 'utf-8'})
  //console.log(html)

  html = '<html>\n<head>\n<title>' + page.name +'</title>\n' + html;
  html += '<h1>' + page.name + '</h1>\n<ul>\n';
  html += tempHTML;
  html += '</ul>\n</div>\n</body>\n</html>'
  fs.writeFileSync(exportPath + 'index.html', html)



  // fs.copy('./html', exportPath, function (err) {
  //   if (err) return console.error(err)
  //   console.log('success!')
  // });

  // var artboard = doc.selectedLayers[0]
  // console.log(artboard)

  // selectedLayers.forEach(function(layer) {
  //   log(layer)
  //   var absolute = layer.frame.changeBasis({from: layer.parent, to: layer.getParentArtboard()});
  //   log(layer.getParentArtboard())
  // });


}