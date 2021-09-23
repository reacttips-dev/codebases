import { push } from 'react-router-redux';
import { msToHMS } from './utils';
import { unsetAndRedirectUser } from './user';
import { APP_INIT, getBaseUrl } from '../helpers/serverRenderingUtils';
import { deletePodcastEpisodeOnServer } from './screens/EpisodeEditorScreen/duck';
import AnchorAPI from './modules/AnchorAPI';

export const RECEIVE_PODCAST_STATUS = '@@podcast/RECEIVE_PODCAST_STATUS';
export const RECEIVE_PODCAST_IMPORT_STATUS =
  '@@podcast/RECEIVE_PODCAST_IMPORT_STATUS';
export const RECEIVE_PODCAST_EPISODES = '@@podcast/RECEIVE_PODCAST_EPISODES';
export const RECEIVE_PODCAST_EPISODE_TOTAL =
  '@@podcast/RECEIVE_PODCAST_EPISODE_TOTAL';
export const REMOVE_PODCAST_EPISODE = '@@podcast/REMOVE_PODCAST_EPISODE';

export const RECEIVE_PODCAST_STATUS_FETCH_REQUEST =
  '@@podcast/RECEIVE_PODCAST_STATUS_FETCH_REQUEST';

export const SET_IS_PLAYING = '@@podcast/SET_IS_PLAYING';
export const SET_IS_ACTIVE = '@@podcast/SET_IS_ACTIVE';

const emptyArray = [];
const emptyObject = {};

// TODO (bui): fetching state should not be true by default
const initialState = {
  isFetchingStatus: true,
  isFetchingDownloads: true,
  isFirstTimeCreator: false,
  isRedirectedToAnchor: false,
  podcastEpisodeTotal: 0,
  podcastEpisodes: emptyArray,
  podcastExternalSource: null,
  podcastImportStatus: null,
  podcastPlatformCount: 0,
  podcastStatus: null,
  podcastUrlDictionary: emptyObject,
};

const initialEpisodeState = {
  isActive: false,
  isPlaying: false,
};

// reducers

function podcastEpisodeReducer(state = initialEpisodeState, action) {
  switch (action.type) {
    case APP_INIT:
    case RECEIVE_PODCAST_EPISODES: {
      const {
        createdUnixTimestamp,
        duration,
        isPublished,
        publishOnUnixTimestamp,
      } = state;
      return {
        ...state,
        created: createdUnixTimestamp && new Date(createdUnixTimestamp * 1000),
        durationHMS: msToHMS(duration),
        isDraft: !isPublished,
        publishOn:
          publishOnUnixTimestamp && new Date(publishOnUnixTimestamp * 1000),
      };
    }
    case SET_IS_ACTIVE: {
      const { podcastEpisodeId, isActive } = action.payload;
      if (podcastEpisodeId === state.podcastEpisodeId) {
        return {
          ...state,
          isActive,
        };
      }
      // note - currently don't support showing multiple active progress bars / it is a singleton state
      return {
        ...state,
        isActive: false,
      };
    }
    case SET_IS_PLAYING: {
      const { podcastEpisodeId, isPlaying } = action.payload;
      if (podcastEpisodeId === state.podcastEpisodeId) {
        return {
          ...state,
          isPlaying,
        };
      }
      return state;
    }
    default:
      return state;
  }
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_PODCAST_STATUS_FETCH_REQUEST: {
      const { isFetchingStatus } = action.payload;
      return {
        ...state,
        isFetchingStatus,
      };
    }
    case RECEIVE_PODCAST_STATUS: {
      const {
        isFirstTimeCreator,
        isRedirectedToAnchor,
        podcastExternalSource,
        podcastStatus,
        podcastUrlDictionary = emptyObject,
      } = action.payload;
      return {
        ...state,
        isFetchingStatus: false,
        isFirstTimeCreator,
        isRedirectedToAnchor,
        podcastStatus,
        podcastExternalSource,
        podcastUrlDictionary,
        podcastPlatformCount: Object.keys(podcastUrlDictionary).length + 1,
      };
    }
    case RECEIVE_PODCAST_IMPORT_STATUS: {
      const { podcastImportStatus } = action.payload;
      return {
        ...state,
        podcastImportStatus,
      };
    }
    case RECEIVE_PODCAST_EPISODE_TOTAL: {
      const { podcastEpisodeTotal } = action.payload;
      return {
        ...state,
        podcastEpisodeTotal,
      };
    }
    case APP_INIT: {
      // SSR
      const { podcastEpisodes } = state;
      return {
        ...state,
        podcastEpisodes: podcastEpisodes.map(e =>
          podcastEpisodeReducer(e, action)
        ),
      };
    }
    case RECEIVE_PODCAST_EPISODES: {
      const { podcastEpisodes } = action.payload;
      return {
        ...state,
        podcastEpisodes: podcastEpisodes.map(e =>
          podcastEpisodeReducer(e, action)
        ),
      };
    }
    case REMOVE_PODCAST_EPISODE: {
      const { podcastEpisodeId } = action.payload;
      return {
        ...state,
        podcastEpisodes: state.podcastEpisodes.filter(
          episode => episode.episodeId !== podcastEpisodeId
        ),
      };
    }
    case SET_IS_ACTIVE:
    case SET_IS_PLAYING: {
      const { podcastEpisodes } = state;
      return {
        ...state,
        podcastEpisodes: podcastEpisodes.map(e =>
          podcastEpisodeReducer(e, action)
        ),
      };
    }
    default:
      return state;
  }
}

