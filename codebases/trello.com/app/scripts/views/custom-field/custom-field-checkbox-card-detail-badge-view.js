/* eslint-disable
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const CustomFieldCardDetailBadgeView = require('app/scripts/views/custom-field/custom-field-card-detail-badge-view');
const t = require('app/scripts/views/internal/teacup-with-helpers')();
const { Util } = require('app/scripts/lib/util');

module.exports = (function () {
  class CustomFieldCheckboxCardDetailBadgeView extends CustomFieldCardDetailBadgeView {
    static initClass() {
      this.prototype.template = t.renderable(function (param) {
        if (param == null) {
          param = {};
        }
        const { icon, name, editable, color } = param;
        t.h3('.card-detail-item-header', { title: name }, function () {
          t.icon(icon, { class: 'mod-quiet' });
          return t.text(name);
        });

        return t.span(
          `.custom-field-detail-badge.custom-field-detail-checkbox-badge${color}`,
          {
            class: t.classify({
              'js-custom-field-detail-badge': editable,
              'is-clickable': editable,
              'is-checked': this.isChecked(),
            }),
          },
          () =>
            t.span('.custom-field-detail-badge-checkbox-box', () =>
              t.span('.custom-field-detail-badge-checkbox-icon'),
            ),
        );
      });

      this.prototype.events = {
        'click .js-custom-field-detail-badge': 'editCustomFieldBadge',
      };
    }

    isChecked() {
      return (
        __guard__(
          this.customFieldItem != null
            ? this.customFieldItem.get('value')
            : undefined,
          (x) => x.checked,
        ) === 'true'
      );
    }

    getBadgeText() {
      return this.customField.get('name');
    }

    editCustomFieldBadge(e) {
      Util.stop(e);
      this.track();

      this.trackCustomFieldValueUpdate();

      if (this.customFieldItem == null) {
        this.model.customFieldItemList.create({
          idCustomField: this.customField.id,
          idModel: this.model.id,
          modelType: 'card',
          value: {
            checked: 'true',
          },
        });
        return;
      }

      const newVal = !this.customFieldItem.getParsedValue();
      if (newVal) {
        return this.customFieldItem.setValue({ checked: newVal.toString() });
      } else {
        return this.customFieldItem.clearValue();
      }
    }
  }
  CustomFieldCheckboxCardDetailBadgeView.initClass();
  return CustomFieldCheckboxCardDetailBadgeView;
})();

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
