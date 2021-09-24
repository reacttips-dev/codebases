'use es6';

import get from 'transmute/get';
import { getCurrentObjectTypeId } from '../../init/selectors/routerStateSelectors';
import { createFrozenSelector } from '../../utils/createFrozenSelector';
import { ALL_PIPELINES_VALUE } from '../constants/AllPipelinesValue';

var getCurrentPipelineIdSlice = function getCurrentPipelineIdSlice(state) {
  return state.currentPipelineId;
};

export var getCurrentPipelineIdForCurrentType = createFrozenSelector([getCurrentPipelineIdSlice, getCurrentObjectTypeId], function (slice, objectTypeId) {
  return get(objectTypeId, slice) || ALL_PIPELINES_VALUE;
});