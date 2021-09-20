/* eslint-disable @trello/disallow-filenames */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Removes Text Ranges
// http://stackoverflow.com/a/3169849/616931

module.exports.removeAllRanges = function () {
  if (window.getSelection) {
    if (window.getSelection().empty) {
      // Chrome
      return window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) {
      // Firefox
      return window.getSelection().removeAllRanges();
    }
  } else if (document.selection) {
    // IE?
    return document.selection.empty();
  }
};
