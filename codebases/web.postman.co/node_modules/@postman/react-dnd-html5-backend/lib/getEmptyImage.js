'use strict';

exports.__esModule = true;
exports['default'] = getEmptyImage;
var emptyImage = undefined;

function getEmptyImage() {
  if (!emptyImage) {
    emptyImage = new Image();
    emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  }

  return emptyImage;
}

module.exports = exports['default'];