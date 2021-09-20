// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'header_overdue_banner',
);

module.exports = () =>
  t.p('.u-bottom', function () {
    t.format(
      t.mustacheVar('planName') === 'Standard'
        ? 'the-billing-information-for-team-is-out-of-date-sta'
        : 'the-billing-information-for-team-is-out-of-date-bc',
      {
        team: t.mustacheVar('team'),
        url: t.mustacheVar('billingUrl'),
      },
    );
    return t.a(
      '.header-banner-link-left.quiet.js-dismiss-overdue-banner.u-float-right',
      { href: '#' },
      () => t.icon('close'),
    );
  });
