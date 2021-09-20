/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const BoardOrgSelectPermLevelView = require('app/scripts/views/board-menu/board-org-select-perm-level-view');
const BoardSelectOrganizationView = require('app/scripts/views/board-menu/board-select-organization-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');

module.exports = class BoardSelectOrganizationForPermChangeView extends (
  BoardSelectOrganizationView
) {
  initialize(options) {
    this.disableNone = options != null ? options.disableNone : undefined;
    return super.initialize(...arguments);
  }

  render() {
    super.render(...arguments);
    if (this.disableNone) {
      this.$('.js-submit').addClass('disabled').attr('disabled', 'disabled');
    }

    return this;
  }

  showOrgBoardVisPerms(organization, idOrganizationSource) {
    // we're not in a context where we want to do this, so error instead
    return PopOver.pushView({
      view: new BoardOrgSelectPermLevelView({
        model: this.model,
        organization,
        idOrganizationSource,
        modelCache: this.modelCache,
      }),
    });
  }

  submit(e) {
    return super.submit(...arguments);
  }

  canAddToOrg(organization) {
    return (
      !organization.isFeatureEnabled('restrictVis') ||
      organization.canSetVisibility('org')
    );
  }

  changeOrg(idOrganizationTarget, idOrganizationSource, settings = {}) {
    settings['prefs/permissionLevel'] = 'org';
    return super.changeOrg(
      idOrganizationTarget,
      idOrganizationSource,
      settings,
    );
  }

  orgSelected() {
    super.orgSelected(...arguments);
    if (this.disableNone) {
      if (this.$('.js-org').val() === '') {
        return this.$('.js-submit')
          .addClass('disabled')
          .attr('disabled', 'disabled');
      } else {
        return this.$('.js-submit')
          .removeClass('disabled')
          .removeAttr('disabled');
      }
    }
  }
};
