/* eslint-disable
    eqeqeq,
    */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const CustomFieldBadgeView = require('app/scripts/views/custom-field/custom-field-badge-view');
const xtend = require('xtend');

const CUSTOM_FIELDS_ID = require('@trello/config').customFieldsId;

module.exports = (function () {
  class CustomFieldCardDetailBadgeView extends CustomFieldBadgeView {
    static initClass() {
      this.prototype.tagName = 'div';
    }
    className() {
      return 'custom-field-detail-item';
    }

    getBadgeIcon() {
      return this.customField.icon();
    }

    getBadgeText() {
      let left;
      return (left =
        this.customFieldItem != null
          ? this.customFieldItem.getFrontBadgeText()
          : undefined) != null
        ? left
        : '';
    }

    track() {
      return this.options.sendPluginUIEvent({
        idPlugin: CUSTOM_FIELDS_ID,
        idBoard: this.model.getBoard().id,
        idCard: this.model.id,
        event: {
          action: 'clicked',
          actionSubject: 'badge',
          actionSubjectId: 'cardDetailBadge',
          source: 'cardDetailScreen',
        },
      });
    }

    renderBadge(badge) {
      this.$el.html(this.template(badge));
      return this.$('.js-custom-field-detail-badge');
    }

    render() {
      const customField = this.customField.toJSON();
      const customFieldItem =
        this.customFieldItem != null
          ? this.customFieldItem.toJSON()
          : undefined;
      let badgeData = _.pick(customField, 'name', 'type', 'options');
      badgeData.idCustomField = customField.id;
      if (customFieldItem) {
        badgeData.idCustomFieldItem = customFieldItem.id;
        badgeData.idValue = customFieldItem.idValue;
      }
      badgeData.editable = this.model.editable();

      const text = this.getBadgeText();
      const icon = this.getBadgeIcon();

      const editable = this.model.editable();
      const colorClass = this.getColorClass();
      const color = colorClass ? `.field-color.${colorClass}` : '';

      badgeData = xtend(badgeData, { icon, text, editable, color });

      this.renderBadge(badgeData);

      return this;
    }
  }
  CustomFieldCardDetailBadgeView.initClass();
  return CustomFieldCardDetailBadgeView;
})();
