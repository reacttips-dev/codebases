/**
 * Intentionally tiny reducer for playback position because this
 * action fires A LOT during playback and should only be tied to
 * components if it has to be
 */

// TODO: move these actions to this reducer?
import { PREVIOUS_AUDIO, END_AUDIO } from './stationConstants';
import { END_EPISODE_AUDIO } from './screens/EpisodeEditorScreen/duck/constants';

export const RECEIVE_PLAYBACK_POSITION =
  '@@playbackPosition/RECEIVE_PLAYBACK_POSITION';
export const SET_DO_SEEK = '@@playbackPosition/SET_DO_SEEK';

const initialState = {
  doSeek: false,
  playbackPosition: 0,
  playbackPositionInMs: 0,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_PLAYBACK_POSITION: {
      const { playbackPosition } = action;
      return {
        ...state,
        playbackPosition,
        playbackPositionInMs: 1000 * playbackPosition,
      };
    }
    case PREVIOUS_AUDIO: {
      return {
        ...state,
        playbackPosition: 0,
        playbackPositionInMs: 0,
      };
    }
    case END_AUDIO:
    case END_EPISODE_AUDIO: {
      return {
        ...state,
        playbackPosition: 0,
        playbackPositionInMs: 0,
      };
    }
    case SET_DO_SEEK: {
      const { doSeek } = action.payload;
      return {
        ...state,
        doSeek,
      };
    }
    default:
      return state;
  }
}

// action creators
function receivePlaybackPosition(
  playbackPosition,
  stationAudioId,
  stationId,
  metadata = {}
) {
  return {
    type: RECEIVE_PLAYBACK_POSITION,
    playbackPosition,
    stationAudioId,
    stationId,
    metadata,
  };
}

export function playedForOneSecond() {
  return {
    type: '', // analytics-only
    meta: {
      analytics: {
        type: 'event-playback-listen',
        payload: {
          value: 1,
        },
      },
    },
  };
}

export function setDoSeek(doSeek) {
  return {
    type: SET_DO_SEEK,
    payload: {
      doSeek,
    },
  };
}

// thunks

export function updatePlaybackPosition(playbackPosition, doSeek = false) {
  return (dispatch, getState) => {
    // grab station metadata for analytics purposes
    const state = getState();
    const { activeIndex, audios = [], stationId } = state.station;
    const { isV3Episode } = state.episodePreview;
    const stationAudioId = audios[activeIndex]
      ? audios[activeIndex].stationAudioId
      : null;

    // to distinguish from passive updates
    if (doSeek) {
      dispatch(setDoSeek(true));
    }
    return dispatch(
      receivePlaybackPosition(playbackPosition, stationAudioId, stationId, {
        isV3Episode,
      })
    );
  };
}

export function updatePlaybackPositionInMs(playbackPosition, doSeek = false) {
  return (dispatch, getState) =>
    dispatch(updatePlaybackPosition(playbackPosition / 1000, doSeek));
}
