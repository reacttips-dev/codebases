'use es6';

import I18n from 'I18n';
import once from 'transmute/once';
import { ALL_OWNER_VALUE, ME_OWNER_VALUE, NONE_OWNER_VALUE } from './OwnerIdValues';
import PropertyOptionRecord from 'customer-data-objects/property/PropertyOptionRecord';
export var getAllOption = once(function () {
  return PropertyOptionRecord({
    label: I18n.text('customerDataObjects.OwnerIdSelect.all'),
    value: ALL_OWNER_VALUE
  });
});
export var getMeOption = once(function () {
  return PropertyOptionRecord({
    icon: 'dynamicFilter',
    label: I18n.text('customerDataObjects.OwnerIdSelect.me'),
    value: ME_OWNER_VALUE,
    description: I18n.text('customerDataObjects.OwnerIdSelect.meDescription')
  });
});
export var getNoneOption = once(function () {
  return PropertyOptionRecord({
    label: I18n.text('customerDataObjects.OwnerIdSelect.none'),
    value: NONE_OWNER_VALUE
  });
});