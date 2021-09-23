/**
 * This is a reducer whose scope is just to batch playback duration data and send
 * it via client middleware to our analytics endpoints.
 */
import idGenerator from 'anchor-server-common/utilities/idGenerator';
import { LOCATION_CHANGE } from 'react-router-redux';
import { setInterval } from '../helpers/serverRenderingUtils';
import { RECEIVE_PLAYBACK_POSITION } from './playbackPosition';

const emptyArray = [];
const emptyObject = {};

const BASE_INTERVAL = 1000;
const SERVER_SYNC_CALL_INTERVAL = 15; // seconds

export const SERVER_SYNCED = '@@playbackDurationTracking/SERVER_SYNCED';

const initialState = {
  playDurationSessions: emptyArray,
  stationSessionLookup: emptyObject,
  syncedWithServer: false,
  purgeOnNextSync: false,
  forceEarlySync: false,
};

// reducer

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE: {
      return {
        ...state,
        purgeOnNextSync: true,
      };
    }
    case RECEIVE_PLAYBACK_POSITION: {
      const { playDurationSessions, stationSessionLookup } = state;
      const { metadata, playbackPosition, stationAudioId, stationId } = action;
      if (metadata.isV3Episode || !stationAudioId) {
        // DO NOT TRACK 3.0 playback position until we rearchitect it
        return state;
      }
      const playbackSeconds = parseInt(playbackPosition, 10);
      let forceEarlySync = false;
      // reduce playDurations
      const newPlayDurationSessions = playDurationSessions.slice();
      const newStationSessionLookup = { ...stationSessionLookup };
      if (!stationSessionLookup[stationId]) {
        newStationSessionLookup[
          stationId
        ] = `web:${idGenerator.generateUuid()}`;
        forceEarlySync = true; // must have loaded a new station, force an initial sync
      }
      const stationSessionUUID = newStationSessionLookup[stationId];
      const playDurationSession = newPlayDurationSessions.find(
        s => s.stationAudioId === stationAudioId
      );
      // 1 - when skipping "back" the play back position is sometimes between 0 and 1 so we have to use the rounded value
      // 2 - this means we have to disregard a bunch of false positive zeroes, so the over-simplification is that
      //     there can't be more than one zero-length session
      if (
        playbackSeconds === 0 &&
        (!playDurationSession || playDurationSession.lastSecondMarker !== 0)
      ) {
        // create a new playDurationSession
        addNewPlayDurationSession(
          newPlayDurationSessions,
          stationSessionUUID,
          stationAudioId,
          playbackSeconds
        );
        // return early, we are not updating anything
        return {
          ...state,
          forceEarlySync,
          playDurationSessions: newPlayDurationSessions,
          stationSessionLookup: newStationSessionLookup,
          syncedWithServer: false,
        };
      }
      if (playDurationSession) {
        playDurationSession.lastSecondMarker = playbackSeconds;
      } else {
        // should only happen under synthetic conditions?
        addNewPlayDurationSession(
          newPlayDurationSessions,
          stationSessionUUID,
          stationAudioId,
          playbackSeconds
        );
      }
      return {
        ...state,
        forceEarlySync,
        playDurationSessions: newPlayDurationSessions,
        stationSessionLookup: newStationSessionLookup,
        syncedWithServer: false,
      };
    }
    case SERVER_SYNCED:
      const { purgeOnNextSync } = state;
      const resetFlags = {
        forceEarlySync: false,
        syncedWithServer: true,
        purgeOnNextSync: false,
      };
      if (purgeOnNextSync) {
        return {
          ...state,
          playDurationSessions: emptyArray,
          stationSessionLookup: emptyObject,
          ...resetFlags,
        };
      }
      return {
        ...state,
        ...resetFlags,
      };
    default:
      return state;
  }
}

// action creators

// means sessions up to this point are set to be synced
function serverSynced(playDurationSessions) {
  return {
    type: SERVER_SYNCED,
    meta: {
      analytics: {
        type: 'event-playback-sync',
        payload: {
          playDurationSessions,
        },
      },
    },
  };
}

// thunks

// State-aware timer that will run every second. By default it syncs every 15
// however a forceEarlySync can be set in special cases, like when a new station loads
export function startSyncInterval() {
  return (dispatch, getState) => {
    let callCount = 0;
    return setInterval(update, BASE_INTERVAL);

    function update() {
      const {
        forceEarlySync,
        playDurationSessions,
        purgeOnNextSync,
        syncedWithServer,
      } = getState().playbackDurationTracking;
      callCount = callCount + 1;
      if (
        !syncedWithServer &&
        (forceEarlySync || callCount >= SERVER_SYNC_CALL_INTERVAL)
      ) {
        callCount = 0;
        dispatch(serverSynced(playDurationSessions));
      }
    }
  };
}

// misc

function addNewPlayDurationSession(
  newPlayDurationSessions,
  stationSessionUUID,
  stationAudioId,
  playbackSeconds
) {
  // push this session to the beginning so we find it first for this given stationAudioId
  newPlayDurationSessions.splice(0, 0, {
    lastSecondMarker: playbackSeconds,
    stationAudioId,
    stationAudioSessionUUID: `web:${idGenerator.generateUuid()}`,
    stationSessionUUID,
  });
}
