'use es6';

import { List, Map as ImmutableMap, OrderedMap, fromJS } from 'immutable';
import { reportError, reportMessage } from '../utils/logging';
import { SEARCH_FILES_SUCCESS, SEARCH_FILES_FAILED, SEARCH_FILES_ATTEMPTED } from './ActionTypes';
import { RequestStatus, ObjectCategory } from '../Constants';
import pick from '../utils/pick';
import * as FileSearchApi from '../api/FileSearch';
import { trackInteraction, trackOnce } from './tracking';
import { getRecentlyUploadedFiles } from '../selectors/FileDetails';
import { parseFileExtensionFromSearch } from '../utils/parseFileExtensionFromSearch';
import { getIsUngatedForFuzzyUnicodeSearch, getIsUngatedForPartitioning } from '../selectors/Auth';
import { containsDoubleByteUnicode } from '../utils/stringUtils';
var FILE_PASSTHROUGH_ATTRS = ['id', 'name', 'size', 'extension', 'encoding', 'url', 'height', 'width', 'category', 'archived'];
var FOLDER_PASSTHROUGH_ATTRS = ['id', 'name', 'hidden', 'category'];

var transformFileItem = function transformFileItem(attrs) {
  return fromJS(Object.assign({}, pick(attrs, FILE_PASSTHROUGH_ATTRS), {
    portal_id: attrs.portalId,
    folder_id: attrs.folderId || null,
    updated: attrs.updatedAt,
    created: attrs.createdAt,
    full_path: attrs.fullPath,
    type: attrs.fileType,
    cloud_key: attrs.cloudKey,
    friendly_url: attrs.url,
    default_hosting_url: attrs.url,
    is_indexable: attrs.isIndexable,
    meta: {
      allows_anonymous_access: attrs.allowsAnonymousAccess
    }
  }));
};

var transformFolderItem = function transformFolderItem(attrs) {
  return ImmutableMap(Object.assign({}, pick(attrs, FOLDER_PASSTHROUGH_ATTRS), {
    portal_id: attrs.portalId,
    parent_folder_id: attrs.folderId ? String(attrs.folderId) : null,
    updated: attrs.updatedAt,
    created: attrs.createdAt,
    full_path: attrs.fullPath
  }));
};

var buildResultFileItems = function buildResultFileItems(objects) {
  return List(objects.map(function (obj) {
    return transformFileItem(obj);
  }));
};

var buildResultFolderItems = function buildResultFolderItems(objects) {
  return OrderedMap(objects.map(function (attrs) {
    return [attrs.id, transformFolderItem(attrs)];
  }));
};

export var buildResponsePayload = function buildResponsePayload(resp) {
  var objectCategory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ObjectCategory.FILE;
  var objects = objectCategory === ObjectCategory.FILE ? buildResultFileItems(resp.results) : buildResultFolderItems(resp.results);
  return ImmutableMap(Object.assign({}, resp, {
    objects: objects
  })).delete('results');
};

var mergeRecentlyUploadedFiles = function mergeRecentlyUploadedFiles(data, recentlyUploadedFiles, currentFolderId, options) {
  var fileIds = data.get('objects').map(function (f) {
    return f.get('id');
  });
  var missingRecentlyUploadedFiles = recentlyUploadedFiles.filter(function (f) {
    return !fileIds.includes(f.get('id'));
  }).toList();

  if (missingRecentlyUploadedFiles.isEmpty()) {
    return data;
  }

  var now = new Date().getTime();
  reportMessage("Splicing in recently uploaded files to ES response", {
    currentFolderId: currentFolderId,
    options: options,
    esFileIds: fileIds.toArray(),
    uploadedFileIds: missingRecentlyUploadedFiles.map(function (f) {
      return {
        id: f.get('id'),
        elapsed: now - f.get('clientUploadedAt')
      };
    }).toArray()
  });
  return data.merge({
    objects: data.get('objects').concat(missingRecentlyUploadedFiles),
    total: data.get('total') + missingRecentlyUploadedFiles.size
  });
};

var searchFilesAttempted = function searchFilesAttempted(query, fetchingMore) {
  return {
    type: SEARCH_FILES_ATTEMPTED,
    status: RequestStatus.PENDING,
    query: query,
    fetchingMore: fetchingMore
  };
};

var searchFilesSuccess = function searchFilesSuccess(query, data, fetchingMore) {
  return {
    type: SEARCH_FILES_SUCCESS,
    status: RequestStatus.SUCCEEDED,
    query: query,
    data: data,
    fetchingMore: fetchingMore
  };
};

var searchFilesFailed = function searchFilesFailed(query, error, fetchingMore) {
  return {
    type: SEARCH_FILES_FAILED,
    status: RequestStatus.FAILED,
    query: query,
    error: error,
    fetchingMore: fetchingMore
  };
};

export var getModifiedOptionsWithFileTypeSearch = function getModifiedOptionsWithFileTypeSearch(options) {
  var _parseFileExtensionFr = parseFileExtensionFromSearch(options.search),
      searchQuery = _parseFileExtensionFr.searchQuery,
      systemRecognizedFileExtension = _parseFileExtensionFr.systemRecognizedFileExtension;

  if (systemRecognizedFileExtension) {
    return Object.assign({}, options, {
      search: searchQuery,
      extension: systemRecognizedFileExtension
    });
  }

  return options;
};
export var searchFiles = function searchFiles() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var fetchingMore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return function (dispatch, getState) {
    var folderId = options.folder_id;
    var recentlyUploadedFiles = getRecentlyUploadedFiles(getState(), {
      folderId: folderId
    });
    var shouldMergeRecentlyUploadedFiles = !fetchingMore && !options.search && !options.archived;

    if (options.search) {
      options = getModifiedOptionsWithFileTypeSearch(options);
    }

    dispatch(searchFilesAttempted(options, fetchingMore));

    if (options.extension) {
      dispatch(trackInteraction('Manage Files', 'search-by-extension', {
        extension: options.extension
      }));
    }

    if (getIsUngatedForFuzzyUnicodeSearch(getState()) && options.search && containsDoubleByteUnicode(options.search)) {
      dispatch(trackOnce('Manage Files', 'search-with-fuzzy-unicode'));
    }

    return FileSearchApi.fetchFilesFromSearch(options, getIsUngatedForFuzzyUnicodeSearch(getState())).then(function (data) {
      data = buildResponsePayload(data, undefined, getIsUngatedForPartitioning(getState()));

      if (shouldMergeRecentlyUploadedFiles) {
        data = mergeRecentlyUploadedFiles(data, recentlyUploadedFiles, folderId, options);
      }

      dispatch(searchFilesSuccess(options, data, fetchingMore));
    }).catch(function (err) {
      reportError(err, {
        type: SEARCH_FILES_FAILED
      });
      dispatch(searchFilesFailed(options, err, fetchingMore));
    });
  };
};