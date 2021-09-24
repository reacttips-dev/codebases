'use es6';

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import ActionTypes from 'SalesTemplateEditor/constants/ActionTypes';
export var initialState = ImmutableMap({
  permissionsModified: false,
  permissionsData: null,
  error: null
});
export var defaultPermissionsData = ImmutableMap({
  private: false,
  visibleToAll: true,
  permissions: ImmutableMap({
    TEAM: ImmutableSet(),
    USER: ImmutableSet()
  })
});
export default function permissions() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  switch (action.type) {
    case ActionTypes.SET_TEMPLATE_SHARED:
      {
        var isPrivate = action.payload;
        return state.set('permissionsModified', true).update('permissionsData', function (permissionsData) {
          return permissionsData.merge({
            private: isPrivate,
            visibleToAll: !isPrivate,
            permissions: ImmutableMap({
              TEAM: ImmutableSet(),
              USER: ImmutableSet()
            })
          });
        });
      }

    case ActionTypes.FETCH_PERMISSIONS_SUCCESS:
      return state.set('permissionsData', action.payload).set('error', false);

    case ActionTypes.FETCH_PERMISSIONS_ERROR:
      return state.set('error', true);

    case ActionTypes.INIT_PERMISSIONS_FOR_NEW_TEMPLATE:
      return initialState.set('permissionsData', defaultPermissionsData).set('error', false);

    case ActionTypes.FETCH_PERMISSIONS_STARTED:
    case ActionTypes.CLEAR_EDITOR:
      return initialState;

    default:
      return state;
  }
}