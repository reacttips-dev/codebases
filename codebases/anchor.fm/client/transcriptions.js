import { replace, push } from 'react-router-redux';
import { unsetAndRedirectUser } from './user';
import { receiveError } from './errorModal';
import { AnchorAPI } from './modules/AnchorAPI';
import { Browser } from './modules/Browser/index.ts';
import { events } from './screens/AudioTranscriptionScreen/events';

const { localStorage } = Browser;

const PREFIX = '@@transcriptions/';

export const RECEIVE_TRANSCRIPTION = `${PREFIX}RECEIVE_TRANSCRIPTION`;
export const RECEIVE_EPISODE_AUDIO = `${PREFIX}RECEIVE_EPISODE_AUDIO`;
export const ADD_TRANSCRIPTION = `${PREFIX}ADD_TRANSCRIPTION`;
export const EDIT_TRANSCRIPTION = `${PREFIX}EDIT_TRANSCRIPTION`;
export const SET_PLAYING = `${PREFIX}SET_PLAYING`;
export const FETCHING_TRANSCRIPTION = `${PREFIX}FETCHING_TRANSCRIPTION`;
export const SAVING_TRANSCRIPTION = `${PREFIX}SAVING_TRANSCRIPTION`;
export const FETCHING_VIDEO = `${PREFIX}FETCHING_VIDEO`;
export const SET_COLORS = `${PREFIX}SET_COLORS`;
export const SET_TRIM_START = `${PREFIX}SET_TRIM_START`;
export const SET_TRIM_END = `${PREFIX}SET_TRIM_END`;
export const POLL_FOR_VIDEO = `${PREFIX}POLL_FOR_VIDEO`;
export const RECEIVE_VIDEO_URLS = `${PREFIX}RECEIVE_VIDEO_URLS`;
export const RESET_TRANSCRIPTION = `${PREFIX}RESET_TRANSCRIPTION`;
export const RESET_STATE = `${PREFIX}RESET_STATE`;
export const SET_DO_SHOW_REQUEST_TRANSCRIPTION_CONFIRMATION = `${PREFIX}SET_DO_SHOW_REQUEST_TRANSCRIPTION_CONFIRMATION`;
export const VIDEO_TRANSCRIPTION_INDEX_DB_KEY = 'videoGenerationRequests';
export const VIDEO_GENERATION_REQUEST_POLL_TIMEOUT_ID =
  'videoGenerationRequestPollTimeoutId';
export const SET_VIDEO_GENERATION_REQUEST_STATUS = `${PREFIX}SET_VIDEO_GENERATION_REQUEST_STATUS`;

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

const DEFAULT_BACKGROUND = '#292F36';
const DEFAULT_HIGHLIGHT = '#31FAD7';

const TRANSCRIPTION_ERROR_MESSAGE =
  'Sorry, something went wrong while transcribing your video! Please contact Anchor support.';

const defaultState = {
  audioFile: EMPTY_OBJECT,
  audio: EMPTY_OBJECT,
  episodeId: null,
  transcription: EMPTY_ARRAY,
  originalTranscription: EMPTY_ARRAY,
  isFetchingTranscription: true, // TODO: CHANGE!!!!
  isSavingTranscription: false,
  isFetchingVideo: false,
  isPlaying: false,
  playedDuration: 0,
  dateUpdated: null, // last updated for transcription -- not sure if needed
  backgroundColor: DEFAULT_BACKGROUND,
  highlightColor: DEFAULT_HIGHLIGHT,
  spaceIdx: null,
  trimStart: null,
  trimEnd: null,
  requestUuid: null,
  requestTime: null,
  videoUrls: null,
  doShowTranscriptionRequestConfirmation: false,
  videoGenerationRequestStatus: null,
};

export const VIDEO_FORMATS = {
  WIDE: 'landscape',
  TALL: 'vertical',
  SQUARE: 'box',
};

function getVideoFormatKeyFromRatio(ratio) {
  switch (ratio) {
    case '9x16':
      return VIDEO_FORMATS.TALL;
    case '16x9':
      return VIDEO_FORMATS.WIDE;
    case '1x1':
    default:
      return VIDEO_FORMATS.SQUARE;
  }
}

