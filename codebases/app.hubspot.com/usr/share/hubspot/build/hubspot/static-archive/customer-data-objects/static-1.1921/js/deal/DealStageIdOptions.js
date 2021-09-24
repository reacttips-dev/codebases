'use es6';

import I18n from 'I18n';
import once from 'transmute/once';
import { ALL_CLOSED_WON_VALUE } from 'customer-data-objects/deal/DealStageIdValues';
import PropertyOptionRecord from 'customer-data-objects/property/PropertyOptionRecord';
export var getAllClosedWonOption = once(function () {
  return PropertyOptionRecord({
    label: I18n.text('customerDataObjects.DealStageIdSelect.allClosedWon'),
    value: ALL_CLOSED_WON_VALUE
  });
});