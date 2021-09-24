import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _TrackingPanelLabels;

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import keyMirror from 'react-utils/keyMirror';
import * as HubLVideoParams from 'FileManagerCore/constants/HubLVideoParams';
export var PAGE_SIZE = 90;
export var Panels = keyMirror({
  BROWSE: null,
  SEARCH: null,
  STOCK_IMAGES: null,
  FOLDER: null,
  FROM_URL: null,
  FILE_DETAIL: null,
  BULK_IMPORT_FROM_URL: null
});
export var CellTypes = keyMirror({
  FILE: null,
  FOLDER: null,
  THUMBNAIL: null
});
export var IMAGE_COLUMN_COUNT = 3;
export var DEFAULT_ROWS_TO_FETCH = 15;
export var FETCH_FILES_LIMIT = IMAGE_COLUMN_COUNT * DEFAULT_ROWS_TO_FETCH;
export var FILE_FOLDER_THUMB_SIZE = 34;
export var PICKER_FOLDER_CLASSNAME = 'folder-row';
export var TrackingPanelLabels = (_TrackingPanelLabels = {}, _defineProperty(_TrackingPanelLabels, Panels.BROWSE, 'browse'), _defineProperty(_TrackingPanelLabels, Panels.SEARCH, 'search'), _defineProperty(_TrackingPanelLabels, Panels.STOCK_IMAGES, 'stock-images'), _defineProperty(_TrackingPanelLabels, Panels.FOLDER, 'browse-folders'), _defineProperty(_TrackingPanelLabels, Panels.FROM_URL, 'from-url'), _defineProperty(_TrackingPanelLabels, Panels.BULK_IMPORT_FROM_URL, 'bulk-import-from-url'), _TrackingPanelLabels);
export var PickerTypes = keyMirror({
  PANEL: null,
  SIDE_MODAL: null
});
export var DrawerTypes = keyMirror({
  IMAGE: null,
  VIDEO: null,
  HUBL_VIDEO: null,
  DOCUMENT: null,
  FILE: null
});
export var DrawerTypesToExtensions = ImmutableMap(_defineProperty({}, DrawerTypes.DOCUMENT, ImmutableSet(['csv', 'doc', 'docx', 'dot', 'dotx', 'key', 'pdf', 'pot', 'potx', 'pps', 'ppsx', 'ppt', 'pptx', 'txt', 'wpd', 'wps', 'wri', 'xls', 'xlsb', 'xlsx', 'xlt', 'xlx', 'xml'])));
export var UploadStatus = keyMirror({
  FINISHED: null,
  FAILED: null,
  PROCESSING: null,
  NOT_STARTED: null
});
export var SupportedHubLVideoParams = HubLVideoParams.SupportedHubLVideoParams;