// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_confirmation_public_boards',
);

module.exports = t.renderable(({ isTemplate }) =>
  t.div('.public-board-confirmation-popover', function () {
    t.div('.public-board-confirmation-popover-title', function () {
      if (isTemplate) {
        t.span(() => t.format('public-template-confirmation-description'));

        return t.button(
          '.js-submit.wide.nch-button.nch-button--primary.full.make-public-confirmation-button',
          () => t.format('public-template-confirm'),
        );
      } else {
        t.span(() => t.format('public-board-confirmation-description'));

        return t.button(
          '.js-submit.wide.nch-button.nch-button--primary.full.make-public-confirmation-button',
          () => t.format('confirm'),
        );
      }
    });

    t.hr();

    return t.div('.public-board-confirmation-popover-invitation-link', () =>
      t.p(function () {
        t.format('looking-for-invite-link');
        t.a(
          '.js-action-link.looking-for-invite-link',
          { href: '#', target: '_blank' },
          function () {
            if (isTemplate) {
              return t.format('invite-to-template-link');
            } else {
              return t.format('invite-to-board-link');
            }
          },
        );
        return t.format('option');
      }),
    );
  }),
);
