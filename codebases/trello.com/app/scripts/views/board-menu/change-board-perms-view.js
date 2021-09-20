/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { Analytics } = require('@trello/atlassian-analytics');
const BoardDisplayHelpers = require('app/scripts/views/internal/board-display-helpers');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const templates = require('app/scripts/views/internal/templates');

class ChangeBoardPermsView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'change permissions';

    this.prototype.events = { 'click .js-select': 'selectPerm' };
  }

  initialize() {
    this.listenTo(this.model, 'change', this.frameDebounce(this.render));
  }

  render() {
    let needle;
    const data = this.model.toJSON({ prefs: true, url: true });

    data.cardCovers = data.prefs.cardCovers;
    const organization = this.model.getOrganization();
    data.hasOrg =
      (data.idOrganization ? data.idOrganization : undefined) != null;

    data.orgCanSee =
      data.hasOrg &&
      ((needle = this.model.getPref('permissionLevel')),
      ['public', 'org'].includes(needle));
    data.premium =
      organization != null
        ? organization.isFeatureEnabled('observers')
        : undefined;
    data.voting_showObservers =
      data.premiumFeatures.includes('observers') && data.hasOrg;
    data.comments_showObservers =
      data.premiumFeatures.includes('observers') && data.hasOrg;
    data.pLevelClass = BoardDisplayHelpers.getPermLevelIconClassForBoard(
      this.model,
    );

    if (organization != null ? organization.owned() : undefined) {
      data.orgOwner = true;
      data.orgName = organization.get('displayName');
      if (!this.model.owned()) {
        data.setOrgNull = true;
      }
    } else if (!this.model.owned()) {
      data.noEditOrg = true;
    }

    const template = this.getTemplate();

    this.$el.html(
      templates.fillMenu(template, data, {
        editable: this.model.editable(),
        owned: this.model.owned(),
      }),
    );

    return this;
  }

  selectPerm(e) {
    Util.stop(e);

    const $target = $(e.target).closest('.js-select');

    if (
      $target.hasClass('disabled') ||
      $target.closest('.js-disabled').length
    ) {
      return;
    }

    const perm = this.getPerm();
    const taskName = `edit-board/prefs/${perm}`;

    const traceId = Analytics.startTask({
      taskName,
      source: 'changeBoardPermissionsInlineDialog',
    });

    const setting = $target.attr('name');

    this.model.setPrefWithTracing(perm, setting, {
      taskName,
      source: 'changeBoardPermissionsInlineDialog',
      traceId,
      next: (_err, res) => {
        if (res) {
          Analytics.sendUpdatedBoardFieldEvent({
            field: `${perm}Pref`,
            value: setting,
            source: 'changeBoardPermissionsInlineDialog',
            attributes: {
              taskId: traceId,
            },
            containers: {
              board: {
                id: this.model.id,
              },
              organization: {
                id: this.model.getOrganization()?.id,
              },
            },
          });
        }
      },
    });
    this.model.save();

    PopOver.popView();
  }
}

ChangeBoardPermsView.initClass();
module.exports = ChangeBoardPermsView;
