/* eslint-disable
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const CustomFieldDeleteView = require('app/scripts/views/custom-field/custom-field-delete-view');
const { isSubmitEvent } = require('@trello/keybindings');
const OptionEditorView = require('app/scripts/views/custom-field/option-editor-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const { Util } = require('app/scripts/lib/util');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'custom_fields',
);
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');

const template = t.renderable(({ name, cardFront, isList }) =>
  t.div(function () {
    t.label({ for: 'name' }, () => t.format('name'));
    t.input('.js-field-name', {
      name: 'name',
      type: 'text',
      autofocus: true,
      spellcheck: true,
      value: name,
    });
    t.p('.custom-field-error-message.hide.js-duplicate-error', () =>
      t.format('duplicate field'),
    );
    t.div({
      class: t.classify({
        'js-options-container': true,
        'options-container': true,
      }),
    });
    if (isList) {
      t.p('.quiet', () => t.format('delete option warning'));
    }
    t.hr();
    t.a(
      '.js-toggle-field-display.custom-fields-settings-toggle',
      { href: '#' },
      function () {
        t.format('show on front of card');
        if (cardFront) {
          return t.icon('check');
        }
      },
    );
    return t.div(function () {
      t.hr();
      return t.a('.quiet.js-delete-field', { href: '#' }, () =>
        t.format('delete field'),
      );
    });
  }),
);

class CustomFieldEditView extends View {
  static initClass() {
    this.prototype.events = {
      'click .js-delete-field': 'removeField',
      'click .js-toggle-field-display': 'toggleDisplay',
      'keydown .js-field-name': 'handleEnter',
      'input .js-field-name': 'validateName',
      'focusout .js-field-name': 'saveOnBlur',
    };
  }
  viewTitleKey() {
    if (this.customField.isList()) {
      return 'edit field';
    } else {
      return 'rename field';
    }
  }

  initialize() {
    this.board = this.options.board;
    this.customField = this.options.customField;
    return (this.options = this.customField.get('options'));
  }

  render() {
    this.$el.html(
      template({
        name: this.customField.get('name'),
        cardFront: __guard__(
          this.customField.get('display'),
          (x) => x.cardFront,
        ),
        isList: this.customField.isList(),
      }),
    );

    if (this.customField.isList()) {
      this.optionEditor = this.subview(
        OptionEditorView,
        this.model,
        { customField: this.customField },
        `${this.customField.id}-options-editor`,
      );
      this.appendSubview(this.optionEditor, this.$('.js-options-container'));
    }

    return this;
  }

  handleEnter(e) {
    if (isSubmitEvent(e)) {
      Util.stop(e);
      return this.$(e.target).blur();
    }
  }

  validateName(e) {
    const $el = this.$(e.target);
    const newName = $el.val().trim();
    if (newName.length === 0) {
      $el.addClass('is-invalid');
      return;
    }
    const currentName = this.customField.get('name');
    const isDupe =
      newName !== currentName &&
      this.board.hasCustomField(this.customField.get('type'), newName);
    $el.toggleClass('is-invalid', isDupe);
    return this.$('.js-duplicate-error').toggleClass('hide', !isDupe);
  }

  saveOnBlur(e) {
    const newName = e.target.value.trim();
    const oldName = this.customField.get('name');
    if (newName === oldName) {
      return;
    }

    const type = this.customField.get('type');
    if (newName.length === 0 || this.board.hasCustomField(type, newName)) {
      // restore existing name
      this.render();
      return;
    }

    const traceId = Analytics.startTask({
      taskName: 'edit-plugin/customFields',
      source: 'customFieldEditInlineDialog',
    });

    this.customField.update(
      {
        traceId,
        name: newName,
      },
      tracingCallback(
        {
          taskName: 'edit-plugin/customFields',
          source: 'customFieldEditInlineDialog',
          traceId,
        },
        (err) => {
          if (!err) {
            Analytics.sendTrackEvent({
              action: 'updated',
              actionSubject: 'customField',
              source: 'customFieldEditInlineDialog',
              attributes: {
                taskId: traceId,
                type: this.customField.get('type'),
                updatedField: 'name',
              },
              containers: this.customField.getBoard().getAnalyticsContainers(),
            });
          }
        },
      ),
    );
  }

  toggleDisplay(e) {
    Util.stop(e);
    const traceId = Analytics.startTask({
      taskName: 'edit-plugin/customFields',
      source: 'customFieldEditInlineDialog',
    });
    this.customField.toggleDisplay(
      traceId,
      tracingCallback(
        {
          taskName: 'edit-plugin/customFields',
          source: 'customFieldEditInlineDialog',
          traceId,
        },
        (err) => {
          if (!err) {
            Analytics.sendTrackEvent({
              action: 'updated',
              actionSubject: 'customField',
              source: 'customFieldEditInlineDialog',
              attributes: {
                taskId: traceId,
                type: this.customField.get('type'),
                updatedField: 'display/cardFront',
              },
              containers: this.customField.getBoard().getAnalyticsContainers(),
            });
          }
        },
      ),
    );

    return this.render();
  }

  removeField(e) {
    Util.stop(e);
    return PopOver.pushView({
      elem: this.$(e.target),
      view: CustomFieldDeleteView,
      options: {
        model: this.model,
        modelCache: this.modelCache,
        customField: this.customField,
      },
    });
  }
}

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
CustomFieldEditView.initClass();
module.exports = CustomFieldEditView;
