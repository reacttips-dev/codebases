// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'header_public_board',
);

module.exports = () =>
  t.p('.u-bottom', function () {
    t.mustacheBlock('interactionText', () =>
      t.span('.u-inline-block', () => t.text(t.mustacheVar('interactionText'))),
    );
    return t.span('.u-inline-block', () =>
      t.a(
        {
          class: 'nch-button nch-button--primary',
          href: t.mustacheVar('signupUrl'),
        },
        () => t.format(t.mustacheVar('ctaKey')),
      ),
    );
  });
