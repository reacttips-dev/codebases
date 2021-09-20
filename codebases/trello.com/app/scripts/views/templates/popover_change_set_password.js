// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'popover_change_set_password',
);

module.exports = function () {
  t.form(function () {
    t.mustacheBlock('hasPassword', function () {
      t.label({ for: 'o_password' }, () => t.format('old-password'));
      return t.input({
        id: 'o_password',
        type: 'password',
        name: 'oldpassword',
        value: '',
        autocomplete: 'password',
      });
    });

    t.label({ for: 'password1' }, function () {
      t.mustacheBlock('hasPassword', () => t.format('new-password'));
      return t.mustacheBlockInverted('hasPassword', () => t.format('password'));
    });
    t.input({
      id: 'password1',
      type: 'password',
      name: 'password',
      value: '',
      autocomplete: 'new-password',
    });

    t.label({ for: 'password2' }, function () {
      t.mustacheBlock('hasPassword', () => t.format('new-password-again'));
      return t.mustacheBlockInverted('hasPassword', () =>
        t.format('password-again'),
      );
    });
    t.input({
      id: 'password2',
      type: 'password',
      name: 'password2',
      value: '',
      autocomplete: 'new-password',
    });

    t.p('.error', { id: 'password-error' });

    return t.input('.nch-button.nch-button--primary.js-save-changes', {
      type: 'submit',
      value: t.l('save'),
    });
  });

  return t.mustacheBlockInverted('hasPassword', function () {
    t.hr();

    return t.p('.quiet.u-bottom', () =>
      t.format(
        'you-havent-set-a-password-yet-you-can-set-a-password-so-you-can-log-onto-trello-with-just-your-username-or-email-address',
      ),
    );
  });
};
