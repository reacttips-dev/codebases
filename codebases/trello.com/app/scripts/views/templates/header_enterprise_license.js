// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'header_enterprise_license',
);
const { localizeCount } = require('app/scripts/lib/localize-count');

module.exports = t.renderable(
  ({ enterpriseName, maxMembers, availableLicenses }) => {
    t.p('.u-bottom', function () {
      t.text(
        localizeCount(
          'you-have-count-remaining-seats',
          Math.max(0, availableLicenses),
          {
            enterpriseName,
            maxMembers: String(maxMembers),
          },
          { raw: true },
        ),
      );
      t.raw(' ');
      t.format('contact-sales');
    });
    t.p('.u-bottom', function () {
      t.a(
        '.nch-button.nch-button--primary',
        {
          tabindex: '0',
          href: 'https://trello.com/en-US/contact#/',
          title: t.l('contact-support'),
          target: 'blank',
        },
        () => t.format('contact-support'),
      );
      t.a(
        '.nch-button.nch-button.js-dismiss-enterprise-license-banner',
        { href: '#' },
        () => t.format('dismiss'),
      );
    });
  },
);
