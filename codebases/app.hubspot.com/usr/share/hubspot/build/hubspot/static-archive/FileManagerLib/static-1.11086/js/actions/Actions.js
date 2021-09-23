'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import Immutable from 'immutable';
import { TRACK_EVENT, FileTypes, ROOT_FOLDER_ID } from 'FileManagerCore/Constants';
import { FETCH_MORE_FILES_ATTEMPTED, FETCH_MORE_FILES_SUCCEEDED, FETCH_FILES_FAILED, RECALCULATE_IMAGE_DIMENSIONS_SUCCESS } from 'FileManagerCore/actions/ActionTypes';
import * as FilesApi from 'FileManagerCore/api/Files';
import { fetchSuspensionStatus } from 'FileManagerCore/actions/Suspension';
import { attemptFilesFetch, receiveFilesFetch, failFilesFetch } from 'FileManagerCore/actions/Files';
import { fetchFoldersByParentId, fetchFolderById } from 'FileManagerCore/actions/FolderFetch';
import { hasDimensions, shouldRecalculateDimensions } from 'FileManagerCore/utils/image';
import { reportError, reportMessage } from 'FileManagerCore/utils/logging';
import { experimentalTrackSearchType } from 'FileManagerCore/utils/experimentalTrackSearchType';
import * as trackingActions from 'FileManagerCore/actions/tracking';
import { searchFiles } from 'FileManagerCore/actions/FileSearch';
import { fetchSingleFileIfNeeded } from 'FileManagerCore/actions/FileDetails';
import { getType, getIsTemporaryUploadingFile } from 'FileManagerCore/utils/file';
import { getUser, getHasFileManagerWriteScope, getHasVideoIntegrationScope, getIsUngatedForPickerFireAlarm } from 'FileManagerCore/selectors/Auth';
import { getIsSearching } from 'FileManagerCore/selectors/Files';
import { getFoldersById } from 'FileManagerCore/selectors/Folders';
import { hasFetchedPortalMeta } from 'FileManagerCore/selectors/PortalMeta';
import { fetchFileManagerPortalData } from 'FileManagerCore/actions/PortalMeta';
import { fetchLimits } from 'FileManagerCore/actions/Limits';
import { getIsFilePrivate } from 'FileManagerCore/utils/fileAccessibility';
import { getHomeFolder } from 'FileManagerCore/utils/FoldersAndFiles';
import { SET_PANEL, SEARCH, SELECT_FILE, BACK, CLEAR_HISTORY, SET_PANEL_WIDTH } from './ActionTypes';
import { TrackingPanelLabels, DrawerTypes, Panels } from '../Constants';
import { deselectStockFile } from './Shutterstock';
import { getHostApp, getUploadedFileAccess, getUseEsFileSearch } from '../selectors/Configuration';
import { getActivePanel, getPreviousPanel, getSelectedFileId, getSelectedFolderInPanel, getSelectedStockFile } from '../selectors/Panel';
import { getImageOptimizationSetting } from '../selectors/ImageOptimizationSettings';
import * as ImageOptimizationSettings from '../enums/ImageOptimizationSettings';
import getIsFileOptimizableImage from '../utils/getIsFileOptimizableImage';
import getOptimizedImage from '../utils/getOptimizedImage';
import overrideFileUrls from '../utils/overrideFileUrls';
import { validateFileAccess } from '../picker/internal/utils';
import { fetchFireAlarm } from './FireAlarm';
import { getShouldFetchFireAlarm } from '../selectors/FireAlarm'; // todo - move all the references to this core action

export var trackInteraction = trackingActions.trackInteraction;
var DEFAULT_QUERY = Immutable.Map({
  order_by: '-updated'
});

function getFilesQuery() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var query = DEFAULT_QUERY.merge(options);

  switch (query.get('type')) {
    case DrawerTypes.IMAGE:
      return query.set('type', FileTypes.IMG);

    case DrawerTypes.VIDEO:
    case DrawerTypes.HUBL_VIDEO:
      return query.set('type', FileTypes.MOVIE);

    case DrawerTypes.DOCUMENT:
      return query.set('type', FileTypes.DOCUMENT);

    case DrawerTypes.FILE:
    default:
      return query.delete('type');
  }
}

