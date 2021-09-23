'use es6';

import Immutable from 'immutable';
import { createSelector } from 'reselect';
import scrollbarSize from 'FileManagerCore/utils/scrollbarSize';
import { getUploadingFilesWithSupportInfo, getFilesWithSupportInfo } from './Files';
import * as shutterstockSelectors from 'FileManagerCore/selectors/Shutterstock';
import { CellTypes, Panels, DrawerTypes } from '../Constants';
import { getChildFolders, getFilteredFolders } from './Folders';
var GUTTER = 10;
var FOLDER_HEIGHT = 54;
var PANEL_PADDING = 80;
var FILE_HEIGHT = FOLDER_HEIGHT;
var FOLDER_LIST_BOTTOM_MARGIN = 24;
var PANEL_NAVIGATOR_THUMB_ASPECT_RATIO = 4 / 3;

var getType = function getType(state, props) {
  return props.type;
};

var getPanel = function getPanel(state) {
  return state.panel;
};

export var getDefaultPanelWidth = function getDefaultPanelWidth() {
  return 462 + scrollbarSize();
};

var getPanelInnerWidth = function getPanelInnerWidth(panel) {
  return (panel.getIn(['present', 'panelWidth']) || getDefaultPanelWidth()) - PANEL_PADDING;
};

var getColumnWidth = function getColumnWidth(panel) {
  return Math.floor((getPanelInnerWidth(panel) - GUTTER * 2) / 3);
};

var isFileDrawerType = function isFileDrawerType(drawerType) {
  return drawerType === DrawerTypes.FILE || drawerType === DrawerTypes.DOCUMENT;
};

function getThumbnailCell(panel, column, nextOffsets, file) {
  var x = column * (getColumnWidth(panel) + GUTTER);
  var y = nextOffsets.get(column);
  var width = getColumnWidth(panel);
  var height = width / PANEL_NAVIGATOR_THUMB_ASPECT_RATIO;
  return {
    cell: Immutable.Map({
      type: CellTypes.THUMBNAIL,
      image: file,
      x: x,
      y: y,
      width: width,
      height: height
    }),
    nextOffset: y + height + GUTTER
  };
}

function getFileRow(_ref) {
  var nextOffsets = _ref.nextOffsets,
      file = _ref.file,
      isLast = _ref.isLast,
      panel = _ref.panel;
  var y = nextOffsets.get(0);
  var height = FILE_HEIGHT;
  return {
    cell: Immutable.Map({
      type: CellTypes.FILE,
      file: file,
      x: 0,
      y: y,
      width: getPanelInnerWidth(panel),
      height: height,
      isLast: isLast
    }),
    nextOffset: y + FILE_HEIGHT
  };
}

function layoutStockTiles(type, stockImages, panel) {
  var nextOffsets = new Immutable.OrderedMap([[0, 0], [1, 0], [2, 0]]);
  var cells = [];

  var getColumn = function getColumn() {
    var min = nextOffsets.min();
    return nextOffsets.findKey(function (val) {
      return val === min;
    });
  };

  stockImages.forEach(function (image, index) {
    var column = getColumn();

    if (isFileDrawerType(type)) {
      var _getFileRow = getFileRow({
        column: column,
        nextOffsets: nextOffsets,
        image: image,
        isLast: index === stockImages.count() - 1,
        panel: panel
      }),
          cell = _getFileRow.cell,
          nextOffset = _getFileRow.nextOffset;

      cells.push(cell);
      nextOffsets = nextOffsets.merge([[0, nextOffset], [1, nextOffset], [2, nextOffset]]);
    } else {
      var _getThumbnailCell = getThumbnailCell(panel, column, nextOffsets, image),
          _cell = _getThumbnailCell.cell,
          _nextOffset = _getThumbnailCell.nextOffset;

      cells.push(_cell);
      nextOffsets = nextOffsets.set(column, _nextOffset);
    }
  });
  return new Immutable.List(cells);
}

function layoutTiles(type, files, folders, panel) {
  var uploadingFiles = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : new Immutable.List();
  var nextOffsets = new Immutable.OrderedMap([[0, 0], [1, 0], [2, 0]]);
  var cells = [];

  var getColumn = function getColumn() {
    var min = nextOffsets.min();
    return nextOffsets.findKey(function (val) {
      return val === min;
    });
  };

  var activePanel = panel.getIn(['present', 'activePanel']);
  var actualFolders = activePanel === Panels.BROWSE ? new Immutable.List() : folders;
  var allFiles = uploadingFiles.concat(files);
  actualFolders.forEach(function (folder, index) {
    var y = nextOffsets.get(0);
    var height = FOLDER_HEIGHT;
    var isLast = index === actualFolders.count() - 1;
    var nextOffset = y + FOLDER_HEIGHT;

    if (!isFileDrawerType(type) && isLast) {
      nextOffset = nextOffset + FOLDER_LIST_BOTTOM_MARGIN;
    }

    cells.push(Immutable.Map({
      type: CellTypes.FOLDER,
      x: 0,
      y: y,
      width: getPanelInnerWidth(panel),
      isLast: !isFileDrawerType(type) || allFiles.count() === 0 ? isLast : false,
      height: height,
      folder: folder
    }));
    nextOffsets = nextOffsets.merge([[0, nextOffset], [1, nextOffset], [2, nextOffset]]);
  });
  allFiles.forEach(function (file, index) {
    var column = getColumn();

    if (isFileDrawerType(type)) {
      var _getFileRow2 = getFileRow({
        column: column,
        nextOffsets: nextOffsets,
        file: file,
        isLast: index === allFiles.count() - 1,
        panel: panel
      }),
          cell = _getFileRow2.cell,
          nextOffset = _getFileRow2.nextOffset;

      cells.push(cell);
      nextOffsets = nextOffsets.merge([[0, nextOffset], [1, nextOffset], [2, nextOffset]]);
    } else {
      var _getThumbnailCell2 = getThumbnailCell(panel, column, nextOffsets, file),
          _cell2 = _getThumbnailCell2.cell,
          _nextOffset2 = _getThumbnailCell2.nextOffset;

      cells.push(_cell2);
      nextOffsets = nextOffsets.set(column, _nextOffset2);
    }
  });
  return new Immutable.List(cells);
}

export var getTiles = createSelector([getType, getFilesWithSupportInfo, getChildFolders, getPanel, getUploadingFilesWithSupportInfo], layoutTiles);
export var getSearchTiles = createSelector([getType, getFilesWithSupportInfo, getFilteredFolders, getPanel, getUploadingFilesWithSupportInfo], layoutTiles);

var getEmptyList = function getEmptyList() {
  return Immutable.List();
};

export var getStockTiles = createSelector([getType, shutterstockSelectors.getResults, getPanel, getEmptyList], layoutStockTiles);