// reducer
// eslint-disable-next-line import/no-default-export
export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case FETCHING_TRANSCRIPTION:
      return Object.assign({}, state, {
        isFetchingTranscription: action.payload.isFetchingTranscription,
      });
    case SAVING_TRANSCRIPTION:
      return Object.assign({}, state, {
        isSavingTranscription: action.payload.isSavingTranscription,
      });
    case RECEIVE_TRANSCRIPTION: {
      const { audioFile, audio, transcription } = action.payload;
      if (!audio.caption) audio.caption = 'Untitled'; // default to Untitled
      return Object.assign({}, state, {
        audioFile,
        audio,
        transcription,
        originalTranscription: transcription,
        isFetchingTranscription: false,
        dateUpdated: new Date(),
        trimStart: 0,
        trimEnd: transcription.length - 1,
      });
    }
    case EDIT_TRANSCRIPTION: {
      const { startIdx, endIdx, edit } = action.payload;
      const oldText = state.transcription;
      const editString = edit
        .trim()
        .split(' ')
        .filter(item => !!item);
      let update = [];
      let didDelete = false;
      if (!editString.length) {
        didDelete = true;
        // user DELETED.
        // prevent deletion of all remaining words
        if (oldText.length <= 1 || endIdx - startIdx === oldText.length - 1) {
          return Object.assign({}, state, {
            transcription: oldText,
            dateUpdated: new Date(),
            trimStart: 0,
            trimEnd: oldText.length - 1,
          });
        }
        // take the PREVIOUS start index, and stretch it to the END idx TO
        // using the PREVIOUS text, or the END + 1 text if beginning
        const fillText =
          startIdx === 0
            ? oldText[endIdx + 1].text
            : oldText[startIdx - 1].text;
        const fillFrom =
          startIdx === 0 ? oldText[0].from : oldText[startIdx - 1].from;
        const fillTo =
          endIdx === 0
            ? oldText[1].to
            : startIdx === 0
            ? oldText[endIdx + 1].to
            : oldText[endIdx].to;
        const fill = {
          from: fillFrom,
          to: fillTo,
          text: fillText,
        };
        update.push(fill);
      } else {
        const startTime = oldText[startIdx].from;
        const endTime = oldText[endIdx].to;
        const increment = (endTime - startTime) / editString.length;
        update = editString.map((item, idx) => ({
          from: startTime + idx * increment,
          to: startTime + (idx + 1) * increment,
          text: item,
        }));
      }
      const replaceStartIdx = didDelete ? Math.max(startIdx - 1, 0) : startIdx;
      const replaceEndIdx = didDelete && startIdx === 0 ? endIdx + 1 : endIdx;
      const newText = oldText.reduce((arr, item, idx) => {
        if (idx === replaceStartIdx) {
          return arr.concat(update);
        }
        if (idx < replaceStartIdx || idx > replaceEndIdx) {
          // (skip anything within the start and end)
          arr.push(item);
        }
        return arr;
      }, []);
      // Reset trimStart and trim end to start and end of an edit
      return Object.assign({}, state, {
        transcription: newText,
        dateUpdated: new Date(),
        trimStart: 0,
        trimEnd: newText.length - 1,
      });
    }
    case ADD_TRANSCRIPTION: {
      const { spaceIdx, edit } = action.payload;
      const oldText = state.transcription;
      const { duration } = state.audio;
      const editString = edit
        .trim()
        .split(' ')
        .filter(item => !!item);
      let update = [];
      // note -- adds new transcription 'between' start/end
      const startTime = spaceIdx ? oldText[spaceIdx].to : 0;
      const nextItem = oldText[spaceIdx + 1];
      const endTime = nextItem ? nextItem.from : duration / 1000;
      const increment = (endTime - startTime) / editString.length;
      update = editString.map((item, idx) => ({
        from: startTime + idx * increment,
        to: startTime + (idx + 1) * increment,
        text: item,
      }));
      let newText;
      if (nextItem) {
        newText = oldText.reduce((arr, item, idx) => {
          if (idx === spaceIdx) {
            // between start/end
            return [...arr, item, ...update];
          }
          // (skip anything within the start and end)
          return [...arr, item];
        }, []);
      } else {
        // end
        newText = oldText.concat(update);
      }
      // Reset trimStart and trim end to start and end of an edit
      return Object.assign({}, state, {
        transcription: newText,
        dateUpdated: new Date(),
        trimStart: 0,
        trimEnd: newText.length - 1,
      });
    }
    case FETCHING_VIDEO: {
      const { isFetchingVideo } = action.payload;
      return Object.assign({}, state, { isFetchingVideo });
    }
    case RECEIVE_VIDEO_URLS: {
      const { videoUrls } = action.payload;
      const audioObj = action.payload.audio;
      if (!audioObj.caption) {
        audioObj.caption = 'Untitled';
      }
      // reset video reqeust
      const mappedVideoFormats = videoUrls.reduce((acc, videoUrlObj) => {
        const { ratio, url, fileSize } = videoUrlObj;
        acc[getVideoFormatKeyFromRatio(ratio)] = {
          url,
          fileSize,
        };
        return acc;
      }, {});
      return Object.assign({}, state, {
        videoUrls: mappedVideoFormats,
        audio: audioObj,
        requestUuid: null,
        requestTime: null,
        isFetchingTranscription: false,
      });
    }
    case SET_PLAYING: {
      const { isPlaying } = action.payload;
      return Object.assign({}, state, { isPlaying });
    }
    case SET_COLORS: {
      const { backgroundColor, highlightColor } = action.payload;
      return Object.assign({}, state, { backgroundColor, highlightColor });
    }
    case SET_TRIM_START: {
      const { trimStart } = action.payload;
      if (!state.trimEnd || trimStart <= state.trimEnd) {
        return Object.assign({}, state, { trimStart });
      }
      return state;
    }
    case SET_TRIM_END: {
      const { trimEnd } = action.payload;
      if (!state.trimStart || trimEnd >= state.trimStart) {
        return Object.assign({}, state, { trimEnd });
      }
      return state;
    }
    case POLL_FOR_VIDEO: {
      const { requestUuid, requestTime } = action.payload;
      return Object.assign({}, state, {
        requestUuid,
        requestTime,
      });
    }
    case RESET_TRANSCRIPTION:
      return Object.assign({}, state, {
        transcription: state.originalTranscription,
        dateUpdated: new Date(),
      });
    case SET_DO_SHOW_REQUEST_TRANSCRIPTION_CONFIRMATION: {
      const { doShowTranscriptionRequestConfirmation } = action.payload;
      return {
        ...state,
        doShowTranscriptionRequestConfirmation,
      };
    }
    case SET_VIDEO_GENERATION_REQUEST_STATUS: {
      const {
        payload: { videoGenerationRequestStatus },
      } = action;
      return { ...state, videoGenerationRequestStatus };
    }
    case RESET_STATE:
      return defaultState;
    default:
      return state;
  }
}

