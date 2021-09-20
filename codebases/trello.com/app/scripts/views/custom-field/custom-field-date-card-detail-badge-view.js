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
const DateEditorView = require('app/scripts/views/custom-field/date-editor-view');
const moment = require('moment');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'custom_fields',
);
const { Util } = require('app/scripts/lib/util');

module.exports = (function () {
  class CustomFieldDateCardDetailBadgeView extends CustomFieldCardDetailBadgeView {
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
          return t.a(
            `.custom-field-detail-badge.is-clickable.js-custom-field-detail-badge${color}`,
            { href: '#', title: text },
            function () {
              if (text) {
                return t.text(text);
              } else {
                t.span('.icon-sm.icon-add');
                return t.format('add date');
              }
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
        'click .js-custom-field-detail-badge': 'editCustomFieldBadge',
      };
    }

    getBadgeText() {
      let date;
      if (
        (date = __guard__(
          this.customFieldItem != null
            ? this.customFieldItem.get('value')
            : undefined,
          (x) => x.date,
        ))
      ) {
        return moment(new Date(date)).calendar();
      } else {
        return '';
      }
    }

    editCustomFieldBadge(e) {
      Util.stop(e);
      this.track();

      return PopOver.toggle({
        elem: this.$(e.target).closest('.js-custom-field-detail-badge'),
        view: DateEditorView,
        options: {
          model: this.model,
          modelCache: this.modelCache,
          customFieldItem: this.customFieldItem,
          customField: this.customField,
          trackSetDateEvent: this.trackCustomFieldValueUpdate,
        },
      });
    }
  }
  CustomFieldDateCardDetailBadgeView.initClass();
  return CustomFieldDateCardDetailBadgeView;
})();

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
