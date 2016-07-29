var webshot = require('webshot');
var ColorThief = require('@paulavery/color-thief');
var debug = require('debug')('magnet-metadata-screenshots:lib');
var colorThief = new ColorThief();
var uuid = require('node-uuid');

var options = {
  screenSize: {
    width: 320
  , height: 480
  }
, shotSize: {
    width: 320
  , height: 480
  }
, userAgent: 'Mozilla/5.0 (Linux; <Android Version>; <Build Tag etc.>) AppleWebKit/<WebKit Rev>'
    + ' (KHTML, like Gecko) Chrome/<Chrome Rev> Mobile Safari/<WebKit Rev>'
};

function getVisualInformation(url) {
  debug(`Getting information for '${url}'`)
  return new Promise((resolve, reject) => {
    var name = uuid.v4() + '.png';
    var path = `static/${name}`;
    debug(`Path for image is ${path}`);
    webshot(url, path, options, function(err) {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        path: `/static/${name}`,
        mainColor: colorThief.getColor(path),
        palette: colorThief.getPalette(path, 8),
        dimensions: {
          width: 320,
          height: 480
        }
      });
    });
  });
}

module.exports = {
  getVisualInformation
}
