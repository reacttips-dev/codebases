/**
 * Constants for Lecture Authoring
 */

const LectureActions = {
  LOAD: 'load',
  UPDATE_NAME: 'updateName',

  RECEIVE_ACTIVE_TAB: 'receiveActiveTab',

  UPLOAD_START: 'uploadStart',
  UPLOAD_STARTED: 'uploadStarted',
  UPLOAD_COMPLETED: 'uploadCompleted',
  UPLOAD_ERROR: 'uploadError',

  RECEIVE_COURSE: 'receiveCourse',

  RECEIVE_LECTURE: 'receiveLecture',
  RECEIVE_LECTURE_DRAFT_METADATA: 'receiveLectureDraftMetadata',
  RECEIVE_WRITE_ACCESS_TOKEN: 'receiveWriteAccessToken',
  RECEIVE_LECTURE_ASSETS: 'receiveLectureAssets',
  VIDEO_IS_ON_DEMAND: 'videoIsOnDemand',
  ADD_ASSET: 'addLectureAsset',
  DELETE_ASSET: 'deleteLectureAsset',

  PUBLISH: 'publish',
  REVERT: 'revert',

  PUBLISHED: 'published',
  REVERTED: 'reverted',

  UPLOAD_SUBTITLE_START: 'uploadSubtitleStart',
  UPLOAD_SUBTITLE_COMPLETED: 'uploadSubtitleCompleted',
  UPLOAD_SUBTITLE_ERROR: 'uploadSubtitleError',

  SELECT_LANGUAGE_CODE: 'selectLanguageCode',

  ERROR: 'error',
  PUBLISH_ERROR: 'publishError',
  LOAD_ERROR: 'loadError',
  CONFLICT: 'conflict',
  PUBLISH_CONFLICT: 'publishConflict',

  UNLOAD: 'unload',

  RELOAD_CUEPOINTS: 'reloadCuepoints',
  OPEN_VIDEO_ASSET_MODAL: 'openVideoAssetModal',
  CLOSE_VIDEO_ASSET_MODAL: 'closeVideoAssetModal',

  KEEP_SUBTITLES: 'keepSubtitles',

  UPDATE_AUTO_PUBLISH_STATE: 'updateAutoPublishState',

  SET_CURRENT_SUBTITLE_EDIT_LANG: 'setCurrentSubtitleEditLang',
  RESET_SUBTITLE_ERROR: 'resetSubtitleError',
  SET_HAS_SUBTITLE_ERRORS: 'setHasSubtitleErrors',
};

const VideoState = {
  None: 'none',
  Published: 'published',
  DraftRaw: 'draftRaw',
  DraftEncoded: 'draftEncoded',
  Failed: 'failed',
};

// determine the polling rate according to video length
const VideoLength = {
  FiveMin: 300000,
  TenMin: 600000,
  ThirtyMin: 1800000,
};

// polling rate is used to poll the video encoding progress from API
const VideoPollingRate = {
  FiveSec: 5000,
  TenSec: 10000,
  ThirtySec: 30000,
  OneMin: 60000,
};

const EditMode = {
  VideoAndSubtitles: 'video-subtitles',
  InVideoQuiz: 'in-video-quiz',
  Resources: 'resources',
};

const AutoPublishState = {
  None: 'NONE',
  Requested: 'REQUESTED',
  Completed: 'COMPLETED',
  FailedAsset: 'FAILED_ASSET',
  FailedPermissions: 'FAILED_PERMISSIONS',
  FailedConflict: 'FAILED_CONFLICT',
};

const exported = {
  LectureActions,
  VideoState,
  VideoLength,
  VideoPollingRate,
  EditMode,
  AutoPublishState,
};

export default exported;
export { LectureActions, VideoState, VideoLength, VideoPollingRate, EditMode, AutoPublishState };
