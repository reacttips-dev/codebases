import Q from 'q';
import _ from 'underscore';
import API from 'js/lib/api';
import URI from 'jsuri';
import user from 'js/lib/user';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';

import InVideoAssessmentAPIUtils from 'bundles/author-lecture/utils/InVideoAssessmentAPIUtils';
import InVideoQuestionAPIUtils from 'bundles/author-lecture/utils/InVideoQuestionAPIUtils';
import CourseAPIUtils from 'bundles/author-common/utils/CourseAPIUtils';
import LectureServerActionCreators from 'bundles/author-lecture/actions/LectureServerActionCreators';
import LectureActionCreators from 'bundles/author-lecture/actions/LectureActionCreators';

const lectureApi = API('/api/authoringLectures.v2', { type: 'rest' });
const autoPublishApi = API('/api/authoringLectureAutopublish.v1', { type: 'rest' });

const opencourseAssetsApi = API('/api/openCourseAssets.v1/', { type: 'rest' });
const authorOpencourseAssetsApi = API('/api/authoringOpenCourseAssets.v1/', {
  type: 'rest',
});
const assetApi = API('/api/assets.v1/', { type: 'rest' });
const onDemandAssetVideosApi = API('/api/onDemandAssetVideos.v1', {
  type: 'rest',
});

const REQUEST_FIELDS = 'writeAccessToken,writeAccessState';
const CONFLICT_ERROR_STATUS = 409;
const NOT_FOUND_ERROR_STATUS = 404;

const handleAPIError = function (error: $TSFixMe, errorActionCreator: $TSFixMe, conflictActionCreator: $TSFixMe) {
  if (error.status === CONFLICT_ERROR_STATUS && conflictActionCreator) {
    conflictActionCreator(error);
  } else {
    errorActionCreator(error);
  }
};

const handleAutoPublishAPIError = function (error: $TSFixMe, errorActionCreator: $TSFixMe) {
  // If no draft matching the id, or no autopublish data with matching id
  // set auto-publish state to be NONE
  if (error.status === NOT_FOUND_ERROR_STATUS) {
    LectureServerActionCreators.updateAutoPublishState('NONE');
    return Q();
  } else {
    errorActionCreator(error);
  }
};

const loadQuestions = function (inVideoAssessmentAuthoringData: $TSFixMe) {
  const publishedQuestionData =
    inVideoAssessmentAuthoringData.published && inVideoAssessmentAuthoringData.published.definition.questions;
  const draftQuestionData =
    inVideoAssessmentAuthoringData.draft && inVideoAssessmentAuthoringData.draft.definition.questions;

  const [
    [publishedInVideoQuestionDraftIds, publishedCuePointsMsMap, publishedOrderMap],
    [draftInVideoQuestionDraftIds, draftCuePointsMsMap, draftOrderMap],
  ] = _([publishedQuestionData, draftQuestionData]).map((inVideoQuestions) => {
    const cuePointMsMaps = {};
    const orderMaps = {};
    const inVideoQuestionDraftIds = _(inVideoQuestions).map((inVideoQuestion) => {
      const draftId = tupleToStringKey([inVideoAssessmentAuthoringData.id, inVideoQuestion.questionId]);

      // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      cuePointMsMaps[draftId] = inVideoQuestion.cuePointMs;
      // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      orderMaps[draftId] = inVideoQuestion.order;

      return draftId;
    });

    return [inVideoQuestionDraftIds, cuePointMsMaps, orderMaps];
  });

  const cuePointMsMaps = {
    draft: draftCuePointsMsMap,
    published: publishedCuePointsMsMap,
  };

  const orderMaps = {
    draft: draftOrderMap,
    published: publishedOrderMap,
  };

  return InVideoQuestionAPIUtils.getAll(
    publishedInVideoQuestionDraftIds,
    draftInVideoQuestionDraftIds,
    cuePointMsMaps,
    orderMaps
  );
};

