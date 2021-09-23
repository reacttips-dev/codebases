'use es6';

import { createSelector } from 'reselect';
import Immutable from 'immutable';
import { RequestStatus } from '../Constants';
import { partition } from '../utils/partition';
import { getHomeFolder } from '../utils/FoldersAndFiles';
import { getFolders } from './Folders';
import { ShutterstockFolderPath } from '../Constants';
import { getShutterstockFolderId } from './UserSettings';
var SIZE = 200;
var BANNER_HEIGHT = 20;

var partitionImages = function partitionImages(images, viewWidth) {
  if (!viewWidth) {
    return new Immutable.List();
  }

  var imagesWithScaling = images.map(function (image) {
    var width = image.get('smallPreviewWidth');
    var height = image.get('smallPreviewHeight');
    var aspectRatio = image.get('smallPreviewWidth') / image.get('smallPreviewHeight');
    var scale = Math.min(1, SIZE / height);
    var bannerOffset = scale * BANNER_HEIGHT;
    return image.merge({
      scaledWidth: width * scale,
      scaledHeight: height * scale,
      aspectRatio: aspectRatio,
      bannerOffset: bannerOffset
    });
  });
  var aspectRatios = imagesWithScaling.map(function (image) {
    return image.get('aspectRatio');
  }).toArray();
  var totalWidth = imagesWithScaling.reduce(function (acc, image) {
    return acc + image.get('scaledWidth');
  }, 0);
  var numRows = Math.ceil(totalWidth / viewWidth);

  if (numRows === 1) {
    return new Immutable.List().push(imagesWithScaling);
  }

  var rows = partition(aspectRatios, numRows);
  var result = new Immutable.List();
  rows.forEach(function (row) {
    var nextRow = new Immutable.List();
    row.forEach(function (aspectRatio) {
      var index = imagesWithScaling.findIndex(function (image) {
        return image.get('aspectRatio') === aspectRatio;
      });
      var image = imagesWithScaling.get(index);
      imagesWithScaling = imagesWithScaling.delete(index);
      nextRow = nextRow.push(image);
    });
    result = result.push(nextRow);
  });
  return result;
};

export var getResults = function getResults(state) {
  return state.shutterstock.get('results');
};
export var getResultsCount = function getResultsCount(state) {
  return getResults(state).count();
};
export var getTotal = function getTotal(state) {
  return state.shutterstock.get('total');
};
export var getSearchStatus = function getSearchStatus(state) {
  return state.shutterstock.get('searchStatus');
};
export var getAcquireStatus = function getAcquireStatus(state) {
  return state.shutterstock.get('acquireStatus');
};
export var isAcquirePending = createSelector([getAcquireStatus], function (acquireStatus) {
  return acquireStatus === RequestStatus.PENDING;
});

var getWidth = function getWidth(state, props) {
  return props.width;
};

var findShutterstockFolder = function findShutterstockFolder(folders, shutterstockFolderId) {
  var shutterstockFolder;

  if (shutterstockFolderId) {
    shutterstockFolder = folders.find(function (folder) {
      return folder.get('id') === shutterstockFolderId;
    });
  } else if (shutterstockFolderId === null) {
    shutterstockFolder = getHomeFolder();
  }

  if (!shutterstockFolder) {
    shutterstockFolder = folders.find(function (folder) {
      return folder.get('full_path') === ShutterstockFolderPath;
    });
  }

  return shutterstockFolder;
};

export var getImageRows = createSelector([getResults, getWidth], partitionImages);
export var getShutterstockFolder = createSelector([getFolders, getShutterstockFolderId], findShutterstockFolder);