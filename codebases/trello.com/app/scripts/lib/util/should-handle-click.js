/* eslint-disable
    eqeqeq,
    @trello/disallow-filenames,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Given a click on something that should act like a link, should we route it or
// let the browser handle it?  Consequences: routing when the browser should
// handle means that the current tab navigates instead of opening in a new tab
// or something like that; the opposite means we do a page reload instead of
// just a navigation.
module.exports.shouldHandleClick = function (e) {
  if (
    e.ctrlKey ||
    e.metaKey ||
    e.shiftKey ||
    (e.button != null && e.button !== 0)
  ) {
    return false;
  }
  return true;
};
