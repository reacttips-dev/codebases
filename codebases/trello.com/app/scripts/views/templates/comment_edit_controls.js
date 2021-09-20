// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'comment_edit_controls',
);

module.exports = function () {
  t.div('.comment-controls.u-clearfix', function () {
    t.input(
      '.nch-button.nch-button--primary.confirm.mod-no-top-bottom-margin.js-save-edit',
      {
        type: 'submit',
        value: t.l('save'),
      },
    );

    return t.a(
      '.js-discard-comment-edits.icon-lg.icon-close.dark-hover.cancel',
      {
        'aria-label': t.l('close-label'),
        href: '#',
        role: 'button',
      },
    );
  });

  return t.div('.comment-controls-errors.u-clearfix', function () {
    t.div('.js-too-long-warning.hide', () =>
      t.p(() => t.format('your-comment-is-too-long')),
    );

    return t.div('.js-is-empty-warning.hide', () =>
      t.p(() => t.format('must-have-at-least-one-character')),
    );
  });
};
