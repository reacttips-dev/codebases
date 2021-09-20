// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_member_searcher',
);

module.exports = function () {
  t.mustacheBlock('showSearch', () =>
    t.input('.js-filter-members.js-autofocus', {
      type: 'text',
      placeholder: t.l('search-members-ellipsis'),
    }),
  );

  return t.ul('.pop-over-member-list.checkable.js-members-list');
};
