// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'card_detail',
);

module.exports = t.renderable((selector, icon, text, isCustom) =>
  t.a(
    `.button-link.${selector}`,
    {
      href: '#',
      title: t.l(text),
    },
    function () {
      t.icon(icon, {
        class: t.classify({
          'icon-custom': isCustom,
          hide: selector.includes('add-button-link'),
        }),
      });
      return t.span('.js-sidebar-action-text', () => t.format(text));
    },
  ),
);
