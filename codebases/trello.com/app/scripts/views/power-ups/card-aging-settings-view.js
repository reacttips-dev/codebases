// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { Analytics } = require('@trello/atlassian-analytics');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const template = require('app/scripts/views/templates/power_ups_card_aging_prefs');

class CardAgingSettingsView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'card aging settings';

    this.prototype.events = {
      'click .js-select:not(.disabled)': 'selectMode',
    };
  }

  initialize() {
    return this.listenTo(this.model, { 'change:prefs': this.render });
  }

  render() {
    this.$el.html(
      template({
        agingMode: this.model.getPref('cardAging'),
        canChange: this.model.editable(),
      }),
    );

    return this;
  }

  selectMode(e) {
    Util.stop(e);
    const traceId = Analytics.startTask({
      taskName: 'edit-plugin/cardAging',
      source: 'cardAgingSettingsInlineDialog',
    });

    const $target = $(e.target).closest('.js-select');

    const setting = $target.attr('name');
    const prevSetting = this.model.getPref('cardAging');
    return this.model.setPrefWithTracing('cardAging', setting, {
      taskName: 'edit-plugin/cardAging',
      source: 'cardAgingSettingsInlineDialog',
      traceId,
      next: (_err, board) => {
        if (board) {
          Analytics.sendUpdatedBoardFieldEvent({
            field: 'cardAgingPref',
            value: setting,
            source: 'cardAgingSettingsInlineDialog',
            containers: {
              board: {
                id: this.model.id,
              },
              organization: {
                id: this.model.get('idOrganization'),
              },
              enterprise: {
                id: this.model.get('idEnterprise'),
              },
            },
            attributes: {
              taskId: traceId,
              previous: prevSetting,
            },
          });
        }
      },
    });
  }
}

CardAgingSettingsView.initClass();
module.exports = CardAgingSettingsView;
