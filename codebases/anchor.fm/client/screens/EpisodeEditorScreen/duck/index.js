/* eslint-disable prefer-destructuring */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Promise from 'bluebird';
import { push } from 'react-router-redux';
import unescaper from 'anchor-server-common/utilities/unescaper';
import { COLORS } from 'anchor-server-common/utilities/episode/constants';
import moment from 'moment';
import { getUnixSaveFilePathName } from '../../../modules/File';
import { fetchStatus } from '../../../money';
import { DropdownButton } from '../../../components/DropdownButton';
import { SupportedFormatsTooltip } from '../components/SupportedFormatsTooltip';
import InfoBubble from '../../../components/InfoBubble';
import bubbleStyles from '../../../components/InfoButton/styles.sass';
import {
  msToHMS,
  getSeekAudioIndexFromEpisodeAudiosAndPositionInMs,
  MAX_FILE_SIZE,
  getV3ShareEmbedHtml,
  getV3ShareUrl,
  getIsAudioAdSlot,
  getReorderedArray,
  getSortedArrayOfObjects,
  addAudioToEpisodeDuration,
} from '../../../utils';
import {
  nextFrame,
  getBlobUrlCreator,
  windowUndefined,
} from '../../../../helpers/serverRenderingUtils';
import {
  updateAudios,
  fetchMyLibrary,
  RECEIVE_AUDIO_LIBRARY,
  setUploadStatuses,
  deleteUploadStatus,
  addProcessingAudioId,
} from '../../../sourceAudio';
import { unsetAndRedirectUser } from '../../../user';
import { AnchorAPI, AnchorAPIError } from '../../../modules/AnchorAPI';
import { duckOperations as globalPodcastDuckOperations } from '../../../store/global/podcast';
import { updatePlaybackPositionInMs } from '../../../playbackPosition';
import { duckOperations as storeDuckOperations } from '../../../store';
import Decoder from '../../../modules/Decoder';
import { getHourOffset } from '../../../modules/Date';
import events from '../events';
import {
  uploadAudioFile,
  pollAudioProcessingStatus,
} from '../../../modules/Upload';
import { END_EPISODE_AUDIO } from './constants';
import { EpisodeEditorPublishErrors } from '../../../components/EpisodeEditorPublish';

let extractAudio = null;
if (!windowUndefined()) {
  // eslint-disable-next-line global-require
  extractAudio = require('../../../modules/WebWorkers').extractAudio;
}

const { SponsorshipsDecoder } = Decoder;

export const RECEIVE_EPISODE_FETCH_REQUEST =
  '@@episodeEditorScreen/RECEIVE_EPISODE_FETCH_REQUEST';
export const ADD_AUDIO_TO_EPISODE =
  '@@episodeEditorScreen/ADD_AUDIO_TO_EPISODE';
export const DISMISS_AUDIO_ERROR = '@@episodeEditorScreen/DISMISS_AUDIO_ERROR';
export const REPLACE_AUDIO_IN_EPISODE =
  '@@episodeEditorScreen/REPLACE_AUDIO_IN_EPISODE';
export const REMOVE_AUDIO_IN_EPISODE =
  '@@episodeEditorScreen/REMOVE_AUDIO_IN_EPISODE';
export const RECEIVE_PODCAST_EPISODE =
  '@@episodeEditorScreen/RECEIVE_PODCAST_EPISODE';
export const RESET_PODCAST_EPISODE =
  '@@episodeEditorScreen/RESET_PODCAST_EPISODE';
export const CHANGE_EPISODE_SORT = '@@episodeEditorScreen/CHANGE_EPISODE_SORT';
export const CHANGE_EPISODE_IMAGE =
  '@@episodeEditorScreen/CHANGE_EPISODE_IMAGE';
export const RECEIVE_EPISODE_AUDIO_CAPTION =
  '@@episodeEditorScreen/CHANGE_EPISODE_AUDIO_CAPTION';
export const RECEIVE_ACTIVE_EPISODE_AUDIO_INDEX =
  '@@episodeEditorScreen/RECEIVE_ACTIVE_EPISODE_AUDIO_INDEX';
export const RECEIVE_ACTIVE_EDITOR_AUDIO_INDEX =
  '@@episodeEditorScreen/RECEIVE_ACTIVE_EDITOR_AUDIO_ID';
export const RECEIVE_DELETE_SEGMENT_PROMPT =
  '@@episodeEditorScreen/RECEIVE_DELETE_SEGMENT_PROMPT';
export const IS_SHOWING_DELETION_NOT_ALLOWED_MODAL =
  '@@episodeEditorScreen/IS_SHOWING_DELETION_NOT_ALLOWED_MODAL';
export const DELETION_MODAL_USED_IN_EPISODES =
  '@@episodeEditorScreen/DELETION_MODAL_USED_IN_EPISODES';
export const RECEIVE_NEW_AUDIO_POSITION =
  '@@episodeEditorScreen/RECEIVE_NEW_AUDIO_POSITION';
export const SET_IS_HOVERING_OVER_ADD_BUTTON =
  '@@episodeEditorScreen/SET_IS_HOVERING_OVER_ADD_BUTTON';
export const SET_IS_DRAFT = '@@episodeEditorScreen/SET_IS_DRAFT';
export const SET_IS_PLAYING = '@@episodeEditorScreen/SET_IS_PLAYING';
export const SET_IS_UPDATING = '@@episodeEditorScreen/SET_IS_UPDATING';
export const SET_PUBLISH_ON = '@@episodeEditorScreen/SET_PUBLISH_ON';
export const SET_DO_ABANDON_CHANGES =
  '@@episodeEditorScreen/SET_DO_ABANDON_CHANGES';
export const STOP_EDITOR_AUDIO = '@@episodeEditorScreen/STOP_EDITOR_AUDIO';
export const SET_IS_USING_SHORTCUT_UPLOAD_FLOW =
  '@@episodeEditorScreen/SET_IS_USING_SHORTCUT_UPLOAD_FLOW';
export const SET_IS_AD_STATE_ENABLED =
  '@@episodeEditorScreen/SET_IS_AD_STATE_ENABLED';
export const SET_IS_SHOWING_ANCHOR_FIRST_AD_MODAL =
  '@@episodeEditorScreen/SET_IS_SHOWING_ANCHOR_FIRST_AD_MODAL';
export const SET_AUTO_PAIRED_CAMPAIGN =
  '@@episodeEditorScreen/SET_AUTO_PAIRED_CAMPAIGN';
export const SET_IS_SHOWING_ACTIVATE_SPONSORSHIPS_CONFIRMATION_MODAL =
  '@@episodeEditorScreen/SET_IS_SHOWING_ACTIVATE_SPONSORSHIPS_CONFIRMATION_MODAL';
export const SET_IS_SHOWING_SPONSORSHIPS_MUSIC_ERROR_MODAL =
  '@@episodeEditorSreen/SET_IS_SHOWING_SPONSORSHIPS_MUSIC_ERROR_MODAL';
export const SET_IS_SHOWING_PUBLISH_NEW_EPISODE_SCREEN =
  '@@episodeEditorScreen/SET_IS_SHOWING_PUBLISH_NEW_EPISODE_SCREEN';
export const SET_HAS_UNSAVED_CAPTION =
  '@@episodeEditorScreen/SET_HAS_UNSAVED_CAPTION';
export const SET_IS_EXTRACTING_AUDIO_STATUS =
  '@@episodeEditorScreen/SET_IS_EXTRACTING_AUDIO_STATUS';
export const SET_UPLOAD_PROGRESS = '@@episodeEditorScreen/SET_UPLOAD_PROGRESS';
export const SET_PODCAST_EPISODE_ID =
  '@@episodeEditorScreen/SET_PODCAST_EPISODE_ID';
const IS_UNPUBLISH_APPROVED_EPISODE_MODAL_OPEN =
  '@@episodeEditorScreen/IS_UNPUBLISH_APPROVED_EPISODE_MODAL_OPEN';
const IS_UNABLE_TO_EDIT_EPISODE_MODAL_OPEN =
  '@@episodeEditorScreen/IS_UNABLE_TO_EDIT_EPISODE_MODAL_OPEN';
const IS_UNABLE_TO_ADD_SONG_MODAL =
  '@@episodeEditorScreen/IS_UNABLE_TO_ADD_SONG_MODAL';
const IS_UNABLE_TO_ADD_SONG_TO_PAYWALLED_EPISODE_MODAL =
  '@@episodeEditorScreen/IS_UNABLE_TO_ADD_SONG_TO_PAYWALLED_EPISODE_MODAL';
const SET_UNPUBLISH_EPISODE_ERROR =
  '@@episodeEditorScreen/SET_UNPUBLISH_EPISODE_ERROR';

