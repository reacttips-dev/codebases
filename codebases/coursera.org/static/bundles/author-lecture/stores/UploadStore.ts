/**
 * Handles upload logic for both videos and subtitles
 */
import _ from 'underscore';

import _t from 'i18n!nls/author-lecture';
import 'js/lib/coursera.store';
import LectureDispatcher from 'bundles/author-lecture/LectureDispatcher';
import AuthoringState from 'bundles/author-common/constants/AuthoringState';
import { LectureActions } from 'bundles/author-lecture/constants/LectureConstants';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import EventEmitter from 'js/vendor/EventEmitter';

const CHANGE_EVENT = 'change';

let _videoUploadState = AuthoringState.Idle;

let _subtitleUploadState = AuthoringState.Idle;
let _subtitleValidationError: $TSFixMe = null;

// default is TRUE based on discussion at CP-6723
let _keepSubtitles = true;

let _isAssetModalOpen = false;

const UploadStore = _.extend({}, EventEmitter.prototype, {
  getUploadState() {
    return _videoUploadState;
  },

  getSubtitleUploadState() {
    return _subtitleUploadState;
  },

  getSubtitleValidationError() {
    return _subtitleValidationError;
  },

  getKeepSubtitles() {
    return _keepSubtitles;
  },

  isAssetModalOpen() {
    return _isAssetModalOpen;
  },

  reset() {
    _videoUploadState = AuthoringState.Idle;

    _subtitleUploadState = AuthoringState.Idle;
    _subtitleValidationError = null;

    _keepSubtitles = false;
  },

  emitChange() {
    return UploadStore.emit(CHANGE_EVENT);
  },

  addChangeListener(callback: $TSFixMe) {
    return UploadStore.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback: $TSFixMe) {
    return UploadStore.removeListener(CHANGE_EVENT, callback);
  },
});

UploadStore.dispatchToken = LectureDispatcher.register(function (payload: $TSFixMe) {
  const { action } = payload;

  switch (action.type) {
    case LectureActions.UPLOAD_START:
      _videoUploadState = AuthoringState.InProgress;
      break;

    case LectureActions.UPLOAD_COMPLETED:
      _videoUploadState = AuthoringState.Idle;
      break;

    case LectureActions.UPLOAD_ERROR:
      _videoUploadState = AuthoringState.Error;
      break;

    case LectureActions.UPLOAD_SUBTITLE_START:
      _subtitleUploadState = AuthoringState.InProgress;
      _subtitleValidationError = null;
      break;

    case LectureActions.UPLOAD_SUBTITLE_COMPLETED:
      _subtitleUploadState = AuthoringState.Idle;
      break;

    case LectureActions.UPLOAD_SUBTITLE_ERROR: {
      const { error } = action;

      if (error && error.status === 400 && error.responseJSON.errorCode === 'validation.failed') {
        // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'null'.
        _subtitleValidationError = _t('Validation error: #{message}', {
          message: error.responseJSON.message,
        });
      }

      _subtitleUploadState = AuthoringState.Error;
      break;
    }

    case LectureActions.RESET_SUBTITLE_ERROR:
      _subtitleUploadState = AuthoringState.Idle;
      _subtitleValidationError = null;
      break;

    case LectureActions.REVERTED:
      _videoUploadState = AuthoringState.Idle;
      break;

    case LectureActions.OPEN_VIDEO_ASSET_MODAL:
      _isAssetModalOpen = true;
      break;

    case LectureActions.KEEP_SUBTITLES:
      _keepSubtitles = action.keepSubtitles;
      break;

    case LectureActions.CLOSE_VIDEO_ASSET_MODAL:
      _isAssetModalOpen = false;
      break;

    case LectureActions.UNLOAD:
      UploadStore.reset();
      break;

    default:
      return;
  }

  UploadStore.emitChange();
});

export default UploadStore;
