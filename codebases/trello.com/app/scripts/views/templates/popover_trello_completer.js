// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_trello_completer',
);

module.exports = t.renderable(function () {
  t.label(function () {
    t.format('card-or-board-to-add');
    return t.input('.js-search.js-autofocus', {
      type: 'text',
      placeholder: t.l('search-for-a-card-or-board-ellipsis'),
    });
  });

  t.div('.js-loading', () => t.span('.loading.spinner'));

  t.div('.pop-over-section.js-card-results.hide', function () {
    t.h4('.pop-over-section-heading', () => t.format('cards'));

    t.ul('.pop-over-list.navigable.js-card-list');

    return t.div(
      '.empty.js-no-card-results.hide',
      { style: 'padding: 24px 6px' },
      () => t.p('.u-bottom', () => t.format('no-results')),
    );
  });

  return t.div('.pop-over-section.js-board-results.hide', function () {
    t.h4('.pop-over-section-heading', () => t.format('boards'));

    t.ul('.pop-over-list.navigable.js-board-list');

    return t.div(
      '.empty.js-no-board-results.hide',
      { style: 'padding: 24px 6px' },
      () => t.p('.u-bottom', () => t.format('no-results')),
    );
  });
});
