// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_reopen_board',
);

module.exports = t.renderable(function () {
  t.div('.js-billable-guests-alert');
  return t.input('.nch-button.nch-button--primary.full.js-confirm-reopen', {
    type: 'submit',
    value: t.l('confirm'),
  });
});
