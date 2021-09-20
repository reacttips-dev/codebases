/* eslint-disable
    default-case,
    eqeqeq,
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
const { Dates } = require('app/scripts/lib/dates');
const TrelloModel = require('app/scripts/models/internal/trello-model');

const DEBOUNCE_INTERVAL = 500; //ms

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class CustomFieldItem extends TrelloModel {
  static initClass() {
    this.prototype.typeName = 'CustomFieldItem';

    this.colors = [
      'green',
      'yellow',
      'orange',
      'red',
      'purple',
      'blue',
      'sky',
      'lime',
      'pink',
      'black',
      'none',
    ];
  }
  url() {
    const idCard = this.get('idModel');
    const idCustomField = this.get('idCustomField');
    return `/1/card/${idCard}/customField/${idCustomField}/item`;
  }

  getCard() {
    return this.modelCache.get('Card', this.get('idModel'));
  }

  getCustomField() {
    return this.modelCache.get('CustomField', this.get('idCustomField'));
  }

  clearValue() {
    return this.setValue(null);
  }

  setValue(newValue) {
    // default key for payload
    let valueKey = 'value';
    const fieldType = this.getType();

    if (fieldType === 'list') {
      valueKey = 'idValue';
    }

    return this.update(
      {
        [valueKey]: newValue,
      },
      { debounceSaveInterval: DEBOUNCE_INTERVAL },
    );
  }

  sync(method, model, options) {
    // we want to ensure that we always use PUT
    // so that when creating a custom field item it is treated more
    // as an update to the card
    // The expectation is this is just used for creation, for updates and deletes
    // use the setValue and clearValue methods instead
    options.type = 'PUT';
    return super.sync(...arguments);
  }

  getType() {
    return __guard__(this.getCustomField(), (x) => x.get('type'));
  }

  getColor() {
    if (this.getType() === 'list') {
      const idValue = this.get('idValue');
      return (
        __guard__(this.getCustomField().getOption(idValue), (x) =>
          x.get('color'),
        ) || 'none'
      );
    } else {
      return this.get('color') || 'none';
    }
  }

  getParsedValue() {
    const value = this.get('value');
    const idValue = this.get('idValue');
    const type = this.getType();
    switch (type) {
      case 'checkbox':
        return (value != null ? value.checked : undefined) === 'true';
      case 'date':
        return new Date(value.date);
      case 'list':
        return (
          __guard__(
            this.getCustomField().getOption(idValue),
            (x) => x.get('value').text,
          ) || ''
        );
      case 'number':
        return parseFloat(value.number);
      case 'text':
        return (value != null ? value.text : undefined) || '';
    }
  }

  getFrontBadgeText() {
    const parsedVal = this.getParsedValue();
    const type = this.getType();
    switch (type) {
      case 'checkbox':
        return this.getCustomField().get('name');
      case 'date':
        return Dates.toDateString(parsedVal);
      case 'number':
        return parsedVal.toLocaleString();
      default:
        return parsedVal;
    }
  }

  // For Custom Fields we are interested in searching the following:
  // Have a checked checkbox field whose name matches the search terms
  // Have a text field whose value matches the search terms
  // Have a list field selection whose value matches the search terms
  // Have a numeric field whose value matches the search value
  getFilterableWords(fxGetWords) {
    if (this.isEmpty()) {
      return [];
    }

    const parsedVal = this.getParsedValue();
    const type = this.getType();
    if (type === 'number') {
      // this is a bit weird, but we want the filter to work on both
      // the formatted number for example 0.01 as well as the raw number .01
      if (parsedVal < 1 && parsedVal > -1) {
        return [this.get('value').number, this.getFrontBadgeText()];
      } else {
        // we want to avoid the formatted ones that aren't just leading 0
        // this is because things like commas are tricky to handle with the filter
        return [this.get('value').number];
      }
    }

    if (type !== 'date' && parsedVal) {
      return fxGetWords(this.getFrontBadgeText());
    }

    return [];
  }

  isEmpty() {
    if (this.getType() === 'list') {
      return this.get('idValue') == null;
    } else {
      return this.get('value') == null;
    }
  }

  showFrontBadge() {
    const customField = this.getCustomField();
    if (!(customField != null ? customField.visible() : undefined)) {
      return false;
    }
    if (!__guard__(customField.get('display'), (x) => x.cardFront)) {
      return false;
    }
    if (this.isEmpty()) {
      return false;
    }
    if (
      customField.get('type') === 'checkbox' &&
      __guard__(this.get('value'), (x1) => x1.checked) !== 'true'
    ) {
      return false;
    }
    if (customField.isList() && !customField.getOption(this.get('idValue'))) {
      return false;
    }
    return true;
  }
}
CustomFieldItem.initClass();

module.exports.CustomFieldItem = CustomFieldItem;