export const PUBLISHING_STATES = {
  IS_DRAFT: 'isDraft',
  IS_SCHEDULED: 'isScheduled',
  IS_PUBLISHED: 'isPublished',
};

export const DRAG_TYPES = {
  EXISTING_AUDIO: 'existingAudio',
  NEW_AUDIO: 'newAudio',
};

const ACTIVE_EMPTY_AD_SLOT_FAKE_DURATION = 30 * 1000;

const emptyArray = [];
const emptyObject = {};

// TODO (bui): fetching states should not default to true
const initialState = {
  isFetchingEpisode: false,
  activeEpisodeAudio: null,
  activeEpisodeAudioIndex: -1,
  addAudioError: null,
  episodeAudios: emptyArray,
  episodeDuration: 0,
  episodeDurationHMS: null,
  isDraft: true,
  isPlaying: false,
  isUpdating: false,
  metadata: emptyObject,
  playedDuration: 0,
  podcastId: null,
  podcastEpisodeId: null,
  publishOn: null,
  requestDeleteAudio: null,
  shareEmbedHtml: null,
  shareUrl: null,
  doAbandonChanges: false,
  updatingEpisode: false,
  isHoveringOverAddButton: false,
  isUsingShortcutUploadFlow: false,
  isShowingAnchorFirstAdModal: false,
  autoPairedCampaign: null,
  isShowingActivateSponsorshipsConfirmationModal: false,
  isShowingSponsorshipsMusicErrorModal: false,
  status: emptyObject,
  isShowingPublishNewEpisodeScreen: false,
  deletionModalUsedInEpisodes: [],
  hasUnsavedCaption: false,
  initialEpisodeAudios: null,
  isExtractingAudio: false,
  uploadProgress: {},
  isShowingDeletionNotAllowedModal: false,
  isUnpublishApprovedEpisodeModalOpen: false,
  isUnableToEditEpisodeModalOpen: false,
  isUnableToAddSongModalOpen: false,
  isUnableToAddSongToPaywalledEpisodeModalOpen: false,
  episodeUnpublishError: false,
};

// reducers

function episodeAudioReducer(state = emptyObject, action) {
  switch (action.type) {
    case RECEIVE_PODCAST_EPISODE: {
      const { duration, caption, isAdSlotEnabled } = state;
      const audio = {
        durationHMS: msToHMS(duration),
        ...state,
      };
      if (caption) {
        audio.caption = unescaper(caption);
      } else if (audio.created) {
        audio.caption = moment(audio.created).format('MMM DD, YYYY hh:mm A');
      } else {
        audio.caption = '';
      }
      // enabled ad without a dynamically insertable audio
      if (isAdSlotEnabled && !audio.duration) {
        // visually green duration
        audio.duration = audio.duration || ACTIVE_EMPTY_AD_SLOT_FAKE_DURATION;
      }
      return audio;
    }
    case RECEIVE_EPISODE_AUDIO_CAPTION: {
      const { key, caption } = action.payload;
      if (state.key !== key) {
        return state;
      }
      return {
        ...state,
        caption,
      };
    }
    case SET_IS_AD_STATE_ENABLED: {
      if (getIsAudioAdSlot(state)) {
        const isAdSlotEnabled = action.payload;
        return {
          ...state,
          isAdSlotEnabled,
        };
      }
      return state;
    }
    default:
      return state;
  }
}

