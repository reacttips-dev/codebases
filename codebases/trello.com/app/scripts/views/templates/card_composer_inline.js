/* eslint-disable
 */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Browser = require('@trello/browser');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'card_composer_inline',
);

module.exports = function () {
  const placeholder = t.mustacheVar('placeholder');

  t.div('.list-card.js-composer', () =>
    t.div('.list-card-details.u-clearfix', function () {
      t.div('.list-card-labels.u-clearfix.js-list-card-composer-labels');
      t.textarea(
        '.list-card-composer-textarea.js-card-title',
        { dir: 'auto', placeholder },
        () =>
          t.text(
            ['explorer-10', 'explorer-11'].includes(Browser.browserVersionStr)
              ? placeholder
              : t.mustacheVar('title'),
          ),
      );
      return t.div('.list-card-members.js-list-card-composer-members');
    }),
  );

  return t.div('.cc-controls.u-clearfix', function () {
    t.div('.cc-controls-section', function () {
      t.input(
        '.nch-button.nch-button--primary.confirm.mod-compact.js-add-card',
        {
          type: 'submit',
          value: t.l('add-card'),
        },
      );
      return t.a('.icon-lg.icon-close.dark-hover.js-cancel', { href: '#' });
    });

    return t.div('.cc-controls-section.mod-right', () =>
      t.a(
        '.icon-lg.icon-overflow-menu-horizontal.dark-background-hover.js-cc-menu',
        { href: '#' },
      ),
    );
  });
};
