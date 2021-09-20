/* eslint-disable
    @typescript-eslint/no-this-alias,
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const templates = require('app/scripts/views/internal/templates');
const { l } = require('app/scripts/lib/localize');
const { Analytics } = require('@trello/atlassian-analytics');

class ChangeSetPasswordPopoverView extends View {
  static initClass() {
    this.prototype.events = { 'click .js-save-changes': 'saveChanges' };
  }
  initialize() {
    return this.listenTo(
      this.model,
      'change:loginTypes',
      this.frameDebounce(this.render),
    );
  }

  viewTitleKey() {
    let needle;
    if (
      ((needle = 'password'),
      !Array.from(this.model.get('loginTypes')).includes(needle))
    ) {
      return 'set password';
    } else {
      return 'change password';
    }
  }

  render() {
    const data = this.model.toJSON({ prefs: true, hasPassword: true });

    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/popover_change_set_password'),
        data,
      ),
    );

    return this;
  }

  getValue(name) {
    return this.$(`[name=${name}]`).val();
  }
  showPasswordError(key) {
    return this.$('#password-error')
      .text(l(['password error', key]))
      .show();
  }

  saveChanges(e) {
    Util.preventDefault(e);

    this.$('#password-error').hide();

    const oldPassword = this.getValue('oldpassword');
    const newPassword = this.getValue('password');
    const newPassword2 = this.getValue('password2');

    if (newPassword || newPassword2) {
      if (newPassword !== newPassword2) {
        this.showPasswordError('must match');
      } else {
        this.model.run(
          'updatePassword',
          { oldPassword, newPassword },
          (err) => {
            if (err == null) {
              Analytics.sendTrackEvent({
                action: 'updated',
                actionSubject: 'password',
                source: 'changePasswordInlineDialog',
              });
              PopOver.popView();
              return;
            }
            this.showPasswordError(
              (() => {
                switch (err.message.trim()) {
                  case 'invalid value for newPassword':
                    return 'not long enough';
                  case 'The old password was incorrect':
                    return 'old password';
                  default:
                    return 'unknown';
                }
              })(),
            );
          },
        );
      }
      return;
    }
  }
}

ChangeSetPasswordPopoverView.initClass();
module.exports = ChangeSetPasswordPopoverView;
