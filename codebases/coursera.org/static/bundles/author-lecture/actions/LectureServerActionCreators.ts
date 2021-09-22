import LectureDispatcher from 'bundles/author-lecture/LectureDispatcher';
import { LectureActions } from 'bundles/author-lecture/constants/LectureConstants';

const LectureServerActionCreators = {
  receiveCourse(courseAuthoringData: $TSFixMe) {
    LectureDispatcher.handleServerAction({
      type: LectureActions.RECEIVE_COURSE,
      courseAuthoringData,
    });
  },

  receiveLecture(lectureAuthoringData: $TSFixMe, opts = {}) {
    // note: triggers changes in the video store as well
    LectureDispatcher.handleServerAction({
      type: LectureActions.RECEIVE_LECTURE,
      lectureAuthoringData,
      opts,
    });
  },

  receiveLectureDraftMetadata(lectureDraftMetadata: $TSFixMe) {
    LectureDispatcher.handleServerAction({
      type: LectureActions.RECEIVE_LECTURE_DRAFT_METADATA,
      lectureDraftMetadata,
    });
  },

  receiveWriteAccessToken(writeAccessToken: $TSFixMe) {
    LectureDispatcher.handleServerAction({
      type: LectureActions.RECEIVE_WRITE_ACCESS_TOKEN,
      writeAccessToken,
    });
  },

  published() {
    LectureDispatcher.handleServerAction({
      type: LectureActions.PUBLISHED,
    });
  },

  reverted() {
    LectureDispatcher.handleServerAction({
      type: LectureActions.REVERTED,
    });
  },

  conflict(error: $TSFixMe) {
    LectureDispatcher.handleServerAction({
      type: LectureActions.CONFLICT,
    });
  },

  error(error: $TSFixMe) {
    LectureDispatcher.handleServerAction({
      type: LectureActions.ERROR,
      error,
    });
  },

  loadError(error: $TSFixMe) {
    LectureDispatcher.handleServerAction({
      type: LectureActions.LOAD_ERROR,
    });
  },

  publishError(error: $TSFixMe) {
    LectureDispatcher.handleServerAction({
      type: LectureActions.PUBLISH_ERROR,
      error,
    });
  },

  publishConflict(error: $TSFixMe) {
    LectureDispatcher.handleServerAction({
      type: LectureActions.PUBLISH_CONFLICT,
    });
  },

  videoIsOnDemand(isOnDemand: $TSFixMe) {
    LectureDispatcher.handleServerAction({
      type: LectureActions.VIDEO_IS_ON_DEMAND,
      videoIsOnDemand: isOnDemand,
    });
  },

  updateAutoPublishState(autoPublishRequestState: $TSFixMe) {
    LectureDispatcher.handleViewAction({
      type: LectureActions.UPDATE_AUTO_PUBLISH_STATE,
      autoPublishRequestState,
    });
  },
};

export default LectureServerActionCreators;

export const {
  receiveCourse,
  receiveLecture,
  receiveLectureDraftMetadata,
  receiveWriteAccessToken,
  published,
  reverted,
  conflict,
  error,
  loadError,
  publishError,
  publishConflict,
  videoIsOnDemand,
} = LectureServerActionCreators;