const LectureAPIUtils = {
  load(lectureDraftId: $TSFixMe) {
    CourseAPIUtils.getBranch(lectureDraftId.branchId)
      .then((courseAuthoringData) => LectureServerActionCreators.receiveCourse(courseAuthoringData))
      .done();

    return (
      LectureAPIUtils.get(lectureDraftId)
        // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'void'.
        .then((lectureAuthoringData) => InVideoAssessmentAPIUtils.get(lectureAuthoringData.id))
        .then(loadQuestions)
        .then(() => LectureAPIUtils.getAutoPublishState(lectureDraftId))
    );
  },

  // Util function to get unversioned assetId
  getUnversionedAssetId(assetId: $TSFixMe) {
    let newAssetId = assetId;
    const posAt = assetId.indexOf('@');
    if (posAt >= 0) {
      newAssetId = assetId.substring(0, posAt);
    }
    return newAssetId;
  },

  // NOTE: mutates the published object!
  get(lectureDraftId: $TSFixMe) {
    const uri = new URI(lectureDraftId.toString()).addQueryParam('fields', REQUEST_FIELDS);
    return (
      Q(lectureApi.get(uri.toString()))
        .then((response) => {
          const lectureAuthoringData = response.elements[0];
          LectureServerActionCreators.receiveLecture(lectureAuthoringData);
          return lectureAuthoringData;
        })
        .then(LectureAPIUtils.checkVideoIsOnDemand)
        // @ts-ignore ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        .catch((error) => handleAPIError(error, LectureServerActionCreators.loadError))
    );
  },

  createAsset(newUrlInfo: $TSFixMe) {
    return Q(authorOpencourseAssetsApi.post('', { data: newUrlInfo }));
  },

  getCourseAssetInfo(assetId: $TSFixMe) {
    const unversionedAssetId = LectureAPIUtils.getUnversionedAssetId(assetId);
    return Q(opencourseAssetsApi.get(unversionedAssetId));
  },

  /**
   * Retrive asset information api.openCourseAsset
   * Input: list of assetId ["1234", "2345"]
   * 1. retrive from api.openCourseAsset
   * 2. if type is asset, retrive detail information from api.assets
   * return: list of assets objects in unified form.
   */
  /* eslint-disable array-callback-return */
  getLectureAssets(assetIds: $TSFixMe) {
    const defered = Q.defer();
    const assetsData: $TSFixMe = [];
    const assetPromises = assetIds.map((assetId: $TSFixMe) => this.getCourseAssetInfo(assetId));
    Q.all(assetPromises)
      .then((assetDetails) => {
        const attachmentPromises: $TSFixMe = [];
        assetDetails.map((detailedData) => {
          // @ts-ignore ts-migrate(2571) FIXME: Object is of type 'unknown'.
          const assetDetail = detailedData.elements[0];
          if (assetDetail.typeName === 'url') {
            assetsData.push(assetDetail);
          } else {
            attachmentPromises.push(this.getAssetInfo(assetDetail));
          }
        });
        if (attachmentPromises.length < 1) {
          defered.resolve(assetsData);
        }
        // case asset based asset (aka pdf attachements)
        // fetch assetbasedasset info from api.Assets and reform to the same struct of link asset
        Q.all(attachmentPromises)
          .then((attachmentAssetsData) => {
            attachmentAssetsData.map((detailedAttachmentData) => {
              // @ts-ignore ts-migrate(2571) FIXME: Object is of type 'unknown'.
              const assetsDetailData = detailedAttachmentData.info;
              assetsData.push({
                // @ts-ignore ts-migrate(2571) FIXME: Object is of type 'unknown'.
                id: detailedAttachmentData.id,
                typeName: 'asset',
                definition: {
                  url: assetsDetailData.url.url,
                  // @ts-ignore ts-migrate(2571) FIXME: Object is of type 'unknown'.
                  name: detailedAttachmentData.name,
                  assetId: assetsDetailData.id,
                  fileName: assetsDetailData.name,
                },
              });
            });
            defered.resolve(assetsData);
          })
          .done();
      })
      .done();
    return defered.promise;
  },

  getAssetInfo(asset: $TSFixMe) {
    const { id, definition } = asset;
    const { assetId, name } = definition;
    return assetApi.get(assetId).then((assetData) => ({
      id,
      name,
      info: assetData.elements[0],
    }));
  },

  createLecture(lectureDraftId: $TSFixMe) {
    const uri = new URI().addQueryParam('fields', REQUEST_FIELDS);

    return Q(lectureApi.post(uri.toString(), { data: lectureDraftId.toString() }))
      .then((response) => {
        const lectureAuthoringData = response.elements[0];
        LectureServerActionCreators.receiveLectureDraftMetadata(lectureAuthoringData.draft.metadata);
        LectureServerActionCreators.receiveWriteAccessToken(lectureAuthoringData.writeAccessToken);
        return lectureAuthoringData;
      })
      .then(LectureAPIUtils.checkVideoIsOnDemand)
      .catch((error) => handleAPIError(error, LectureServerActionCreators.error, LectureServerActionCreators.conflict));
  },

  updateLecture(lectureDraftId: $TSFixMe, updates: $TSFixMe, doneCallback: $TSFixMe) {
    const uri = new URI(lectureDraftId.toString()).addQueryParam('fields', REQUEST_FIELDS);

    // all updates need the userId passed in
    const updatesWithUserId = Object.assign({}, updates, { userId: user.get().id });

    return Q(lectureApi.put(uri.toString(), { data: updatesWithUserId }))
      .then((response) => {
        const lectureAuthoringData = response.elements[0];

        if (
          updates.attachedAssets ||
          updates.videoAssetId ||
          _(updates.updatedSubtitles).keys().length > 0 ||
          updates.deletedSubtitles.length > 0
        ) {
          // If the video or subtitles changed, we need to reload the lecture
          LectureServerActionCreators.receiveLecture(lectureAuthoringData, { isVideoReplace: !!updates.videoAssetId });
        } else {
          LectureServerActionCreators.receiveLectureDraftMetadata(lectureAuthoringData.draft.metadata);
          LectureServerActionCreators.receiveWriteAccessToken(lectureAuthoringData.writeAccessToken);
        }

        if (doneCallback) {
          doneCallback();
        }

        return lectureAuthoringData;
      })
      .then(LectureAPIUtils.checkVideoIsOnDemand)
      .then(() => LectureAPIUtils.getAutoPublishState(lectureDraftId))
      .catch((error) => {
        handleAPIError(error, LectureServerActionCreators.error, LectureServerActionCreators.conflict);
      });
  },

  // WARNING: mutates updates
  updateAndCreateIfNeeded(lectureDraftId: $TSFixMe, updates: $TSFixMe, doneCallback: $TSFixMe) {
    let promise;

    if (updates.writeAccessToken ? updates.writeAccessToken === 'DEFAULT' : !updates.metadata) {
      promise = this.createLecture(lectureDraftId).then((lectureAuthoringData) => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'draft' does not exist on type 'void'.
        updates.metadata = lectureAuthoringData.draft.metadata;
        // @ts-ignore ts-migrate(2339) FIXME: Property 'writeAccessToken' does not exist on type... Remove this comment to see the full error message
        updates.writeAccessToken = lectureAuthoringData.writeAccessToken;
        LectureAPIUtils.updateLecture(lectureDraftId, updates, doneCallback);
      });
    } else {
      promise = this.updateLecture(lectureDraftId, updates, doneCallback);
    }

    return promise;
  },

  updateAndCreateAssetIfNeeded(lectureDraftId: $TSFixMe, assetId: $TSFixMe, addAsset: $TSFixMe) {
    const defered = Q.defer();
    Q(
      this.get(lectureDraftId).then((result) => {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'draft' does not exist on type 'void'.
        if (!result.draft) {
          defered.resolve(
            this.createLecture(lectureDraftId).then((lectureAuthoringData) => {
              this.updateAsset(lectureDraftId, assetId, lectureAuthoringData, addAsset);
            })
          );
        } else {
          defered.resolve(this.updateAsset(lectureDraftId, assetId, result, addAsset));
        }
      })
    );
    return defered.promise;
  },

  // Handle add and delete actions of lecture attached assets
  updateAsset(lectureDraftId: $TSFixMe, assetId: $TSFixMe, lectureAuthoringData: $TSFixMe, addAsset: $TSFixMe) {
    if (addAsset) {
      lectureAuthoringData.draft.attachedAssets.push(assetId + '@1');
    } else {
      // Delete one asset from assets array.
      const posAt = _(lectureAuthoringData.draft.attachedAssets).findIndex((attachedAsset) =>
        attachedAsset.includes(assetId)
      );
      if (posAt >= 0) {
        lectureAuthoringData.draft.attachedAssets.splice(posAt, 1);
      }
    }
    const updates = {
      name: lectureAuthoringData.draft.name,
      attachedAssets: lectureAuthoringData.draft.attachedAssets,
      metadata: lectureAuthoringData.draft.metadata,
      writeAccessToken: lectureAuthoringData.writeAccessToken,
    };
    LectureServerActionCreators.receiveLecture(lectureAuthoringData);
    // @ts-ignore ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
    return this.updateLecture(lectureDraftId, updates);
  },

  publish(lectureDraftId: $TSFixMe, metadata: $TSFixMe, done: $TSFixMe) {
    const actionString = 'autopublish';
    const uri = new URI().addQueryParam('id', lectureDraftId).addQueryParam('action', actionString);

    return Q(
      lectureApi.post(uri.toString(), {
        data: metadata,
      })
    )
      .then(() => LectureServerActionCreators.published())
      .then(() => done())
      .catch((error) => {
        handleAPIError(error, LectureServerActionCreators.publishError, LectureServerActionCreators.publishConflict);
      });
  },

  revert(lectureDraftId: $TSFixMe, lectureMetadata: $TSFixMe, isNotCurrentAtom = false) {
    const uri = new URI().addQueryParam('id', lectureDraftId).addQueryParam('action', 'revert');
    return (
      Q(lectureApi.post(uri.toString(), { data: lectureMetadata }))
        .then(() => !isNotCurrentAtom && LectureServerActionCreators.reverted())
        // fetch lecture data again to ensure updated write access
        // @ts-ignore ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
        .then(() => LectureActionCreators.reload())
        .catch((error) =>
          handleAPIError(error, LectureServerActionCreators.error, LectureServerActionCreators.conflict)
        )
    );
  },

  // we check to see if a video is on demand or not by hitting the onDemandAssetVideosApi endpoint, and checking it
  // returns a 404 or 200.
  checkVideoIsOnDemand(lectureAuthoringData: $TSFixMe) {
    const videoId = lectureAuthoringData.draft
      ? lectureAuthoringData.draft.videoId
      : lectureAuthoringData.published.videoId;

    if (videoId === undefined) {
      return Q(lectureAuthoringData);
    }

    return Q(onDemandAssetVideosApi.get(videoId))
      .then(() => {
        LectureServerActionCreators.videoIsOnDemand(true);
        return lectureAuthoringData;
      })
      .catch((error) => {
        if (error.status === 404) {
          LectureServerActionCreators.videoIsOnDemand(false);
          return lectureAuthoringData;
        } else {
          throw error;
        }
      });
  },

  getAutoPublishState(lectureDraftId: $TSFixMe) {
    const uri = new URI(lectureDraftId.toString());
    return Q(autoPublishApi.get(uri.toString()))
      .then((response) => {
        const autoPublishRequestState = response.elements[0];
        LectureServerActionCreators.updateAutoPublishState(autoPublishRequestState.state);
      })
      .catch((error) => handleAutoPublishAPIError(error, LectureServerActionCreators.loadError));
  },
};
export default LectureAPIUtils;

export const {
  load,
  getUnversionedAssetId,
  get,
  createAsset,
  getCourseAssetInfo,
  getLectureAssets,
  getAssetInfo,
  createLecture,
  updateLecture,
  updateAndCreateIfNeeded,
  updateAndCreateAssetIfNeeded,
  updateAsset,
  publish,
  revert,
  checkVideoIsOnDemand,
} = LectureAPIUtils;
