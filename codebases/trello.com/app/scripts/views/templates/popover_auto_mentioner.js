// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_auto_mentioner',
);

module.exports = function () {
  t.mustacheBlock('button', () =>
    t.input('.js-filter-mentionables.js-autofocus', {
      type: 'text',
      placeholder: t.l('search-members-ellipsis'),
    }),
  );

  t.p('.quiet.js-empty-list.hide', { style: 'padding: 8px 8px 0;' }, () =>
    t.format('no-matching-members'),
  );

  return t.ul('.pop-over-member-list.js-available-members');
};
