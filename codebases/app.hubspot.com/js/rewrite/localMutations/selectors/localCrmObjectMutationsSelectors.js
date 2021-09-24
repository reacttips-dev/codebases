'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { getCurrentObjectTypeId } from '../../init/selectors/routerStateSelectors';
import { createFrozenSelector } from '../../utils/createFrozenSelector';
import get from 'transmute/get';
import { objectEntries } from '../../objectUtils/objectEntries';
import { mutableUpdateIn } from '../../objectUtils/mutableUpdateIn';

var getLocalMutationsSlice = function getLocalMutationsSlice(state) {
  return state.localCrmObjectMutations;
};

export var getLocallyCreatedObjectIds = createFrozenSelector([getLocalMutationsSlice], function (slice) {
  return slice.createdObjectIds;
});
export var getLocallyDeletedObjectIds = createFrozenSelector([getLocalMutationsSlice], function (slice) {
  return slice.deletedObjectIds;
});
export var getUpdatedObjectIdsAndDeltas = createFrozenSelector([getLocalMutationsSlice], function (slice) {
  return slice.updatedObjectIdsAndDeltas;
});
export var getFilterQueryMutations = createFrozenSelector([getLocalMutationsSlice], function (slice) {
  return slice.filterQueryMutations;
});
export var getReconciledPipelineableObjects = createFrozenSelector([getLocalMutationsSlice], function (slice) {
  return slice.reconciledPipelineableObjects;
});
export var getLocallyCreatedObjectIdsForCurrentType = createFrozenSelector([getLocallyCreatedObjectIds, getCurrentObjectTypeId], function (idMap, objectTypeId) {
  return get(objectTypeId, idMap) || [];
});
export var getLocallyDeletedObjectIdsForCurrentType = createFrozenSelector([getLocallyDeletedObjectIds, getCurrentObjectTypeId], function (idMap, objectTypeId) {
  return get(objectTypeId, idMap) || [];
});
export var getLocallyUpdatedObjectsForCurrentType = createFrozenSelector([getUpdatedObjectIdsAndDeltas, getCurrentObjectTypeId], function (updatedObjects, objectTypeId) {
  return get(objectTypeId, updatedObjects) || {};
});
export var getLocallyUpdatedFilterQueryMutationsForCurrentType = createFrozenSelector([getFilterQueryMutations, getCurrentObjectTypeId], function (filterQueryMutations, objectTypeId) {
  return get(objectTypeId, filterQueryMutations) || {};
});
export var getReconciledPipelineableObjectsForCurrentType = createFrozenSelector([getReconciledPipelineableObjects, getCurrentObjectTypeId], function (objects, objectTypeId) {
  return get(objectTypeId, objects) || {};
});
export var getReconciledPipelineableObjectIdsByStageId = createFrozenSelector([getReconciledPipelineableObjectsForCurrentType], function (objects) {
  return objectEntries(objects).reduce(function (stageToObjectIdSet, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        objectId = _ref2[0],
        toStageId = _ref2[1];

    mutableUpdateIn([toStageId], function () {
      var objectIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Set();
      objectIds.add(objectId);
      return objectIds;
    }, stageToObjectIdSet);
    return stageToObjectIdSet;
  }, {});
});