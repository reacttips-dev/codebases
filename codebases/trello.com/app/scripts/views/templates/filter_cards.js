// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'filter_cards',
);

module.exports = function () {
  t.input('.js-input.js-autofocus', {
    type: 'text',
    attr: 'title',
    value: t.mustacheVar('title'),
    style: 'margin-bottom: 0;',
  });

  return t.div('.js-filter-search-results');
};