export function resetTranscription() {
  return {
    type: RESET_TRANSCRIPTION,
  };
}

// Users who click request transcription will go back to the episode when returning from dash
function receiveEpisodeAudio(episodeId, audio = {}) {
  return {
    type: RECEIVE_EPISODE_AUDIO,
    payload: {
      episodeId,
      audio,
    },
  };
}

export function navigateToTranscription(audio, episodeId) {
  // TODO: episodeId and caption need to be fetched from the controllers
  return (dispatch, getState) => {
    dispatch(receiveEpisodeAudio(episodeId, audio));
    dispatch(push(`/dashboard/transcribe/${audio.audioId}`));
  };
}

function setFetchingTranscription(isFetchingTranscription) {
  return {
    type: FETCHING_TRANSCRIPTION,
    payload: {
      isFetchingTranscription,
    },
  };
}

function setFetchingVideo(isFetchingVideo) {
  return {
    type: FETCHING_VIDEO,
    payload: {
      isFetchingVideo,
    },
  };
}

function setSavingTranscription(isSavingTranscription) {
  return {
    type: SAVING_TRANSCRIPTION,
    payload: {
      isSavingTranscription,
    },
  };
}

export function receiveTranscription(audioFile, audio, transcription) {
  // audiofile contains url, created
  // audio contains caption, duration
  return {
    type: RECEIVE_TRANSCRIPTION,
    payload: {
      audioFile,
      audio,
      transcription,
    },
  };
}

// i.e. adding by clicking space
export function addTranscription(spaceIdx, edit) {
  return {
    type: ADD_TRANSCRIPTION,
    payload: {
      spaceIdx,
      edit,
    },
  };
}

// i.e. replacing a word
export function editTranscription(startIdx, endIdx, edit) {
  return {
    type: EDIT_TRANSCRIPTION,
    payload: {
      startIdx,
      endIdx,
      edit,
    },
  };
}

export function setAudioPlaying(isPlaying) {
  return {
    type: SET_PLAYING,
    payload: {
      isPlaying,
    },
  };
}

export const isValidHex = str => /^#(?=[0-9A-F]*$)(?:.{3}|.{6})$/i.test(str);

export function setVideoColors(backgroundColor, highlightColor) {
  return {
    type: SET_COLORS,
    payload: {
      backgroundColor: isValidHex(backgroundColor)
        ? backgroundColor
        : DEFAULT_BACKGROUND,
      highlightColor: isValidHex(highlightColor)
        ? highlightColor
        : DEFAULT_HIGHLIGHT,
    },
  };
}

