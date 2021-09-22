/* eslint-disable complexity */
/**
 * Handles all lecture related data.
 */
import _, { isEmpty } from 'underscore';

import $ from 'jquery';
import { getErrorIsSlugifiableError } from 'bundles/author-common/utils/PublishErrorUtils';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import AuthoringState from 'bundles/author-common/constants/AuthoringState';
import LectureDispatcher from 'bundles/author-lecture/LectureDispatcher';
import { LectureDraftId } from 'bundles/author-lecture/utils/DraftIdModels';
import { InVideoQuestionActions } from 'bundles/author-lecture/constants/InVideoQuestionConstants';
import { LectureActions, AutoPublishState } from 'bundles/author-lecture/constants/LectureConstants';
import { InVideoAssessmentActions } from 'bundles/author-lecture/constants/InVideoAssessmentConstants';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import EventEmitter from 'js/vendor/EventEmitter';

const CHANGE_EVENT = 'change';

/* eslint-disable complexity */
// TODO: Refactor to use DraftIdModels
let _courseId = '';
let _branchId = '';
let _courseSlug = '';
let _itemId = '';
let _atomId: $TSFixMe = null;

let _branch: $TSFixMe = null;

let _draft: $TSFixMe = null;
let _published: $TSFixMe = null;

let _nameEmpty = false;

let _saveState = AuthoringState.Idle;

let _autoPublishState = AutoPublishState.None;

let _lectureExists = true;
let _videoIsOnDemand = false;
let _lectureResources: $TSFixMe = null;

// tracks currently selected subtitle language in the subtitle editor
let _currentSubtitleEditLanguage: $TSFixMe = null;

// array of `SubtitleDraftValidation`, see `lectureTypes.ts`
let _subtitleDraftValidations: $TSFixMe = [];

// since FE has a stricter SRT validation logic, we need to track that for
// publish-blocking calculation in `this.getHasValidSubtitleDrafts()`
// initial value is true to prevent publishing until all data is loaded and _hasSubtitleErrors is set again
let _hasSubtitleErrors = true;

