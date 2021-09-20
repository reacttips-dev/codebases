// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'member_on_card_menu',
);

module.exports = () =>
  t.mustacheBlock('__ed', () =>
    t.li(() => t.a('.js-remove-member', () => t.format('remove-from-card'))),
  );
