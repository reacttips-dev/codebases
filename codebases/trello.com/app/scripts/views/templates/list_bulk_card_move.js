// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'list_bulk_card_move',
);

module.exports = () =>
  t.form(() =>
    t.ul('.pop-over-list', () =>
      t.mustacheBlock('lists', () =>
        t.li(() =>
          t.a(
            {
              href: '#',
              class: `js-select-list highlight-icon ${t.mustacheBlock(
                'current',
                () => ' disabled',
              )}`,
              name: t.mustacheVar('id'),
            },
            function () {
              t.text(t.mustacheVar('name'));
              return t.mustacheBlock('current', function () {
                t.text(' ');
                return t.format('current');
              });
            },
          ),
        ),
      ),
    ),
  );