export function getFetchFunction(drawerType) {
  if (drawerType === DrawerTypes.HUBL_VIDEO) {
    return FilesApi.fetchIntegratedVideos;
  }

  return FilesApi.fetchFiles;
}
export function fetchInitialFiles() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var drawerType = arguments.length > 1 ? arguments[1] : undefined;
  return function (dispatch, getState) {
    var query = getFilesQuery(options);
    query = query.set('hostApp', getHostApp(getState()));

    if (getUseEsFileSearch(getState()) && drawerType !== DrawerTypes.HUBL_VIDEO) {
      dispatch(searchFiles(query.toJS()));
      return;
    }

    var fetchFunction = getFetchFunction(drawerType);
    dispatch(attemptFilesFetch(query));
    fetchFunction(query).then(function (data) {
      dispatch(receiveFilesFetch(query, data));
    }, function (error) {
      reportError(error, {
        action: FETCH_FILES_FAILED
      });
      dispatch(failFilesFetch(query, error));
    }).done();
  };
}
export function fetchMoreFiles() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var drawerType = arguments.length > 1 ? arguments[1] : undefined;
  return function (dispatch, getState) {
    var fetchFunction = getFetchFunction(drawerType);
    var query = getFilesQuery(options);
    query = query.set('hostApp', getHostApp(getState()));

    if (getUseEsFileSearch(getState()) && drawerType !== DrawerTypes.HUBL_VIDEO) {
      dispatch(searchFiles(query.toJS(), true));
      return;
    }

    dispatch({
      type: FETCH_MORE_FILES_ATTEMPTED,
      query: query
    });
    fetchFunction(query).then(function (data) {
      dispatch({
        type: FETCH_MORE_FILES_SUCCEEDED,
        query: query,
        data: data
      });
    }).done();
  };
}
export function setPanel(_ref) {
  var activePanel = _ref.activePanel,
      selectedFolder = _ref.selectedFolder,
      searchQuery = _ref.searchQuery;
  return {
    type: SET_PANEL,
    activePanel: activePanel,
    selectedFolder: selectedFolder,
    searchQuery: searchQuery,
    meta: _defineProperty({}, TRACK_EVENT, {
      name: 'Explore Files',
      eventKey: 'fileManagerSetPanelExploreFiles',
      action: 'set-panel',
      meta: {
        panel: TrackingPanelLabels[activePanel]
      }
    })
  };
}
export var browseToFolder = function browseToFolder(folderId) {
  return function (dispatch, getState) {
    if (folderId && getIsSearching(getState())) {
      dispatch(fetchFolderById(folderId, {
        withBreadcrumbs: true
      }));
    }

    var folder = getFoldersById(getState()).get(folderId) || getHomeFolder();
    dispatch(setPanel({
      activePanel: Panels.FOLDER,
      selectedFolder: folder
    }));
  };
};
export function enterSearchPanel(searchQuery) {
  return {
    type: SET_PANEL,
    activePanel: Panels.SEARCH,
    selectedFolder: null,
    meta: _defineProperty({}, TRACK_EVENT, {
      name: 'Explore Files',
      eventKey: 'fileManagerExploreFiles',
      action: 'started-search'
    }),
    searchQuery: searchQuery
  };
}
export function goBack() {
  return {
    type: BACK,
    meta: _defineProperty({}, TRACK_EVENT, {
      name: 'Explore Files',
      eventKey: 'fileManagerExploreFiles',
      action: 'back'
    })
  };
}
export function setSearchQuery(searchQuery) {
  return {
    type: SEARCH,
    searchQuery: searchQuery
  };
}

function getSelectFileAction(selectedFile, meta) {
  return {
    type: SELECT_FILE,
    meta: _defineProperty({}, TRACK_EVENT, {
      name: 'Explore Files',
      eventKey: 'fileManagerExploreFiles',
      action: 'select-file',
      fileType: getType(selectedFile.get('extension')),
      meta: Object.assign({}, meta, {
        fileType: getType(selectedFile.get('extension'))
      })
    }),
    selectedFile: selectedFile
  };
}

export var recalculateImageDimensionsIfNeeded = function recalculateImageDimensionsIfNeeded(file) {
  return function (dispatch) {
    if (!shouldRecalculateDimensions(file)) {
      return Promise.resolve(file);
    }

    var fileId = file.get('id');
    return FilesApi.recalculateImageDimensions(fileId).then(function (fileResp) {
      dispatch({
        type: RECALCULATE_IMAGE_DIMENSIONS_SUCCESS,
        file: fileResp
      });

      if (!hasDimensions(fileResp)) {
        reportMessage('Image still missing dimensions after recalculating', {
          fileId: fileId,
          type: 'RECALCULATE_IMAGE_DIMENSIONS'
        });
      }

      return fileResp;
    }).catch(function (err) {
      reportError(err, {
        type: 'RECALCULATE_IMAGE_DIMENSIONS'
      });
      return file;
    });
  };
};
export var selectFile = function selectFile(selectedFile) {
  var meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (dispatch) {
    dispatch(fetchSingleFileIfNeeded(selectedFile.get('id'))).then(function (singleFile) {
      return dispatch(recalculateImageDimensionsIfNeeded(singleFile));
    }).done();
    dispatch(getSelectFileAction(selectedFile, meta));
  };
};

var optimizeFileAndCallOnSelect = function optimizeFileAndCallOnSelect(file, onSelectCallback) {
  return function (dispatch, getState) {
    var imageOptimizationSetting = getImageOptimizationSetting(getState());

    if (imageOptimizationSetting !== ImageOptimizationSettings.MEDIUM && getIsFileOptimizableImage(file)) {
      onSelectCallback(getOptimizedImage(file, imageOptimizationSetting));
    } else {
      onSelectCallback(file);
    }
  };
};