export function setTrimStart(trimStart) {
  return {
    type: SET_TRIM_START,
    payload: {
      trimStart,
    },
  };
}

export function setTrimEnd(trimEnd) {
  return {
    type: SET_TRIM_END,
    payload: {
      trimEnd,
    },
  };
}

function startPollingForVideo(requestUuid, requestTime) {
  return {
    type: POLL_FOR_VIDEO,
    payload: {
      requestUuid,
      requestTime,
    },
  };
}

export function receiveVideoUrls(videoUrls, audio) {
  return {
    type: RECEIVE_VIDEO_URLS,
    payload: {
      videoUrls,
      audio,
    },
  };
}

export function resetState() {
  return {
    type: RESET_STATE,
  };
}

export function setVideoGenerationRequestStatus(videoGenerationRequestStatus) {
  return {
    type: SET_VIDEO_GENERATION_REQUEST_STATUS,
    payload: {
      videoGenerationRequestStatus,
    },
  };
}

export function setDoShowRequestTranscriptionConfirmation(
  doShowTranscriptionRequestConfirmation
) {
  return {
    payload: {
      doShowTranscriptionRequestConfirmation,
    },
    type: SET_DO_SHOW_REQUEST_TRANSCRIPTION_CONFIRMATION,
  };
}

function getVideoGenerationRequestStatus(requests) {
  const statuses = requests.map(request => request.status);
  if (statuses.includes('failed')) return 'failed';
  if (statuses.includes('inprogress')) return 'inprogress';
  if (statuses.includes('todo')) return 'todo';
  if (statuses.every(status => status === 'completed')) return 'completed';
  return 'failed';
}

export function pollForVideos({ audioId, requestIds }) {
  return async (dispatch, getState) => {
    const response = await AnchorAPI.fetchVideoTranscriptionRequestStatus(
      requestIds
    );
    if (response.status === 401) {
      return dispatch(unsetAndRedirectUser());
    }
    if (response.status === 404) {
      return dispatch(push('/404'));
    }
    const json = await response.json();
    const { requests } = json;
    const requestsStatus = getVideoGenerationRequestStatus(requests);
    function setPolling() {
      const timeoutId = setTimeout(() => {
        dispatch(pollForVideos({ audioId, requestIds }));
      }, 5000);
      localStorage.setItem(VIDEO_GENERATION_REQUEST_POLL_TIMEOUT_ID, timeoutId);
    }
    dispatch(setVideoGenerationRequestStatus(requestsStatus));
    switch (requestsStatus) {
      case 'completed': {
        removeTranscriptionRequestFromIndexedDB(audioId, requestIds);
        dispatch(fetchLatestVideoFromTranscriptionForDownload(audioId));
        return dispatch(setFetchingVideo(false));
      }
      case 'todo':
        return setPolling();
      case 'inprogress': {
        const requestTime = new Date(
          requests.find(request => request.status === 'inprogress').started
        );
        const now = new Date().getTime();
        if (requestTime && now - requestTime > 600000) {
          dispatch(setFetchingVideo(false));
          dispatch(setVideoGenerationRequestStatus('failed'));
        }
        // poll again after 5 seconds
        return setPolling();
      }
      case 'failed':
      default:
        return dispatch(setFetchingVideo(false));
    }
  };
}

export function fetchTranscription(audioId, options = {}) {
  return (dispatch, getState) => {
    // reset state on a new fetch if it doesn't match the current redux audioId
    if (getState().transcriptions.audio.audioId !== audioId) {
      dispatch(resetState());
    }
    dispatch(setFetchingTranscription(true));
    return new Promise((resolve, reject) => {
      fetch(`/api/transcription/${audioId}`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(options),
      })
        .then(resolve)
        .catch(reject);
    })
      .then(response => {
        if (response.status === 401) {
          return dispatch(unsetAndRedirectUser());
        }
        if (response.status === 403) {
          throw new Error(
            `User does not have permission for this audio: ${audioId}`
          );
        }
        if (response.status === 404) {
          throw new Error(`Unable to find audio: ${audioId}`);
        }
        if (response.status !== 200) {
          const { status, statusText, url } = response;
          throw new Error(
            `Unexpected response: ${status} - ${statusText} - ${url}`
          );
        }
        return response.json();
      })
      .then(({ transcription, audio, audioFile }) => {
        dispatch(receiveTranscription(audioFile, audio, transcription));
        dispatch(setFetchingTranscription(false));
      })
      .catch(() => {
        dispatch(
          receiveError(
            'Sorry, we had trouble transcribing your audio. Please contact Anchor support if this issue persists: https://help.anchor.fm.'
          )
        );
        dispatch(setFetchingTranscription(false));
      });
  };
}

