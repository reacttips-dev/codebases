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
const t = require('app/scripts/views/internal/teacup-with-helpers')();
const View = require('app/scripts/views/internal/view');
const xtend = require('xtend');

const { Analytics } = require('@trello/atlassian-analytics');

const template = t.renderable(function ({ icon, name, text, type }) {
  if (icon != null) {
    t.icon(icon, { class: 'mod-quiet' });
  }
  return t.span('.badge-text', function () {
    if (name && type !== 'checkbox') {
      return t.text(`${name}: ${text}`);
    } else {
      return t.text(text);
    }
  });
});

const colorClasses = {
  black: 'field-color-black',
  blue: 'field-color-blue',
  green: 'field-color-green',
  orange: 'field-color-orange',
  red: 'field-color-red',
  yellow: 'field-color-yellow',
  purple: 'field-color-purple',
  pink: 'field-color-pink',
  sky: 'field-color-sky',
  lime: 'field-color-lime',
  'light-gray': 'field-color-light-gray',
};

class CustomFieldBadgeView extends View {
  static initClass() {
    this.prototype.tagName = 'div';
  }
  className() {
    const colorClass = this.getColorClass();
    if (colorClass) {
      return `badge field-color ${colorClass}`;
    } else {
      return 'badge';
    }
  }

  initialize({ customFieldItem, customField }) {
    this.customFieldItem = customFieldItem;
    this.customField = customField;
  }

  getColorClass() {
    return colorClasses[
      this.options.customFieldItem != null
        ? this.options.customFieldItem.getColor()
        : undefined
    ];
  }

  trackCustomFieldValueUpdate() {
    Analytics.sendTrackEvent({
      action: 'updated',
      actionSubject: 'customFieldValue',
      source: 'cardDetailBadge',
      attributes: {
        type: this.customField.get('type'),
      },
      containers: this.customField.getBoard().getAnalyticsContainers(),
    });
  }

  renderBadge(badge) {
    this.$el.html(template(badge));
    return this.$el;
  }

  render() {
    const customField = this.customField.toJSON();
    const customFieldItem = this.customFieldItem.toJSON();

    const icon =
      this.customField.get('type') === 'checkbox'
        ? this.customField.icon()
        : undefined;
    const text = this.customFieldItem.getFrontBadgeText();

    this.renderBadge(
      xtend(customFieldItem, _.pick(customField, 'name', 'type'), {
        icon,
        text,
      }),
    );

    return this;
  }
}

CustomFieldBadgeView.initClass();
module.exports = CustomFieldBadgeView;
