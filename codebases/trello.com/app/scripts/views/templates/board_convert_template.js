// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_copy',
);

module.exports = () =>
  t.form(function () {
    t.div('.board-menu-convert-to-template-container', () =>
      t.img('.board-menu-convert-to-template', {
        src: require('resources/images/template-create-popover-icon.svg'),
        alt: '',
        role: 'presentation',
      }),
    );

    t.p(() => t.format('make-template-text'));
    return t.input('.nch-button.nch-button--primary.wide.full.js-convert', {
      type: 'submit',
      value: t.l('make-template'),
    });
  });
