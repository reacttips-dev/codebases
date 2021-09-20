// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'archive_item',
);

module.exports = t.renderable(function ({
  url,
  name,
  orgName,
  canReopen,
  reOpenText,
  reopenDisabled,
}) {
  t.div('.item-name', function () {
    if (url) {
      t.a({ href: url }, () => t.text(name));
      t.div('.quiet', function () {});
    } else {
      t.span(() => t.text(name));
    }

    if (orgName) {
      return t.div('.quiet', () => t.text(orgName));
    }
  });
  return t.div('.options', function () {
    if (canReopen) {
      t.a(
        `.button-link.js-reopen${reopenDisabled ? '.disabled' : ''}`,
        { href: '#' },
        function () {
          t.icon('refresh');
          t.text(' ');
          return t.text(reOpenText);
        },
      );
    }
  });
});
