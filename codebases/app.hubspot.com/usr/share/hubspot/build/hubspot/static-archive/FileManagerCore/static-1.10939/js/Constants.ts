import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _Immutable$Map;

import keyMirror from 'react-utils/keyMirror';
import Immutable from 'immutable';
export var MINIMUM_FETCH_FILES_LIMIT = 40;
export var SEARCH_QUERY_WARN_LENGTH = 45;
export var MAX_SEARCH_QUERY_LENGTH = 50;
export var TRACK_EVENT = '@@usage';
export var NOTIFICATION_EVENT = 'notification';
export var VIDEO_EXPERIMENTS_GATE = 'video-experiments';
export var CANVA_GATE = 'FileManager:Canva';
export var BYPASS_ELASTIC_SEARCH_GATE = 'FileManagerUI:BypassElasticSearch';
export var FREE_FILE_HOSTING_DOMAIN_GATE = 'free-file-hosting-domain';
export var SHUTTERSTOCK_MAINTENANCE_GATE = 'FileManagerUI:ShutterstockMaintenance';
export var FUZZY_UNICODE_SEARCH_GATE = 'FileManagerUI:FuzzyUnicodeSearch';
export var FILE_HISTORY_GATE = 'FileManagerUI:FileHistory';
export var PICKER_FIREALARM_GATE = 'FileManagerUI:PickerFireAlarm';
export var SEARCHABLE_MOVE_MODAL_GATE = 'FileManagerUI:SearchableMoveModal';
export var RECYCLE_BIN_GATE = 'restore-files-ui:app';
export var PARTITIONING_GATE = 'FileManager:EnablePartitioning';
export var VIDEO_MIGRATION_ALERT_GATE = 'DAM:VideoMigrationOptInAlert';
export var SUPPRESS_SVG_DIMENSIONS_GATE_NAME = 'FileManagerUI:SuppressSvgDimensions';
export var NEW_DETAILS_PANEL_GATE = 'FileManagerUI:NewDetailsPanel';
export var HUBSPOT_VIDEO_2_GATE = 'DAM:HubspotVideo2';
export var CANVA_INTEGRATION_SCOPE = 'canva-integration';
export var MARKETING_VIDEO_SCOPE = 'marketing-video';
export var FILE_MANAGER_ACCESS = 'file-manager-access';
export var PARTITIONING_SCOPE = 'content-team-assignment';
export var FILE_MANAGER_WRITE_SCOPE = 'file-manager-write';
export var FILE_HOSTING_PAID_DOMAINS_SCOPE = 'file-hosting-paid-domains-access';
export var RequestStatus;

(function (RequestStatus) {
  RequestStatus["UNINITIALIZED"] = "UNINITIALIZED";
  RequestStatus["PENDING"] = "PENDING";
  RequestStatus["SUCCEEDED"] = "SUCCEEDED";
  RequestStatus["FAILED"] = "FAILED";
  RequestStatus["NOTFOUND"] = "NOTFOUND";
})(RequestStatus || (RequestStatus = {}));

export var COMPLETED_REQUEST_STATUSES = [RequestStatus.SUCCEEDED, RequestStatus.FAILED, RequestStatus.NOTFOUND];
export var UrlSchemes = keyMirror({
  SIMPLIFIED: null,
  LEGACY: null
});
export var FileTypes;

(function (FileTypes) {
  FileTypes["IMG"] = "IMG";
  FileTypes["MOVIE"] = "MOVIE";
  FileTypes["DOCUMENT"] = "DOCUMENT";
  FileTypes["AUDIO"] = "AUDIO";
  FileTypes["OTHER"] = "OTHER";
})(FileTypes || (FileTypes = {}));

export var ObjectCategory;

(function (ObjectCategory) {
  ObjectCategory["FILE"] = "FILE";
  ObjectCategory["FOLDER"] = "FOLDER";
})(ObjectCategory || (ObjectCategory = {}));

