'use es6';

import { fromJS } from 'immutable';
import { GLOBAL_NULL } from '../../constants/defaultNullValues';
export var generateInteractionTypeLabel = function generateInteractionTypeLabel(interactionType, key) {
  var immutableInteractionType = fromJS(interactionType);
  return immutableInteractionType.get('name', key === GLOBAL_NULL ? null : key);
};