// eslint-disable-next-line import/no-default-export
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_PODCAST_EPISODE_ID:
      return { ...state, podcastEpisodeId: action.payload.podcastEpisodeId };
    case SET_HAS_UNSAVED_CAPTION:
      return { ...state, hasUnsavedCaption: action.payload.hasUnsavedCaption };
    case SET_UPLOAD_PROGRESS: {
      const { uploadProgress } = state;
      const {
        payload: { tmpAudioId, percentComplete },
      } = action;
      uploadProgress[tmpAudioId] = percentComplete;
      return { ...state, uploadProgress };
    }
    case SET_IS_EXTRACTING_AUDIO_STATUS: {
      return {
        ...state,
        isExtractingAudio: action.payload.isExtractingAudio,
      };
    }
    case SET_IS_SHOWING_ANCHOR_FIRST_AD_MODAL: {
      const { isShowingAnchorFirstAdModal } = action.payload;
      return {
        ...state,
        isShowingAnchorFirstAdModal,
      };
    }
    case SET_IS_SHOWING_PUBLISH_NEW_EPISODE_SCREEN: {
      const { isShowingPublishNewEpisodeScreen } = action.payload;
      return {
        ...state,
        isShowingPublishNewEpisodeScreen,
      };
    }
    case SET_IS_SHOWING_SPONSORSHIPS_MUSIC_ERROR_MODAL: {
      const { isShowingSponsorshipsMusicErrorModal } = action.payload;
      return {
        ...state,
        isShowingSponsorshipsMusicErrorModal,
      };
    }
    case SET_IS_SHOWING_ACTIVATE_SPONSORSHIPS_CONFIRMATION_MODAL: {
      const { isShowingActivateSponsorshipsConfirmationModal } = action.payload;
      return {
        ...state,
        isShowingActivateSponsorshipsConfirmationModal,
      };
    }
    case SET_AUTO_PAIRED_CAMPAIGN: {
      const { autoPairedCampaign } = action.payload;
      return {
        ...state,
        autoPairedCampaign,
      };
    }
    // (TODO: bui) use index to correctly calculate sort
    case RECEIVE_AUDIO_LIBRARY: {
      // need to update the audios in the staging area with the correct transformation name/status
      // in order to correctly set the uploading/processing/completed UI states
      const { episodeAudios } = state;
      const {
        payload: { audios },
      } = action;

      // this handles updating the audios in the staging area that were uploaded
      // with the most recent audios coming from the recently fetched library
      const newEpisodeAudios = episodeAudios.map(episodeAudio => {
        const updatedAudio = audios.find(
          audio => audio.audioId === episodeAudio.audioId
        );
        if (updatedAudio) {
          const {
            audioTransformationName,
            audioTransformationStatus,
            url,
          } = updatedAudio;
          return {
            ...episodeAudio,
            url,
            audioTransformationName,
            audioTransformationStatus,
            uploadState:
              audioTransformationStatus === 'finished'
                ? 'complete'
                : episodeAudio.uploadState,
          };
        }
        return episodeAudio;
      });
      return {
        ...state,
        episodeAudios: newEpisodeAudios,
      };
    }
    case ADD_AUDIO_TO_EPISODE: {
      const { episodeAudios, episodeDuration } = state;
      if (action.error) {
        return {
          ...state,
          addAudioError: action.payload,
        };
      }
      const { audio, idx } = action.payload;
      const { audioId, caption: audioCaption, type, tmpAudioId } = audio;
      const newEpisodeDuration = addAudioToEpisodeDuration(
        episodeDuration,
        audio
      );
      const newAudios = [];
      let curSort = 0;
      const insertPosition =
        (idx !== undefined && idx) || idx === 0 ? idx : episodeAudios.length;
      const caption =
        type === 'music'
          ? null
          : audioCaption ||
            moment(audio.created).format('MMM DD, YYYY hh:mm A');
      for (let i = 0; i <= episodeAudios.length; i = i + 1) {
        if (insertPosition === i) {
          newAudios.push({
            ...audio,
            caption,
            sort: curSort,
            key: `${audioId || tmpAudioId}-${curSort}`,
          });
          curSort = curSort + 10;
        }
        if (episodeAudios[i]) {
          newAudios.push({ ...episodeAudios[i], sort: curSort });
          curSort = curSort + 10;
        }
      }
      return {
        ...state,
        addAudioError: null,
        episodeAudios: newAudios,
        episodeDuration: newEpisodeDuration,
        episodeDurationHMS: msToHMS(newEpisodeDuration),
      };
    }
    case REPLACE_AUDIO_IN_EPISODE: {
      const { episodeAudios } = state;
      const {
        payload: {
          urlToReplace,
          audioIdToReplace,
          tmpAudioIdToReplace,
          audio: newAudio,
        },
      } = action;
      const newEpisodeAudios = episodeAudios.map(audio => {
        const { audioId, tmpAudioId, sort, url } = audio;
        // we have the ability to replace an audio using audioId, tmpAudioId, or url
        if (
          (audioIdToReplace && audioIdToReplace === audioId) ||
          (urlToReplace && urlToReplace === url) ||
          (tmpAudioIdToReplace &&
            tmpAudioId &&
            tmpAudioIdToReplace === tmpAudioId)
        ) {
          return {
            ...audio,
            url: newAudio.url,
            audioId: newAudio.audioId,
            isUploading: newAudio.isUploading,
            duration: newAudio.duration,
            derivedFromAudioId: newAudio.derivedFromAudioId,
            uploadState: newAudio.uploadState,
            sort, // make sure we place the audio in the right position
          };
        }
        return audio;
      });
      const newEpisodeDuration = newEpisodeAudios.reduce(
        (sum, audio) => addAudioToEpisodeDuration(sum, audio),
        0
      );
      return {
        ...state,
        addAudioError: null,
        episodeAudios: newEpisodeAudios,
        episodeDuration: newEpisodeDuration,
        episodeDurationHMS: msToHMS(newEpisodeDuration),
      };
    }
    case REMOVE_AUDIO_IN_EPISODE: {
      const { audioIndex } = action.payload;
      const { episodeAudios } = state;
      // filter out audio based on index position
      const splicedAudios = episodeAudios
        .filter((_audio, idx) => idx !== audioIndex)
        // recalculate sort value
        .map((audio, index) => ({
          ...audio,
          sort: index * 10,
        }));
      const newEpisodeDuration = splicedAudios.reduce(
        (sum, audio) => addAudioToEpisodeDuration(sum, audio),
        0
      );
      return {
        ...state,
        episodeAudios: splicedAudios,
        episodeDuration: newEpisodeDuration,
        episodeDurationHMS: msToHMS(newEpisodeDuration),
        activeEpisodeAudio: null,
        activeEpisodeAudioIndex: -1,
        isPlaying: false,
        playedDuration: 0,
      };
    }
    case SET_IS_AD_STATE_ENABLED: {
      return {
        ...state,
        episodeAudios: state.episodeAudios.map(a =>
          episodeAudioReducer(a, action)
        ),
      };
    }
    case END_EPISODE_AUDIO: {
      const { activeEpisodeAudioIndex, episodeAudios } = state;
      const nextActiveIndex = getNextActiveIndex(
        activeEpisodeAudioIndex,
        episodeAudios
      );
      const nextActiveAudio = episodeAudios[nextActiveIndex];
      return {
        ...state,
        activeEpisodeAudioIndex: nextActiveIndex,
        activeEpisodeAudio: nextActiveAudio,
        isPlaying: !!nextActiveAudio,
        playedDuration: playedDurationFromEpisodeAudiosAndActiveIndex(
          episodeAudios,
          nextActiveIndex
        ),
      };
    }
    case RESET_PODCAST_EPISODE: {
      return {
        ...state,
        ...initialState,
      };
    }
    case DISMISS_AUDIO_ERROR: {
      return {
        ...state,
        addAudioError: null,
      };
    }
    case RECEIVE_PODCAST_EPISODE: {
      const {
        episodeAudios,
        isDraft,
        metadata,
        podcastId,
        podcastEpisodeId,
        publishOn,
        status,
        reviewState,
      } = action.payload;
      const episodeDuration = episodeDurationFromEpisodeAudios(episodeAudios);
      const durationFromAdSlots = episodeDurationFromEpisodeAudios(
        episodeAudios.filter(getIsAudioAdSlot)
      );
      const mappedEpisodeAudios = episodeAudios.map(a =>
        episodeAudioReducer(a, action)
      );
      // when updating/creating, status and metadata are unset and should not override
      return {
        ...state,
        episodeAudios: mappedEpisodeAudios,
        initialEpisodeAudios:
          state.initialEpisodeAudios === null
            ? mappedEpisodeAudios
            : state.initialEpisodeAudios,
        episodeDuration,
        episodeDurationHMS: msToHMS(episodeDuration - durationFromAdSlots),
        isDraft,
        metadata: {
          ...state.metadata,
          ...metadata,
        },
        podcastEpisodeId,
        podcastId,
        isFetchingEpisode: false,
        publishOn: publishOn ? new Date(publishOn) : null,
        shareEmbedHtml: getV3ShareEmbedHtml(action.payload),
        shareUrl: getV3ShareUrl(action.payload),
        status: {
          ...state.status,
          ...status,
        },
        reviewState,
      };
    }
    case CHANGE_EPISODE_SORT: {
      const { startSort, endSort } = action.payload;
      const { episodeAudios } = state;
      const newEpisodeAudios = getReorderedArray(
        episodeAudios,
        'sort',
        startSort,
        endSort
      );
      return {
        ...state,
        // resort the audios based on the `sort` property
        // the remove audio action is based on the array index position, so this
        // makes it easier to do that
        episodeAudios: getSortedArrayOfObjects(newEpisodeAudios, 'sort', 'asc'),
        activeEpisodeAudioIndex: -1,
        isPlaying: false,
      };
    }
    case RECEIVE_EPISODE_AUDIO_CAPTION: {
      const { episodeAudios } = state;
      return {
        ...state,
        episodeAudios: episodeAudios.map(a => episodeAudioReducer(a, action)),
      };
    }
    case SET_IS_DRAFT: {
      const { isDraft } = action.payload;
      return {
        ...state,
        isDraft,
        publishOn: null,
      };
    }
    case SET_IS_PLAYING: {
      const { isPlaying } = action.payload;
      const activeEditorAudioIndex = isPlaying
        ? null
        : state.activeEditorAudioIndex;
      return {
        ...state,
        isPlaying,
        activeEditorAudioIndex,
      };
    }
    case SET_IS_UPDATING: {
      const { isUpdating } = action.payload;
      return {
        ...state,
        isUpdating,
      };
    }
    case SET_PUBLISH_ON: {
      const { publishOn } = action.payload;
      return {
        ...state,
        publishOn,
      };
    }
    case RECEIVE_ACTIVE_EPISODE_AUDIO_INDEX: {
      const { episodeAudios } = state;
      let { activeEpisodeAudioIndex } = action.payload;
      let activeEpisodeAudio = episodeAudios[activeEpisodeAudioIndex];
      // special case where segment is an ad or otherwise broken, try next one
      if (
        !activeEpisodeAudio ||
        !activeEpisodeAudio.duration ||
        !activeEpisodeAudio.url
      ) {
        activeEpisodeAudioIndex = getNextActiveIndex(
          activeEpisodeAudioIndex,
          episodeAudios
        );
        activeEpisodeAudio = episodeAudios[activeEpisodeAudioIndex];
      }
      return {
        ...state,
        activeEpisodeAudioIndex,
        activeEpisodeAudio,
        playedDuration: playedDurationFromEpisodeAudiosAndActiveIndex(
          episodeAudios,
          activeEpisodeAudioIndex
        ),
      };
    }
    case RECEIVE_ACTIVE_EDITOR_AUDIO_INDEX: {
      const { activeEditorAudioIndex } = action.payload;
      // Audio state from editor is kept locally in the AvailableSegment components
      // This may not be the best way to do this, as the state is reset when the tab is switched
      return {
        ...state,
        activeEditorAudioIndex,
        isPlaying: false,
      };
    }
    case STOP_EDITOR_AUDIO: {
      return {
        ...state,
        activeEditorAudioIndex: -1,
      };
    }
    case RECEIVE_EPISODE_FETCH_REQUEST: {
      return {
        ...state,
        isFetchingEpisode: true,
      };
    }
    case RECEIVE_DELETE_SEGMENT_PROMPT: {
      return {
        ...state,
        requestDeleteAudio: action.payload.audio,
      };
    }
    case IS_SHOWING_DELETION_NOT_ALLOWED_MODAL: {
      return {
        ...state,
        isShowingDeletionNotAllowedModal:
          action.payload.isShowingDeletionNotAllowedModal,
      };
    }
    case DELETION_MODAL_USED_IN_EPISODES: {
      return {
        ...state,
        deletionModalUsedInEpisodes: action.payload.deletionModalUsedInEpisodes,
      };
    }
    case SET_DO_ABANDON_CHANGES: {
      return {
        ...state,
        doAbandonChanges: action.payload.doAbandonChanges,
      };
    }
    case SET_IS_HOVERING_OVER_ADD_BUTTON: {
      return {
        ...state,
        isHoveringOverAddButton: action.payload.isHoveringOverAddButton,
      };
    }
    case SET_IS_USING_SHORTCUT_UPLOAD_FLOW: {
      return {
        ...state,
        isUsingShortcutUploadFlow: action.payload,
      };
    }
    case IS_UNPUBLISH_APPROVED_EPISODE_MODAL_OPEN: {
      return {
        ...state,
        isUnpublishApprovedEpisodeModalOpen: action.isOpen,
        unpublishEpisodeError: false,
      };
    }
    case IS_UNABLE_TO_EDIT_EPISODE_MODAL_OPEN: {
      return {
        ...state,
        isUnableToEditEpisodeModalOpen: action.isOpen,
        unpublishEpisodeError: false,
      };
    }
    case IS_UNABLE_TO_ADD_SONG_MODAL: {
      return {
        ...state,
        isMusicAndTalkFastTrackEnabled: action.isMusicAndTalkFastTrackEnabled,
        isUnableToAddSongModalOpen: action.isOpen,
      };
    }
    case IS_UNABLE_TO_ADD_SONG_TO_PAYWALLED_EPISODE_MODAL: {
      return {
        ...state,
        isUnableToAddSongToPaywalledEpisodeModalOpen: action.isOpen,
      };
    }
    case SET_UNPUBLISH_EPISODE_ERROR: {
      return {
        ...state,
        unpublishEpisodeError: true,
      };
    }
    default:
      return state;
  }
}

