/* eslint-disable @trello/disallow-filenames */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
module.exports.selectElementContents = function (el) {
  let range;
  if (document.body.createTextRange) {
    range = document.body.createTextRange();
    range.moveToElementText(el);
    range.select();
  } else {
    const selection = window.getSelection();
    range = document.createRange();
    range.selectNodeContents(el);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};
