// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_add_to_team',
);

module.exports = t.renderable(function ({ teamType }) {
  t.p('.u-text-align-center', { style: 'padding: 3px 0' }, () =>
    t.format('add to team-disclaimer', { teamType }),
  );
  return t.button('.button-link.primary.u-width-100.js-add-to-team', () =>
    t.format('add to team-confirm'),
  );
});