// action creators

export function setPodcastEpisodeId(podcastEpisodeId) {
  return { type: SET_PODCAST_EPISODE_ID, payload: { podcastEpisodeId } };
}

export const setHasUnsavedCaption = hasUnsavedCaption => (
  dispatch,
  getState
) => {
  const {
    episodeEditorScreen: { hasUnsavedCaption: prevHasUnsavedCaption },
  } = getState();
  // this action can be triggered in an input on key press, so only dispatch
  // action if the value has changed to avoid dispatching unecessarily
  if (prevHasUnsavedCaption !== hasUnsavedCaption) {
    dispatch({
      type: SET_HAS_UNSAVED_CAPTION,
      payload: {
        hasUnsavedCaption,
      },
    });
  }
};
function setUploadProgress({ tmpAudioId, percentComplete }) {
  return {
    type: SET_UPLOAD_PROGRESS,
    payload: { tmpAudioId, percentComplete },
  };
}

function setExtractingAudioStatus(isExtractingAudio) {
  return {
    type: SET_IS_EXTRACTING_AUDIO_STATUS,
    payload: { isExtractingAudio },
  };
}

export const addAudioToEpisode = (audio, idx, playlistId) => (
  dispatch,
  getState
) => {
  const {
    global: {
      podcast: {
        podcast: {
          webStationId,
          metadata: { isMusicAndTalkFastTrackEnabled, isPWEnabled, isPWSetup },
        },
      },
    },
    episodeEditorScreen: {
      isDraft,
      initialEpisodeAudios,
      reviewState,
      metadata: { isPW: isPWEpisode },
    },
  } = getState();

  // published episodes distributed via RSS can't add music until they're unpublished
  if (
    initialEpisodeAudios &&
    !initialEpisodeAudios.some(({ type }) => type === 'music') &&
    !isDraft &&
    audio.type === 'music'
  ) {
    dispatch(
      setIsUnableToAddSongModalOpen(true, isMusicAndTalkFastTrackEnabled)
    );
  } else if (
    !isMusicAndTalkFastTrackEnabled &&
    !isDraft &&
    reviewState === 'accepted'
  ) {
    //  published M+T episodes need to be unpublished and re-reviewed to be edited
    dispatch(setIsUnpublishApprovedEpisodeModalOpen(true));
  } else if (
    isPWEnabled &&
    isPWSetup &&
    isPWEpisode &&
    audio.type === 'music'
  ) {
    // paywalled episodes cannot be M+T episodes
    dispatch(setIsUnableToAddSongToPaywalledEpisodeModalOpen(true));
  } else if (audio.type === 'music') {
    AnchorAPI.createMusicSegment({ webStationId, audio })
      .then(({ audio: newAudio }) => {
        dispatchAddAudio(newAudio);
        events.musicAdded({ type: audio.type, playlistId });
      })
      .catch(() => {
        addAudioToEpisodeError({
          title: 'Unexpected Error',
          message: '',
          subTitle:
            'There was an error adding this music segment to your episode. Please try again and if the issue persists, contact support.',
        });
      });
  } else {
    dispatchAddAudio(audio);
  }

  function dispatchAddAudio(newAudio) {
    dispatch({
      type: ADD_AUDIO_TO_EPISODE,
      payload: {
        audio: newAudio,
        idx,
      },
    });
  }
};

export function setIsShowingSponsorshipsMusicErrorModal(
  isShowingSponsorshipsMusicErrorModal
) {
  return {
    type: SET_IS_SHOWING_SPONSORSHIPS_MUSIC_ERROR_MODAL,
    payload: {
      isShowingSponsorshipsMusicErrorModal,
    },
  };
}
export function setDeletionModalUsedInEpisodes(deletionModalUsedInEpisodes) {
  return {
    type: DELETION_MODAL_USED_IN_EPISODES,
    payload: {
      deletionModalUsedInEpisodes,
    },
  };
}

export function setIsShowingAnchorFirstAdModal(isShowingAnchorFirstAdModal) {
  return {
    type: SET_IS_SHOWING_ANCHOR_FIRST_AD_MODAL,
    payload: {
      isShowingAnchorFirstAdModal,
    },
  };
}

export function setIsShowingPublishNewEpisodeScreen(
  isShowingPublishNewEpisodeScreen
) {
  return {
    type: SET_IS_SHOWING_PUBLISH_NEW_EPISODE_SCREEN,
    payload: {
      isShowingPublishNewEpisodeScreen,
    },
  };
}

export function setIsShowingActivateSponsorshipsConfirmationModal(
  isShowingActivateSponsorshipsConfirmationModal
) {
  return {
    type: SET_IS_SHOWING_ACTIVATE_SPONSORSHIPS_CONFIRMATION_MODAL,
    payload: {
      isShowingActivateSponsorshipsConfirmationModal,
    },
  };
}

export function setAutoPairedCampaign(autoPairedCampaign) {
  return {
    type: SET_AUTO_PAIRED_CAMPAIGN,
    payload: {
      autoPairedCampaign,
    },
  };
}

export function replaceAudioInEpisode({
  urlToReplace,
  audioIdToReplace,
  tmpAudioIdToReplace,
  audio,
}) {
  return {
    type: REPLACE_AUDIO_IN_EPISODE,
    payload: {
      urlToReplace,
      audioIdToReplace,
      tmpAudioIdToReplace,
      audio,
    },
  };
}

function addAudioToEpisodeError({ title, subTitle, message, isModal = false }) {
  const error = new Error(message);
  error.title = title;
  error.subTitle = subTitle;
  error.isModal = isModal;
  return {
    type: ADD_AUDIO_TO_EPISODE,
    payload: error,
    error: true,
  };
}

export function resetPodcastEpisode() {
  return {
    type: RESET_PODCAST_EPISODE,
  };
}

function receivePodcastEpisode({
  created,
  createdUnixTimestamp,
  description,
  episodeAudios,
  episodeImage,
  isDraft,
  isPW,
  shareLinkPath,
  shareLinkEmbedPath,
  podcastId,
  podcastEpisodeId,
  podcastEpisodeIsExplicit,
  podcastEpisodeNumber,
  podcastEpisodeType,
  podcastSeasonNumber,
  publishOn,
  safeDescription,
  status,
  title,
  reviewState,
  wordpressPostMetadataId,
  containsMusicSegments,
}) {
  let metadata = {
    created,
    createdUnixTimestamp,
    description,
    episodeImage,
    isPW,
    podcastEpisodeIsExplicit,
    podcastEpisodeNumber,
    podcastEpisodeType,
    podcastSeasonNumber,
    safeDescription,
    title,
    wordpressPostMetadataId,
    containsMusicSegments,
  };
  if (Object.values(metadata).filter(v => !!v).length === 0) {
    metadata = null;
  }
  return {
    type: RECEIVE_PODCAST_EPISODE,
    payload: {
      episodeAudios,
      isDraft,
      isFetchingEpisode: false,
      metadata,
      podcastId,
      podcastEpisodeId,
      publishOn,
      shareLinkPath,
      shareLinkEmbedPath,
      status,
      reviewState,
    },
  };
}

function setIsUpdating(isUpdating) {
  return {
    type: SET_IS_UPDATING,
    payload: {
      isUpdating,
    },
  };
}

export function setIsDraft(isDraft) {
  return {
    type: SET_IS_DRAFT,
    payload: {
      isDraft,
    },
  };
}

function setDoAbandonChanges(doAbandonChanges) {
  return {
    type: SET_DO_ABANDON_CHANGES,
    payload: {
      doAbandonChanges,
    },
  };
}

export function receiveActiveEpisodeAudioIndex(activeEpisodeAudioIndex) {
  return {
    type: RECEIVE_ACTIVE_EPISODE_AUDIO_INDEX,
    payload: {
      activeEpisodeAudioIndex,
    },
  };
}

export function receiveActiveEditorAudioIndex(activeEditorAudioIndex) {
  return {
    type: RECEIVE_ACTIVE_EDITOR_AUDIO_INDEX,
    payload: {
      activeEditorAudioIndex,
    },
  };
}

export function setIsPlaying(isPlaying) {
  return {
    type: SET_IS_PLAYING,
    payload: {
      isPlaying,
    },
  };
}

export function endEpisodeAudio() {
  return {
    type: END_EPISODE_AUDIO,
  };
}

