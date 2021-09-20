// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'header_warning_personal_boards_ownership',
);

module.exports = t.renderable(({ enterpriseName, date }) =>
  t.div(function () {
    t.span('.personal-boards-message', () =>
      t.format('security-updates-are-coming-on', { date }),
    );
    t.a(
      '.personal-boards-learn-more',
      {
        href: `/enterprise/${enterpriseName}/personal-boards`,
        target: 'blank',
      },
      () => t.format('learn-how-this-will-affect-your-boards'),
    );

    return t.a(
      '.quiet.sso-notice-dismiss.js-dismiss-personal-boards-ownership.u-float-right',
      { href: '#' },
      () => t.icon('close'),
    );
  }),
);
