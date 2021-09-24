'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _Immutable$fromJS;

import Immutable from 'immutable';
import { RequestStatus } from '../Constants';
import * as RequestType from '../enums/RequestType';
import { escapeRegExp } from '../utils/stringUtils';
import { ADD_FOLDER_SUCCEEDED, BULK_DELETE_ATTEMPTED, BULK_DELETE_FAILED, BULK_MOVE_ATTEMPTED, BULK_MOVE_FAILED, BULK_MOVE_SUCCEEDED, DELETE_FOLDER_SUCCEEDED, FETCH_FOLDER_SUCCEEDED, FETCH_FOLDERS_ATTEMPTED, FETCH_FOLDERS_FAILED, FETCH_FOLDERS_SUCCEEDED, MOVE_FOLDER_SUCCEEDED, RENAME_FOLDER_SUCCEEDED } from '../actions/ActionTypes';
var defaultState = Immutable.Map({
  objects: new Immutable.OrderedMap(),
  total: 0,
  status: RequestStatus.UNINITIALIZED,
  requests: Immutable.fromJS((_Immutable$fromJS = {}, _defineProperty(_Immutable$fromJS, RequestType.byParentId, {}), _defineProperty(_Immutable$fromJS, RequestType.bySearchTerm, {}), _Immutable$fromJS))
});

function getPathMatcher(folder) {
  return new RegExp("^" + escapeRegExp(folder.get('full_path')) + "\\/");
}

function findIndex(state, folderId) {
  if (state.get('objects') instanceof Immutable.OrderedMap) {
    return folderId;
  }

  return state.get('objects').findIndex(function (item) {
    return item.get('id') === folderId;
  });
}

function replaceFolder(state, folder) {
  var index = findIndex(state, folder.get('id'));
  return state.setIn(['objects', index], folder);
}

function deleteFolder(state, folder) {
  var objects = state.get('objects').delete(folder.get('id'));
  return state.merge({
    objects: objects,
    total: state.get('total') - 1
  });
}

function deleteAll(state, folders) {
  return folders.reduce(deleteFolder, state);
}

function move(state, folders, destination) {
  folders.forEach(function (folder) {
    state = state.mergeIn(['objects', folder.get('id')], {
      full_path: destination.get('full_path') + "/" + folder.get('name'),
      parent_folder_id: destination.get('id'),
      updated: Date.now()
    });
  });
  return state;
}

function handleMove(state, folders, updatedFolders) {
  var toRemove = folders.filter(function (folder) {
    return updatedFolders.findIndex(function (updatedFolder) {
      return updatedFolder.get('id') === folder.get('id');
    }) === -1;
  });
  var nextState = updatedFolders.reduce(replaceFolder, state);
  return deleteAll(nextState, toRemove);
}

function rename(state, updatedFolder) {
  var index = findIndex(state, updatedFolder.get('id'));
  var prevFolder = state.getIn(['objects', index]);
  var pathMatcher = getPathMatcher(prevFolder);
  var escapedPath = updatedFolder.get('full_path').replace(/\$/, '$$$');
  var nextFolders = state.get('objects').map(function (folder) {
    var path = folder.get('full_path');

    if (folder.get('id') === updatedFolder.get('id')) {
      return updatedFolder;
    } else if (pathMatcher.test(path)) {
      var nextPath = path.replace(pathMatcher, escapedPath + "/");
      return folder.set('full_path', nextPath);
    }

    return folder;
  });
  return state.set('objects', nextFolders);
}

function restoreOriginalFoldersOnBulkMoveFailure(state, folders) {
  if (!(folders instanceof Immutable.OrderedMap)) {
    folders = Immutable.OrderedMap(folders.map(function (f) {
      return [f.get('id'), f];
    }));
  }

  return state.merge({
    objects: state.get('objects').concat(folders),
    total: state.get('total') + folders.count()
  });
}

function updateRequestInfo(state, requestType, requestLookupKey) {
  var attrs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  attrs.timestamp = new Date().getTime();
  return state.mergeIn(['requests', requestType, requestLookupKey], attrs);
}

export default function Folders() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
      status = action.status,
      data = action.data,
      folder = action.folder,
      folders = action.folders,
      updatedFolders = action.updatedFolders,
      destination = action.destination,
      initialFetch = action.initialFetch;

  if (action.requestType && action.requestLookupKey) {
    state = updateRequestInfo(state, action.requestType, action.requestLookupKey, {
      status: status
    });
  }

  switch (type) {
    case FETCH_FOLDERS_ATTEMPTED:
      // after the initial fetch, its important NOT to set the top-level status to PENDING, as it will unmount the rows of the table due to getCombinedStatus selector behavior
      if (initialFetch) {
        return state.merge({
          status: status
        });
      }

      return state;

    case FETCH_FOLDERS_FAILED:
      // do not wipe out all the folders if a specific request fails
      if (!initialFetch) {
        return state;
      }

      return Immutable.Map({
        objects: new Immutable.OrderedMap(),
        total: 0,
        timestamp: null,
        status: status
      });

    case FETCH_FOLDERS_SUCCEEDED:
      // its possible to fetch hidden folders initially via the /info/multiple endpoint, which happens on the form submission redirect.
      // in this case we want to fetch and confirm the folder of that path exists, but not place in the reducer which would show it in dash table and allow it to be manipulated
      state = state.updateIn(['objects'], function (objects) {
        return objects.concat(data.get('objects').filter(function (f) {
          return !f.get('hidden');
        }));
      });

      if (initialFetch || state.get('status') !== RequestStatus.SUCCEEDED) {
        state = state.merge({
          status: status,
          timestamp: new Date().getTime(),
          total: data.get('total_count') || state.get('objects').size
        });
      }

      return state;

    case FETCH_FOLDER_SUCCEEDED:
      state = state.setIn(['objects', data.get('id')], data);
      return state.set('total', state.get('objects').size);

    case ADD_FOLDER_SUCCEEDED:
      {
        var objects = state.get('objects').set(folder.get('id'), folder);
        return state.merge({
          objects: objects.sortBy(function (f) {
            return f.get('name');
          }),
          total: objects.size
        });
      }

    case DELETE_FOLDER_SUCCEEDED:
      return deleteFolder(state, folder);

    case RENAME_FOLDER_SUCCEEDED:
      return rename(state, folder);

    case MOVE_FOLDER_SUCCEEDED:
      return replaceFolder(state, folder);

    case BULK_DELETE_ATTEMPTED:
      return deleteAll(state, folders);

    case BULK_MOVE_ATTEMPTED:
      return move(state, folders, destination);

    case BULK_MOVE_SUCCEEDED:
      return handleMove(state, folders, updatedFolders);

    case BULK_MOVE_FAILED:
    case BULK_DELETE_FAILED:
      return restoreOriginalFoldersOnBulkMoveFailure(state, folders);

    default:
      return state;
  }
}