const LectureStore = _.extend({}, EventEmitter.prototype, {
  getState() {
    return {
      itemId: _itemId,
      atomId: _atomId,
      lecture: this.getLecture(),
      saveState: _saveState,
      autoPublishState: this.getAutoPublishState(),
      hasDraft: this.hasLectureDraft(),
      isPublished: this.getIsPublished(),
      isReadOnly: this.getIsReadOnly(),
      writeAccessToken: this.getWriteAccessToken(),
      writeAccessState: this.getWriteAccessState(),
      lectureExists: _lectureExists,
      videoIsOnDemand: _videoIsOnDemand,
      imageUploadOptions: this.getImageUploadOptions(),
      assetAdminOptions: this.getAssetAdminOptions(),
      codeBlockOptions: this.getCodeBlockOptions(),
      draftVideoNew: this.isDraftVideoNew(),
      isLockedBy: this.isLockedBy(),
      currentSubtitleLang: this.getCurrentSubtitleEditLanguage(),
      hasInvalidSubtitleDrafts: !this.getHasValidSubtitleDrafts(),
      subtitleDraftValidations: this.getSubtitleDraftValidations(),
    };
  },

  getSaveState() {
    return _saveState;
  },

  getCourseId() {
    return _courseId;
  },

  getBranchId() {
    return _branchId;
  },

  getCourseSlug() {
    return _courseSlug;
  },

  getItemId() {
    return _itemId;
  },

  getAtomId() {
    return _atomId;
  },

  getLecture() {
    return LectureStore.hasLectureDraft() ? _draft : _published;
  },

  getLectureDraftMetadata() {
    // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
    return _draft && _draft.metadata;
  },

  getLectureAssets() {
    // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
    return (_draft && _draft.attachedAssets) || (_published && _published.attachedAssets);
  },

  getLectureDraftId() {
    return new LectureDraftId(this.getBranchId(), this.getItemId(), this.getAtomId());
  },

  getAuthoringCourseBranchItemId() {
    return tupleToStringKey([_branchId, _itemId]);
  },

  getLectureDraft() {
    return _draft;
  },

  getLecturePublished() {
    return _published;
  },

  getName() {
    return LectureStore.getLecture().name;
  },

  getIsPublished() {
    return !!_published;
  },

  getIsNameEmpty() {
    return _nameEmpty;
  },

  hasLectureDraft() {
    return !_(_draft).isEmpty();
  },

  getAutoPublishState() {
    return _autoPublishState;
  },

  getVideoIsOnDemand() {
    return _videoIsOnDemand;
  },

  getLectureResources() {
    return _lectureResources;
  },

  getIsReadOnly() {
    const lecture = this.getLecture();
    // writeAccessToken only exists when the item is editable
    return lecture && !lecture.writeAccessToken;
  },

  getWriteAccessState() {
    const lecture = this.getLecture();

    return lecture ? lecture.writeAccessState : null;
  },

  getWriteAccessToken() {
    const lecture = this.getLecture();
    return lecture ? lecture.writeAccessToken : null;
  },

  isDraftVideoNew() {
    // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
    return _draft && _draft.videoId && _published && _draft.videoId !== _published.videoId;
  },

  isLockedBy() {
    // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
    return _branch && _branch.courseMaterial.itemLocks.lockingItemId;
  },

  // TODO: Refactor this out of author-quiz and author-lecture into author-common.
  getImageUploadOptions() {
    return {
      context: {
        courseId: _courseId,
      },
      pendingAssetCreation: {
        assetType: 'image',
        typeName: 'pending',
        tags: [],
      },
      assetCreationUrl: '/api/authoringAssetCreationAttempts.v1',
    };
  },

  getAssetAdminOptions() {
    return {
      context: {
        courseId: _courseId,
      },
      pendingAssetCreation: {
        typeName: 'pending',
        tags: [],
      },
    };
  },

  getCodeBlockOptions() {
    return {
      context: {
        courseId: _courseId,
        branchId: _branchId,
        itemId: _itemId,
      },
      ecbEnabled: true,
    };
  },

  getSubtitles() {
    const { video } = this.getLecture() || {};
    // the video track element only understands VTT format
    const subtitles = video ? Object.assign({}, video.subtitlesVtt) : null;

    if (!subtitles || isEmpty(subtitles)) {
      return;
    }

    // override existing `subtitles` with valid draft subtitles when available,
    // since they have higher content priority
    if (_subtitleDraftValidations.length > 0) {
      // @ts-ignore ts-migrate(7006) FIXME: Parameter 'validation' implicitly has an 'any' typ... Remove this comment to see the full error message
      _subtitleDraftValidations.forEach((validation) => {
        if (validation.isValidSubtitle) {
          subtitles[validation.language] = validation.vttUrl;
        }
      });
    }

    return subtitles;
  },

  getCurrentSubtitleEditLanguage() {
    return _currentSubtitleEditLanguage;
  },

  getSubtitleDraftValidations() {
    return _subtitleDraftValidations;
  },

  // returns `true` when either all current subtitle drafts are valid AND _hasSubtitleErrors is `false` OR subtitles don't exist,
  // returns `false` otherwise
  // note: we need the _hasSubtitleErrors check since that is set by the FE srt-validator which is a stricter+accurate validator
  // than the BE one returned via `_subtitleDraftValidations`, so we check both for the final draft validity.
  getHasValidSubtitleDrafts() {
    const subtitles = this.getSubtitles();

    if (!subtitles || isEmpty(subtitles)) {
      return true;
    }

    // we have invalid drafts when there is at least 1 entry in `_subtitleDraftValidations` and its boolean is false
    // when `_subtitleDraftValidations` is [], there no drafts to publish
    if (_subtitleDraftValidations.length === 0) {
      return !_hasSubtitleErrors;
    }

    // we are in an invalid state when _hasSubtitleErrors is `true` OR there is at least 1 draft with `false` on `isValidSubtitle`
    // @ts-ignore ts-migrate(7006) FIXME: Parameter 'validation' implicitly has an 'any' typ... Remove this comment to see the full error message
    return !_hasSubtitleErrors && _subtitleDraftValidations.every((validation) => validation.isValidSubtitle === true);
  },

  reset() {
    _courseSlug = '';
    _courseId = '';
    _branchId = '';
    _branch = null;
    _itemId = '';
    _draft = null;
    _published = null;
    _lectureExists = true;
    _nameEmpty = false;
    _saveState = AuthoringState.Idle;
    _autoPublishState = AutoPublishState.None;
    _videoIsOnDemand = false;
    _lectureResources = null;
    _currentSubtitleEditLanguage = null;
    _subtitleDraftValidations = [];
    _hasSubtitleErrors = true;
  },

  emitChange() {
    return LectureStore.emit(CHANGE_EVENT);
  },

  addChangeListener(callback: $TSFixMe) {
    return LectureStore.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback: $TSFixMe) {
    return LectureStore.removeListener(CHANGE_EVENT, callback);
  },
});

