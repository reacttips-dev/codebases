import { push } from 'react-router-redux';
import unescaper from 'anchor-server-common/utilities/unescaper';
import { AnchorAPI } from './modules/AnchorAPI/index';
import { PODCAST_EPISODE_AUDIO_TYPES } from '../helpers/serverRenderingUtils';
import { unsetAndRedirectUser } from './user';

export const RECEIVE_CALL_INS = '@@sourceAudio/RECEIVE_CALL_INS';
export const RECEIVE_INTERVIEWS = '@@sourceAudio/RECEIVE_INTERVIEWS';
export const RECEIVE_INTERLUDES = '@@sourceAudio/RECEIVE_INTERLUDES';
export const RECEIVE_MOBILE_RECORDINGS =
  '@@sourceAudio/RECEIVE_MOBILE_RECORDINGS';
export const RECEIVE_AUDIO_LIBRARY = '@@sourceAudio/RECEIVE_AUDIO_LIBRARY';
export const RECEIVE_LOCAL_RECORDING = '@@sourceAudio/RECEIVE_LOCAL_RECORDING';
export const UPDATE_UPLOADED_AUDIO = '@@sourceAudio/UPDATE_UPLOADED_AUDIO';
export const UPDATE_AUDIOS = '@@sourceAudio/UPDATE_AUDIOS';
export const SET_UPLOAD_STATUSES = '@@sourceAudio/SET_UPLOAD_STATUSES';
export const DELETE_UPLOAD_STATUS = '@@sourceAudio/DELETE_UPLOAD_STATUS';
export const ADD_PROCESSING_AUDIO_ID = '@@sourceAudio/ADD_PROCESSING_AUDIO_ID';
export const DELETE_PROCESSING_AUDIO_ID =
  '@@sourceAudio/DELETE_PROCESSING_AUDIO_ID';

export const AUDIO_TYPE_LABELS = {};
AUDIO_TYPE_LABELS[PODCAST_EPISODE_AUDIO_TYPES.MOBILE_RECORDING] = 'Record';
AUDIO_TYPE_LABELS[PODCAST_EPISODE_AUDIO_TYPES.UPLOAD] = 'Upload';
AUDIO_TYPE_LABELS[PODCAST_EPISODE_AUDIO_TYPES.INTERVIEW] = 'Interviews';
AUDIO_TYPE_LABELS[PODCAST_EPISODE_AUDIO_TYPES.CALL_IN] = 'Call In';
AUDIO_TYPE_LABELS[PODCAST_EPISODE_AUDIO_TYPES.INTERLUDE] = 'Transitions';
AUDIO_TYPE_LABELS[PODCAST_EPISODE_AUDIO_TYPES.LIBRARY] = 'Library';
AUDIO_TYPE_LABELS[PODCAST_EPISODE_AUDIO_TYPES.MUSIC] = 'Music';

const emptyArray = [];

const initialState = {
  callIns: emptyArray,
  audioLibrary: emptyArray,
  hasFetchedInterludes: false,
  hasFetchedMobileRecordings: false,
  hasFetchedCallIns: false,
  hasFetchedAudioLibrary: false,
  interludes: emptyArray,
  interviews: emptyArray,
  mobileRecordings: emptyArray,
  uploadStatuses: {},
  processingAudioIds: [],
};

// Edit metadata within audio arrays
function audioArrayReducer(state = [], action) {
  const { audios } = action.payload;
  const updatedAudios = state.map(audio => {
    const { audioId } = audio;
    return audios[audioId] ? { ...audio, ...audios[audioId] } : audio;
  });
  return updatedAudios;
}

// callins/interludes/interviews/recordings are reduced to arrays within sourceAudio
// with RECEIVE_<type> actions.
// because the fetch returns all of the current segments from that user, it is safe
// to overwrite the entire state in these scenarios
// however, this may not be the case/may not scale for other fetches
function callInReducer(state = emptyArray, action) {
  switch (action.type) {
    case RECEIVE_CALL_INS: {
      // `audios` sent from the controller don't have callinIds.
      // Here we can grab the callinId from `callIns` with matching audioIds
      const { audios, callIns } = action.payload;
      if (callIns) {
        return audios.map(a => ({
          ...a,
          callinId: callIns.find(callIn => callIn.webAudioId === a.audioId)
            .callinId,
        }));
      }
      return audios;
    }
    default:
      return state;
  }
}

function interludeReducer(state = emptyArray, action) {
  switch (action.type) {
    case RECEIVE_INTERLUDES: {
      const { interludes } = action.payload;
      const audioToAdd = interludes.map(interlude => ({
        ...interlude,
        caption: interlude.caption ? unescaper(interlude.caption) : null,
      }));
      return audioToAdd;
    }
    default:
      return state;
  }
}

/**
 * TODO: lots of abstraction can be done here
 */
