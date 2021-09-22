import _ from 'underscore';
import requestManager from 'bundles/author-lecture/utils/LectureRequestManagerSingleton';
import UploadServerActionCreators from 'bundles/author-lecture/actions/UploadServerActionCreators';
import LectureDispatcher from 'bundles/author-lecture/LectureDispatcher';
import { LectureActions } from 'bundles/author-lecture/constants/LectureConstants';
import UploadStore from 'bundles/author-lecture/stores/UploadStore';
import LectureStore from 'bundles/author-lecture/stores/LectureStore';
import LectureUtils from 'bundles/author-lecture/utils/LectureUtils';

const UploadActionCreators = {
  uploadStart() {
    LectureDispatcher.handleViewAction({
      type: LectureActions.UPLOAD_START,
    });

    // Save the lecture draft even though no changes have been made
    // This is to update the draft version to help prevent some concurrent edit issues
    requestManager.run(LectureUtils.save);
  },

  uploadComplete(videoAssetId: $TSFixMe) {
    const completeUploadRequest = function () {
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 1.
      return LectureUtils.save(videoAssetId).then(UploadServerActionCreators.uploadCompleted);
    };

    requestManager.run(completeUploadRequest);
  },

  replaceSubtitle(languageCode: $TSFixMe, assetId: $TSFixMe) {
    requestManager.debouncedRun(() => {
      const newSubtitle = {};
      // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      newSubtitle[languageCode] = assetId;

      // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 3.
      return LectureUtils.save(null, newSubtitle, null);
    });
  },

  keepSubtitles(keepSubtitles: $TSFixMe) {
    LectureDispatcher.handleViewAction({
      type: LectureActions.KEEP_SUBTITLES,
      keepSubtitles,
    });
  },

  resetSubtitleError() {
    // reset subtitle error state if there was one previously
    LectureDispatcher.handleViewAction({
      type: LectureActions.RESET_SUBTITLE_ERROR,
    });
  },

  deleteSubtitle(languageCode: $TSFixMe, doneCallback: $TSFixMe) {
    UploadActionCreators.resetSubtitleError();
    requestManager.debouncedRun(() => {
      return LectureUtils.save(null, null, [languageCode], doneCallback);
    });
  },

  openVideoAssetModal() {
    LectureDispatcher.handleViewAction({
      type: LectureActions.OPEN_VIDEO_ASSET_MODAL,
    });
  },

  closeAssetModal() {
    LectureDispatcher.handleViewAction({
      type: LectureActions.CLOSE_VIDEO_ASSET_MODAL,
    });
  },

  // @ts-ignore ts-migrate(7031) FIXME: Binding element 'asset' implicitly has an 'any' ty... Remove this comment to see the full error message
  videoAssetSelected([asset]) {
    const assetId = asset.id;
    const keepSubtitles = UploadStore.getKeepSubtitles();
    const updatedSubtitles = {};

    if (keepSubtitles) {
      _(LectureStore.getSubtitles()).each((subtitleURL, lang) => {
        // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        updatedSubtitles[lang] = LectureUtils.getAssetIdFromUrl(subtitleURL);
      });
    }
    // note that after save functionality, changes to videoStore and lecture store are also triggered via RECEIVE_LECTURE action
    requestManager.run(() =>
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
      LectureUtils.save(assetId, updatedSubtitles).then(UploadServerActionCreators.uploadCompleted)
    );
  },
};

export default UploadActionCreators;

export const {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'updateUploadProgress' does not exist on ... Remove this comment to see the full error message
  updateUploadProgress,
  uploadStart,
  uploadComplete,
  replaceSubtitle,
  keepSubtitles,
  deleteSubtitle,
  openVideoAssetModal,
  closeAssetModal,
  videoAssetSelected,
} = UploadActionCreators;
