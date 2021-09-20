// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')('confirm');

module.exports = function () {
  t.p(function () {
    if (t.mustacheVar('html')) {
      return t.raw(t.mustacheVar('html'));
    } else {
      return t.text(t.mustacheVar('text'));
    }
  });

  t.input('.js-confirm.full', {
    type: 'submit',
    class: t.mustacheVar('confirmBtnClass'),
    value: t.mustacheVar('confirmText'),
    'data-test-id': t.mustacheVar('confirmBtnTestId'),
  });

  return t.mustacheBlock('cancelText', () =>
    t.input('.js-cancel.full', {
      type: 'submit',
      value: t.mustacheVar('cancelText'),
    }),
  );
};
