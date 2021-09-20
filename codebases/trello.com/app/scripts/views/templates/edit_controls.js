// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'edit_controls',
);

module.exports = t.renderable(() =>
  t.div('.edit-controls.u-clearfix', function () {
    t.input(
      '.nch-button.nch-button--primary.confirm.mod-submit-edit.js-save-edit',
      {
        type: 'submit',
        value: t.l('save'),
      },
    );
    return t.a('.icon-lg.icon-close.dark-hover.cancel.js-cancel-edit', {
      href: '#',
    });
  }),
);