var handleDispatchCallback = function handleDispatchCallback(file, onSelectCallback) {
  return function (dispatch) {
    var isFilePrivate = getIsFilePrivate(file);

    if (isFilePrivate) {
      file = overrideFileUrls(file, FilesApi.getSignedUrlRedirectViewUrl(file.get('id')));
      onSelectCallback(file);
    } else {
      dispatch(optimizeFileAndCallOnSelect(file, onSelectCallback));
    }
  };
};

export var handleInsertFile = function handleInsertFile(file, onSelectCallback) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      type = _ref2.type,
      target = _ref2.target;

  return function (dispatch, getState) {
    if (getIsTemporaryUploadingFile(file)) {
      onSelectCallback(file);
    } else {
      dispatch(fetchSingleFileIfNeeded(file.get('id'))).then(function (singleFile) {
        return dispatch(recalculateImageDimensionsIfNeeded(singleFile));
      }).then(function (singleFile) {
        experimentalTrackSearchType(getState(), singleFile, dispatch);
        dispatch(handleDispatchCallback(singleFile, onSelectCallback));
      }).done();
    }

    var trackingAttrs = {
      target: target,
      drawerType: type,
      withPanelNavigator: true
    };

    if (type === DrawerTypes.HUBL_VIDEO) {
      dispatch(trackInteraction('Manage Files', 'insert-hubl-video', trackingAttrs));
    } else {
      dispatch(trackInteraction('Manage Files', 'insert', trackingAttrs));
    }
  };
};
export function deselectFile() {
  var meta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    type: SELECT_FILE,
    meta: _defineProperty({}, TRACK_EVENT, {
      name: 'Explore Files',
      eventKey: 'fileManagerExploreFiles',
      action: 'deselect-file',
      meta: meta
    }),
    selectedFile: null
  };
}

var clearHistory = function clearHistory() {
  return {
    type: CLEAR_HISTORY
  };
};

export var returnToPrevious = function returnToPrevious() {
  return function (dispatch, getState) {
    var previousPanel = getPreviousPanel(getState());
    var selectedFileId = getSelectedFileId(getState());
    var selectedStockFile = getSelectedStockFile(getState());
    var selectedFolder = getSelectedFolderInPanel(getState());
    var isBrowsingHomeFolder = Boolean(selectedFolder && !selectedFolder.get('id'));

    if (selectedFileId) {
      dispatch(deselectFile({
        target: 'panel-navigator-previous'
      }));
    } else if (selectedStockFile) {
      dispatch(deselectStockFile());
    } else if (isBrowsingHomeFolder && previousPanel.get('activePanel') !== Panels.BROWSE) {
      dispatch(clearHistory());
    } else if (previousPanel) {
      dispatch(goBack());
    } else {
      dispatch(clearHistory());
    }
  };
};
var PANELS_TO_UNSET_ON_MOUNT = [Panels.FROM_URL, Panels.BULK_IMPORT_FROM_URL];
export var libComponentDidMount = function libComponentDidMount() {
  return function (dispatch, getState) {
    if (getUser(getState()) && !getHasFileManagerWriteScope(getState())) {
      dispatch(fetchSuspensionStatus());
    }

    if (PANELS_TO_UNSET_ON_MOUNT.includes(getActivePanel(getState()))) {
      dispatch(clearHistory());
    }
  };
};
export var maybeFetchFolders = function maybeFetchFolders() {
  return function (dispatch) {
    dispatch(fetchFoldersByParentId(ROOT_FOLDER_ID, {
      initialFetch: true
    }));
  };
};
export var maybeFetchFoldersByParentId = function maybeFetchFoldersByParentId(parentFolderId) {
  return function (dispatch) {
    dispatch(fetchFoldersByParentId(parentFolderId));
  };
};
export var filePickerDidMount = function filePickerDidMount(type) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      pickerType = _ref3.pickerType,
      panelWidth = _ref3.panelWidth;

  return function (dispatch, getState) {
    var state = getState();
    validateFileAccess(type, getUploadedFileAccess(getState()));

    if (!hasFetchedPortalMeta(state)) {
      dispatch(fetchFileManagerPortalData());
    }

    if (type === DrawerTypes.HUBL_VIDEO && getHasVideoIntegrationScope(state)) {
      dispatch(fetchLimits());
    }

    if (getIsUngatedForPickerFireAlarm(state) && getShouldFetchFireAlarm(state)) {
      dispatch(fetchFireAlarm());
    }

    if (panelWidth) {
      dispatch({
        type: SET_PANEL_WIDTH,
        panelWidth: panelWidth
      });
    }

    dispatch(trackInteraction('fileManagerLib', 'mount', {
      componentName: 'FilePickerPanel',
      drawerType: type,
      withPanelNavigator: true,
      pickerType: pickerType
    }));
  };
};