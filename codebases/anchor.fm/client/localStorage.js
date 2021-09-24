/**
 * This is a reducer whose scope is anything that should persist for an anonymous user
 * such as segments that have been played. Don't put secure stuff here.
 * Just things that would enhance a user experience and appear like a logged in user.
 */
import { REHYDRATE } from 'redux-persist/constants';
import { PLAY } from './station';
import { SET_COLORS } from './transcriptions';

const emptyObject = {};

const SET_PLAYBACK_SPEED = '@@localStorange/SET_PLAYBACK_SPEED';

export const PLAYBACK_SPEEDS = {
  NORMAL: 1,
  FAST: 1.2,
  FASTER: 1.4,
};

const initialState = {
  // dictionary of the last segment you heard for a given station
  lastPlayedSegment: emptyObject,
  playbackSpeed: PLAYBACK_SPEEDS.NORMAL,
};

// reducer

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE: {
      const { lastPlayedSegment } = state;
      const { localStorage } = action.payload;
      if (localStorage) {
        return {
          ...initialState,
          ...localStorage,
          // this is asynchronous and might actually be older than current state:
          lastPlayedSegment: {
            ...localStorage.lastPlayedSegment,
            ...lastPlayedSegment,
          },
        };
      }
      return state;
    }
    case PLAY: {
      const {
        meta: {
          analytics: {
            payload: {
              stationId,
              stationAudioId,
              lastPlayedStationAudioId = 0,
              episodeId,
            },
          },
        },
      } = action;
      const { lastPlayedSegment } = state;
      const nextLastPlayedStatement = { ...lastPlayedSegment };
      if (
        // just look for differences within an episode
        (episodeId && stationAudioId !== lastPlayedStationAudioId) ||
        // else these are ever-increasing (2.0 station playback)
        stationAudioId > lastPlayedStationAudioId
      ) {
        nextLastPlayedStatement[stationId] = stationAudioId;
        return {
          ...state,
          lastPlayedSegment: nextLastPlayedStatement,
        };
      }
      return state;
    }
    case SET_PLAYBACK_SPEED:
      return {
        ...state,
        playbackSpeed: action.playbackSpeed,
      };
    case SET_COLORS:
      const { backgroundColor, highlightColor } = action.payload;
      return {
        ...state,
        backgroundColor,
        highlightColor,
      };
    default:
      return state;
  }
}

// action creators

export function setPlaybackSpeed(playbackSpeed) {
  return {
    type: SET_PLAYBACK_SPEED,
    playbackSpeed,
  };
}