export function receiveDeleteSegmentPrompt(audio) {
  return {
    type: RECEIVE_DELETE_SEGMENT_PROMPT,
    payload: {
      audio,
    },
  };
}

export function setIsShowingDeletionNotAllowedModal(
  isShowingDeletionNotAllowedModal
) {
  return {
    type: IS_SHOWING_DELETION_NOT_ALLOWED_MODAL,
    payload: {
      isShowingDeletionNotAllowedModal,
    },
  };
}

export function receiveEpisodeAudioCaption(audio) {
  return (dispatch, getState) => {
    const {
      episodeEditorScreen: { episodeAudios, isDraft },
    } = getState();
    if (!isDraft && episodeAudios.some(({ type }) => type === 'music')) {
      dispatch(setIsUnableToEditEpisodeModalOpen(true));
    } else {
      dispatch({
        type: RECEIVE_EPISODE_AUDIO_CAPTION,
        payload: audio,
      });
    }
  };
}

export function receiveEpisodeFetchRequest() {
  return {
    type: RECEIVE_EPISODE_FETCH_REQUEST,
  };
}

export function stopEditorAudio() {
  return {
    type: STOP_EDITOR_AUDIO,
  };
}

export function dismissAudioError() {
  return {
    type: DISMISS_AUDIO_ERROR,
  };
}

export function receiveIsHoveringOnAddButton(isHoveringOverAddButton) {
  return {
    type: SET_IS_HOVERING_OVER_ADD_BUTTON,
    payload: { isHoveringOverAddButton },
  };
}

function trackGAEpisodeMetadataFormSubmit(publishOn, isDraft) {
  return {
    type: '', // no actual actions
    meta: {
      analytics: {
        type: 'event-episode-editor-submit',
        payload: {
          target: publishOn ? 'Schedule' : isDraft ? 'Save Draft' : 'Publish',
          value: publishOn && publishOn.unix && publishOn.unix(),
        },
      },
    },
  };
}

export function setIsUsingShortcutUploadFlow(isUsingShortcutUploadFlow) {
  return {
    type: SET_IS_USING_SHORTCUT_UPLOAD_FLOW,
    payload: isUsingShortcutUploadFlow,
  };
}

export function setIsAdStateEnabled(isAdStateEnabled) {
  return {
    type: SET_IS_AD_STATE_ENABLED,
    payload: isAdStateEnabled,
  };
}

export function setIsUnpublishApprovedEpisodeModalOpen(isOpen) {
  return {
    type: IS_UNPUBLISH_APPROVED_EPISODE_MODAL_OPEN,
    isOpen,
  };
}

export function setIsUnableToAddSongModalOpen(
  isOpen,
  isMusicAndTalkFastTrackEnabled
) {
  return {
    type: IS_UNABLE_TO_ADD_SONG_MODAL,
    isOpen,
    isMusicAndTalkFastTrackEnabled,
  };
}

export function setIsUnableToAddSongToPaywalledEpisodeModalOpen(isOpen) {
  return {
    type: IS_UNABLE_TO_ADD_SONG_TO_PAYWALLED_EPISODE_MODAL,
    isOpen,
  };
}

export function setIsUnableToEditEpisodeModalOpen(isOpen) {
  return {
    type: IS_UNABLE_TO_EDIT_EPISODE_MODAL_OPEN,
    isOpen,
  };
}

function setUnpublishEpisodeError() {
  return {
    type: SET_UNPUBLISH_EPISODE_ERROR,
  };
}

export const setPublishOn = publishOn => ({
  type: SET_PUBLISH_ON,
  payload: {
    publishOn,
  },
});

// thunks
export const updateEpisodeMetadata = (
  { data },
  { optedIntoDistribution, isOpenToolTip, delayRedirect }
) => dispatch => {
  return dispatch(
    submitUpdateEpisodeMetadataForm(data, {
      optedIntoDistribution,
      isOpenToolTip,
      delayRedirect,
    }) // always publish everywhere, product decision
  ).then(() => {
    dispatch(fetchStatus())
      .then(() => {
        dispatch(storeDuckOperations.fetchAndUpdateAllData());
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.log('ERROR', err);
      });
  });
};

export const updateSponsorshipsFeaturePreference = sponsorshipsFeaturePreference => (
  dispatch,
  getState
) => {
  const {
    global: {
      podcast: {
        podcast: { webStationId },
      },
    },
  } = getState();
  return AnchorAPI.updateSponsorshipsPreference({
    webStationId,
    sponsorshipsFeaturePreference,
  });
};

async function handleUpdateEpisodeAdState({ webEpisodeId }) {
  const {
    isAutoPairedWithSponsor,
    adCampaignId,
  } = await AnchorAPI.updateEpisodeAdState({
    isAdSlotEnabled: true,
    webEpisodeId,
  });
  return { isAutoPairedWithSponsor, adCampaignId };
}

async function handleFetchAdCampaignForStation({
  adCampaignId,
  webStationId,
  hasAuthenticatedStripe,
  dispatch,
}) {
  const {
    adCampaigns: adCampaignsJSON,
    audios: audiosJSON,
  } = await AnchorAPI.fetchAdCampaignForStation(adCampaignId, webStationId);
  const campaignJSON = adCampaignsJSON[0];
  const campaign = SponsorshipsDecoder.decodeAdCampaignJSONIntoCampaign(
    campaignJSON,
    audiosJSON
  );
  const campaignForAdRecording = SponsorshipsDecoder.decodeCampaignIntoAdRecordingModalCampaign(
    campaign,
    hasAuthenticatedStripe
  );
  dispatch(setAutoPairedCampaign(campaignForAdRecording));
  dispatch(setIsShowingAnchorFirstAdModal(true));
  return null;
}

/**
 * im not 100% sure why we need to call these, but im keeping it here just in case
 */
function handleRefetch({ isUpdating, podcastEpisodeId, dispatch }) {
  // Prevent losing uploads/etc. The slot will change into a proper ad slot toggle once processing finishes
  if (!isUpdating) {
    dispatch(fetchPodcastEpisode(podcastEpisodeId));
  }
  dispatch(globalPodcastDuckOperations.fetchPodcastAndSet());
}

function handleActivateSponsorshipsError({ err, dispatch }) {
  if (err instanceof AnchorAPIError) {
    const {
      response: { status: statusCode },
    } = err;
    if (statusCode === 451) {
      dispatch(setIsShowingSponsorshipsMusicErrorModal(true));
    }
  }
  // reset because of failed fetch
  dispatch(setIsAdStateEnabled(false));
}

export function handleActivateSponsorshipsSuccess({
  podcastEpisodeId,
  isUpdating,
}) {
  return async (dispatch, getState) => {
    const {
      global: {
        podcast: {
          podcast: { webStationId },
        },
      },
      money: {
        status: { hasAuthenticatedStripe },
      },
    } = getState();
    try {
      dispatch(setIsAdStateEnabled(true));
      if (!podcastEpisodeId) {
        dispatch(globalPodcastDuckOperations.fetchPodcastAndSet());
        return Promise.resolve(null);
      }
      const {
        isAutoPairedWithSponsor,
        adCampaignId,
      } = await handleUpdateEpisodeAdState({
        webEpisodeId: podcastEpisodeId,
      });
      if (isAutoPairedWithSponsor) {
        await handleFetchAdCampaignForStation({
          adCampaignId,
          webStationId,
          hasAuthenticatedStripe,
          dispatch,
        });
      }
      refetch();
      return Promise.resolve(null);
    } catch (err) {
      handleActivateSponsorshipsError({ err, dispatch });
      return Promise.reject(
        new Error('unable to handle activation success callback')
      );
    }

    function refetch() {
      handleRefetch({ isUpdating, dispatch, podcastEpisodeId });
    }
  };
}

export const activateSponsorshipsForFirstTime = ({
  isUpdating,
  podcastEpisodeId,
}) => async (dispatch, getState) => {
  const {
    global: {
      podcast: {
        podcast: { webStationId },
      },
    },
  } = getState();

  try {
    await AnchorAPI.updateSponsorshipsPreference({
      webStationId,
      sponsorshipsFeaturePreference: 'accepted',
    });
    dispatch(
      handleActivateSponsorshipsSuccess({ podcastEpisodeId, isUpdating })
    );
  } catch (err) {
    handleActivateSponsorshipsError({ err, dispatch });
  }
};

export function removeAudioWithIdAndReplaceWithAudios(audioId, audios) {
  return (dispatch, getState) => {
    const {
      episodeEditorScreen: { episodeAudios },
    } = getState();
    const indexOfAudioToReplace = episodeAudios.findIndex(
      episodeAudio => episodeAudio.audioId === audioId
    );

    return new Promise(() => {
      dispatch(removeAudioInEpisode(indexOfAudioToReplace));
      audios.forEach((audio, index) => {
        const audioIndex = indexOfAudioToReplace + index;
        dispatch(
          addProcessingAudioId({
            audioIdToReplace: audio.audioId,
          })
        );
        dispatch(addAudioToEpisode(audio, audioIndex));
      });
      dispatch(fetchMyLibrary());
    });
  };
}