export var TypeToExtensions = Immutable.Map((_Immutable$Map = {}, _defineProperty(_Immutable$Map, FileTypes.IMG, Immutable.Set(['jpg', 'jpeg', 'png', 'gif', 'tif', 'tiff', 'ico', 'bmp', 'webp', 'svg'])), _defineProperty(_Immutable$Map, FileTypes.MOVIE, Immutable.Set(['mov', 'avi', 'flv', 'wmv', 'rm', '3gp', '3g2', 'asf', 'asx', 'mpg', 'mp4', 'mpeg', 'swf', 'm4v', 'webm'])), _defineProperty(_Immutable$Map, FileTypes.DOCUMENT, Immutable.Set(['csv', 'doc', 'docx', 'dot', 'dotx', 'key', 'pdf', 'pot', 'potx', 'pps', 'ppsx', 'ppt', 'pptx', 'txt', 'wpd', 'wps', 'wri', 'xls', 'xlsb', 'xlsx', 'xlt', 'xlx', 'xml'])), _defineProperty(_Immutable$Map, FileTypes.AUDIO, Immutable.Set(['aif', 'm4a', 'mp3', 'mpa', 'ra', 'wav', 'wma'])), _Immutable$Map));
export var SystemRecognizedFileExtensionList = TypeToExtensions.flatten().toList();
export var ContentCategories = Immutable.Map({
  UNMAPPED: 0,
  LANDING_PAGE: 1,
  EMAIL: 2,
  BLOG_POST: 3,
  SITE_PAGE: 4,
  LEGACY_PAGE: 5,
  KNOWLEDGE_ARTICLE: 6
});
export var ROOT_FOLDER_ID = 'root';
export var VidyardTosStatus;

(function (VidyardTosStatus) {
  VidyardTosStatus["ACCEPTED"] = "ACCEPTED";
  VidyardTosStatus["HIDDEN"] = "HIDDEN";
  VidyardTosStatus["NOT_ASKED"] = "NOT_ASKED";
  VidyardTosStatus["DISABLED"] = "DISABLED";
  VidyardTosStatus["UNSYNCED"] = "UNSYNCED";
})(VidyardTosStatus || (VidyardTosStatus = {}));

export var ImportImageCopyrightNoticeValues = {
  ACCEPTED: 'ACCEPTED'
};
export var ShutterstockTosValues = {
  ACCEPTED: 'ACCEPTED'
};
export var DiscoverabilityPopupDismissed = 'DISMISSED';
export var UserInferredRoles = Immutable.Map({
  HEAVY_MARKETER: 'heavyMarketers',
  CRM_AND_SALES: 'crmAndSales',
  CRM: 'crmUsers'
});
export var MAX_IMG_SIZE_FOR_THUMBNAIL = 999999;
export var VideoProviders = keyMirror({
  VIDYARD: null,
  HUBSPOT_VIDEO_2: null
});
export var Limits;

(function (Limits) {
  Limits["EMBEDDABLE_VIDEO"] = "EMBEDDABLE_VIDEO";
})(Limits || (Limits = {}));

export var IMG_WIDTH_IN_DETAIL_PANEL = 430;
export var PATH_TO_VIDEO_HOSTING_INFO = ['meta', 'video_data', 'hosting_infos'];
export var THUMBNAILS_FOLDER_NAME = 'custom-video-thumbnails';
export var ImageEditorLocations = keyMirror({
  DRAWER: null,
  EDITOR_MODAL: null
});
export var FILE_DETAILS_QUERY_PARAM_NAME = 'showDetails';
export var TRY_VIDEO_PATH = 'tryVideo';
export var HUSBPOT_VIDEO_PATH = 'hubspot-video';
export var ShutterstockFolderName = 'Stock images';
export var ShutterstockFolderPath = "/" + ShutterstockFolderName;
export var CanvaFolderName = 'Canva images';
export var CanvaFolderPath = "/" + CanvaFolderName;
export var IMPORTED_IMAGE_FOLDER_NAME = 'Imported images';
export var IMPORTED_IMAGE_FOLDER_PATH = "/" + IMPORTED_IMAGE_FOLDER_NAME;
export var PathToFileAccessibility = ['meta', 'allows_anonymous_access'];
export var PICKER_CHANGE_VISIBILITY_SOURCE = 'picker-change-visibility';
export var MODAL_WIDTH = 600;
export var VIDEO_MIGRATION_DUE_DATE = Date.parse('11/1/2021');
export var VIDEO_MIGRATION_REMINDER_DATE = Date.parse('10/15/2021');
export var VIYDARD_UPGRADE_LINK = 'https://www.vidyard.com/hubspot-video-upgrade';
export var USE_HS_WITH_VY_LINK = 'https://knowledge.vidyard.com/hc/en-us/articles/360009997013-How-to-add-videos-to-your-HubSpot-landing-pages-website-and-blog';
export var LEARN_ABOUT_HS_VIDEO_LINK = 'https://knowledge.hubspot.com/website-pages/add-videos-to-your-hubspot-content';