function recordingReducer(state = emptyArray, action) {
  switch (action.type) {
    case RECEIVE_MOBILE_RECORDINGS: {
      const { mobileRecordings } = action.payload;
      const audioToAdd = mobileRecordings.map(recording => ({
        ...recording,
        caption: recording.caption ? unescaper(recording.caption) : null,
      }));
      return audioToAdd;
    }
    case UPDATE_UPLOADED_AUDIO: {
      const { oldAudioId, newAudio } = action.payload;
      const updatedAudios = state.map(audio => {
        if (audio.audioId === oldAudioId) {
          return {
            audioId: newAudio.audioId,
            caption: newAudio.caption || audio.caption,
            color: '#FD6767',
          };
        }
        return { ...audio };
      });
      return updatedAudios;
    }
    default:
      return state;
  }
}

// eslint-disable-next-line import/no-default-export
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case DELETE_PROCESSING_AUDIO_ID: {
      const { processingAudioIds } = state;
      const {
        payload: { audioId },
      } = action;
      const removeIndex = processingAudioIds.indexOf(audioId);
      processingAudioIds.splice(removeIndex, 1);
      return { ...state, processingAudioIds };
    }
    case ADD_PROCESSING_AUDIO_ID: {
      const { processingAudioIds } = state;
      const {
        payload: { audioIdToReplace },
      } = action;
      return {
        ...state,
        processingAudioIds: [...processingAudioIds, audioIdToReplace],
      };
    }
    case DELETE_UPLOAD_STATUS: {
      const { uploadStatuses } = state;
      const {
        payload: { audioId },
      } = action;
      delete uploadStatuses[audioId];
      return { ...state, uploadStatuses };
    }
    case SET_UPLOAD_STATUSES: {
      const { uploadStatuses } = state;
      const {
        payload: { audioId, status, file },
      } = action;
      const currentStatus = uploadStatuses[audioId];

      // if status is already in state, use existing file if it exists (it should)
      let newFile = currentStatus ? currentStatus.file : file;
      // on successful upload, set file to null
      // might be better for performance/memory usage?
      if (status === 'success') newFile = null;
      return {
        ...state,
        uploadStatuses: {
          ...uploadStatuses,
          [audioId]: {
            status,
            file: newFile,
          },
        },
      };
    }
    case RECEIVE_CALL_INS: {
      return {
        ...state,
        hasFetchedCallIns: true,
        callIns: callInReducer(state.callIns, action),
      };
    }
    case RECEIVE_AUDIO_LIBRARY: {
      const { audioLibrary, uploadStatuses } = state;
      const {
        payload: { audios },
      } = action;
      let newAudioLibrary = [...audios];

      // keep any audios pending upload from the previous `audioLibrary` state
      const uploadStatusesKeys = Object.keys(uploadStatuses);
      if (uploadStatusesKeys.length > 0) {
        uploadStatusesKeys.forEach(key => {
          const audioPendingUpload = audioLibrary.find(
            audio => audio.audioId === key
          );
          if (audioPendingUpload)
            newAudioLibrary = [audioPendingUpload, ...newAudioLibrary];
        });
      }

      newAudioLibrary = newAudioLibrary.map(audio => ({
        ...audio,
        caption: getCaption(audio),
      }));

      return {
        ...state,
        hasFetchedAudioLibrary: true,
        audioLibrary: newAudioLibrary,
      };
    }
    case RECEIVE_LOCAL_RECORDING: {
      const {
        payload: {
          recording: { audioId, caption, url, tmpAudioId },
        },
      } = action;
      const audioToAdd = {
        audioId,
        caption,
        url,
        color: '#FD6767',
        tmpAudioId,
      };
      return {
        ...state,
        audioLibrary: [audioToAdd].concat(state.audioLibrary),
      };
    }
    case RECEIVE_INTERLUDES: {
      return {
        ...state,
        hasFetchedInterludes: true,
        interludes: interludeReducer(state.interludes, action),
      };
    }
    case RECEIVE_MOBILE_RECORDINGS:
    case UPDATE_UPLOADED_AUDIO: {
      return {
        ...state,
        hasFetchedMobileRecordings: true,
        mobileRecordings: recordingReducer(state.mobileRecordings, action),
      };
    }
    case UPDATE_AUDIOS: {
      // Map thru all user-editable reducers, match any updated audios with new metadata
      // updated audios: { audioId: { audioData }}
      // action.payload.updatedAudios[audioId] = {updatedData}
      return {
        ...state,
        callIns: audioArrayReducer(state.callIns, action),
        audioLibrary: audioArrayReducer(state.audioLibrary, action),
        mobileRecordings: audioArrayReducer(state.mobileRecordings, action),
      };
    }
    default:
      return state;
  }
}

// action creators

function receiveCallIns({ audios, userDictionary, callIns }) {
  return {
    type: RECEIVE_CALL_INS,
    payload: {
      audios,
      userDictionary,
      callIns,
    },
  };
}

function receiveAudioLibrary(audios) {
  return {
    type: RECEIVE_AUDIO_LIBRARY,
    payload: {
      audios,
    },
  };
}