// action creators

function receivePodcastStatusFetchRequest(isFetchingStatus = false) {
  return {
    type: RECEIVE_PODCAST_STATUS_FETCH_REQUEST,
    payload: {
      isFetchingStatus,
    },
  };
}

export function receivePodcastStatus(podcastStatusObject) {
  return {
    type: RECEIVE_PODCAST_STATUS,
    payload: podcastStatusObject,
  };
}

function receivePodcastImportStatus(importStatusObject) {
  return {
    type: RECEIVE_PODCAST_IMPORT_STATUS,
    payload: importStatusObject,
  };
}

export function receivePodcastEpisodes(podcastEpisodes) {
  return {
    type: RECEIVE_PODCAST_EPISODES,
    payload: {
      podcastEpisodes,
    },
  };
}

export function receivePodcastEpisodeTotal(podcastEpisodeTotal) {
  return {
    type: RECEIVE_PODCAST_EPISODE_TOTAL,
    payload: {
      podcastEpisodeTotal,
    },
  };
}

function removePodcastEpisode(podcastEpisodeId) {
  return {
    type: REMOVE_PODCAST_EPISODE,
    payload: {
      podcastEpisodeId,
    },
  };
}

export function setIsActive(isActive, podcastEpisodeId) {
  return {
    type: SET_IS_ACTIVE,
    payload: {
      isActive,
      podcastEpisodeId,
    },
  };
}

export function setIsPlaying(isPlaying, podcastEpisodeId) {
  return {
    type: SET_IS_PLAYING,
    payload: {
      isPlaying,
      podcastEpisodeId,
    },
  };
}

// thunks

export function fetchMyPodcastStatus() {
  return (dispatch, getState) => {
    dispatch(receivePodcastStatusFetchRequest(true));
    return new Promise((resolve, reject) => {
      fetch('/api/podcast/status', {
        credentials: 'same-origin',
      })
        .then(resolve)
        .catch(reject);
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
          // TODO: Fix this; need better way to fetch podcast status after first auth
          // return dispatch(unsetAndRedirectUser());
          return;
        }
        dispatch(receivePodcastStatus(responseJson));
        return responseJson;
      })
      .finally(() => {
        dispatch(receivePodcastStatusFetchRequest(false));
      });
  };
}

/**
 * Only for 'Switch to Anchor' users
 */
export function fetchMyPodcastImportStatus() {
  return (dispatch, getState) =>
    fetch('/api/podcast/import/status', {
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
          // TODO: Fix this; need better way to fetch podcast status after first auth
          // return dispatch(unsetAndRedirectUser());
          return;
        }
        dispatch(receivePodcastImportStatus(responseJson));
        return responseJson;
      });
}

export function deleteEpisodeFromDashboard(podcastEpisodeId) {
  return (dispatch, getState) =>
    deletePodcastEpisodeOnServer(podcastEpisodeId).then(response => {
      const { status } = response;
      if (status === 403) {
        dispatch(push('/404'));
        return;
      }
      if (status === 401) {
        dispatch(unsetAndRedirectUser());
        return;
      }
      console.log(status);
      dispatch(removePodcastEpisode(podcastEpisodeId));
    });
}

export function retryPodcastImport() {
  return (dispatch, getState) =>
    fetch('/api/podcast/reimport', {
      credentials: 'same-origin',
      method: 'POST',
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
          // TODO: Fix this; need better way to fetch podcast status after first auth
          // return dispatch(unsetAndRedirectUser());
          return;
        }
        dispatch(receivePodcastImportStatus(responseJson));
        return responseJson;
      });
}

export function fetchMyPodcastEpisodes(page = 1, limit = 10) {
  return (dispatch, getState) => {
    return AnchorAPI.fetchPodcastEpisodes(page, limit)
      .then(responseJson => {
        const { podcastEpisodes, totalPodcastEpisodes } = responseJson;
        dispatch(receivePodcastEpisodes(podcastEpisodes));
        dispatch(receivePodcastEpisodeTotal(totalPodcastEpisodes));
        return podcastEpisodes;
      })
      .catch(error => {
        if (error.status === 401) {
          // not logged in
          return dispatch(push('/login'));
        }
        // e.g. no permissions (403)
        return dispatch(push('/404'));
      });
  };
}
