// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_sidebar',
);

module.exports = t.renderable(() =>
  t.div('.board-menu-tab-content', function () {
    t.div('.board-menu-header.js-board-menu-title', function () {
      t.div('.board-menu-header-content', function () {
        t.a(
          '.board-menu-header-back-button.icon-lg.icon-back.js-pop-widget-view',
          { href: '#', title: t.l('go-back') },
        );
        t.h3('.board-menu-header-title.js-board-menu-title-text');
        return t.a(
          '.board-menu-header-close-button.icon-lg.icon-close.js-hide-sidebar',
          { href: '#', title: t.l('close-the-board-menu') },
        );
      });

      return t.hr('.board-menu-header-divider');
    });
    return t.div(
      '.board-menu-content.u-fancy-scrollbar.js-board-menu-content-wrapper',
    );
  }),
);
