'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { CREATED_CRM_OBJECT, DELETE_CRM_OBJECTS_SUCCEEDED, UPDATE_CRM_OBJECTS_SUCCEEDED, BATCH_DELETE_CRM_OBJECTS_SUCCEEDED, BATCH_UPDATE_CRM_OBJECTS_SUCCEEDED } from '../../crmObjects/actions/crmObjectsActionTypes';
import { SYNC_ROUTER_VALUES } from '../../init/actions/initActionTypes';
import { FILTERS_CHANGED, SORT_CHANGED } from '../../views/actions/viewsActionTypes';
import { produce } from 'immer';
import { mutableSetIn } from '../../objectUtils/mutableSetIn';
import { mutableUpdateIn } from '../../objectUtils/mutableUpdateIn';
import { SET_RECONCILED_OBJECTS } from '../actions/localMutationsActionTypes';
import { objectEntries } from '../../objectUtils/objectEntries';
import { SYNC_SEARCH_TERM } from '../../search/actions/searchActionTypes';
var initialState = {
  createdObjectIds: {},
  deletedObjectIds: {},
  updatedObjectIdsAndDeltas: {},
  filterQueryMutations: {},
  // Map of objectTypeId > objectId > reconciled stageId
  reconciledPipelineableObjects: {}
};
export var localCrmObjectMutationsReducer = produce(function (draft, action) {
  switch (action.type) {
    case CREATED_CRM_OBJECT:
      {
        var _action$payload = action.payload,
            objectTypeId = _action$payload.objectTypeId,
            objectId = _action$payload.objectId;
        mutableUpdateIn(['createdObjectIds', objectTypeId], function () {
          var existingIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
          return _toConsumableArray(new window.Set([].concat(_toConsumableArray(existingIds), [objectId])));
        }, draft);
        return draft;
      }

    case BATCH_DELETE_CRM_OBJECTS_SUCCEEDED:
    case DELETE_CRM_OBJECTS_SUCCEEDED:
      {
        var _action$payload2 = action.payload,
            _objectTypeId = _action$payload2.objectTypeId,
            objectIds = _action$payload2.objectIds;
        mutableUpdateIn(['deletedObjectIds', _objectTypeId], function () {
          var existingIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
          return _toConsumableArray(new window.Set([].concat(_toConsumableArray(existingIds), _toConsumableArray(objectIds))));
        }, draft);
        return draft;
      }

    case BATCH_UPDATE_CRM_OBJECTS_SUCCEEDED:
    case UPDATE_CRM_OBJECTS_SUCCEEDED:
      {
        var _action$payload3 = action.payload,
            _objectTypeId2 = _action$payload3.objectTypeId,
            _objectIds = _action$payload3.objectIds,
            propertyValues = _action$payload3.propertyValues;

        _objectIds.forEach(function (objectId) {
          propertyValues.forEach(function (_ref) {
            var name = _ref.name,
                value = _ref.value;
            mutableSetIn(['updatedObjectIdsAndDeltas', _objectTypeId2, objectId, name], value, draft);
          });
        });

        if (action.type === BATCH_UPDATE_CRM_OBJECTS_SUCCEEDED) {
          propertyValues.forEach(function (_ref2) {
            var name = _ref2.name,
                value = _ref2.value;
            mutableSetIn(['filterQueryMutations', _objectTypeId2, 'propertyUpdates', name], value, draft);
          });
        }

        return draft;
      }

    case SET_RECONCILED_OBJECTS:
      {
        var _action$payload4 = action.payload,
            _objectTypeId3 = _action$payload4.objectTypeId,
            objectIdsToStageIds = _action$payload4.objectIdsToStageIds,
            pipelineStagePropertyName = _action$payload4.pipelineStagePropertyName;
        objectEntries(objectIdsToStageIds).forEach(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
              objectId = _ref4[0],
              toStageId = _ref4[1];

          // Otherwise, we log the reconciliation, making sure to preserve the original fromStageId
          // so that we keep track of where Apollo thinks the object is
          mutableSetIn(['reconciledPipelineableObjects', _objectTypeId3, objectId], toStageId, draft);
          mutableSetIn(['updatedObjectIdsAndDeltas', _objectTypeId3, objectId, pipelineStagePropertyName], toStageId, draft);
        });
        return draft;
      }

    case SORT_CHANGED:
    case FILTERS_CHANGED:
    case SYNC_SEARCH_TERM:
    case SYNC_ROUTER_VALUES:
      {
        draft.createdObjectIds = {};
        draft.deletedObjectIds = {};
        draft.updatedObjectIdsAndDeltas = {};
        draft.reconciledPipelineableObjects = {};
        draft.filterQueryMutations = {};
        return draft;
      }

    default:
      {
        return draft;
      }
  }
}, initialState);