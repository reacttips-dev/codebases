'use es6';

import I18n from 'I18n';
import once from 'transmute/once';
import { ALL_CLOSED_VALUE } from 'customer-data-objects/ticket/TicketStageIdValues';
import PropertyOptionRecord from 'customer-data-objects/property/PropertyOptionRecord';
export var getAllClosedOption = once(function () {
  return PropertyOptionRecord({
    label: I18n.text('customerDataObjects.TicketStageIdSelect.allClosed'),
    value: ALL_CLOSED_VALUE
  });
});