export function updateAudioSegmentCaption(audio) {
  const { audioId, caption, type } = audio;
  return dispatch => {
    // Eager update
    const audioToUpdate = {};
    audioToUpdate[audioId] = { caption, type };
    dispatch(updateAudios(audioToUpdate));
    return fetch(`/api/sourceaudio/caption/${audioId}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ caption }),
    }).then(
      response =>
        // if (response.status === 200) {
        // } else {
        //   // TODO: fail undo
        // }
        response
    );
  };
}

function handleDeleteAudioSegment(audio) {
  if (audio.callinId) {
    return AnchorAPI.hideCallIn(audio.callinId).catch(e =>
      AnchorAPIError(e, `Error hiding audio with callinId ${audio.callinId}`)
    );
  }
  return fetch(`/api/proxy/v3/audios/webAudioId:${audio.audioId}/delete`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      isRejectedIfUsedInEpisode: true,
    }),
  });
}

export function deleteAudioSegment() {
  // Redux store receives the requested audio segment; this action takes the state in the store
  // and deletes that audioId
  // eslint-disable-next-line consistent-return
  return (dispatch, getState) => {
    const { episodeEditorScreen } = getState();
    const { requestDeleteAudio } = episodeEditorScreen;
    if (requestDeleteAudio !== null) {
      return handleDeleteAudioSegment(requestDeleteAudio).then(response => {
        dispatch(receiveDeleteSegmentPrompt(null));
        if (response.status === 409) {
          response.json().then(jsonBody => {
            const episodeTitles = jsonBody.conflictingData.usedInEpisodes.map(
              episode => episode.title
            );
            dispatch(setIsShowingDeletionNotAllowedModal(true));
            dispatch(setDeletionModalUsedInEpisodes(episodeTitles));
          });
        }
        return response;
      });
      // warning: this fetch response is handled by EpisodeEditor/index.js
      // because it refetches the feeds after the fact
    }
  };
}

export function fetchPodcastEpisode(podcastEpisodeId) {
  return dispatch => {
    dispatch(receiveEpisodeFetchRequest());
    return (
      fetch(`/api/podcastepisode/${podcastEpisodeId}`, {
        credentials: 'same-origin',
      })
        // eslint-disable-next-line consistent-return
        .then(response => {
          if (response.status === 200) {
            return response.json();
          }
          if (response.status === 401) {
            // not logged in
            dispatch(unsetAndRedirectUser());
            // eslint-disable-next-line consistent-return
            return;
          }
          // e.g. no permissions (403)
          dispatch(push('/404'));
        })
        .then(responseJson => {
          dispatch(receivePodcastEpisode(responseJson));
          return responseJson;
        })
    );
  };
}

export function updatePodcastEpisode() {
  return (dispatch, getState) => {
    const { episodeEditorScreen } = getState();
    const data = {
      episodeAudios: episodeEditorScreen.episodeAudios,
      isDraft: episodeEditorScreen.isDraft,
      publishOn: episodeEditorScreen.publishOn,
    };
    dispatch(setIsUpdating(true));
    return (
      createOrUpdatePodcastEpisodeOnServer(
        data,
        episodeEditorScreen.podcastEpisodeId
      )
        // eslint-disable-next-line consistent-return
        .then(response => {
          if (response.status === 200) {
            return response.json();
          }
          if (response.status === 401) {
            // not logged in
            dispatch(unsetAndRedirectUser());
            // eslint-disable-next-line consistent-return
            return;
          }
          // e.g. no permissions (403)
          dispatch(push('/404'));
        })
        .finally(() => {
          dispatch(setIsUpdating(false));
        })
    );
  };
}

export function getLocalAudio(file, acceptedFilesIndex, positionIndex) {
  return new Promise((resolve, reject) => {
    nextFrame(() => {
      const blob = getBlobUrlCreator();
      if (!blob) {
        reject(new Error('Blob doesnt exist'));
      }
      const url = blob.createObjectURL(file);

      // create an element in memory to get duration
      const audio = document.createElement('audio');
      audio.addEventListener('canplaythrough', () => {
        // // Chrome web recording bug
        // if (audio.duration === Infinity || audio.duration === NaN) {
        //   audio.duration = fallbackDuration;
        // }
        resolve(getAudioObject((audio.duration || 0) * 1000));
      });
      audio.addEventListener('error', () => {
        // if an error occurs, this means the audio cannot be previewed, e.g. aiff files
        // we'll still add the audio, but set the duration to 0
        resolve(getAudioObject(0));
      });
      audio.src = url;

      function getAudioObject(duration) {
        return {
          duration,
          url,
          acceptedFilesIndex,
          positionIndex,
          name: file.name,
          tmpAudioId: `${getUnixSaveFilePathName(
            file.name
          )}-${new Date().getTime()}`,
        };
      }
    });
  });
}

/**
 * handles uploading an audio file and updating the audio's upload status.
 * on success, the audio in the episode will be updated with the latest audio
 * object
 */
export function uploadFileAndAddToEpisode({
  file,
  isExtractedFromVideo,
  tmpAudioId,
}) {
  return dispatch => {
    handleSetUploadStatuses('uploading');
    return uploadAudioFile({
      file,
      fileCaption: isExtractedFromVideo
        ? `(Audio only) ${getFileCaption(file)}`
        : getFileCaption(file),
      origin: 'podcasts:upload',
      onProgress: e => {
        if (e.lengthComputable) {
          dispatch(
            setUploadProgress({
              tmpAudioId,
              percentComplete: e.loaded / e.total,
            })
          );
        }
      },
      onSuccess: () => dispatch(deleteUploadStatus(tmpAudioId)),
      onError: () => handleSetUploadStatuses('error'),
    })
      .then(({ requestUuid }) => {
        pollAudioProcessingStatus({
          requestUuid,
          onSuccess: res => {
            const { data } = res;
            dispatch(
              replaceAudioInEpisode({
                tmpAudioIdToReplace: tmpAudioId,
                audio: { ...data, uploadState: 'processing' },
              })
            );
            dispatch(fetchMyLibrary());
          },
          onError: () => handleSetUploadStatuses('error'),
        });
      })
      .catch(err => {
        handleSetUploadStatuses('error');
        return Promise.reject(err); // pass through error
      });

    /**
     * this sets the appropriate upload `status` of a given audio.
     * the `status` is used to display the appropriate copy in `AudioSegmentSubtitle`
     * @param {*} status
     */
    function handleSetUploadStatuses(status) {
      dispatch(
        setUploadStatuses({
          audioId: tmpAudioId,
          tmpAudioId,
          status,
          file,
          isExtractedFromVideo,
        })
      );
    }
  };
}

function getIsFileAudioType(file) {
  return file.type.startsWith('audio/');
}
function getIsFileVideoType(file) {
  return file.type.startsWith('video/');
}
function getIsFileValidType(file) {
  return getIsFileAudioType(file) || getIsFileVideoType(file);
}
function getIsFileValidSize(file) {
  return file.size <= MAX_FILE_SIZE.size;
}
function getFileCaption(file) {
  // remove file extension
  return file.name.replace(/\.[^/.]+$/, '');
}

/**
 * We only accept a single file via upload, but inputs are arrays
 */
export function receiveAudioFiles(
  acceptedFiles,
  rejectedFiles,
  startingPositionIndex = null
) {
  return async dispatch => {
    dispatch({ type: DISMISS_AUDIO_ERROR });
    // check file type is video or audio
    const filesRejectedDueToType = acceptedFiles.filter(
      acceptedFile => !getIsFileValidType(acceptedFile)
    );
    if (filesRejectedDueToType.length > 0) {
      dispatch(
        addAudioToEpisodeError({
          title: 'Upload Error',
          message: filesRejectedDueToType.map(f => f.name).join(', '),
          subTitle: (
            <div>
              A file you’re uploading is not supported. Please check the{' '}
              <DropdownButton
                activeOnHover
                direction="bottom"
                onClick={e => e.stopPropagation()}
                dropdownComponent={
                  <InfoBubble
                    positionAgainstParent={false}
                    className={bubbleStyles.bubble}
                    direction="bottom"
                    width={240}
                  >
                    <SupportedFormatsTooltip />
                  </InfoBubble>
                }
              >
                <span
                  css={css`
                    text-decoration: underline;
                  `}
                >
                  file requirements
                </span>
              </DropdownButton>{' '}
              and try again.
            </div>
          ),
        })
      );
      return Promise.reject(new Error('Rejection due to file type'));
    }

    // check if there are rejected files
    if (rejectedFiles > 0) {
      dispatch(
        addAudioToEpisodeError({
          title: 'Upload Error',
          message: rejectedFiles.map(f => f.name).join(', '),
          subTitle: 'The file you tried to upload was invalid.',
        })
      );
      return Promise.reject(new Error('File rejected due to unknown issue'));
    }

    // extract audio from video files, if present
    let allAudios;
    const videoFileIndexes = []; // this will be used for size validation of audio extraced from video
    dispatch(setExtractingAudioStatus(true));
    try {
      const allAudiosPromise = acceptedFiles.map(
        async (acceptedFile, index) => {
          const isVideoFile = getIsFileVideoType(acceptedFile);
          let file = acceptedFile;
          if (isVideoFile) {
            // eslint-disable-next-line prefer-destructuring
            file = (await extractAudio([acceptedFile]))[0];
            videoFileIndexes.push(index);
          }
          return file;
        }
      );
      allAudios = await Promise.all(allAudiosPromise);
      dispatch(setExtractingAudioStatus(false));
    } catch {
      // show error if extraction fails
      dispatch(setExtractingAudioStatus(false));
      dispatch(
        addAudioToEpisodeError({
          title: 'Video Conversion Error',
          message: '',
          subTitle:
            'There was an error converting video to audio. Please try again and if the issue persists, contact support.',
        })
      );
      return Promise.reject(new Error('Unable to extract audio'));
    }

    // check if audios are within the size limit
    const filesRejectedDueToSize = allAudios.filter(
      audio => !getIsFileValidSize(audio)
    );

    if (filesRejectedDueToSize.length > 0) {
      // check to see if a invalid file size is due to audio extracted from video
      // and set the respective error copy
      dispatch(
        addAudioToEpisodeError({
          title: 'Upload Error',
          message: filesRejectedDueToSize.map(f => f.name).join(', '),
          subTitle: (
            <div>
              A file you’re uploading is too large. Please check the{' '}
              <DropdownButton
                activeOnHover
                direction="bottom"
                dropdownComponent={
                  <InfoBubble
                    positionAgainstParent={false}
                    className={bubbleStyles.bubble}
                    direction="bottom"
                    width={240}
                  >
                    <SupportedFormatsTooltip />
                  </InfoBubble>
                }
              >
                <span
                  css={css`
                    text-decoration: underline;
                  `}
                >
                  file requirements
                </span>
              </DropdownButton>{' '}
              and try again.
            </div>
          ),
        })
      );
      return Promise.reject(new Error('File rejected due to size'));
    }

    dispatch(setDoAbandonChanges(false));
    return Promise.all(
      allAudios.map((file, index) => {
        // `startingPositionIndex` is used to place dragged audio into a specific slot within
        // the staging area. that means if the person drags a new file between audio slots that
        // are currently in 0 and 1, the `startingPositionIndex` === 1 and when we add this
        // audio to the UI, it'll be placed in between the current audios as expected.
        const positionIndex = startingPositionIndex
          ? startingPositionIndex + index
          : index;
        const acceptedFilesIndex = index;
        return getLocalAudio(file, acceptedFilesIndex, positionIndex);
      })
    )
      .then(localAudios => {
        addAudiosToUi(localAudios);
        return uploadFiles(localAudios);
      })
      .catch(() =>
        // no blob / preview support
        ({})
      )
      .finally(() => {
        for (const file of acceptedFiles) {
          garbageCollect(file);
        }
      });

    function addAudiosToUi(localAudios) {
      if (localAudios.length > 0) {
        const now = new Date();
        for (const localAudio of localAudios) {
          const { acceptedFilesIndex, positionIndex } = localAudio;
          const file = acceptedFiles[acceptedFilesIndex];
          const caption = getIsFileVideoType(file)
            ? `(Audio only) ${getFileCaption(file)}`
            : getFileCaption(file);
          dispatch(
            addAudioToEpisode(
              {
                ...localAudio,
                color: COLORS.UPLOAD_FROM_WEB,
                caption,
                created: now.toString(),
                uploadState: 'uploading',
                type: 'default',
              },
              positionIndex
            )
          );
        }
      }
    }

    async function uploadFiles(localAudios) {
      const uploadPromises = [];
      for (const localAudio of localAudios) {
        const { acceptedFilesIndex, tmpAudioId } = localAudio;
        const file = allAudios[acceptedFilesIndex];
        const originalFile = acceptedFiles[acceptedFilesIndex];
        uploadPromises.push(
          dispatch(
            uploadFileAndAddToEpisode({
              file,
              isExtractedFromVideo: getIsFileVideoType(originalFile),
              tmpAudioId,
            })
            // eslint-disable-next-line consistent-return
          ).catch(err => {
            const response = JSON.parse(err.response);
            if (response.reasonKind === 'UploadFileWithVideoStream') {
              dispatch(
                addAudioToEpisodeError({
                  title: "Can't upload video files",
                  subTitle: (
                    <span>
                      Unable to upload file. Please remove any video assets from
                      your file and try again.
                    </span>
                  ),
                  isModal: false,
                })
              );
              return Promise.reject(err);
            }
            if (err.status >= 500) {
              dispatch(
                addAudioToEpisodeError({
                  title: 'Upload failed',
                  subTitle: (
                    <span>
                      Something went wrong with your upload. Please try again.
                      If you’re uploading a large file ({`>`}100MB), you may
                      want to compress it into a smaller format, such as mp3. If
                      you need any help at all, please contact us any time at{' '}
                      <a
                        href="https://help.anchor.fm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        help.anchor.fm
                      </a>
                      !
                    </span>
                  ),
                  isModal: true,
                })
              );
              // propagate promise
              return Promise.reject(err);
            }
          })
        );
      }
      return Promise.all(uploadPromises);
    }

    function garbageCollect(file) {
      // garbage collect
      window.URL.revokeObjectURL(file.preview);
    }
  };
}

/**
 *
 * @param {float} position between 0 and 1
 */
export function updateEpisodePlaybackPosition(position) {
  return (dispatch, getState) => {
    const { episodeDuration, episodeAudios } = getState().episodeEditorScreen;
    const positionInMs = position * episodeDuration;
    const {
      audioIndex,
      audioPositionInMs,
    } = getSeekAudioIndexFromEpisodeAudiosAndPositionInMs(
      episodeAudios,
      positionInMs
    );
    dispatch(receiveActiveEpisodeAudioIndex(audioIndex));
    dispatch(updatePlaybackPositionInMs(audioPositionInMs, true));
  };
}

// misc
function episodeDurationFromEpisodeAudios(episodeAudios = []) {
  const containsMusicSegments = episodeAudios.some(
    ({ type }) => type === 'music'
  );
  if (containsMusicSegments) {
    return episodeAudios.reduce(
      (sum, audio) => addAudioToEpisodeDuration(sum, audio),
      0
    );
  }
  // duration is `null` for inactive ad slots
  return episodeAudios.reduce(
    (acc, curr) => acc + (curr.duration != null ? curr.duration : 0),
    0
  );
}

function playedDurationFromEpisodeAudiosAndActiveIndex(
  episodeAudios = [],
  activeIndex = 0
) {
  return episodeDurationFromEpisodeAudios(episodeAudios.slice(0, activeIndex));
}

// important that this returns a promise to the form submit handler
export function submitUpdateEpisodeMetadataForm(
  formData,
  { optedIntoDistribution, isOpenToolTip, delayRedirect }
) {
  return (dispatch, getState) => {
    const {
      episodeEditorScreen: {
        episodeAudios,
        metadata: { wordpressPostMetadataId },
      },
    } = getState();
    const data = {
      ...formData,
      episodeAudios,
      episodeImage: formData.episodeImage && formData.episodeImage.image,
      episodeImage400: formData.episodeImage && formData.episodeImage.image400,
    };
    dispatch(trackGAEpisodeMetadataFormSubmit(data.publishOn, data.isDraft));
    // Create Anchor image first if user edited their episode image

    // see if this has now been set
    // eslint-disable-next-line no-shadow
    // TODO https://anchorfm.atlassian.net/browse/WHEEL-805: Investigate Moving podcastEpisodeId Higher Inside submitUpdateEpisodeMetadataForm
    const podcastEpisodeId = getState().episodeEditorScreen.podcastEpisodeId;

    return createOrUpdatePodcastEpisodeOnServer(data, podcastEpisodeId, true)
      .then(async response => {
        const { status } = response;
        if (status === 400) {
          await response.text().then(errorText => {
            if (errorText) {
              throw new Error(errorText);
            } else {
              throw new Error(response.statusText);
            }
          });
        }
        // e.g. no permissions (403)
        if (status === 403) {
          dispatch(push('/404'));
          return;
        }
        if (status === 401) {
          dispatch(unsetAndRedirectUser());
          return;
        }
        if (status === 500) {
          throw new Error('There was a problem; please try again.');
        }
        // eslint-disable-next-line consistent-return
        return response.json();
      })
      .then(responseJson => {
        if (responseJson.publishStateFailureReason === 'musicNotAllowed') {
          throw new Error(EpisodeEditorPublishErrors.MUSIC_NOT_ALLOWED);
        }
        events.episodeSubmitted();
        dispatch(fetchPodcastEpisode(responseJson.podcastEpisodeId));
        // pull episode ID from response in case episode was created
        // clear local editor store
        dispatch(resetPodcastEpisode());

        // back to episode details
        const { isDraft, publishOn } = formData;

        setTimeout(() => {
          dispatch(
            push(
              getRedirectUrl({
                podcastEpisodeId:
                  responseJson.podcastEpisodeId || podcastEpisodeId,
                isPublishing: isDraft === false && publishOn === null,
                isWordPressEpisode: !!wordpressPostMetadataId,
                optedIntoDistribution,
                isOpenToolTip,
              })
            )
          );
        }, delayRedirect);
      });
  };
}

/**
 * add query parameter to show share modal for WP flows on the next page
 * if:
 * - episode is going from draft => published
 */
function getRedirectUrl({
  podcastEpisodeId,
  isWordPressEpisode,
  isPublishing,
  optedIntoDistribution,
  isOpenToolTip,
}) {
  let queryParams = '';
  if (isPublishing) {
    queryParams = `?wpshare=${isWordPressEpisode ? '1' : '2'}`;
  }
  let distributionQueryParam = '';
  if (isOpenToolTip) distributionQueryParam = '?isTooltipOpen=true';

  const url = optedIntoDistribution
    ? `/dashboard/podcast/distribution${distributionQueryParam}`
    : `/dashboard/episode/${podcastEpisodeId}${queryParams}`;
  return url;
}

export function deletePodcastEpisode() {
  return (dispatch, getState) => {
    const { episodeEditorScreen } = getState();
    return deletePodcastEpisodeOnServer(
      episodeEditorScreen.podcastEpisodeId
    ).then(response => {
      const { status } = response;
      // next frame to allow component state cleanup
      nextFrame(() => {
        // e.g. no permissions (403)
        if (status === 403) {
          dispatch(push('/404'));
          return;
        }
        if (status === 401) {
          dispatch(unsetAndRedirectUser());
          return;
        }
        // back to episode list?
        dispatch(push('/dashboard/episodes'));
      });
    });
  };
}

export function getPodcastEpisodeIdFromProps(props) {
  const { params } = props.match;
  return params ? params.podcastEpisodeId : undefined;
}

function createOrUpdatePodcastEpisodeOnServer(
  data,
  podcastEpisodeId,
  isMetadataOnly = false
) {
  // eslint-disable-next-line no-param-reassign
  data.hourOffset = getHourOffset();
  if (podcastEpisodeId) {
    if (isMetadataOnly) {
      return new Promise((resolve, reject) => {
        fetch(`/api/podcastepisode/${podcastEpisodeId}/metadata`, {
          method: 'PUT',
          credentials: 'same-origin',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(data),
        })
          .then(resolve)
          .catch(reject);
      });
    }
    return new Promise((resolve, reject) => {
      fetch(`/api/podcastepisode/${podcastEpisodeId}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(data),
      })
        .then(resolve)
        .catch(reject);
    });
  }

  return fetch('/api/podcastepisode', {
    method: 'POST',
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(data),
  }).then(response => {
    events.episodeCreated();
    return response;
  });
}

