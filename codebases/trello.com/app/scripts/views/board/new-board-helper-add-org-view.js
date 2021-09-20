/* eslint-disable
    @typescript-eslint/no-this-alias,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Analytics } = require('@trello/atlassian-analytics');
const { Auth } = require('app/scripts/db/auth');
const CreateOrgView = require('app/scripts/views/organization/create-org-view');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const templates = require('app/scripts/views/internal/templates');

class NewBoardHelperAddOrgView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'add an organization';

    this.prototype.events = { 'click .js-create-org': 'newOrg' };
  }

  render() {
    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/popover_helper_new_board_add_org'),
      ),
    );

    if (featureFlagClient.get('dataeng.gasv3-event-tracking', false)) {
      Analytics.sendScreenEvent({
        name: 'newBoardHelperAddWorkspaceInlineDialog',
      });
    }
    return this;
  }

  newOrg(e) {
    const createOpts = {};

    if (Auth.me().isPaidManagedEntMember()) {
      createOpts.isEnterprise = true;
    }

    Util.stop(e);
    const trackingOpts = {
      category: 'board',
      method: 'by clicking team info icon in copy board menu',
    };
    return PopOver.pushView({
      view: new CreateOrgView({
        model: this.model,
        modelCache: this.modelCache,
        createOpts,
        trackingOpts,
      }),
    });
  }
}

NewBoardHelperAddOrgView.initClass();
module.exports = NewBoardHelperAddOrgView;
