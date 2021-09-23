'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { produce } from 'immer';
import { mutableSetIn } from '../../objectUtils/mutableSetIn';
import { objectEntries } from '../../objectUtils/objectEntries';
import { FETCH_CRM_OBJECTS_SUCCEEDED } from '../actions/crmObjectsActionTypes';
var initialState = {};
export var crmObjectsReducer = produce(function (draft, action) {
  switch (action.type) {
    case FETCH_CRM_OBJECTS_SUCCEEDED:
      {
        var _action$payload = action.payload,
            objectTypeId = _action$payload.objectTypeId,
            objects = _action$payload.objects;
        objectEntries(objects).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              objectId = _ref2[0],
              object = _ref2[1];

          return mutableSetIn([objectTypeId, objectId], object, draft);
        });
        return draft;
      }

    default:
      {
        return draft;
      }
  }
}, initialState);