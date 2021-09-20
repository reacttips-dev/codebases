// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'card_detail_more_menu',
);

module.exports = function () {
  t.ul('.pop-over-list', function () {
    t.li(() =>
      t.a('.js-print', { href: '#' }, () => t.format('print-ellipsis')),
    );

    if (t.mustacheVar('isLoggedIn')) {
      return t.li(() =>
        t.a('.js-export-json', { href: t.mustacheVar('jsonURL') }, () =>
          t.format('export-json'),
        ),
      );
    }
  });

  return t.mustachePartial(
    require('app/scripts/views/templates/card_menu_meta'),
  );
};
