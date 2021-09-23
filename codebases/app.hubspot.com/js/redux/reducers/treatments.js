'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import ActionMapper from '../../lib/legacyRequestActionMapper';
import actionTypes from '../actions/actionTypes';
import { Map as ImmutableMap } from 'immutable';
import { handleActions } from 'flux-actions';
export var treatments = handleActions(_defineProperty({}, ActionMapper.success(actionTypes.EXPERIMENT_TREATMENT_FETCH), function (state, action) {
  return state.set(action.data.get('key'), action.data);
}), ImmutableMap());