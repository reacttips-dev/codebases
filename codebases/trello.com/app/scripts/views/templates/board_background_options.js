// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_background_options',
);

module.exports = function () {
  t.p('.u-font-weight-bold.quiet', () => t.format('display-type'));

  t.ul('.pop-over-list', function () {
    t.li(() =>
      t.a(
        '.js-select-option',
        { href: '#', 'data-background-display-type': 'cover' },
        () => t.check(!t.mustacheVar('tile'), 'cover'),
      ),
    );

    return t.li(() =>
      t.a(
        '.js-select-option',
        { href: '#', 'data-background-display-type': 'tile' },
        () => t.check(t.mustacheVar('tile'), 'tile'),
      ),
    );
  });

  t.hr();

  t.p('.u-font-weight-bold.quiet', () => t.format('board-text'));

  t.ul('.pop-over-list', function () {
    t.li(() =>
      t.a(
        '.js-select-option',
        { href: '#', 'data-board-brightness': 'dark' },
        () => t.check(t.mustacheVar('brightnessDark'), 'light'),
      ),
    );

    return t.li(() =>
      t.a(
        '.js-select-option',
        { href: '#', 'data-board-brightness': 'light' },
        () => t.check(t.mustacheVar('brightnessLight'), 'dark'),
      ),
    );
  });

  t.hr();

  return t.a('.quiet-button.js-delete-background', { href: '#' }, () =>
    t.format('delete-background'),
  );
};
