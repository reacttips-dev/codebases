import { List, Map as ImmutableMap, OrderedMap, fromJS } from 'immutable';
import memoize from 'react-utils/memoize';
import I18n from 'I18n';
import { escapeRegExp, removeLeadingSlashFromPath } from './stringUtils';
import { ObjectCategory } from '../Constants';
export var getHomeFolder = memoize(function () {
  return ImmutableMap({
    name: I18n.text('FileManagerCore.rootFolder'),
    id: null,
    parent_folder_id: null,
    full_path: '',
    children: List()
  });
});

function findFoldersForParentId(foldersByParentId, parentId) {
  return foldersByParentId.get(parentId, List()).map(function (f) {
    return f.toJS();
  }).map(function (f) {
    f.children = findFoldersForParentId(foldersByParentId, String(f.id));
    return f;
  }).toArray();
}

export function makeFolderTree(folders) {
  var foldersByParentId = OrderedMap(folders.groupBy(function (f) {
    return f.get('parent_folder_id');
  }));
  var folderTree = findFoldersForParentId(foldersByParentId, null);
  var root = getHomeFolder().toJS();
  root.children = folderTree;
  return root;
}
export function isFile(object) {
  if (object.get('category')) {
    return object.get('category') === ObjectCategory.FILE;
  }

  return object.has('meta');
}
export function getFolder(id, folders) {
  if (folders instanceof OrderedMap) {
    return folders.get(id);
  }

  return folders.find(function (folder) {
    return folder.get('id') === id;
  });
}
export function getParentFolderId(object) {
  if (!object) {
    return null;
  }

  var folderId = object.get('parent_folder_id') || object.get('folder_id');
  return folderId ? parseInt(folderId, 10) : null;
}
export function getParentFolder(object, folders) {
  var parentId = getParentFolderId(object);

  if (!parentId) {
    return getHomeFolder();
  }

  return folders.find(function (folder) {
    return folder.get('id') === parentId;
  }) || getHomeFolder();
}
export function getAncestors(folder, folders) {
  var ancestors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : OrderedMap();

  if (!folder) {
    return ancestors;
  }

  ancestors = ancestors.set(folder.get('id'), folder);

  if (!folder.get('parent_folder_id')) {
    return ancestors.reverse();
  }

  var parentId = parseInt(folder.get('parent_folder_id'), 10);
  var parentFolder = getFolder(parentId, folders);

  if (!parentFolder) {
    return ancestors;
  }

  return getAncestors(parentFolder, folders, ancestors);
}
export function getAncestorsForFile(file, folders) {
  var folderId = file.get('folder_id');
  var folder = folders.get(folderId);

  if (!folder) {
    return OrderedMap();
  }

  return getAncestors(folder, folders);
}
export function getFilteredByKeyword(folders, keyword) {
  return folders.filter(function (folder) {
    var folderName = folder.get('name').toLowerCase();
    var searchQuery = keyword.toLowerCase();

    try {
      // decode percent-encoding, which is safe because folder names can't contain %
      searchQuery = window.decodeURIComponent(searchQuery);
    } catch (e) {} // eslint-disable-line no-empty


    return folderName.indexOf(searchQuery) >= 0;
  });
}
export function filterFolders(folders, path, keyword) {
  var parentFolderId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  if (keyword) {
    return getFilteredByKeyword(folders, keyword);
  } else if (!path && !parentFolderId) {
    return folders.filter(function (folder) {
      return folder.get('parent_folder_id') === null;
    });
  }

  var parentFolderFromPath = null;

  if (parentFolderId) {
    parentFolderFromPath = getFolder(parentFolderId, folders);
  } else if (path) {
    parentFolderFromPath = folders.find(function (folder) {
      return folder.get('full_path') === "/" + path || folder.get('full_path') === path;
    });
  }

  if (parentFolderFromPath) {
    return folders.filter(function (folder) {
      return parseInt(folder.get('parent_folder_id'), 10) === parentFolderFromPath.get('id');
    });
  } // [TEMPORARY FIX] if the parent folder is hidden, use the path and regex
  // which may be less reliable since it won't use the parent_folder_id


  return folders.filter(function (folder) {
    var fullPath = folder.get('full_path');
    var regex = new RegExp("\\/" + escapeRegExp(folder.get('name')) + "$");
    var basePath = fullPath.replace(regex, '');
    return basePath === "/" + path;
  });
}
export function toOrderedMap(objects) {
  return OrderedMap(objects.map(function (f) {
    return [f.get('id'), f];
  }));
}
export var buildFolderFromAttrs = function buildFolderFromAttrs(attrs) {
  return fromJS(Object.assign({}, attrs, {
    category: ObjectCategory.FOLDER
  }));
};
export var buildFolderMap = function buildFolderMap(objects) {
  return OrderedMap(objects.map(function (attrs) {
    return [attrs.id, buildFolderFromAttrs(attrs)];
  }));
};
export var getAncestorPaths = function getAncestorPaths(fullPath) {
  fullPath = removeLeadingSlashFromPath(fullPath);
  var pathParts = fullPath.split('/');
  return pathParts.map(function (part, i) {
    return "/" + pathParts.slice(0, i + 1).join('/');
  });
};
export var getLeafFolderName = function getLeafFolderName(fullPath) {
  fullPath = removeLeadingSlashFromPath(fullPath);
  var pathParts = fullPath.split('/');
  return pathParts[pathParts.length - 1];
};
var RECENT_FILE_UPLOAD_THRESHOLD_SECONDS = 10;
export var filterRecentlyUploadedFiles = function filterRecentlyUploadedFiles(singleFileDetails, uploadRequestsById, currentFolderId) {
  var threshold = I18n.moment().subtract(RECENT_FILE_UPLOAD_THRESHOLD_SECONDS, 'seconds').valueOf();
  var recentlyUploadedFileIds = uploadRequestsById.filter(function (val) {
    return val.get('timestamp') > threshold;
  }).keySeq().toList();
  var recentlyUploadedFiles = recentlyUploadedFileIds.map(function (id) {
    return singleFileDetails.get(id);
  }).filter(function (f) {
    return Boolean(f);
  }).map(function (f) {
    return f.set('clientUploadedAt', uploadRequestsById.get(f.get('id')).get('timestamp'));
  });

  if (currentFolderId) {
    if (currentFolderId === 'None') {
      currentFolderId = null;
    }

    recentlyUploadedFiles = recentlyUploadedFiles.filter(function (f) {
      return f.get('folder_id') === currentFolderId;
    });
  }

  return recentlyUploadedFiles;
};