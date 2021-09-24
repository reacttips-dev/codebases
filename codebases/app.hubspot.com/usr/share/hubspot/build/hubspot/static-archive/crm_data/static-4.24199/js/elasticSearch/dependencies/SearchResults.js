'use es6';

import partial from 'transmute/partial';
import { getId, toStringExpanded } from 'customer-data-objects/model/ImmutableModel';
export var createMatchValue = function createMatchValue(subject) {
  return "" + getId(subject);
};
export var parseValue = function parseValue(value) {
  return {
    id: value
  };
};
export var toMatchOption = function toMatchOption(createValue, subject) {
  return {
    record: subject,
    text: toStringExpanded(subject),
    value: createValue(subject)
  };
};
export var toMatch = partial(toMatchOption, createMatchValue);