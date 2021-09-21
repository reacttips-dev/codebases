import {
  RECEIVE_CALL_INS,
  RECEIVE_INTERVIEWS,
  RECEIVE_INTERLUDES,
  RECEIVE_MOBILE_RECORDINGS,
  RECEIVE_LOCAL_RECORDING,
  RECEIVE_AUDIO_LIBRARY,
  UPDATE_UPLOADED_AUDIO,
} from './sourceAudio';

import { PODCAST_EPISODE_AUDIO_TYPES } from '../helpers/serverRenderingUtils';

const REPLACE_AUDIO_ID = '@@audioSegments/REPLACE_AUDIO_ID';
const UPDATE_AUDIO = '@@audioSegments/UPDATE_AUDIO';

const initialState = {};

function reduceSegments(state, audioSegments, type) {
  const audioToAdd = audioSegments.reduce((map, segment) => {
    const { audioId, created, duration, url, key } = segment;
    // Todo: fix collisions (should not happen)
    // for now, do not overwrite
    if (!state[audioId] && !map[audioId]) {
      map[audioId] = {
        created,
        duration,
        type,
        url,
        key,
      };
    }
    if (state[audioId] && state[audioId].url === null && url) {
      map[audioId] = {
        created,
        duration,
        type,
        url,
      };
    }
    return map;
  }, {});
  return {
    ...state,
    ...audioToAdd,
  };
}

function replaceSegmentWithId(state, oldId, newSegment) {
  const audioId = newSegment.audioId;
  const oldState = state[oldId];
  const segmentOverwrite = oldState
    ? {
        ...oldState,
        ...newSegment,
      }
    : newSegment;
  const map = {};
  // Just use local blob URL for now
  if (oldState) {
    segmentOverwrite.url = oldState.url;
  }
  map[audioId] = segmentOverwrite;
  return {
    ...state,
    audioId: segmentOverwrite,
  };
}

// reducer
export default function reducer(state = initialState, action) {
  let audioSegments = null;
  switch (action.type) {
    case RECEIVE_CALL_INS: {
      audioSegments = action.payload.audios;
      return reduceSegments(
        state,
        audioSegments,
        PODCAST_EPISODE_AUDIO_TYPES.CALL_IN
      );
    }
    case RECEIVE_AUDIO_LIBRARY: {
      audioSegments = action.payload.audios;
      return reduceSegments(
        state,
        audioSegments,
        PODCAST_EPISODE_AUDIO_TYPES.LIBRARY
      );
    }
    case RECEIVE_INTERLUDES: {
      audioSegments = action.payload.interludes;
      return reduceSegments(
        state,
        audioSegments,
        PODCAST_EPISODE_AUDIO_TYPES.INTERLUDE
      );
    }
    case RECEIVE_INTERVIEWS: {
      audioSegments = action.payload.interviews;
      return reduceSegments(
        state,
        audioSegments,
        PODCAST_EPISODE_AUDIO_TYPES.INTERVIEW
      );
    }
    case RECEIVE_MOBILE_RECORDINGS: {
      audioSegments = action.payload.mobileRecordings;
      return reduceSegments(
        state,
        audioSegments,
        PODCAST_EPISODE_AUDIO_TYPES.MOBILE_RECORDING
      );
    }
    case RECEIVE_LOCAL_RECORDING: {
      audioSegments = [action.payload.recording];
      return reduceSegments(
        state,
        audioSegments,
        PODCAST_EPISODE_AUDIO_TYPES.MOBILE_RECORDING
      );
    }
    case UPDATE_UPLOADED_AUDIO: {
      const { oldAudioId, newAudio } = action.payload;
      return replaceSegmentWithId(state, oldAudioId, newAudio);
    }
    case UPDATE_AUDIO: {
      const { audio } = action.payload;
      const { audioId, ...audioProps } = audio;
      const oldAudio = state[audioId];
      const newAudio = Object.assign({}, oldAudio, audioProps);
      return {
        ...state,
        audioId: newAudio,
      };
    }
    default:
      return state;
  }
}

export function updateAudio(audio) {
  return {
    type: UPDATE_AUDIO,
    payload: { audio },
  };
}
