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
const _ = require('underscore');
const CustomFieldBadgeView = require('app/scripts/views/custom-field/custom-field-badge-view');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const {
  sendPluginViewedComponentEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const View = require('app/scripts/views/internal/view');

const CUSTOM_FIELDS_ID = require('@trello/config').customFieldsId;

let lastIdBoard = null;
let trackedFrontBadges = false;

class CustomFieldBadgesView extends View {
  static initClass() {
    this.prototype.tagName = 'span';
    this.prototype.badgeView = CustomFieldBadgeView;
  }

  idForBadge(customField, customFieldItem) {
    let idParts = [
      customField.id,
      customField.name,
      JSON.stringify(customField.options),
    ];
    if (customFieldItem) {
      idParts.push(customFieldItem.id);
      if (customFieldItem.idValue) {
        idParts.push(customFieldItem.idValue);
      } else {
        idParts = idParts.concat([
          customFieldItem.color,
          JSON.stringify(customFieldItem.value),
        ]);
      }
    }

    return idParts.join(':');
  }

  render() {
    const board = this.model.getBoard();
    if (board.id !== lastIdBoard) {
      lastIdBoard = board.id;
      trackedFrontBadges = false;
    }

    const subviews = board.customFieldList.map((customField) => {
      const customFieldItem = this.model.getCustomFieldItem(customField.id);
      //filter out those that aren't supposed to show on card front
      if (
        !(customFieldItem != null
          ? customFieldItem.showFrontBadge()
          : undefined)
      ) {
        return null;
      }
      const viewId = this.idForBadge(
        customField.toJSON(),
        customFieldItem.toJSON(),
      );
      return this.subview(
        this.badgeView,
        this.model,
        { customFieldItem, customField },
        viewId,
      );
    });

    const compacted = _.compact(subviews);
    this.ensureSubviews(compacted);

    if (compacted.length > 0) {
      this.trackBadges();
    }

    return this;
  }

  trackBadges() {
    if (!trackedFrontBadges) {
      trackedFrontBadges = true;
      // ensure we have the Custom Fields plugin model before sending the event
      // b/c without the model's info, the tracking event will fail
      return PluginRunner.getOrLoadPlugin(
        this.model.getBoard(),
        CUSTOM_FIELDS_ID,
      ).then(() => {
        return sendPluginViewedComponentEvent({
          idPlugin: CUSTOM_FIELDS_ID,
          idBoard: this.model.getBoard().id,
          idCard: this.model.id,
          event: {
            componentType: 'badge',
            componentName: 'pupCardBadge',
            source: 'boardScreen',
          },
        });
      });
    }
  }
}

CustomFieldBadgesView.initClass();
module.exports = CustomFieldBadgesView;
