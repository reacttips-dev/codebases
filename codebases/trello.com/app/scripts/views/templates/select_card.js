// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'select_card',
);

module.exports = t.renderable(({ name, id, closed, boardName }) =>
  t.li('.item', () =>
    t.a(
      '.name.js-select-card',
      { href: '#', title: name, 'data-id': id },
      function () {
        t.span('.item-name', function () {
          t.text(name);
          if (closed) {
            t.text(' ');
            return t.span('.quiet', () => t.format('archived'));
          }
        });
        if (boardName) {
          return t.span('.sub-name', () =>
            t.format('in-boardname', { boardName }),
          );
        }
      },
    ),
  ),
);
