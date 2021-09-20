// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'sticker_select',
);

module.exports = t.renderable(function ({
  additionalStickersEnabled,
  upsellEnabled,
  useAnimatedStickers,
}) {
  t.div('.search-stickers', function () {
    t.input('.js-search-stickers', {
      type: 'text',
      placeholder: t.l('search-giphy'),
    });
    return t.span('.icon-sm.icon-search');
  });

  t.div('.spinner.loading.js-search-spinner.hide');
  t.div('.giphy-stickers.js-giphy-stickers.hide', function () {
    t.div('.stickers-footer', function () {
      t.div('.check-div.mod-animated-check-div', function () {
        t.input('.animated-checkbox.js-use-animated-stickers', {
          type: 'checkbox',
          checked: useAnimatedStickers,
          id: 'usedAnimated',
        });
        return t.label({ for: 'usedAnimated' }, () =>
          t.format('use-animated-stickers'),
        );
      });
      return t.span('.giphy-attribution');
    });
    t.div('.js-giphy-stickers-no-results', () =>
      t.span('.no-results', () => t.format('no-results')),
    );
    return t.div('.sticker-list.u-clearfix.js-search-sticker-list');
  });

  return t.div('.js-static-stickers', function () {
    t.div('.sticker-list.u-clearfix.js-standard-sticker-list');

    if (additionalStickersEnabled || upsellEnabled) {
      t.div('.js-premium-stickers');

      t.h2(() => t.format('custom-stickers'));

      return t.div('.sticker-list.u-clearfix.js-custom-sticker-list');
    }
  });
});
