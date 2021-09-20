// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'power_ups_card_aging_prefs',
);

module.exports = t.renderable(function ({ agingMode, canChange }) {
  t.h2(() => t.format('how-do-you-want-the-aged-cards-to-look'));

  return t.ul('.pop-over-list', function () {
    t.li(() =>
      t.a(
        '.js-select',
        {
          href: '#',
          class: t.classify({ disabled: !canChange }),
          name: 'regular',
        },
        function () {
          t.span('.name', () => t.format('regular-mode'));

          if (agingMode === 'regular') {
            t.icon('check');
          }

          return t.span('.sub-name', () =>
            t.format('older-cards-become-more-transparent'),
          );
        },
      ),
    );

    return t.li(() =>
      t.a(
        '.js-select',
        {
          href: '#',
          class: t.classify({ disabled: !canChange }),
          name: 'pirate',
        },
        function () {
          t.span('.name', () => t.format('pirate-mode'));

          if (agingMode === 'pirate') {
            t.icon('check');
          }

          return t.span('.sub-name', () =>
            t.format('older-cards-crackle-and-tear'),
          );
        },
      ),
    );
  });
});
