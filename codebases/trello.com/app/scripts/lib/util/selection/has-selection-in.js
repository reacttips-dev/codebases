/* eslint-disable @trello/disallow-filenames */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
module.exports.hasSelectionIn = function ($el) {
  const selection = window.getSelection();
  const string = selection.toString();
  const node = selection.anchorNode;
  return !!string && !!$el.find(node).length;
};
