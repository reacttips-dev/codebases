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
const CustomFieldBadgesView = require('app/scripts/views/custom-field/custom-field-badges-view');
const CustomFieldCheckboxCardDetailBadgeView = require('app/scripts/views/custom-field/custom-field-checkbox-card-detail-badge-view');
const CustomFieldDateCardDetailBadgeView = require('app/scripts/views/custom-field/custom-field-date-card-detail-badge-view');
const CustomFieldListCardDetailBadgeView = require('app/scripts/views/custom-field/custom-field-list-card-detail-badge-view');
const CustomFieldNumberCardDetailBadgeView = require('app/scripts/views/custom-field/custom-field-number-card-detail-badge-view');
const CustomFieldTextCardDetailBadgeView = require('app/scripts/views/custom-field/custom-field-text-card-detail-badge-view');

const CUSTOM_FIELDS_ID = require('@trello/config').customFieldsId;

const viewForType = function (type) {
  switch (type) {
    case 'checkbox':
      return CustomFieldCheckboxCardDetailBadgeView;
    case 'date':
      return CustomFieldDateCardDetailBadgeView;
    case 'list':
      return CustomFieldListCardDetailBadgeView;
    case 'number':
      return CustomFieldNumberCardDetailBadgeView;
    case 'text':
      return CustomFieldTextCardDetailBadgeView;
    default:
      break;
  }
};

module.exports = (function () {
  class CustomFieldCardDetailBadgesView extends CustomFieldBadgesView {
    static initClass() {
      this.prototype.tagName = 'div';
    }
    className() {
      return 'custom-field-detail-badges-grid';
    }

    render() {
      const subviews = this.model
        .getBoard()
        .customFieldList.map((customField) => {
          if (!customField.visible()) {
            return null;
          }
          const customFieldItem = this.model.getCustomFieldItem(customField.id);
          if (
            !this.model.editable() &&
            (customFieldItem != null ? customFieldItem.isEmpty() : undefined)
          ) {
            return null;
          }
          if (customFieldItem != null || this.model.editable()) {
            const uniqId = this.idForBadge(
              customField.toJSON(),
              customFieldItem != null ? customFieldItem.toJSON() : undefined,
            );
            return this.subview(
              viewForType(customField.get('type')),
              this.model,
              {
                customFieldItem,
                customField,
                sendPluginUIEvent: this.options.sendPluginUIEvent,
              },
              uniqId,
            );
          }
        });

      const compacted = _.compact(subviews);
      this.ensureSubviews(compacted);

      if (compacted.length > 0) {
        this.trackBadges();
      }

      return this;
    }

    trackBadges() {
      if (!this.trackedDetailsBadges) {
        this.trackedDetailsBadges = true;
        return this.options.sendPluginScreenEvent({
          idPlugin: CUSTOM_FIELDS_ID,
          idBoard: this.model.getBoard().id,
          idCard: this.model.id,
          screenName: 'pupCardBackSectionInlineDialog',
        });
      }
    }
  }
  CustomFieldCardDetailBadgesView.initClass();
  return CustomFieldCardDetailBadgesView;
})();
