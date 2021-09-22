import LectureDispatcher from 'bundles/author-lecture/LectureDispatcher';
import { LectureActions } from 'bundles/author-lecture/constants/LectureConstants';

const UploadServerActionCreators = {
  uploadCompleted() {
    LectureDispatcher.handleServerAction({
      type: LectureActions.UPLOAD_COMPLETED,
    });
  },

  uploadStarted(metadata: $TSFixMe) {
    LectureDispatcher.handleServerAction({
      type: LectureActions.UPLOAD_STARTED,
      metadata,
    });
  },

  uploadError() {
    LectureDispatcher.handleServerAction({
      type: LectureActions.UPLOAD_ERROR,
    });
  },

  uploadSubtitleStart() {
    LectureDispatcher.handleViewAction({
      type: LectureActions.UPLOAD_SUBTITLE_START,
    });
  },

  uploadSubtitleCompleted() {
    LectureDispatcher.handleViewAction({
      type: LectureActions.UPLOAD_SUBTITLE_COMPLETED,
    });
  },

  uploadSubtitleError(error: $TSFixMe) {
    LectureDispatcher.handleViewAction({
      type: LectureActions.UPLOAD_SUBTITLE_ERROR,
      error,
    });
  },
};

export default UploadServerActionCreators;

export const {
  uploadCompleted,
  uploadStarted,
  uploadError,
  uploadSubtitleStart,
  uploadSubtitleCompleted,
  uploadSubtitleError,
} = UploadServerActionCreators;
