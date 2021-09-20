/* eslint-disable
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const { CustomFieldItem } = require('app/scripts/models/custom-field-item');
const { isSubmitEvent } = require('@trello/keybindings');
const View = require('app/scripts/views/internal/view');
const { Util } = require('app/scripts/lib/util');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'custom_fields',
);

const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');

const MAX_OPTIONS = 50;

const template = t.renderable(({ options, colors }) =>
  t.div(function () {
    t.label('.js-option-list-label', () => t.format('options'));
    t.div('.js-option-list', () =>
      options.map((o) =>
        t.div(
          '.field-list-option.js-list-option',
          { idOption: o.cid || o.id },
          function () {
            t.a(
              `.field-list-option-color-swatch.is-clickable.js-option-pick-color.field-color-${
                o.color || 'none'
              }`,
              { href: '#' },
            );
            t.a(
              '.option-value.js-option',
              { href: '#', title: o.value.text },
              () => t.text(o.value.text),
            );
            t.input('.option-value.js-option', {
              type: 'text',
              value: o.value.text,
            });
            return t.a('.icon-sm.icon-trash.js-remove-option', { href: '#' });
          },
        ),
      ),
    );
    t.div('.hide.js-option-color-picker', function () {
      t.label('.field-color-picker-label', () => t.format('select a color'));
      return t.div({ style: 'margin-left: 4px' }, () =>
        colors.map((c) =>
          t.a(
            `.field-list-option-color-swatch.field-color.is-clickable.field-color-${c.color}.js-palette-color`,
            { 'data-color': c.color },
          ),
        ),
      );
    });
    if (options.length < MAX_OPTIONS) {
      return t.input('.js-add-option.add-option', {
        type: 'text',
        placeholder: t.l('add item'),
      });
    }
  }),
);

class OptionsEditorView extends View {
  static initClass() {
    this.prototype.events = {
      'click .js-option-pick-color': 'toggleColorPicker',
      'click .js-palette-color': 'pickColor',
      'click a.js-option': 'startEditOption',
      'click .js-remove-option': 'removeOption',
      'keydown .js-add-option': 'addOption',
      'keydown input[type=text].js-option': 'blurOnEnter',
      'focusout input[type=text].js-option': 'updateOption',
    };
  }
  initialize() {
    let left;
    this.customField = this.options.customField;

    return (this.options =
      (left =
        this.customField != null
          ? this.customField.get('options')
          : undefined) != null
        ? left
        : []);
  }

  render() {
    const colors = Array.from(CustomFieldItem.colors).map((color) => ({
      color,
    }));
    let { options } = this;
    if (this.customField) {
      options = this.customField.optionList.models.map((o) =>
        _.extend({ cid: o.cid }, o.toJSON()),
      );
    }

    this.$el.html(template({ colors, options }));
    const $optionList = this.$('.js-option-list');

    if (options.length > 1) {
      $optionList.sortable({
        axis: 'y',
        cursor: 'move',
        delay: '75',
        distance: '5',
        tolerance: 'pointer',
        placeholder: 'field-list-option placeholder',
        items: '.js-list-option',
        sort: (event, ui) => {
          const formTop = this.$el
            .closest('.js-options-container')
            .parent()
            .offset().top;
          const labelHeight = this.$el
            .find('.js-option-list-label')
            .first()
            .outerHeight();
          const top = event.clientY - formTop - labelHeight;
          return ui.helper.css({ top: `${top}px` });
        },
        update: (event, ui) => {
          const idOption = ui.item.attr('idOption');
          const newIndex = ui.item.parent().children().index(ui.item);
          if (this.customField) {
            return this.customField.getOptionByCId(idOption).move(newIndex);
          } else {
            const oldIndex = _.findIndex(
              this.options,
              (o) => o.id === idOption,
            );
            // https://stackoverflow.com/a/7180095
            return this.options.splice(
              newIndex,
              0,
              this.options.splice(oldIndex, 1)[0],
            );
          }
        },
      });
    }

    return this;
  }

  getOption(id) {
    return _.find(this.options, (o) => o.id === id);
  }

  getOptions() {
    return this.options.map(function (o, i) {
      if (o.new) {
        return { color: o.color, value: o.value, pos: (i + 1) * 1024 };
      } else {
        return _.omit(o, 'pos', 'idCustomField');
      }
    });
  }

  toggleColorPicker(e) {
    const $picker = this.$('.js-option-color-picker');
    if (!$picker.hasClass('hide')) {
      this.render();
      return;
    }
    const $opt = this.$(e.target).closest('.js-list-option');
    if ($opt.hasClass('editing')) {
      $opt.children('input.js-option').blur();
      return;
    }

    const idOption = $opt.attr('idOption');
    this.targetOption = idOption;

    return $picker
      .insertAfter(`.js-list-option[idOption="${idOption}"]`)
      .removeClass('hide');
  }

  pickColor(e) {
    const { color } = e.target.dataset;
    const idOption = this.targetOption;
    if (this.customField) {
      const traceId = Analytics.startTask({
        taskName: 'edit-plugin/customFields',
        source: 'customFieldEditInlineDialog',
      });
      this.customField.getOptionByCId(idOption).update(
        {
          traceId,
          color,
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
                  updatedField: 'options/color',
                },
                containers: this.customField
                  .getBoard()
                  .getAnalyticsContainers(),
              });
            }
          },
        ),
      );
    } else {
      const opt = this.getOption(idOption);
      opt.color = color;
    }
    return this.render();
  }

  startEditOption(e) {
    const $el = this.$(e.target).closest('.js-list-option');
    if (!$el.hasClass('editing')) {
      $el.addClass('editing');
      return $el.children('input[type="text"].js-option').first().select();
    }
  }

  updateOption(e) {
    const newValue = e.target.value.trim();
    const idOption = this.$(e.target)
      .closest('.js-list-option')
      .attr('idOption');
    if (!this.customField) {
      const targetOpt = this.getOption(idOption);
      targetOpt.value.text = newValue;
    } else if (
      this.customField.getOptionByCId(idOption).get('value').text !== newValue
    ) {
      const traceId = Analytics.startTask({
        taskName: 'edit-plugin/customFields',
        source: 'customFieldEditInlineDialog',
      });
      this.customField.getOptionByCId(idOption).update(
        {
          traceId,
          value: { text: newValue },
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
                  updatedField: 'options/value/text',
                },
                containers: this.customField
                  .getBoard()
                  .getAnalyticsContainers(),
              });
            }
          },
        ),
      );
    }
    return this.render();
  }

  blurOnEnter(e) {
    if (isSubmitEvent(e)) {
      return this.$(e.target).blur();
    }
  }

  removeOption(e) {
    const idOption = this.$(e.target)
      .closest('.js-list-option')
      .attr('idOption');
    if (this.customField) {
      const targetOption = this.customField.getOptionByCId(idOption);
      if (targetOption != null) {
        const traceId = Analytics.startTask({
          taskName: 'edit-plugin/customFields',
          source: 'customFieldEditInlineDialog',
        });
        targetOption.destroyWithTracing(
          { traceId },
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
                    removedField: 'options',
                  },
                  containers: this.customField
                    .getBoard()
                    .getAnalyticsContainers(),
                });
              }
            },
          ),
        );
      }
    } else {
      this.options = _.filter(this.options, (o) => o.id !== idOption);
    }
    return this.render();
  }

  addOption(e) {
    if (isSubmitEvent(e)) {
      Util.stop(e);
      const newVal = e.target.value.trim();
      if (!newVal) {
        return;
      }
      if (this.customField) {
        const traceId = Analytics.startTask({
          taskName: 'edit-plugin/customFields',
          source: 'customFieldEditInlineDialog',
        });
        this.customField.optionList.createWithTracing(
          {
            value: { text: newVal },
            pos: 'bottom',
          },
          {
            traceId,
            error: (model, error) => {
              Analytics.taskFailed({
                taskName: 'edit-plugin/customFields',
                source: 'customFieldEditInlineDialog',
                traceId,
                error,
              });
            },
            success: () => {
              Analytics.sendTrackEvent({
                action: 'updated',
                actionSubject: 'customField',
                source: 'customFieldEditInlineDialog',
                attributes: {
                  taskId: traceId,
                  type: this.customField.get('type'),
                  addedField: 'options',
                },
                containers: this.customField
                  .getBoard()
                  .getAnalyticsContainers(),
              });

              Analytics.taskSucceeded({
                taskName: 'edit-plugin/customFields',
                source: 'customFieldEditInlineDialog',
                traceId,
              });
            },
          },
        );
      } else {
        this.options.push(
          this._createOption(
            e.target.value.trim(),
            __guard__(_.last(this.options), (x) => x.pos) || 0,
          ),
        );
      }
      e.target.value = '';
      this.render();
      // return focus to new item text box
      return this.$('.js-add-option').focus();
    }
  }

  _createOption(text, position, color = 'none') {
    return {
      id: _.uniqueId('field-option_'),
      color,
      new: true,
      pos: position + 5,
      value: { text },
    };
  }
}

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
OptionsEditorView.initClass();
module.exports = OptionsEditorView;