export function deletePodcastEpisodeOnServer(podcastEpisodeId) {
  return new Promise((resolve, reject) => {
    fetch(`/api/podcastepisode/${podcastEpisodeId}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    })
      .then(resolve)
      .catch(reject);
  });
}

function getNextActiveIndex(activeEpisodeAudioIndex, episodeAudios) {
  if (activeEpisodeAudioIndex === -1) {
    return -1;
  }
  const nextIndexStart = activeEpisodeAudioIndex + 1;
  const remainingAudios = episodeAudios.slice(nextIndexStart);
  const nextIndexFound = remainingAudios.findIndex(
    a => a && a.duration && a.url
  );
  if (nextIndexFound !== -1) {
    return nextIndexFound + nextIndexStart;
  }
  return -1;
}
export function markAudioAsExternalAdAction(audio) {
  return async dispatch => {
    try {
      const markExternalAdRequest = await AnchorAPI.markAudioAsExternalAd(
        audio
      );
      if (markExternalAdRequest.ok) {
        dispatch(fetchMyLibrary());
        dispatch(
          removeAudioWithIdAndReplaceWithAudios(audio.audioId, [
            {
              ...audio,
              isMarkedAsExternalAd: true,
            },
          ])
        );
        events.audioMarkedAsExternalAd({
          type: audio.type,
          duration: audio.duration,
        });
      }
    } catch (e) {
      addAudioToEpisode({ error: 'Could not mark as external ad' });
    }
  };
}
export function unMarkAudioAsExternalAdAction(audio) {
  return async dispatch => {
    try {
      const unMarkExternalAdRequest = await AnchorAPI.unMarkAudioAsExternalAd(
        audio
      );
      if (unMarkExternalAdRequest.ok) {
        dispatch(fetchMyLibrary());
        dispatch(
          removeAudioWithIdAndReplaceWithAudios(audio.audioId, [
            {
              ...audio,
              isMarkedAsExternalAd: false,
            },
          ])
        );
      }
      events.audioUnmarkedAsExternalAd({
        type: audio.type,
        duration: audio.duration,
      });
    } catch (e) {
      addAudioToEpisode({ error: 'Could not unmark as external ad' });
    }
  };
}

export function changeEpisodeSort({ startSort, endSort }) {
  return (dispatch, getState) => {
    const {
      episodeEditorScreen: { isDraft, initialEpisodeAudios, reviewState },
      global: {
        podcast: {
          podcast: {
            metadata: { isMusicAndTalkFastTrackEnabled },
          },
        },
      },
    } = getState();

    // published M+T episode needs to be unpublished before editing
    // unpublish rule doesn't apply for O&E/partnered shows (isMusicAndTalkFastTrackEnabled)
    if (
      !isMusicAndTalkFastTrackEnabled &&
      initialEpisodeAudios &&
      initialEpisodeAudios.some(({ type }) => type === 'music') &&
      !isDraft &&
      reviewState === 'accepted'
    ) {
      return dispatch(setIsUnableToEditEpisodeModalOpen(true));
    }
    return dispatch({
      type: CHANGE_EPISODE_SORT,
      payload: {
        startSort,
        endSort,
      },
    });
  };
}

export function removeAudioInEpisode(audioIndex) {
  return (dispatch, getState) => {
    const {
      episodeEditorScreen: { isDraft, initialEpisodeAudios, reviewState },
      global: {
        podcast: {
          podcast: {
            metadata: { isMusicAndTalkFastTrackEnabled },
          },
        },
      },
    } = getState();

    // published M+T episode needs to be unpublished before editing
    // unpublish rule doesn't apply for O&E/partnered shows (isMusicAndTalkFastTrackEnabled)
    if (
      !isMusicAndTalkFastTrackEnabled &&
      initialEpisodeAudios &&
      initialEpisodeAudios.some(({ type }) => type === 'music') &&
      !isDraft &&
      reviewState === 'accepted'
    ) {
      return dispatch(setIsUnableToEditEpisodeModalOpen(true));
    }
    return dispatch({
      type: REMOVE_AUDIO_IN_EPISODE,
      payload: { audioIndex },
    });
  };
}

/**
 * Updates a podcast's draft state by changing its publishOn value
 *
 * PUT /api/podcastepisode/:podcastEpisodeId/metadata
 * This endpoint assumes the client sends all metadata, not just one field
 * Constructs the episode's metadata using redux state and changes publishOn, isDraft
 *
 * @returns {function(*, *): Promise<void>}
 */
export function unpublishEpisode() {
  return (dispatch, getState) => {
    const {
      episodeEditorScreen: { podcastEpisodeId, episodeAudios, metadata },
    } = getState();
    return AnchorAPI.updateEpisodeMetadata({
      podcastEpisodeId,
      metadata: {
        ...metadata,
        isDraft: true,
        publishOn: null,
        episodeAudios,
      },
      // eslint-disable-next-line consistent-return
    }).then(({ error }) => {
      if (error) {
        dispatch(setUnpublishEpisodeError());
        return Promise.reject(error);
      }
      dispatch(setIsDraft(true));
      dispatch(setPublishOn(null));
    });
  };
}