function receiveInterludes(interludes) {
  return {
    type: RECEIVE_INTERLUDES,
    payload: {
      interludes,
    },
  };
}

function receiveMobileRecordings(mobileRecordings) {
  return {
    type: RECEIVE_MOBILE_RECORDINGS,
    payload: {
      mobileRecordings,
    },
  };
}

export function receiveLocalRecording(recording) {
  return {
    type: RECEIVE_LOCAL_RECORDING,
    payload: {
      recording: {
        ...recording,
      },
    },
  };
}

export function updateUploadedRecordedAudio(oldAudioId, newAudio) {
  return {
    type: UPDATE_UPLOADED_AUDIO,
    payload: {
      oldAudioId,
      newAudio,
    },
  };
}

export function updateAudios(audios) {
  return {
    type: UPDATE_AUDIOS,
    payload: {
      audios: audios || {},
    },
  };
}

// thunks

export function deleteProcessingAudioId({ audioId }) {
  return {
    type: DELETE_PROCESSING_AUDIO_ID,
    payload: { audioId },
  };
}

export function addProcessingAudioId({ audioIdToReplace }) {
  return {
    type: ADD_PROCESSING_AUDIO_ID,
    payload: { audioIdToReplace },
  };
}

export function setUploadStatuses({ audioId, status, file }) {
  return {
    type: SET_UPLOAD_STATUSES,
    payload: { audioId, status, file },
  };
}

export function deleteUploadStatus(audioId) {
  return {
    type: DELETE_UPLOAD_STATUS,
    payload: { audioId },
  };
}

export function fetchInterludes() {
  return dispatch =>
    fetch('/api/sourceaudio/interlude', {
      credentials: 'same-origin',
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        return response;
      })
      .then(responseJson => {
        if (responseJson.status && responseJson.status !== 200) {
          if (responseJson.status === 401) {
            // not logged in
            return dispatch(unsetAndRedirectUser());
          }
          // e.g. no permissions (403)
          return dispatch(push('/404'));
        }
        const { interludes } = responseJson;
        dispatch(receiveInterludes(interludes));
        return interludes;
      });
}

export function fetchMyCallIns() {
  return dispatch =>
    fetch('/api/sourceaudio/callin', {
      credentials: 'same-origin',
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        return response;
      })
      .then(responseJson => {
        if (responseJson.status && responseJson.status !== 200) {
          if (responseJson.status === 401) {
            // not logged in
            return dispatch(unsetAndRedirectUser());
          }
          // e.g. no permissions (403)
          return dispatch(push('/404'));
        }
        const { audios, userDictionary, callIns } = responseJson;
        dispatch(receiveCallIns({ audios, userDictionary, callIns }));
        return audios;
      });
}

export function fetchMyLibrary(options = { isCacheBust: false }) {
  return async dispatch => {
    try {
      const json = await AnchorAPI.fetchAudioLibrary(options.isCacheBust);
      const { audios } = json;
      return dispatch(receiveAudioLibrary(audios));
    } catch (err) {
      if (err.status) {
        switch (err.status) {
          case 401:
            // not logged in
            return dispatch(push('/login'));
          case 403:
            // e.g. no permissions (403)
            return dispatch(push('/404'));
        }
      }
      // i dont think this is the ideal behavior to send them to the 404 page,
      // but this is what it currently does, so we'll keep that logic in place
      return dispatch(push('/404'));
    }
  };
}

export function fetchMyMobileRecordings() {
  return dispatch =>
    fetch('/api/sourceaudio/mobilerecording', {
      credentials: 'same-origin',
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        return response;
      })
      .then(responseJson => {
        if (responseJson.status && responseJson.status !== 200) {
          if (responseJson.status === 401) {
            // not logged in
            return dispatch(unsetAndRedirectUser());
          }
          // e.g. no permissions (403)
          return dispatch(push('/404'));
        }
        const { mobileRecordings } = responseJson;
        dispatch(receiveMobileRecordings(mobileRecordings));
        return mobileRecordings;
      });
}

export function generateMobileRecordingLink() {
  return dispatch =>
    fetch('/api/audio/mobilerecording', {
      method: 'POST',
      credentials: 'same-origin',
    }).then(response => {
      if (response.status !== 200) {
        if (response.status === 401) {
          // not logged in
          dispatch(unsetAndRedirectUser());
        } else {
          // e.g. no permissions (403)
          dispatch(push('/404'));
        }
      }
    });
}

// misc

function identifyInterview(interview) {
  if (interview.contactName) {
    return `Interview with ${unescaper(interview.contactName)}`;
  }
  if (interview.participants) {
    const participants = interview.participants.split(',');
    if (participants.length > 1) {
      return `Interview with ${unescaper(participants.join(', '))}`;
    }
    return `Interview with ${unescaper(participants[0])}`;
  }
  return 'Interview';
}

function getCaption(audio) {
  const { type, caption } = audio;
  if (type === PODCAST_EPISODE_AUDIO_TYPES.INTERVIEW)
    return identifyInterview(audio);
  return caption ? unescaper(caption) : null;
}
