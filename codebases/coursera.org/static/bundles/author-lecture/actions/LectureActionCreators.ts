import requestManager from 'bundles/author-lecture/utils/LectureRequestManagerSingleton';
import LectureAPIUtils from 'bundles/author-lecture/utils/LectureAPIUtils';
import LectureUtils from 'bundles/author-lecture/utils/LectureUtils';
import LectureDispatcher from 'bundles/author-lecture/LectureDispatcher';
import { LectureActions } from 'bundles/author-lecture/constants/LectureConstants';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import { loadCourseMaterialForBranch } from 'bundles/author-course/actions/CourseMaterialActions';

import LectureStore from 'bundles/author-lecture/stores/LectureStore';
import { Actions as QuestionActions } from 'bundles/author-questions/constants/QuestionConstants';
import QuestionDispatcher from 'bundles/author-questions/QuestionDispatcher';

const LectureActionCreators = {
  // TODO: Refactor into InVideoAssessment and Question action creators
  load(lectureDraftId: $TSFixMe, courseSlug: $TSFixMe, courseId: $TSFixMe) {
    if (LectureStore.getItemId()) {
      // If the store already contains data, reset it before loading new data
      this.unload();
    }

    LectureDispatcher.handleViewAction({
      type: LectureActions.LOAD,
      lectureDraftId,
      courseSlug,
      courseId,
    });

    QuestionDispatcher.handleViewAction({
      type: QuestionActions.RECEIVE_COURSE_DATA,
      branchId: lectureDraftId.branchId,
      itemId: lectureDraftId.itemId,
      courseSlug,
    });

    return LectureAPIUtils.load(lectureDraftId).then(() => {
      // @ts-ignore ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
      this.updateLectureAssets();
    });
  },

  unload() {
    LectureDispatcher.handleViewAction({
      type: LectureActions.UNLOAD,
    });
  },

  reload(newAtomId: $TSFixMe) {
    // TODO: Optimize this to avoid reloading everything.

    const lectureDraftId = LectureStore.getLectureDraftId();
    if (newAtomId) {
      lectureDraftId.atomId = newAtomId;
      lectureDraftId.id = newAtomId;
    }
    const courseSlug = LectureStore.getCourseSlug();
    const courseId = LectureStore.getCourseId();
    LectureActionCreators.unload();
    return LectureActionCreators.load(lectureDraftId, courseSlug, courseId);
  },

  setCurrentSubtitleEditLanguage(lang: $TSFixMe) {
    // delayed to avoid the "dispatch in the middle of a dispatch" error,
    // can be removed after we upgrade to Fluxible or other modern dispatchers
    setTimeout(
      () =>
        LectureDispatcher.handleViewAction({
          type: LectureActions.SET_CURRENT_SUBTITLE_EDIT_LANG,
          lang,
        }),
      0
    );
  },

  updateName(name: string, callback?: () => void) {
    requestManager.debouncedRun(() => {
      LectureDispatcher.handleViewAction({
        type: LectureActions.UPDATE_NAME,
        name,
      });

      return LectureUtils.save(null, null, null, callback);
    });
  },

  updateSubtitleDraft(assetId: $TSFixMe, doneCallback = () => {}) {
    requestManager.debouncedRun(() => {
      return LectureUtils.save(null, null, null, null, [assetId]).then(() => {
        LectureDispatcher.handleViewAction({
          // @ts-ignore ts-migrate(2339) FIXME: Property 'RELOAD_SUBTITLES' does not exist on type... Remove this comment to see the full error message
          type: LectureActions.RELOAD_SUBTITLES,
        });
        doneCallback();
      });
    });
  },

  publish(userId: $TSFixMe, branchId: $TSFixMe, executeAction: $TSFixMe) {
    requestManager.debouncedRun(() => {
      LectureDispatcher.handleViewAction({
        type: LectureActions.PUBLISH,
      });

      const writeAccessToken = LectureStore.getWriteAccessToken();
      const publishBody = {
        writeAccessToken,
        // [be-tech-debt] with 100% atoms we should refactor this as well, see CP-4178.
        enclosingAuthoringCourseBranchItemId: LectureStore.getAuthoringCourseBranchItemId(),
        authorId: userId,
        scope: {
          typeName: 'singleBranch',
          definition: { branchId },
        },
      };

      // Once published, reload branch's course material so that item's itemMetadata.publish is true for the Publisher component.
      return LectureAPIUtils.publish(LectureStore.getLectureDraftId(), publishBody, () =>
        executeAction(loadCourseMaterialForBranch, { branchId, forceRefresh: true })
      );
    });
  },

  revert() {
    return requestManager.debouncedRun(() => {
      LectureDispatcher.handleViewAction({
        type: LectureActions.REVERT,
      });

      const writeAccessToken = LectureStore.getWriteAccessToken();
      const lectureMetadata = writeAccessToken || LectureStore.getLectureDraftMetadata();

      return LectureAPIUtils.revert(LectureStore.getLectureDraftId(), lectureMetadata);
    });
  },

  // Load courseAsset and lectureAsset on refresh/load functions
  updateLectureAssets(doneCallback: $TSFixMe) {
    const lectureAssets = LectureStore.getLectureAssets();
    if (!lectureAssets) return;
    this.getCourseAssetInfo(lectureAssets, doneCallback);
  },

  // dispatch to lectureStore when getting new assets information
  getCourseAssetInfo(assetIds: $TSFixMe, doneCallback = () => {}) {
    LectureAPIUtils.getLectureAssets(assetIds)
      .then((assetsData) => {
        LectureDispatcher.handleViewAction({
          type: LectureActions.RECEIVE_LECTURE_ASSETS,
          assetsData,
        });
      })
      .done(doneCallback);
  },

  // Optimistically add lecture store asset
  createUrlAsset(courseId: $TSFixMe, linkUrl: $TSFixMe, linkName: $TSFixMe, lectureDraftId: $TSFixMe) {
    LectureAPIUtils.createAsset({
      asset: {
        typeName: 'url',
        definition: {
          url: linkUrl,
          name: linkName,
        },
      },
      courseId,
    })
      .then((result) => {
        const newAsset = {
          id: result.elements[0].id,
          definition: {
            name: linkName,
            url: linkUrl,
          },
          typeName: 'url',
        };
        this.createAsset(lectureDraftId, newAsset);
      })
      .done();
  },

  createAssetBasedAsset(courseId: $TSFixMe, assetId: $TSFixMe, lectureDraftId: $TSFixMe, definition: $TSFixMe) {
    LectureAPIUtils.createAsset({
      asset: {
        typeName: 'asset',
        definition: {
          assetId,
          name: definition.name,
        },
      },
      courseId,
    })
      .then((result) => {
        const newAssetData = result.elements[0];
        const newAsset = {
          id: newAssetData.id,
          typeName: 'asset',
          definition,
        };
        this.createAsset(lectureDraftId, newAsset);
      })
      .done();
  },

  createAsset(lectureDraftId: $TSFixMe, newAsset: $TSFixMe) {
    LectureDispatcher.handleViewAction({
      type: LectureActions.ADD_ASSET,
      newAsset,
    });

    LectureAPIUtils.updateAndCreateAssetIfNeeded(lectureDraftId, newAsset.id, true);
  },

  // Optimistically delete lecture store asset
  deleteLectureAsset(asset: $TSFixMe, lectureDraftId: $TSFixMe) {
    LectureAPIUtils.updateAndCreateAssetIfNeeded(lectureDraftId, asset.id, false);

    LectureDispatcher.handleViewAction({
      type: LectureActions.DELETE_ASSET,
      asset,
    });
  },

  setHasSubtitleErrors(hasErrors: $TSFixMe) {
    // delayed to avoid the "dispatch in the middle of a dispatch" error,
    // can be removed after we upgrade to Fluxible or other modern dispatchers
    setTimeout(() => {
      LectureDispatcher.handleViewAction({
        type: LectureActions.SET_HAS_SUBTITLE_ERRORS,
        hasErrors,
      });
    }, 0);
  },
};

export default LectureActionCreators;

export const {
  load,
  unload,
  reload,
  updateName,
  updateSubtitleDraft,
  publish,
  revert,
  updateLectureAssets,
  getCourseAssetInfo,
  createUrlAsset,
  createAssetBasedAsset,
  createAsset,
  deleteLectureAsset,
  setHasSubtitleErrors,
  setCurrentSubtitleEditLanguage,
} = LectureActionCreators;
