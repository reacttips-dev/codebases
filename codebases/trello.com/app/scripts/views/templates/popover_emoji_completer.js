// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_emoji_completer',
);

module.exports = t.renderable(function ({ input, button, upsellEnabled }) {
  if (button) {
    t.input('.js-filter-emoji.js-autofocus', {
      type: 'text',
      placeholder: t.l('search-for-emoji-ellipsis'),
    });
  }

  t.div('.js-results.input-emoji-results', function () {
    t.ul('.pop-over-emoji-list.js-available-emoji');

    if (upsellEnabled) {
      t.hr();

      return t.ul('.pop-over-list', () =>
        t.li(() =>
          t.a('.js-upload-emoji', { href: '#', 'data-emojiname': '' }, () =>
            t.format('upload-emoji'),
          ),
        ),
      );
    }
  });

  return t.div('.js-no-results.hide.input-emoji-no-results', function () {
    if (upsellEnabled) {
      t.p('.u-bottom.js-no-matching-emoji-helper');
      return t.a(
        '.nch-button.nch-button--primary.nch-button--fullwidth.js-upload-emoji.my-4',
        {
          href: '#',
          'data-emojiname': '',
        },
      );
    }
  });
});
