// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const {
  CustomFieldOptionList,
} = require('app/scripts/models/collections/custom-field-option-list');
const TrelloModel = require('app/scripts/models/internal/trello-model');
const { Util } = require('app/scripts/lib/util');

const CUSTOM_FIELDS_ID = require('@trello/config').customFieldsId;

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class CustomField extends TrelloModel {
  static initClass() {
    this.prototype.typeName = 'CustomField';
    this.prototype.urlRoot = '/1/customFields';

    this.types = ['checkbox', 'date', 'list', 'number', 'text'];

    this.lazy({
      optionList() {
        return new CustomFieldOptionList().syncSubModels(this, 'options', true);
      },
    });
  }

  getBoard() {
    return this.modelCache.get('Board', this.get('idModel'));
  }

  getOption(idOption) {
    return this.optionList.get(idOption);
  }

  getOptionByCId(cid) {
    return _.find(this.optionList.models, (o) => o.cid === cid);
  }

  editable() {
    return this.visible() && this.getBoard().editable();
  }

  visible() {
    return this.pluginEnabled();
  }

  pluginEnabled() {
    return this.getBoard().isPluginEnabled(CUSTOM_FIELDS_ID);
  }

  icon() {
    switch (this.get('type')) {
      case 'text':
        return 'text';
      case 'number':
        return 'number';
      case 'date':
        return 'calendar';
      case 'checkbox':
        return 'selection-mode';
      case 'list':
        return 'dropdown-options';
      default:
        return '';
    }
  }

  calcPos(index, option) {
    return Util.calcPos(index, this.optionList, option);
  }

  move(index) {
    this.update('pos', Util.calcPos(index, this.collection, this));
    this.collection.sort({ silent: false });
  }

  isList() {
    return this.get('type') === 'list';
  }

  isSortable() {
    return this.get('type') === 'number' || this.get('type') === 'date';
  }

  toggleDisplay(traceId, next) {
    return this.update(
      {
        traceId,
        'display/cardFront': !__guard__(
          this.get('display'),
          (x) => x.cardFront,
        ),
      },
      next,
    );
  }
}
CustomField.initClass();

module.exports.CustomField = CustomField;
