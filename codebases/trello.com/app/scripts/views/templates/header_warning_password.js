// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'header_warning_password',
);

module.exports = () =>
  t.p('.u-bottom', function () {
    t.format(
      'we-ve-automatically-created-an-account-for-email-with-the-username-username',
      { email: t.mustacheVar('email'), username: t.mustacheVar('username') },
    );
    return t.a('.quiet.js-change-password', { href: '/my/account' }, () =>
      t.format('add-a-password'),
    );
  });
