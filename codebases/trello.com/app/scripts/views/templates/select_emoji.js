// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'select_emoji',
);

module.exports = () =>
  t.li('.item', () =>
    t.a(
      '.name.js-select-emoji',
      { href: '#', title: t.mustacheVar('name') },
      function () {
        t.mustacheBlock('isEmojiMart', () => {
          t.mustacheBlock('html', () => {
            return t.raw(t.mustacheVar('html'));
          });
          t.mustacheBlock('image', () => {
            return t.img('.emoji', { src: t.mustacheVar('image') });
          });
        });
        t.mustacheBlockInverted('isEmojiMart', () => {
          return t.img('.emoji', { src: t.mustacheVar('image') });
        });
        return t.span('.emoji-name', { name: t.mustacheVar('name') }, () =>
          t.text(t.mustacheVar('name')),
        );
      },
    ),
  );
