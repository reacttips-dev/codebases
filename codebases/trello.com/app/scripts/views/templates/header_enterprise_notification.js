// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')();

module.exports = t.renderable(({ enterpriseName, formattedMessage }) =>
  t.p('.u-bottom', function () {
    t.h3(function () {
      t.span('.icon-sm.icon-warning');
      t.text(`Message from ${enterpriseName}:`);
      return t.a(
        '.header-banner-link-left.quiet.js-dismiss-enterprise-notification-banner.u-float-right',
        { href: '#' },
        () => t.icon('close'),
      );
    });
    return t.span('.message', () => t.raw(formattedMessage));
  }),
);
