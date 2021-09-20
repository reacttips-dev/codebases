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
const { CustomField } = require('app/scripts/models/custom-field');
const OptionEditorView = require('app/scripts/views/custom-field/option-editor-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const Promise = require('bluebird');
const View = require('app/scripts/views/internal/view');
const { Util } = require('app/scripts/lib/util');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'custom_fields',
);
const { Analytics } = require('@trello/atlassian-analytics');

const template = t.renderable(
  ({ selectedType, name, isDuplicate, cardFront }) =>
    t.form(function () {
      t.label({ for: 'field-create-type' }, () => t.format('type'));
      t.select(
        '.js-field-type-select',
        { id: 'field-create-type', name: 'type' },
        () =>
          CustomField.types.forEach((type) =>
            t.option({ value: type, selected: selectedType === type }, () =>
              t.format(type),
            ),
          ),
      );
      t.label({ for: 'field-create-name' }, () => t.format('name'));
      t.input('.js-field-name-input', {
        autoselect: true,
        class: t.classify({ 'is-invalid': isDuplicate }),
        id: 'field-create-name',
        maxlength: 1000,
        name: 'name',
        required: true,
        spellcheck: true,
        type: 'text',
        value: name,
      });
      t.p(
        '.custom-field-error-message.js-duplicate-error',
        { class: t.classify({ hide: !isDuplicate }) },
        () => t.format('duplicate field'),
      );
      t.div({
        class: t.classify({
          'js-options-container': true,
          'options-container': true,
        }),
      });
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
      t.hr();
      return t.input('.nch-button.nch-button--primary.js-save-field', {
        disabled: name.length === 0 || isDuplicate,
        type: 'submit',
        value: t.l('create'),
      });
    }),
);

class CustomFieldCreateView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'new field';

    this.prototype.events = {
      'click .js-save-field': 'createField',
      'click .js-toggle-field-display': 'toggleDisplay',
      'input .js-field-name-input': 'validateFieldName',
      'change .js-field-type-select': 'changeType',
    };
  }

  initialize() {
    this.cardFront = true;
    return (this.board = this.options.board);
  }

  isDuplicate() {
    const name = this.name != null ? this.name : '';
    const type = this.selectedType != null ? this.selectedType : 'checkbox';
    return this.board.hasCustomField(type, name);
  }

  render() {
    const isDuplicate = this.isDuplicate();
    this.$el.html(
      template({
        name: this.name != null ? this.name : '',
        isDuplicate,
        selectedType: this.selectedType,
        cardFront: this.cardFront,
      }),
    );

    if (this.selectedType === 'list') {
      this.optionEditor = this.subview(
        OptionEditorView,
        this.model,
        {},
        'new-field-options-editor',
      );
      this.appendSubview(this.optionEditor, this.$('.js-options-container'));
    }

    return this;
  }

  changeType(e) {
    this.selectedType = this.$(e.target).val();
    return this.render();
  }

  validateFieldName(e) {
    const $el = this.$(e.target);
    const newVal = $el.val().trim();
    this.name = newVal;
    const isDuplicate = this.isDuplicate();
    this.$('.js-save-field').prop(
      'disabled',
      this.name.length === 0 || isDuplicate,
    );
    this.$('.js-field-name-input').toggleClass('is-invalid', isDuplicate);
    return this.$('.js-duplicate-error').toggleClass('hide', !isDuplicate);
  }

  toggleDisplay(e) {
    Util.stop(e);
    this.cardFront = !this.cardFront;
    return this.render();
  }

  createField(e) {
    Util.stop(e);
    const $elem = this.$(e.target);
    const $form = $elem.closest('form');
    const type = $form.find('.js-field-type-select').val();
    const name = $form.find('.js-field-name-input').val().trim();

    if (name === '') {
      return;
    }

    const traceId = Analytics.startTask({
      taskName: 'edit-plugin/customFields',
      source: 'customFieldCreateInlineDialog',
    });

    // disable button to prevent double submission
    $elem.prop('disabled', true);

    const newCustomField = {
      idModel: this.board.id,
      modelType: 'board',
      name,
      pos: 'bottom',
      type,
    };

    if (type === 'list') {
      newCustomField.options = this.optionEditor.getOptions();
    }

    const requestData = _.extend({}, newCustomField, {
      display_cardFront: this.cardFront,
    });

    return new Promise((resolve, reject) => {
      return this.board.customFieldList.createWithTracing(newCustomField, {
        requestData,
        traceId,
        success: () => {
          Analytics.sendTrackEvent({
            action: 'added',
            actionSubject: 'customField',
            source: 'customFieldCreateInlineDialog',
            attributes: {
              taskId: traceId,
              type,
            },
            containers: this.board.getAnalyticsContainers(),
          });

          Analytics.taskSucceeded({
            taskName: 'edit-plugin/customFields',
            source: 'customFieldCreateInlineDialog',
            traceId,
          });
          resolve();
        },
        error: (model, error) => {
          Analytics.taskFailed({
            taskName: 'edit-plugin/customFields',
            traceId,
            source: 'customFieldCreateInlineDialog',
            error,
          });
          return reject(error);
        },
      });
    })
      .then(() => PopOver.popView())
      .done();
  }
}

CustomFieldCreateView.initClass();
module.exports = CustomFieldCreateView;
