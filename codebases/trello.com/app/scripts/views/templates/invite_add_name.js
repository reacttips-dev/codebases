// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'invite_add_name',
);

module.exports = t.renderable(function ({
  email,
  fullName,
  canAddAsObserver,
  modelType,
  isLoading,
  isOrgAdmin,
  wouldBecomeBillableGuest,
  availableLicenseCount,
  error,
  isDesktop,
}) {
  if (isLoading) {
    t.div('.spinner.loading');
  }

  if (error) {
    t.div('.error', () => t.text(error));
  }

  const showAsAdmin = isOrgAdmin && !isDesktop;
  if (wouldBecomeBillableGuest) {
    t.div('.card-back-billable-guests-alert.js-billable-guests-alert', {
      class: t.classify({
        'as-admin': showAsAdmin,
        'as-non-admin': !showAsAdmin,
      }),
    });
  }

  if (
    !isLoading &&
    !error &&
    (!wouldBecomeBillableGuest || showAsAdmin) &&
    !(wouldBecomeBillableGuest && availableLicenseCount < 1)
  ) {
    t.p('.quiet', function () {
      if (modelType === 'Board') {
        return t.format('click-send-below');
      } else if (modelType === 'Organization') {
        return t.format('we dont know that person…team', { email });
      } else {
        throw new Error(
          `Expected either Board or Organization as modelType; got ${modelType}`,
        );
      }
    });

    t.p('.error.hide.js-name-error', () => t.format('full name too short'));

    t.p('.error.hide.js-name-error-url', () =>
      t.format('full name must not contain a url'),
    );

    return t.form('.js-email-data', function () {
      t.label(() => t.format('full-name'));
      t.input('.js-autofocus.js-full-name', { type: 'text', value: fullName });

      t.input('.js-email', { type: 'hidden', value: email });

      if (canAddAsObserver) {
        t.span('.check-div.quiet.u-clearfix', function () {
          t.input({ type: 'checkbox', id: 'addAsObserver' });
          return t.label({ for: 'addAsObserver' }, () =>
            t.format('include-this-member-as-a-view-only-observer'),
          );
        });
      }

      return t.input(
        '.wide.nch-button.nch-button--primary.js-send-email-invite',
        {
          type: 'submit',
          value: t.l('send'),
        },
      );
    });
  }
});
