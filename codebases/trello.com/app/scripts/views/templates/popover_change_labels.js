// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_change_labels',
);

module.exports = function () {
  t.input('.js-autofocus.js-label-search', {
    type: 'text',
    placeholder: t.l('search-labels-ellipsis'),
    value: t.mustacheVar('searchInit'),
    autocomplete: 'off',
  });

  t.div('.pop-over-section.js-suggestions', function () {
    t.h4(function () {
      t.icon('sparkle');
      return t.format('suggested');
    });
    t.ul('.edit-labels-pop-over.js-suggested-labels-list', function () {});
  });

  return t.div('.pop-over-section', function () {
    t.h4(() => t.format('labels'));

    t.ul('.edit-labels-pop-over.js-labels-list');

    return t.mustacheBlock('__ed', () =>
      t.div(function () {
        t.button('.button.full.js-add-label', () =>
          t.format('create-a-new-label'),
        );
        t.button('.button.full.hide.js-show-more', () =>
          t.format('show-more-labels'),
        );
        t.hr();
        return t.button('.button.full.js-toggle-color-blind-mode', function () {
          t.mustacheBlock('isColorBlindEnabled', () =>
            t.format('disable-color-blind-friendly-mode-no-punc'),
          );
          return t.mustacheBlockInverted('isColorBlindEnabled', () =>
            t.format('enable-color-blind-friendly-mode-no-punc'),
          );
        });
      }),
    );
  });
};
