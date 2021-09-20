// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'board_menu_default',
);

module.exports.renderInputRow = t.renderable(({ title, showFilterButton }) =>
  t.div('.board-menu-navigation-row', function () {
    t.div('.input-container', function () {
      t.input('.js-input.js-autofocus', {
        type: 'search',
        attr: 'title',
        placeholder: t.l('search-cards-placeholder'),
        'aria-label': t.l('search-cards-placeholder'),
        value: title,
      });
      return t.div('.js-input-search-icon');
    });

    if (showFilterButton) {
      return t.button('.button.js-search-open-card-filter', () =>
        t.icon('filter'),
      );
    }
  }),
);

module.exports.renderInputIcon = t.renderable(function ({ title }) {
  if (title) {
    return t.a('.input-icon.js-search-clear-title', { href: '#' }, () =>
      t.icon('close'),
    );
  } else {
    return t.a('.input-icon.js-search-open-card-filter', { href: '#' }, () =>
      t.icon('search'),
    );
  }
});
