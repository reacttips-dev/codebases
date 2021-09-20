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
const CustomFieldCreateView = require('app/scripts/views/custom-field/custom-field-create-view');
const CustomFieldEditView = require('app/scripts/views/custom-field/custom-field-edit-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const { Util } = require('app/scripts/lib/util');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'custom_fields',
);

const CUSTOM_FIELDS_ID = require('@trello/config').customFieldsId;
const { MAX_FIELDS } = require('app/scripts/views/custom-field/constants.ts');

const template = t.renderable(function (param) {
  if (param == null) {
    param = {};
  }
  const { canCreate, fields } = param;
  return t.div(function () {
    if (fields.length === 0 && canCreate) {
      t.p(() => t.format('no custom fields'));
      t.hr();
      return t.a('.custom-field.js-add-field', { href: '#' }, function () {
        t.icon('add');
        return t.span('.custom-field-name', () => t.format('new field'));
      });
    } else {
      return t.ul(function () {
        fields.map((cf) =>
          t.li(
            '.custom-field.js-field',
            { href: '#', idCustomField: cf.id },
            function () {
              t.icon(cf.icon(), { class: 'js-drag-handle draggable' });
              return t.a(
                '.custom-field-name.js-edit-field',
                { href: '#' },
                () => t.text(cf.get('name')),
              );
            },
          ),
        );
        if (canCreate) {
          t.hr();
          return t.a('.custom-field.js-add-field', { href: '#' }, function () {
            t.icon('add');
            return t.span('.custom-field-name', () => t.format('new field'));
          });
        }
      });
    }
  });
});

class CustomFieldsButtonView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'custom fields';

    this.prototype.events = {
      'click .js-add-field': 'createCustomField',
      'click .js-edit-field': 'editCustomField',
    };
  }

  initialize() {
    return (this.board = this.options.board);
  }

  render() {
    const fields = this.board.customFieldList.models;

    const canCreate =
      this.board.editable() &&
      this.board.isPluginEnabled(CUSTOM_FIELDS_ID) &&
      this.board.customFieldList.length < MAX_FIELDS;

    this.$el.html(template({ canCreate, fields }));

    if (fields.length > 1) {
      const $fieldList = this.$('.js-field').first().closest('ul');
      $fieldList.sortable({
        axis: 'y',
        cursor: 'move',
        delay: '75',
        distance: '5',
        handle: '.js-drag-handle',
        tolerance: 'pointer',
        placeholder: 'field-list-option placeholder',
        items: '.js-field',
        sort: (event, ui) => {
          const formTop = $fieldList.parent().parent().offset().top;
          const top = event.clientY - formTop;
          return ui.helper.css({ top: `${top}px` });
        },
        update: (event, ui) => {
          const idCustomField = ui.item.attr('idCustomField');
          const newIndex = ui.item.parent().children().index(ui.item);
          return this.board.customFieldList.get(idCustomField).move(newIndex);
        },
      });
    }

    return this;
  }

  createCustomField(e) {
    Util.stop(e);
    return PopOver.pushView({
      elem: this.$(e.target),
      view: CustomFieldCreateView,
      options: {
        model: this.model,
        modelCache: this.modelCache,
        board: this.board,
      },
    });
  }

  editCustomField(e) {
    const $el = this.$(e.target).closest('.js-field');
    const idCustomField = $el.attr('idCustomField');
    const customField = this.board.customFieldList.get(idCustomField);
    return PopOver.pushView({
      elem: $el,
      view: CustomFieldEditView,
      options: {
        model: this.model,
        modelCache: this.modelCache,
        board: this.board,
        customField,
      },
    });
  }
}

CustomFieldsButtonView.initClass();
module.exports = CustomFieldsButtonView;
