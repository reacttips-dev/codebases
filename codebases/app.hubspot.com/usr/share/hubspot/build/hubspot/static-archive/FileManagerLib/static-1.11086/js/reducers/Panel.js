'use es6';

import { Map as ImmutableMap } from 'immutable';
import { Panels } from '../Constants';
import { DELETE_FILE_SUCCEEDED } from 'FileManagerCore/actions/ActionTypes';
import { SET_PANEL, SEARCH, SELECT_FILE, SELECT_STOCK_FILE, SET_PANEL_WIDTH } from '../actions/ActionTypes';
var defaultState = ImmutableMap({
  selectedFolder: null,
  selectedFile: null,
  selectedStockFile: null,
  activePanel: Panels.BROWSE,
  searchQuery: '',
  panelWidth: null
});
export default function Panel() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      selectedFolder = action.selectedFolder,
      selectedFile = action.selectedFile,
      activePanel = action.activePanel,
      searchQuery = action.searchQuery;

  switch (type) {
    case SET_PANEL:
      return state.merge({
        selectedFolder: selectedFolder || null,
        selectedFile: null,
        selectedStockFile: null,
        searchQuery: searchQuery || '',
        activePanel: activePanel
      });

    case SET_PANEL_WIDTH:
      return state.merge({
        panelWidth: action.panelWidth
      });

    case SEARCH:
      return state.merge({
        selectedFile: selectedFile,
        searchQuery: searchQuery
      });

    case SELECT_FILE:
      return state.set('selectedFile', selectedFile);

    case SELECT_STOCK_FILE:
      return state.set('selectedStockFile', selectedFile);

    case DELETE_FILE_SUCCEEDED:
      if (state.get('selectedFile') && state.getIn(['selectedFile', 'id']) === action.fileId) {
        return state.set('selectedFile', null);
      }

      return state;

    default:
      return state;
  }
}