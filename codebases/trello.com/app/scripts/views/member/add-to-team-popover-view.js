/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Alerts = require('app/scripts/views/lib/alerts');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const $ = require('jquery');
const addToTeamTemplate = require('app/scripts/views/templates/popover_add_to_team');
const { l } = require('app/scripts/lib/localize');
const {
  localizeServerError,
} = require('app/scripts/lib/localize-server-error');
const {
  maybeDisplayOrgMemberLimitsError,
} = require('app/scripts/views/organization/member-limits-error');

class AddToTeamPopoverView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'add to team';

    this.prototype.events = { 'click .js-add-to-team': 'addToTeam' };
  }

  render() {
    const teamType = l([
      'products',
      this.options.isStandard
        ? 'standard'
        : this.options.isBC
        ? 'bc'
        : 'enterprise',
    ]);

    this.$el.html(addToTeamTemplate({ teamType }));
    return this;
  }

  showError(message) {
    const errorMessage = localizeServerError(message);
    return Alerts.showLiteralText(errorMessage, 'error', 'addToTeam', 5000);
  }

  addToTeam(e) {
    Util.preventDefault(e);

    this.$('.js-add-to-team').attr('disabled', true).addClass('disabled');

    if (
      maybeDisplayOrgMemberLimitsError(
        $(e.target),
        this.options.org,
        this.model,
      )
    ) {
      return;
    }

    if (!this.options.isOrgView) {
      // this popover is also used where team errors aren't shown
      return this.options.org
        .addMember(this.model)
        .then(() => {
          if (
            this.options.showAlert != null
              ? this.options.showAlert
              : (this.options.showAlert = false)
          ) {
            return Alerts.show('added to team', 'confirm', 'addToTeam', 3000);
          }
        })
        .catch((err) => {
          return this.showError(err.message);
        })
        .finally(() => {
          return PopOver.hide();
        });
    } else {
      return this.options.org.addMembers(this.model).then((statusMessages) => {
        const successResponse =
          statusMessages[statusMessages._categories.ADDED];

        if (
          successResponse &&
          (this.options.showAlert != null
            ? this.options.showAlert
            : (this.options.showAlert = false))
        ) {
          Alerts.show('added to team', 'confirm', 'addToTeam', 3000);
        }

        return PopOver.hide();
      });
    }
  }
}

AddToTeamPopoverView.initClass();
module.exports = AddToTeamPopoverView;
