// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'header_warning_account_transfer_required',
);

module.exports = t.renderable(function ({ targetDate, enterpriseDisplayName }) {
  t.a(
    '.quiet.sso-notice-dismiss.js-dismiss-account-transfer.u-float-right',
    { href: '#' },
    () => t.icon('close'),
  );
  return t.div('.sso-notice', function () {
    t.p(() =>
      t.format('will-become-owned', { enterpriseDisplayName, targetDate }),
    );
    return t.a(
      '.sso-notice-learn-more',
      {
        href:
          'https://help.trello.com/article/1130-managed-enterprise-accounts',
        target: 'blank',
      },
      () => t.format('find-out-why'),
    );
  });
});
