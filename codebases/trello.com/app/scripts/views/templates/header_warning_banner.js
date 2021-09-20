// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'header_warning_banner',
);

module.exports = () =>
  t.ul(function () {
    t.li('.u-inline', function () {
      t.mustacheBlock('isAaMastered', function () {
        // Message changes for day before users are forced logged out
        if (t.mustacheVar('daysLeft') === 1) {
          return t.format(
            'to-avoid-being-logged-out-please-confirm-your-email-by-tomorrow',
            {
              email: t.mustacheVar('email'),
            },
          );
          // Aa mastered users have 14 days to confirm their account before
          // they are forced logged out
        } else if (t.mustacheVar('daysLeft') <= 100) {
          return t.format('please-confirm-your-email-in-the-next-x-days', {
            email: t.mustacheVar('email'),
            days: t.mustacheVar('daysLeft'),
          });
        }
      });
      return t.mustacheBlockInverted('isAaMastered', () => {
        // Message changes for users older than 14 days
        if (t.mustacheVar('daysOld') >= 14) {
          return t.format(
            'to-avoid-losing-access-to-your-account-please-confirm-your-email',
            {
              email: t.mustacheVar('email'),
            },
          );
        } else {
          return t.format('please-confirm-your-email-address-email', {
            email: t.mustacheVar('email'),
          });
        }
      });
    });
    t.mustacheBlock('knownEmailProvider', () =>
      t.li('.header-banner-link-left', () =>
        t.a(
          '.js-check-inbox',
          {
            href: '#',
          },
          () =>
            t.format('check-your-inbox', {
              emailInboxUrl: t.mustacheVar('emailInboxUrl'),
            }),
        ),
      ),
    );
    if (t.mustacheVar('isAaMastered')) {
      t.li('.header-banner-link-left.quiet', () =>
        t.a(
          {
            href: t.mustacheVar('verifyEmailLink'),
          },
          () => t.format('resend-email'),
        ),
      );
    } else {
      t.li('.header-banner-link-left.quiet', () =>
        t.a(
          '.js-resend-confirmation-email',
          {
            href: '#',
          },
          () => t.format('resend-email'),
        ),
      );
    }
    return t.li('.header-banner-link-left.quiet', () =>
      t.a(
        {
          href:
            'https://help.trello.com/article/716-not-receiving-confirmation-emails-or-password-reset-emails',
          target: '_blank',
        },
        () => t.format('didnt-receive-the-email'),
      ),
    );
  });
