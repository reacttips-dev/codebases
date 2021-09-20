// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'tooltip_content',
);

module.exports = function () {
  const closeable = t.mustacheVar('closeable');

  const classList = closeable ? ['.tooltip-content-closeable'] : [];

  return t.div(
    classList.join('') + '.tooltip-content.js-tooltip-content',
    function () {
      if (closeable) {
        t.icon('close', {
          class: 'tooltip-close-button js-tooltip-close-button',
        });
      }
      return t.raw(t.mustacheVar('tooltipHtml'));
    },
  );
};
