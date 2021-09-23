'use es6';

import { Map as ImmutableMap } from 'immutable';
import * as ActionTypes from './ActionTypes';
import * as RequestType from '../enums/RequestType';
import { ObjectCategory, RequestStatus, ROOT_FOLDER_ID } from '../Constants';
import { reportError, reportMessage } from '../utils/logging';
import * as foldersApi from '../api/FolderFetch';
import * as FileSearchApi from '../api/FileSearch';
import { hasFolderRequestInitialized, hasFolderRequestSucceeded } from '../selectors/Folders';
import { FOLDER_BY_PARENT_CUTOFF, FOLDER_BY_PARENT_REQUEST_LIMIT } from '../constants/Api';
import { addLeadingSlashToPath } from '../utils/stringUtils';
import { getIsUngatedForBypassElasticSearch, getIsUngatedForPartitioning } from '../selectors/Auth';
import { buildResponsePayload } from './FileSearch';
import { buildFolderFromAttrs, buildFolderMap } from '../utils/FoldersAndFiles';
export var buildFolderPayload = function buildFolderPayload(resp, isUngatedForPatitioning) {
  return ImmutableMap(Object.assign({}, resp, {
    objects: buildFolderMap(resp.objects, isUngatedForPatitioning)
  }));
};

var buildFolderSearchResponsePayload = function buildFolderSearchResponsePayload(resp, isUngatedForPatitioning) {
  var data = buildResponsePayload(resp, ObjectCategory.FOLDER, isUngatedForPatitioning);
  return data.set('total_count', data.get('total'));
};

function fetchFoldersAttempt(_ref) {
  var initialFetch = _ref.initialFetch,
      requestType = _ref.requestType,
      requestLookupKey = _ref.requestLookupKey;
  return {
    type: ActionTypes.FETCH_FOLDERS_ATTEMPTED,
    status: RequestStatus.PENDING,
    initialFetch: initialFetch,
    requestType: requestType,
    requestLookupKey: requestLookupKey
  };
}

export function fetchFoldersSuccess(data) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$initialFetch = _ref2.initialFetch,
      initialFetch = _ref2$initialFetch === void 0 ? false : _ref2$initialFetch,
      requestType = _ref2.requestType,
      requestLookupKey = _ref2.requestLookupKey;

  return {
    type: ActionTypes.FETCH_FOLDERS_SUCCEEDED,
    status: RequestStatus.SUCCEEDED,
    data: data,
    initialFetch: initialFetch,
    requestType: requestType,
    requestLookupKey: requestLookupKey
  };
}

function searchFoldersSuccess(data, searchTerm, _ref3) {
  var _ref3$initialFetch = _ref3.initialFetch,
      initialFetch = _ref3$initialFetch === void 0 ? false : _ref3$initialFetch;
  return {
    type: ActionTypes.FETCH_FOLDERS_SUCCEEDED,
    status: RequestStatus.SUCCEEDED,
    data: data,
    initialFetch: initialFetch,
    requestType: RequestType.bySearchTerm,
    requestLookupKey: searchTerm
  };
}

function fetchFoldersFailed(_ref4) {
  var initialFetch = _ref4.initialFetch,
      _ref4$status = _ref4.status,
      status = _ref4$status === void 0 ? RequestStatus.FAILED : _ref4$status,
      requestType = _ref4.requestType,
      requestLookupKey = _ref4.requestLookupKey;
  return {
    type: ActionTypes.FETCH_FOLDERS_FAILED,
    status: status,
    initialFetch: initialFetch,
    requestType: requestType,
    requestLookupKey: requestLookupKey
  };
}

