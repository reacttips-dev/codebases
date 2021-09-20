// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { Analytics } = require('@trello/atlassian-analytics');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const template = require('app/scripts/views/templates/power_ups_voting_prefs');

class VotingSettingsView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'voting settings';

    this.prototype.events = {
      'click .js-voting-select:not(.disabled)': 'selectPerm',
      'click .js-vote-count-select:not(.disabled)': 'hideVotes',
    };
  }

  initialize() {
    return this.listenTo(this.model, { 'change:prefs': this.render });
  }

  render() {
    this.$el.html(
      template({
        canChange: this.model.editable(),
        canSetObservers: this.model
          .getOrganization()
          ?.isFeatureEnabled('observers'),
        canSetOrganization: this.model.hasOrganization(),
        canSetPublic: this.model.isPublic(),
        votingMode: this.model.getPref('voting'),
        hideVotes: this.model.getPref('hideVotes'),
      }),
    );

    return this;
  }

  selectPerm(e) {
    Util.stop(e);
    const traceId = Analytics.startTask({
      taskName: 'edit-plugin/voting',
      source: 'votingSettingsInlineDialog',
    });
    const $target = $(e.target).closest('.js-voting-select');
    const setting = $target.attr('name');
    this.model.setPrefWithTracing('voting', setting, {
      taskName: 'edit-plugin/voting',
      source: 'votingSettingsInlineDialog',
      traceId,
      next: (_err, board) => {
        if (board) {
          Analytics.sendUpdatedBoardFieldEvent({
            field: 'votingPref',
            value: setting,
            source: 'votingSettingsInlineDialog',
            containers: {
              board: {
                id: this.model.id,
              },
              organization: {
                id: this.model.getOrganization()?.id,
              },
            },
            attributes: {
              previous: this.model.getPref('voting'),
              taskId: traceId,
            },
          });
        }
      },
    });
  }

  hideVotes(e) {
    Util.stop(e);
    const traceId = Analytics.startTask({
      taskName: 'edit-plugin/voting',
      source: 'votingSettingsInlineDialog',
    });

    this.model.setPrefWithTracing(
      'hideVotes',
      !this.model.getPref('hideVotes'),
      {
        taskName: 'edit-board/voting',
        source: 'votingSettingsInlineDialog',
        traceId,
        next: (_err, board) => {
          if (board) {
            Analytics.sendUpdatedBoardFieldEvent({
              field: 'hideVotesPref',
              value: this.model.getPref('hideVotes'),
              source: 'votingSettingsInlineDialog',
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
      },
    );
  }
}

VotingSettingsView.initClass();
module.exports = VotingSettingsView;
