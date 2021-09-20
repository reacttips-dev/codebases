/*
The following class is a repurposed version of CustomFieldItem in app/scripts/models/custom-field-item.js
The key necessity is mapping between CustomFields and CustomFieldItems, which requires a little 
more logic outside of the Backbone model framework.
*/

import { getWords } from 'app/common/lib/util/satisfies-filter';

import {
  CustomFields,
  CustomField,
  CustomFieldItem as CustomFieldItemType,
  BoardPlugins,
} from './types';

import { customFieldsId } from '@trello/config';

import { Dates } from 'app/scripts/lib/dates';

export class CustomFieldItem {
  public value;
  public idValue;
  public idCustomField;

  constructor({ value, idValue, idCustomField }: CustomFieldItemType) {
    this.value = value;
    this.idValue = idValue;
    this.idCustomField = idCustomField;
  }

  getCustomField(customFields: CustomFields) {
    return customFields.find(({ id }) => id === this.idCustomField);
  }

  getParsedValue({ options, type }: CustomField) {
    const parsedVal = JSON.parse(this.value);

    switch (type) {
      case 'checkbox':
        return (parsedVal !== null ? parsedVal.checked : undefined) === 'true';
      case 'date':
        return new Date(parsedVal.date);
      case 'list':
        return options?.find(({ id }) => id === this.idValue)?.value.text;
      case 'number':
        return parseFloat(parsedVal.number);
      case 'text':
        return (parsedVal !== null ? parsedVal.text : undefined) || '';
      default:
        return undefined;
    }
  }

  isEmpty(type: string) {
    if (type === 'list') {
      return this.idValue === null;
    } else {
      return this.value === null;
    }
  }

  getFrontBadgeText(customField: CustomField) {
    const parsedVal = this.getParsedValue(customField);

    const type = customField.type;

    switch (type) {
      case 'checkbox':
        return customField.name;
      case 'date':
        return Dates.toDateString(parsedVal);
      case 'number':
        return parsedVal.toLocaleString();
      default:
        return parsedVal;
    }
  }

  getFilterableWords(customField: CustomField) {
    if (this.isEmpty(customField.type)) {
      return [];
    }

    const parsedVal = this.getParsedValue(customField);
    const type = customField.type;

    if (type === 'number') {
      const value = JSON.parse(this.value);

      // this is a bit weird, but we want the filter to work on both
      // the formatted number for example 0.01 as well as the raw number .01
      if (value < 1 && value > -1) {
        return [value.number, this.getFrontBadgeText(customField)];
      } else {
        // we want to avoid the formatted ones that aren't just leading 0
        // this is because things like commas are tricky to handle with the filter
        return [value.number];
      }
    }

    if (type !== 'date' && parsedVal) {
      return getWords(this.getFrontBadgeText(customField));
    }

    return [];
  }
}

export const isCustomFieldsEnabled = (boardPlugins: BoardPlugins) => {
  if (!boardPlugins) {
    return false;
  }

  return boardPlugins.some(({ idPlugin }) => idPlugin === customFieldsId);
};
