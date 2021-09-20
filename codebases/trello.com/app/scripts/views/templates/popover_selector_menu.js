// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_selector_menu',
);

module.exports = t.renderable(({ isTemplate }) =>
  t.ul('.pop-over-list', function () {
    if (!isTemplate) {
      t.li(() =>
        t.a('.js-mem-selector', { href: '#' }, () =>
          t.format('members-ellipsis'),
        ),
      );
    }
    t.li(() =>
      t.a('.js-label-selector', { href: '#' }, () =>
        t.format('labels-ellipsis'),
      ),
    );
    return t.li(() =>
      t.a('.js-pos-selector', { href: '#' }, () =>
        t.format('position-ellipsis'),
      ),
    );
  }),
);
