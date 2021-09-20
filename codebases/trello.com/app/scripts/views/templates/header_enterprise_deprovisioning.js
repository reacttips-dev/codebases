// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'header_enterprise_deprovisioning',
);
const { Dates } = require('app/scripts/lib/dates');
const moment = require('moment');

module.exports = t.renderable(
  ({ enterpriseName, enterpriseStanding, pendingDeprovision }) =>
    t.p('.u-bottom', function () {
      const daysUntilDeprovision = moment(pendingDeprovision).diff(
        moment(),
        'days',
      );

      let msgTemplate;
      if (daysUntilDeprovision > 10) {
        msgTemplate =
          enterpriseStanding === 1
            ? 'overdue-payment-more-than-ten-days'
            : 'overdue-renewal-more-than-ten-days';
      } else {
        msgTemplate =
          enterpriseStanding === 1 ? 'overdue-payment' : 'overdue-renewal';
      }

      t.format(msgTemplate, {
        enterpriseName,
        deprovisioningDate: Dates.toDateString(pendingDeprovision),
      });

      return t.a(
        '.header-banner-link-left.quiet.js-dismiss-enterprise-deprovisioning-banner.u-float-right',
        { href: '#' },
        () => t.icon('close'),
      );
    }),
);
