'use es6';

import { Map as ImmutableMap } from 'immutable';
import ActionTypes from 'SalesTemplateEditor/constants/ActionTypes';
var initialState = ImmutableMap({
  template: null
});
export default function template() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  switch (action.type) {
    case ActionTypes.EDIT_TEMPLATE_NAME:
      return state.setIn(['template', 'name'], action.payload).setIn(['template', 'nameEdited'], true);

    case ActionTypes.SET_TEMPLATE_SHARED:
      {
        var isPrivate = action.payload;
        return state.update('template', function (_template) {
          return _template.merge({
            private: isPrivate,
            privateModified: true
          });
        });
      }

    case ActionTypes.FETCH_PERMISSIONS_SUCCESS:
      {
        // https://git.hubteam.com/HubSpot/sales-rep-engagement/issues/550
        if (state.get('template') !== null) {
          var permissionsData = action.payload;
          return state.setIn(['template', 'private'], permissionsData.get('private'));
        }

        return state;
      }

    case ActionTypes.SELECT_TEMPLATE_FOLDER:
      {
        var folderId = action.payload;

        if (folderId === 0) {
          return state.deleteIn(['template', 'folderId']);
        } else {
          return state.setIn(['template', 'folderId'], folderId);
        }
      }

    case ActionTypes.CLEAR_EDITOR:
      {
        return state.set('template', null);
      }

    case ActionTypes.OPEN_EDITOR:
      {
        return state.set('template', action.payload);
      }

    default:
      return state;
  }
}