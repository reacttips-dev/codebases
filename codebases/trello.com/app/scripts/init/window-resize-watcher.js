// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { WindowSize } = require('app/scripts/lib/window-size');

$(function () {
  WindowSize.calc();

  let resize = null;
  return $(window).on('resize', function () {
    clearTimeout(resize);
    resize = setTimeout(() => WindowSize.calc(), 200);
  });
});
