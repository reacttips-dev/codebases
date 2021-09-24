'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Map as ImmutableMap, fromJS } from 'immutable';
import I18n from 'I18n';
import formatName from 'I18n/utils/formatName';
import { batch } from './owners';
import { validNumerical } from '../ids';
import { makeOption } from '../Option';
import { DEFAULT_NULL_VALUES } from '../../constants/defaultNullValues';
export var generateOwnerLabel = function generateOwnerLabel(owner, key) {
  owner = fromJS(owner);
  return key === DEFAULT_NULL_VALUES.ENUMERATION || key === '' ? I18n.text('reporting-data.missing.unassigned') : formatName({
    firstName: owner.get('firstName'),
    lastName: owner.get('lastName'),
    email: owner.get('email')
  });
};
export default (function (ids) {
  return batch(validNumerical(ids)).then(function (owners) {
    return Object.keys(owners).reduce(function (options, ownerId) {
      return options.set(String(ownerId), makeOption(ownerId, generateOwnerLabel(owners[ownerId])));
    }, ids.includes(DEFAULT_NULL_VALUES.ENUMERATION) ? ImmutableMap(_defineProperty({}, DEFAULT_NULL_VALUES.ENUMERATION, makeOption(DEFAULT_NULL_VALUES.ENUMERATION, I18n.text('reporting-data.missing.unassigned')))) : ImmutableMap());
  });
});