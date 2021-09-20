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
const CustomFieldCardDetailBadgeView = require('app/scripts/views/custom-field/custom-field-card-detail-badge-view');
const { isSubmitEvent } = require('@trello/keybindings');
const { Util } = require('app/scripts/lib/util');
const { isUrl } = require('app/scripts/lib/util/url/is-url');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'custom_fields',
);

module.exports = (function () {
  class CustomFieldTextCardDetailBadgeView extends CustomFieldCardDetailBadgeView {
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
          if (isUrl(text) || Util.checkEmail(text)) {
            t.div('.u-relative.custom-field-external-link', function () {
              t.input(
                `.custom-field-detail-badge.is-clickable.js-custom-field-detail-badge${color}`,
                {
                  autocomplete: 'off',
                  'data-lpignore': 'true',
                  maxlength: 16000,
                  size: Math.max(text.length + 1, 10),
                  title: text,
                  type: 'text',
                  value: text,
                },
              );
              if (isUrl(text)) {
                return t.a(
                  {
                    href: text,
                    target: '_blank',
                    rel: 'noreferrer nofollow noopener',
                    title: text,
                  },
                  () => t.icon('external-link'),
                );
              } else if (Util.checkEmail(text)) {
                return t.a({ href: `mailto:${text}`, title: text }, () =>
                  t.icon('email'),
                );
              }
            });
          } else {
            t.input(
              `.custom-field-detail-badge.is-clickable.js-custom-field-detail-badge${color}`,
              {
                autocomplete: 'off',
                'data-lpignore': 'true',
                maxlength: 16000,
                placeholder: t.l(
                  'add field value',
                  { fieldName: name.toLowerCase() },
                  { raw: true },
                ),
                size: Math.max(text.length + 1, 10),
                title: text,
                type: 'text',
                value: text,
              },
            );
          }
        }

        if (isUrl(text)) {
          return t.a(
            `.custom-field-detail-badge.is-clickable${color}`,
            {
              class: t.classify({ 'printable-badge': editable }),
              href: text,
              target: '_blank',
              rel: 'noreferrer nofollow noopener',
              title: text,
            },
            () => t.text(text),
          );
        } else if (Util.checkEmail(text)) {
          return t.a(
            `.custom-field-detail-badge.is-clickable${color}`,
            {
              class: t.classify({ 'printable-badge': editable }),
              href: `mailto:${text}`,
              title: text,
            },
            () => t.text(text),
          );
        } else {
          return t.span(
            `.custom-field-detail-badge${color}`,
            {
              class: t.classify({ 'printable-badge': editable }),
              title: text,
            },
            () => t.text(text),
          );
        }
      });

      this.prototype.events = {
        'keydown .js-custom-field-detail-badge': 'handleEnter',
        'focusin .js-custom-field-detail-badge':
          'startEditCustomFieldBadgeText',
        'focusout .js-custom-field-detail-badge.js-is-editing':
          'editCustomFieldBadgeText',
      };
    }

    startEditCustomFieldBadgeText(e) {
      this.track();
      e.target.classList.add('js-is-editing');
      return e.target.parentElement.classList.add('editing');
    }

    handleEnter(e) {
      if (isSubmitEvent(e)) {
        return this.$(e.target).blur();
      }
    }

    editCustomFieldBadgeText(e) {
      Util.stop(e);
      e.target.classList.remove('js-is-editing');
      e.target.parentElement.classList.remove('editing');
      const newVal = e.target.value.trim();

      this.trackCustomFieldValueUpdate();

      if (this.customFieldItem == null) {
        if (newVal) {
          this.model.customFieldItemList.create({
            idCustomField: this.customField.id,
            idModel: this.model.id,
            modelType: 'card',
            value: {
              text: newVal,
            },
          });
        }
        return;
      }

      const oldVal = this.customFieldItem.getParsedValue();
      // check to see if the value has changed
      if (newVal === oldVal) {
        return;
      }

      if (newVal === '') {
        return this.customFieldItem.clearValue();
      } else {
        return this.customFieldItem.setValue({ text: newVal });
      }
    }
  }
  CustomFieldTextCardDetailBadgeView.initClass();
  return CustomFieldTextCardDetailBadgeView;
})();
