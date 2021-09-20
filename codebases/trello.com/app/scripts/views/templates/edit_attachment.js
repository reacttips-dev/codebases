// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'edit_attachment',
);

module.exports = t.renderable(({ serviceKey, url, name }) =>
  t.form(function () {
    if (serviceKey === 'other') {
      t.label(function () {
        t.format('attachment-url');
        return t.input('.js-attachment-url', { type: 'text', value: url });
      });
    }

    t.label(function () {
      if (serviceKey === 'other') {
        t.format('attachment-name-optional');
      } else {
        t.format('attachment-name');
      }
      return t.input('.js-attachment-name.js-autofocus', {
        type: 'text',
        value: name,
      });
    });

    t.input('.js-edit-attachment.wide.nch-button.nch-button--primary', {
      style: 'margin: 0;',
      type: 'submit',
      value: t.l('update-attachment'),
    });

    return t.div('.hide.save-attachment-container');
  }),
);
