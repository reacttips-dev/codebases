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
let PluginCardDetailBadgesView;
const PluginBadgesView = require('app/scripts/views/plugin/plugin-badges-view');
const PluginCardDetailBadgeView = require('app/scripts/views/plugin/plugin-card-detail-badge-view');
const {
  sendPluginViewedComponentEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');

module.exports = PluginCardDetailBadgesView = (function () {
  PluginCardDetailBadgesView = class PluginCardDetailBadgesView extends (
    PluginBadgesView
  ) {
    static initClass() {
      this.prototype.tagName = 'div';
      this.prototype.badgeView = PluginCardDetailBadgeView;
    }

    isDetailView() {
      return true;
    }

    runnerOptions() {
      return {
        command: 'card-detail-badges',
        board: this.model.getBoard(),
        card: this.model,
      };
    }

    trackBadges(idPlugin) {
      if (this.trackedDetailsBadges == null) {
        this.trackedDetailsBadges = {};
      }
      if (!this.trackedDetailsBadges[idPlugin]) {
        this.trackedDetailsBadges[idPlugin] = true;
        return sendPluginViewedComponentEvent({
          idPlugin,
          idBoard: this.model.getBoard().id,
          idCard: this.model.id,
          event: {
            componentType: 'badge',
            componentName: 'pupCardDetailBadge',
            source: 'cardDetailScreen',
          },
        });
      }
    }
  };
  PluginCardDetailBadgesView.initClass();
  return PluginCardDetailBadgesView;
})();