export function fetchOriginalTranscription(audioId) {
  return (dispatch, getState) => {
    dispatch(fetchTranscription(audioId, { requestOriginal: true }));
  };
}

export function saveTranscription(audioId) {
  return async (dispatch, getState) => {
    // pass in match prop audioId for dispatch afterwards
    // and to keep in sync with fetchTranscription
    dispatch(setSavingTranscription(true));
    const {
      transcriptions: { transcription },
    } = getState();
    try {
      const response = await AnchorAPI.updateTranscription(
        audioId,
        transcription
      );
      if (response.status === 401) return dispatch(unsetAndRedirectUser());
      if (response.status === 404) return dispatch(push('/404'));
      if (response.status !== 200) {
        return dispatch(
          receiveError(
            'There was an error saving this transcription. Please contact Anchor support!'
          )
        );
      }
      events.audioTranscriptionCreated();
      return dispatch(setSavingTranscription(false));
    } catch (error) {
      console.error(error);
      return dispatch(receiveError(error.message));
    }
  };
}

export function goToDownloadPage(audioId) {
  return dispatch =>
    dispatch(push(`/dashboard/transcribe/${audioId}/download`));
}

async function addTranscriptionRequestToIndexedDB(transcriptionRequest) {
  const currentRequests =
    (await localStorage.getItem(VIDEO_TRANSCRIPTION_INDEX_DB_KEY)) || [];
  const newRequests = [...currentRequests, transcriptionRequest];
  localStorage.setItem(VIDEO_TRANSCRIPTION_INDEX_DB_KEY, newRequests);
  return newRequests;
}

async function removeTranscriptionRequestFromIndexedDB(audioId) {
  const requests = await localStorage.getItem(VIDEO_TRANSCRIPTION_INDEX_DB_KEY);
  if (requests || requests.length > 0) {
    const filteredRequests = requests.filter(
      request => request.audioId !== audioId
    );
    localStorage.setItem(VIDEO_TRANSCRIPTION_INDEX_DB_KEY, filteredRequests);
  }
}

export function generateVideoFromTranscription(audioId) {
  return async (dispatch, getState) => {
    dispatch(setFetchingVideo(true));
    dispatch(setVideoGenerationRequestStatus(null));
    const {
      user: {
        user: { userId },
      },
      global: {
        podcast: {
          podcast: { stationId },
        },
      },
    } = getState();
    try {
      const response = await AnchorAPI.generateVideoTranscriptionRequest(
        audioId,
        stationId,
        userId
      );
      if (response.status === 401) return dispatch(unsetAndRedirectUser());
      if (response.status === 404 || response.status === 415)
        return dispatch(push('/404'));
      if (response.status === 500) {
        return dispatch(receiveError(TRANSCRIPTION_ERROR_MESSAGE));
      }
      const requests = await response.json();
      if (requests && requests.length > 0) {
        const { transcriptionId } = requests[0];
        const requestIds = requests.map(request => request.requestId);
        const transcriptionRequest = {
          transcriptionId,
          requestIds,
          audioId,
          createdAt: new Date().getTime(),
        };
        events.videoCreated();
        return await addTranscriptionRequestToIndexedDB(transcriptionRequest);
      }
      console.error(TRANSCRIPTION_ERROR_MESSAGE);
      return dispatch(receiveError(TRANSCRIPTION_ERROR_MESSAGE));
    } catch (error) {
      console.error(error);
      return dispatch(receiveError(error.message));
    }
  };
}

export function fetchLatestVideoFromTranscriptionForDownload(audioId) {
  return (dispatch, getState) => {
    dispatch(setFetchingVideo(true));
    return new Promise(async (resolve, reject) => {
      const response = await AnchorAPI.fetchVideoTranscriptionRequestStatusByWebAudioId(
        audioId,
        true
      );
      const data = await response.json();
      fetch(`/api/transcription/${audioId}/video`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(data),
      })
        .then(resolve)
        .catch(reject);
    })
      .then(response => {
        if (response.status === 401) {
          return dispatch(unsetAndRedirectUser());
        }
        if (response.status === 404 || response.status === 415) {
          return dispatch(push('/404'));
        }
        return response.json();
      })
      .then(json => {
        if (json) {
          const { audio, urls } = json;
          dispatch(receiveVideoUrls(urls, audio));
        }
      })
      .catch(err => {
        dispatch(receiveError(err.message));
      })
      .finally(() => {
        dispatch(setFetchingVideo(false));
      });
  };
}