const validate = function () {
  if (!LectureStore.hasLectureDraft()) {
    return;
  }

  // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
  _nameEmpty = _draft.name === '';
};

// Optimistically generates lecture drafts
LectureStore.dispatchToken = LectureDispatcher.register(function (payload: $TSFixMe) {
  const { action } = payload;

  switch (action.type) {
    case LectureActions.LOAD:
      _branchId = action.lectureDraftId.branchId;
      _courseId = action.courseId;
      _itemId = action.lectureDraftId.itemId;
      _atomId = action.lectureDraftId.atomId;
      _courseSlug = action.courseSlug;
      break;

    case LectureActions.RECEIVE_COURSE:
      _branch = action.courseAuthoringData.branch;
      break;

    case LectureActions.RECEIVE_LECTURE:
      if (action.branchId && action.itemId) {
        _branchId = action.lectureAuthoringData.branchId;
        _itemId = action.lectureAuthoringData.itemId;
      }

      _published = action.lectureAuthoringData.published;
      _draft = action.lectureAuthoringData.draft;

      if (_draft) {
        // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
        _draft.writeAccessToken = action.lectureAuthoringData.writeAccessToken;
        // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
        _draft.writeAccessState = action.lectureAuthoringData.writeAccessState;

        /**
         *  `stagedSubtitleDrafts` is a list of subtitles that have drafts for the current lecture,
         *   {
         *     isValidSubtitle: boolean;
         *     subtitleDraftId: string;
         *     language: string;
         *     vttUrl?: string;
         *   }
         */
        _subtitleDraftValidations = _draft.stagedSubtitleDrafts;
      } else {
        // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
        _published.writeAccessToken = action.lectureAuthoringData.writeAccessToken;
        // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
        _published.writeAccessState = action.lectureAuthoringData.writeAccessState;
      }

      if (action.lectureAuthoringData.lectureDraftMetadata) {
        // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
        _draft.metadata = action.lectureAuthoringData.metadata;
      }

      _saveState = action.lectureAuthoringData.draft ? AuthoringState.Success : AuthoringState.NoChanges;

      validate();
      break;

    case LectureActions.RECEIVE_LECTURE_DRAFT_METADATA:
      _draft = $.extend(true, {}, _draft || _published);
      // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
      _draft.metadata = action.lectureDraftMetadata;
      _saveState = AuthoringState.Success;
      break;

    case LectureActions.RECEIVE_WRITE_ACCESS_TOKEN:
      _draft = $.extend(true, {}, _draft || _published);
      // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
      _draft.writeAccessToken = action.writeAccessToken;

      _saveState = AuthoringState.Success;
      break;

    case InVideoAssessmentActions.CREATE_QUESTION:
    case InVideoAssessmentActions.UPDATE_QUESTION:
      _saveState = AuthoringState.InProgress;
      break;

    case InVideoAssessmentActions.EDIT_IN_VIDEO_QUESTION:
      _draft = $.extend(true, {}, _draft || _published);
      // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
      _draft.metadata = action.lectureDraftMetadata;
      // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
      _draft.writeAccessToken = action.writeAccessToken;
      _saveState = AuthoringState.Success;
      break;

    case InVideoAssessmentActions.RECEIVE_IN_VIDEO_ASSESSMENT:
      if (action.inVideoAssessmentAuthoringData.lectureDraftMetadata) {
        _draft = $.extend(true, {}, _draft || _published);
        // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
        _draft.metadata = action.inVideoAssessmentAuthoringData.lectureDraftMetadata;
      }

      if (action.inVideoAssessmentAuthoringData.writeAccessToken) {
        // @ts-gnore ts-migrate(2531) FIXME: Object is possibly 'null'.
        _draft.writeAccessToken = action.inVideoAssessmentAuthoringData.writeAccessToken;
        // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
        _draft.writeAccessState = action.inVideoAssessmentAuthoringData.writeAccessState;
      }

      _saveState = action.inVideoAssessmentAuthoringData.draft ? AuthoringState.Success : AuthoringState.NoChanges;
      break;

    case InVideoQuestionActions.RECEIVE_NEW_IN_VIDEO_QUESTION:
      if (action.inVideoQuestionAuthoringData.lectureDraftMetadata) {
        _draft = $.extend(true, {}, _draft || _published);
        // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
        _draft.metadata = action.inVideoQuestionAuthoringData.lectureDraftMetadata;
      }

      if (action.inVideoQuestionAuthoringData.writeAccessToken) {
        // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
        _draft.writeAccessToken = action.inVideoQuestionAuthoringData.writeAccessToken;
        // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
        _draft.writeAccessState = action.inVideoQuestionAuthoringData.writeAccessState;
      }

      _saveState = action.inVideoQuestionAuthoringData.draft ? AuthoringState.Success : AuthoringState.NoChanges;
      break;

    case LectureActions.UPDATE_NAME:
      _draft = $.extend(true, {}, _draft || _published);
      // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
      _draft.name = action.name;
      _saveState = AuthoringState.InProgress;
      validate();
      break;

    case LectureActions.UPLOAD_COMPLETED:
      _saveState = AuthoringState.Success;
      break;

    case LectureActions.VIDEO_IS_ON_DEMAND:
      _videoIsOnDemand = action.videoIsOnDemand;
      break;

    case LectureActions.PUBLISH:
      _saveState = AuthoringState.PublishInProgress;
      break;

    case LectureActions.REVERT:
      _saveState = AuthoringState.RevertInProgress;
      break;

    case LectureActions.PUBLISHED:
      _saveState = AuthoringState.Published;
      break;

    case LectureActions.REVERTED:
      _saveState = AuthoringState.Reverted;
      _draft = $.extend(
        true,
        {
          // maintain access token because DELETE does not return a token
          // and we don't want an intermediate state where `writeAccessToken` is missing
          // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
          writeAccessToken: _draft.writeAccessToken,
        },
        _published
      );
      validate();
      break;

    case LectureActions.CONFLICT:
    case LectureActions.PUBLISH_CONFLICT:
      _saveState = AuthoringState.Conflict;
      break;

    case LectureActions.ERROR:
      _saveState = AuthoringState.Error;
      break;

    case LectureActions.PUBLISH_ERROR:
      if (action.error?.responseJSON?.details.find((detail: $TSFixMe) => getErrorIsSlugifiableError(detail.error))) {
        _saveState = AuthoringState.PublishSlugError;
      } else {
        _saveState = AuthoringState.PublishError;
      }

      break;

    case LectureActions.LOAD_ERROR:
      _lectureExists = false;
      break;

    case LectureActions.UNLOAD:
      LectureStore.reset();
      break;

    case LectureActions.RECEIVE_LECTURE_ASSETS:
      _lectureResources = action.assetsData;
      break;

    case LectureActions.ADD_ASSET:
      _saveState = AuthoringState.InProgress;
      // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
      _lectureResources.push(action.newAsset);
      break;

    case LectureActions.DELETE_ASSET:
      _saveState = AuthoringState.InProgress;
      // @ts-ignore ts-migrate(2531) FIXME: Object is possibly 'null'.
      _lectureResources.splice(_lectureResources.indexOf(action.asset), 1);
      break;

    case LectureActions.UPDATE_AUTO_PUBLISH_STATE:
      _autoPublishState = action.autoPublishRequestState;
      break;

    case LectureActions.SET_CURRENT_SUBTITLE_EDIT_LANG:
      _currentSubtitleEditLanguage = action.lang;
      break;

    case LectureActions.SET_HAS_SUBTITLE_ERRORS:
      _hasSubtitleErrors = action.hasErrors;
      break;

    default:
      return;
  }

  LectureStore.emitChange();
});

export default LectureStore;
