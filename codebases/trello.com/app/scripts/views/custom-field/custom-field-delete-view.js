/* eslint-disable
 */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const { Util } = require('app/scripts/lib/util');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'custom_fields',
);
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');

const template = t.renderable(({ name }) =>
  t.div(function () {
    t.p(() => t.format('delete warning'));
    t.p(() => t.format('delete prompt', { fieldName: name }));
    t.input('.js-field-name', {
      name: 'name',
      type: 'text',
      autofocus: true,
      spellcheck: true,
      placeholder: t.l('field name'),
    });
    return t.div(() =>
      t.button(
        '.nch-button--fullwidth.nch-button.nch-button--danger.js-delete-field.disabled',
        { disabled: true },
        () => t.format('delete field'),
      ),
    );
  }),
);

class CustomFieldDeleteView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'delete field';

    this.prototype.events = {
      'click .js-delete-field': 'removeField',
      'input .js-field-name': 'validateName',
    };
  }

  initialize() {
    return (this.customField = this.options.customField);
  }

  render() {
    this.$el.html(template({ name: this.customField.get('name') }));

    return this;
  }

  validateName(e) {
    const $el = this.$(e.target);
    const newName = $el.val();
    const allowDelete = newName === this.customField.get('name');
    return this.$('.js-delete-field')
      .toggleClass('disabled', !allowDelete)
      .prop('disabled', !allowDelete);
  }

  removeField(e) {
    Util.stop(e);
    const traceId = Analytics.startTask({
      taskName: 'edit-plugin/customFields',
      source: 'customFieldDeleteInlineDialog',
    });
    this.customField.destroyWithTracing(
      { traceId },
      tracingCallback(
        {
          taskName: 'edit-plugin/customFields',
          source: 'customFieldDeleteInlineDialog',
          traceId,
        },
        (err) => {
          if (!err) {
            Analytics.sendTrackEvent({
              action: 'deleted',
              actionSubject: 'customField',
              source: 'customFieldDeleteInlineDialog',
              attributes: {
                taskId: traceId,
                type: this.customField.get('type'),
              },
              containers: this.customField.getBoard().getAnalyticsContainers(),
            });
          }
        },
      ),
    );

    return PopOver.hide();
  }
}

CustomFieldDeleteView.initClass();
module.exports = CustomFieldDeleteView;