export var fetchFoldersByParentId = function fetchFoldersByParentId(parentFolderId) {
  var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref5$initialFetch = _ref5.initialFetch,
      initialFetch = _ref5$initialFetch === void 0 ? false : _ref5$initialFetch;

  return function (dispatch, getState) {
    parentFolderId = parentFolderId || ROOT_FOLDER_ID;
    var isUngatedForPatitioning = getIsUngatedForPartitioning(getState());

    if (hasFolderRequestSucceeded(getState(), RequestType.byParentId, parentFolderId)) {
      return null;
    }

    dispatch(fetchFoldersAttempt({
      initialFetch: initialFetch,
      requestType: RequestType.byParentId,
      requestLookupKey: parentFolderId
    }));
    var fetchOptions = {
      parent_folder_id: parentFolderId === ROOT_FOLDER_ID ? 'None' : parentFolderId
    };
    return foldersApi.fetchFolders(fetchOptions).then(function (subfolderData) {
      subfolderData = buildFolderPayload(subfolderData, isUngatedForPatitioning);

      if (subfolderData.get('total_count') > FOLDER_BY_PARENT_REQUEST_LIMIT) {
        if (subfolderData.get('total_count') > FOLDER_BY_PARENT_CUTOFF) {
          reportMessage('Found more folders within a parent than we will load', {
            total: subfolderData.get('total_count'),
            limit: FOLDER_BY_PARENT_CUTOFF,
            parentFolderId: parentFolderId
          });
        }

        if (initialFetch) {
          return foldersApi.fetchFolders(Object.assign({}, fetchOptions, {
            offset: FOLDER_BY_PARENT_REQUEST_LIMIT
          })).then(function (remainingFolderData) {
            var remainingFolders = buildFolderMap(remainingFolderData.objects);
            subfolderData = subfolderData.updateIn(['objects'], function (objects) {
              return objects.merge(remainingFolders);
            });
            dispatch(fetchFoldersSuccess(subfolderData, {
              requestType: RequestType.byParentId,
              requestLookupKey: parentFolderId,
              initialFetch: initialFetch
            }));
            return subfolderData;
          });
        }
      }

      dispatch(fetchFoldersSuccess(subfolderData, {
        requestType: RequestType.byParentId,
        requestLookupKey: parentFolderId,
        initialFetch: initialFetch
      }));
      return subfolderData;
    }).catch(function (err) {
      reportError(err, {
        type: ActionTypes.FETCH_FOLDERS_FAILED,
        parentFolderId: parentFolderId,
        initialFetch: initialFetch
      });
      dispatch(fetchFoldersFailed({
        requestType: RequestType.byParentId,
        requestLookupKey: parentFolderId,
        initialFetch: initialFetch
      }));
    });
  };
};
export var fetchInitialFolderByPath = function fetchInitialFolderByPath(folderPath) {
  return function (dispatch) {
    dispatch(fetchFoldersAttempt({
      initialFetch: true
    }));
    return foldersApi.fetchFolderWithBreadcrumbs(folderPath).then(function (data) {
      var objects = buildFolderMap(data);
      var resp = ImmutableMap({
        objects: objects,
        total: objects.size
      });
      var initialFolder = objects.find(function (f) {
        return f.get('full_path') === addLeadingSlashToPath(folderPath);
      });

      if (!initialFolder) {
        throw new Error('Could not find initial folder by path');
      }

      dispatch(fetchFoldersSuccess(resp, {
        initialFetch: true
      }));
      return initialFolder;
    }).catch(function (err) {
      reportError(err, {
        type: 'FETCH_FOLDER_WITH_BREADCRUMBS_BY_PATH_FAILED',
        folderPath: folderPath
      });
      dispatch(fetchFoldersFailed({
        initialFetch: true,
        status: RequestStatus.NOTFOUND
      }));
      throw err;
    });
  };
};
export var fetchInitialFolderById = function fetchInitialFolderById(folderId) {
  return function (dispatch, getState) {
    dispatch(fetchFoldersAttempt({
      initialFetch: true,
      requestType: RequestType.byParentId,
      requestLookupKey: folderId
    }));
    return foldersApi.fetchFolderWithBreadcrumbs(folderId).then(function (data) {
      var objects = buildFolderMap(data, getIsUngatedForPartitioning(getState()));
      var resp = ImmutableMap({
        objects: objects,
        total: objects.size
      });
      dispatch(fetchFoldersSuccess(resp, {
        initialFetch: true,
        requestType: RequestType.byParentId,
        requestLookupKey: folderId
      }));
    }).catch(function (err) {
      reportError(err, {
        type: 'FETCH_FOLDER_WITH_BREADCRUMBS_BY_ID',
        folderId: folderId
      });
      dispatch(fetchFoldersFailed({
        initialFetch: true,
        status: RequestStatus.NOTFOUND,
        requestType: RequestType.byParentId,
        requestLookupKey: folderId
      }));
    });
  };
};
export var fetchFolderById = function fetchFolderById(id) {
  var _ref6 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref6$withBreadcrumbs = _ref6.withBreadcrumbs,
      withBreadcrumbs = _ref6$withBreadcrumbs === void 0 ? false : _ref6$withBreadcrumbs;

  return function (dispatch) {
    if (withBreadcrumbs) {
      foldersApi.fetchFolderWithBreadcrumbs(id).then(function (data) {
        var resp = ImmutableMap({
          objects: buildFolderMap(data)
        });
        dispatch(fetchFoldersSuccess(resp, {
          requestType: RequestType.parentBreadcrumbs,
          requestLookupKey: id
        }));
      }).catch(function (err) {
        reportError(err, {
          type: 'FETCH_FOLDER_WITH_BREADCRUMBS_FAILED'
        });
      });
      return;
    }

    foldersApi.fetchSingleFolder(id).then(function (resp) {
      var data = buildFolderFromAttrs(resp);
      dispatch({
        type: ActionTypes.FETCH_FOLDER_SUCCEEDED,
        data: data
      });
    }).catch(function (err) {
      reportError(err, {
        type: 'FETCH_FOLDER_FAILED'
      });
    });
  };
};
export var searchFolders = function searchFolders(searchTerm) {
  var _ref7 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref7$initialFetch = _ref7.initialFetch,
      initialFetch = _ref7$initialFetch === void 0 ? false : _ref7$initialFetch,
      initialFolderId = _ref7.initialFolderId;

  return function (dispatch, getState) {
    var options = {
      search: searchTerm
    };

    if (initialFetch) {
      if (initialFolderId) {
        dispatch(fetchInitialFolderById(initialFolderId));
      } else {
        dispatch(fetchFoldersByParentId(ROOT_FOLDER_ID));
      }
    }

    if (!searchTerm) {
      return;
    }

    if (hasFolderRequestInitialized(getState(), RequestType.bySearchTerm, searchTerm)) {
      return;
    }

    dispatch(fetchFoldersAttempt({
      requestType: RequestType.bySearchTerm,
      requestLookupKey: searchTerm
    }));
    var isUngatedForPatitioning = getIsUngatedForPartitioning(getState());

    if (!getIsUngatedForBypassElasticSearch(getState())) {
      FileSearchApi.fetchFoldersFromSearch(options).then(function (data) {
        data = buildFolderSearchResponsePayload(data, isUngatedForPatitioning);
        dispatch(searchFoldersSuccess(data, searchTerm, {
          initialFetch: initialFetch
        }));
      });
      return;
    }

    foldersApi.fetchFolders(options).then(function (data) {
      data = buildFolderPayload(data, isUngatedForPatitioning);
      return dispatch(searchFoldersSuccess(data, searchTerm, {
        initialFetch: initialFetch
      }));
    }).catch(function (err) {
      reportError(err, {
        type: 'FETCH_FOLDERS_BY_QUERY_FAILED'
      });
    });
  };
};