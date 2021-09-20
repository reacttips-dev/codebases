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
const { isSubmitEvent } = require('@trello/keybindings');
const { Util } = require('app/scripts/lib/util');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'custom_fields',
);

module.exports = (function () {
  class CustomFieldNumberCardDetailBadgeView extends CustomFieldCardDetailBadgeView {
    static initClass() {
      this.prototype.template = t.renderable(function (param) {
        if (param == null) {
          param = {};
        }
        const { icon, name, text, editable, color } = param;
        t.h3('.card-detail-item-header', { title: name }, function () {
          t.icon(icon, { class: 'mod-quiet' });
          return t.text(name);
        });

        if (editable) {
          t.input(
            `.custom-field-detail-badge.is-clickable.js-custom-field-detail-badge${color}`,
            {
              autocomplete: 'off',
              'data-lpignore': 'true',
              maxlength: 256,
              placeholder: t.l(
                'add field value',
                { fieldName: name.toLowerCase() },
                { raw: true },
              ),
              size: Math.max(text.length + 2, 7),
              title: text,
              type: 'text',
              value: text,
            },
          );
        }

        return t.span(
          `.custom-field-detail-badge${color}`,
          {
            class: t.classify({ 'printable-badge': editable }),
            title: text,
          },
          () => t.text(text),
        );
      });

      this.prototype.events = {
        'keyup .js-custom-field-detail-badge': 'validateNumber',
        'keydown .js-custom-field-detail-badge': 'handleEnter',
        'focusin .js-custom-field-detail-badge':
          'startEditCustomFieldBadgeText',
        'focusout .js-custom-field-detail-badge.js-is-editing':
          'editCustomFieldBadgeText',
      };
    }

    getBadgeText() {
      return (
        __guard__(
          this.customFieldItem != null
            ? this.customFieldItem.get('value')
            : undefined,
          (x) => x.number,
        ) || ''
      );
    }

    startEditCustomFieldBadgeText(e) {
      this.track();
      return e.target.classList.add('js-is-editing');
    }

    validateNumber(e) {
      const current = e.target.value.trim();
      if (isNaN(current)) {
        return e.target.classList.add('is-invalid');
      } else {
        return e.target.classList.remove('is-invalid');
      }
    }

    handleEnter(e) {
      if (isSubmitEvent(e)) {
        return this.$(e.target).blur();
      }
    }

    editCustomFieldBadgeText(e) {
      Util.stop(e);
      e.target.classList.remove('js-is-editing');
      e.target.classList.remove('is-invalid');
      const newVal = e.target.value.trim();
      e.target.value = newVal;

      this.trackCustomFieldValueUpdate();

      if (this.customFieldItem == null) {
        if (newVal && !isNaN(newVal)) {
          this.model.customFieldItemList.create({
            idCustomField: this.customField.id,
            idModel: this.model.id,
            modelType: 'card',
            value: {
              number: newVal,
            },
          });
        }
        if (isNaN(newVal)) {
          e.target.value = '';
        }
        return;
      }

      const oldVal =
        __guard__(this.customFieldItem.get('value'), (x) => x.number) || '';
      // check to see if the value has changed
      if (newVal === oldVal) {
        return;
      }

      if (newVal === '') {
        return this.customFieldItem.clearValue();
      } else {
        // only update if the number is valid
        if (!isNaN(newVal)) {
          return this.customFieldItem.setValue({ number: newVal });
        } else {
          return (e.target.value = oldVal);
        }
      }
    }
  }
  CustomFieldNumberCardDetailBadgeView.initClass();
  return CustomFieldNumberCardDetailBadgeView;
})();

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
