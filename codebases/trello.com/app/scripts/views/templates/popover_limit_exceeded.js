// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_limit_exceeded',
);

module.exports = t.renderable((limitType) =>
  t.div(
    '.error.js-limit-exceeded',
    { style: 'margin: 12px 0 6px;' },
    function () {
      if (limitType === 'perCard') {
        return t.format('attachments-per-card-exceeded');
      } else if (limitType === 'perBoard') {
        return t.format('attachments-per-board-exceeded');
      }
    },
  ),
);
