/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const CustomFieldCardDetailBadgeView = require('app/scripts/views/custom-field/custom-field-card-detail-badge-view');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'custom_fields',
);

module.exports = (function () {
  class CustomFieldListCardDetailBadgeView extends CustomFieldCardDetailBadgeView {
    static initClass() {
      this.prototype.template = t.renderable(function (param) {
        if (param == null) {
          param = {};
        }
        const { idValue, icon, name, text, editable, options, color } = param;
        t.h3('.card-detail-item-header', { title: name }, function () {
          t.icon(icon, { class: 'mod-quiet' });
          return t.text(name);
        });

        if (editable) {
          return t.div(
            `.list-detail-badge.custom-field-detail-badge.is-clickable.js-custom-field-detail-badge${color}`,
            { title: text || t.l('select') },
            function () {
              t.span(
                '.list-detail-badge-value.js-custom-field-list-value',
                function () {
                  if (text) {
                    return t.text(text);
                  } else {
                    t.format('select');
                    return t.span('.icon-sm.icon-down');
                  }
                },
              );
              t.label(name);
              return t.select('.js-custom-field-list', function () {
                t.option(
                  { value: '', selected: idValue == null || !text },
                  () => '--',
                );
                return (() => {
                  const result = [];
                  for (const { id, value } of Array.from(
                    options != null ? options : [],
                  )) {
                    result.push(
                      t.option({ value: id, selected: id === idValue }, () =>
                        t.text(value.text),
                      ),
                    );
                  }
                  return result;
                })();
              });
            },
          );
        } else {
          return t.span(
            `.custom-field-detail-badge${color}`,
            { title: text },
            () => t.text(text),
          );
        }
      });

      this.prototype.events = {
        'change .js-custom-field-list': 'editCustomFieldList',
      };
    }

    editCustomFieldList(e) {
      this.track();

      this.trackCustomFieldValueUpdate();

      if (this.customFieldItem == null && e.target.value) {
        this.model.customFieldItemList.create({
          idCustomField: this.customField.id,
          idModel: this.model.id,
          modelType: 'card',
          idValue: e.target.value,
          options: [],
        });
        return;
      }

      if (this.customFieldItem && e.target.value === '') {
        return this.customFieldItem.clearValue();
      } else {
        return this.customFieldItem.setValue(e.target.value);
      }
    }
  }
  CustomFieldListCardDetailBadgeView.initClass();
  return CustomFieldListCardDetailBadgeView;
})();
