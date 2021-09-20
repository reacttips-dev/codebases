/* eslint-disable @trello/disallow-filenames */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { stickerMargin } = require('app/scripts/data/sticker-margin');

const minValue = -stickerMargin;
const maxValue = 100 - stickerMargin;

// Used to ensure that a sticker is inside the editable area
module.exports.stickerClip = function (value) {
  if (value < minValue) {
    return minValue;
  } else if (value > maxValue) {
    return maxValue;
  } else {
    return value;
  }
};
