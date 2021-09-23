import Promise from 'bluebird';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import unescaper from 'anchor-server-common/utilities/unescaper';
import { getBaseUrl, nextFrame } from '../helpers/serverRenderingUtils';
import { getSeekAudioIndexFromEpisodeAudiosAndPositionInMs } from './utils';
import { RECEIVE_EPISODE, RECEIVE_V3_CREATOR } from './episodePreviewConstants';
import { receivePageMetadata } from './pageMetadata';
import { setDoSeek, updatePlaybackPositionInMs } from './playbackPosition';
import { PODCAST_URL_HOSTS } from './screens/DistributionScreen/constants';
import { PREVIOUS_AUDIO, END_AUDIO } from './stationConstants';

export const RECEIVE_STATION = 'RECEIVE_STATION';
export const RECEIVE_STATION_ID = '@@station/RECEIVE_STATION_ID';
export const RECEIVE_PODCAST_METADATA = 'RECEIVE_PODCAST_METADATA';
export const RECEIVE_ACTIVE_AUDIO_ID = 'RECEIVE_ACTIVE_AUDIO_ID';
export const REPLAY_STATION = 'REPLAY_STATION';
export const RECEIVE_VOLUME_DATA = 'RECEIVE_VOLUME_DATA';
export const RECEIVE_REQUESTED_VANITY_SLUG =
  '@@station/RECEIVE_REQUESTED_VANITY_SLUG';
export const PLAY = 'PLAY';
export const PAUSE = 'PAUSE';
export const START_SHARE = 'START_SHARE';
export const STOP_SHARE = 'STOP_SHARE';

const ANCHOR = 'anchor';

export const attributesByHost = new Map([
  [
    ANCHOR,
    {
      displayName: 'Anchor',
      src: 'anchor.png',
    },
  ],
  [
    PODCAST_URL_HOSTS.APPLE_PODCASTS,
    {
      displayName: 'Apple Podcasts',
      src: 'apple_podcasts.png',
    },
  ],
  [
    PODCAST_URL_HOSTS.GOOGLE_PODCASTS,
    {
      displayName: 'Google Podcasts',
      src: 'google_podcasts.png',
    },
  ],
  [
    PODCAST_URL_HOSTS.GOOGLE_PLAY_MUSIC,
    {
      displayName: 'Google Play Music',
      src: 'google_play.png',
    },
  ],
  [
    PODCAST_URL_HOSTS.OVERCAST,
    {
      displayName: 'Overcast',
      src: 'overcast.png',
    },
  ],
  [
    PODCAST_URL_HOSTS.POCKETCASTS,
    {
      displayName: 'Pocket Casts',
      src: 'pocket_casts.png',
    },
  ],
  [
    PODCAST_URL_HOSTS.RADIO_PUBLIC,
    {
      displayName: 'RadioPublic',
      src: 'radiopublic.png',
    },
  ],
  [
    PODCAST_URL_HOSTS.STITCHER,
    {
      displayName: 'Stitcher',
      src: 'stitcher_dark.png',
    },
  ],
  [
    PODCAST_URL_HOSTS.SPOTIFY,
    {
      displayName: 'Spotify',
      src: 'spotify.png',
    },
  ],
  [
    PODCAST_URL_HOSTS.BREAKER,
    {
      displayName: 'Breaker',
      src: 'breaker.png',
    },
  ],
  [
    PODCAST_URL_HOSTS.TUNE_IN,
    {
      displayName: 'TuneIn',
      src: 'tune_in.png',
    },
  ],
  [
    PODCAST_URL_HOSTS.CASTBOX,
    {
      displayName: 'Castbox',
      src: 'castbox.png',
    },
  ],
  [
    PODCAST_URL_HOSTS.POD_BEAN,
    {
      displayName: 'PodBean',
      src: 'podbean.png',
    },
  ],
]);

const MUSIC_SOURCES = {
  APPLE_MUSIC: 'applemusic',
  SPOTIFY: 'spotify',
};

const emptyArray = [];
const emptyObject = {};

const initialState = {
  audios: emptyArray,
  episodeId: null,
  episodeTitle: null,
  stationId: null,
  creator: null,
  users: emptyObject,
  podcastMetadata: emptyObject,
  podcastUrlDictionary: emptyObject,
  activeIndex: -1,
  requestedVanitySlug: null,
  isPlaying: false,
  isSharing: false,
  stationDuration: 0,
  playedDuration: 0,
  activeAudioDuration: 0,
  volumeData: emptyArray,
  vanitySlug: null,
  trailerUrl: null,
  defaultProfileHeaderColor: '',
};

// reducers

function segmentReducer(state = emptyObject, action) {
  switch (action.type) {
    case RECEIVE_STATION: {
      const { caption } = state;
      const newState = {
        ...state,
        created: new Date(state.createdUnixTimestamp * 1000),
      };
      if (caption) {
        newState.caption = unescaper(caption);
      }
      return newState;
    }
    default:
      return state;
  }
}

export function creatorReducer(state = emptyObject, action) {
  switch (action.type) {
    case RECEIVE_V3_CREATOR:
    case RECEIVE_EPISODE:
    case RECEIVE_STATION: {
      const { name, bio } = state;
      return {
        ...state,
        bio: unescaper(bio),
        name: unescaper(name),
      };
    }
    default:
      return state;
  }
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case PAUSE:
      return {
        ...state,
        isPlaying: false,
      };
    case PLAY:
      return {
        ...state,
        isPlaying: true,
      };
    case RECEIVE_STATION: {
      const {
        creator,
        users,
        station,
        podcastUrlDictionary,
        trailerUrl,
        defaultProfileHeaderColor,
      } = action;
      const audios = station && station.audios ? station.audios : emptyArray;
      const stationId = station ? station.stationId : null;
      const processedUsers = {};
      if (users) {
        Object.keys(users).forEach(key => {
          processedUsers[key] = creatorReducer(users[key], action);
        });
      }
      return {
        ...state,
        audios: audios.map(s => segmentReducer(s, action)),
        episodeId: station.episodeId || null,
        episodeTitle: (station.title && unescaper(station.title)) || null,
        creator: creatorReducer(creator, action),
        stationId,
        users: processedUsers || emptyObject,
        stationDuration: sumAudioDuration(audios),
        podcastUrlDictionary,
        vanitySlug: station.vanitySlug || null,
        trailerUrl,
        defaultProfileHeaderColor,
      };
    }
    case RECEIVE_PODCAST_METADATA: {
      const { podcastMetadata } = action.payload;
      if (!podcastMetadata) {
        return state;
      }
      podcastMetadata.podcastAuthorName = unescaper(
        podcastMetadata.podcastAuthorName
      );
      podcastMetadata.podcastDescription = unescaper(
        podcastMetadata.podcastDescription
      );
      podcastMetadata.podcastName = unescaper(podcastMetadata.podcastName);
      return {
        ...state,
        podcastMetadata,
      };
    }
    case PREVIOUS_AUDIO: {
      const { activeIndex, audios } = state;
      // assume -1 means we want to play the last segment in the station
      const prevActiveIndex =
        activeIndex !== -1 ? activeIndex - 1 : audios.length - 1;
      const prevAudio = audios[prevActiveIndex];
      return {
        ...state,
        activeIndex: prevActiveIndex,
        activeAudioDuration:
          prevAudio && prevAudio.duration ? prevAudio.duration : 0,
        playedDuration:
          prevActiveIndex !== -1
            ? sumAudioDuration(audios.slice(0, prevActiveIndex))
            : 0,
      };
    }
    case END_AUDIO: {
      const { activeIndex, audios } = state;
      const nextActiveIndex =
        activeIndex !== -1 && activeIndex < audios.length - 1
          ? activeIndex + 1
          : -1;
      const nextAudio = audios[nextActiveIndex];
      return {
        ...state,
        activeIndex: nextActiveIndex,
        activeAudioDuration:
          nextAudio && nextAudio.duration ? nextAudio.duration : 0,
        playedDuration: sumAudioDuration(
          audios.slice(
            0,
            nextActiveIndex !== -1 ? nextActiveIndex : audios.length
          )
        ),
      };
    }
    case RECEIVE_ACTIVE_AUDIO_ID: {
      const { audios } = state;
      const { activeStationAudioId } = action;
      const currentlyPlayingAudio = audios.find(
        a => a.stationAudioId === activeStationAudioId
      );
      const activeIndex = audios.indexOf(currentlyPlayingAudio);
      return {
        ...state,
        activeIndex,
        activeAudioDuration:
          currentlyPlayingAudio && currentlyPlayingAudio.duration
            ? currentlyPlayingAudio.duration
            : 0,
        playedDuration: sumAudioDuration(audios.slice(0, activeIndex)),
      };
    }
    case REPLAY_STATION: {
      const { audios } = state;
      const currentlyPlayingAudio = audios[0];
      return {
        ...state,
        activeIndex: 0,
        activeAudioDuration:
          currentlyPlayingAudio && currentlyPlayingAudio.duration
            ? currentlyPlayingAudio.duration
            : 0,
        playedDuration: 0,
      };
    }
    case RECEIVE_VOLUME_DATA: {
      const { volumeData } = action;
      return {
        ...state,
        volumeData,
      };
    }
    case START_SHARE:
      return {
        ...state,
        isSharing: true,
      };
    case STOP_SHARE:
      return {
        ...state,
        isSharing: false,
      };
    case RECEIVE_REQUESTED_VANITY_SLUG: {
      return {
        ...state,
        requestedVanitySlug: action.payload.requestedVanitySlug,
      };
    }
    case RECEIVE_STATION_ID: {
      return {
        ...state,
        stationId: action.payload.stationId,
      };
    }
    case LOCATION_CHANGE: {
      return {
        ...state,
        isSharing: false,
      };
    }
    default:
      return state;
  }
}

export default reducer;

// action creators

export function receivePodcastMetadata(podcastMetadata) {
  return {
    type: RECEIVE_PODCAST_METADATA,
    payload: {
      podcastMetadata,
    },
  };
}

export function receiveStation({
  station,
  creator,
  users,
  podcastUrlDictionary,
  trailerUrl,
  defaultProfileHeaderColor,
}) {
  const meta = {};
  const { audios } = station;

  if (!audios || audios.length === 0) {
    meta.analytics = {
      type: 'event-playback-expired',
      payload: {
        target: 'Station',
      },
    };
  }
  return {
    type: RECEIVE_STATION,
    station,
    creator,
    users,
    meta,
    podcastUrlDictionary,
    trailerUrl,
    defaultProfileHeaderColor,
  };
}

export function previousAudio(target) {
  const meta = {};
  if (target) {
    meta.analytics = {
      type: 'event-playback-click',
      payload: {
        target,
      },
    };
  }
  return {
    type: PREVIOUS_AUDIO,
    meta,
  };
}

export function endAudio(target) {
  const meta = {};
  if (target) {
    meta.analytics = {
      type: 'event-playback-click',
      payload: {
        target,
      },
    };
  }
  return {
    type: END_AUDIO,
    meta,
  };
}

export function pause({
  audioId = null,
  episodeId,
  stationAudioId = null,
  stationId,
  lastPlayedStationAudioId,
  target,
} = {}) {
  return {
    type: PAUSE,
    meta: {
      analytics: {
        type: 'event-playback-pause',
        payload: {
          audioId,
          episodeId,
          stationId,
          stationAudioId,
          lastPlayedStationAudioId,
          target,
        },
      },
    },
  };
}
export function play({
  audioId = null,
  episodeId,
  stationAudioId = null,
  stationId,
  lastPlayedStationAudioId,
  target,
} = {}) {
  return {
    type: PLAY,
    meta: {
      analytics: {
        type: 'event-playback-play',
        payload: {
          audioId,
          episodeId,
          stationId,
          stationAudioId,
          lastPlayedStationAudioId,
          target,
        },
      },
    },
  };
}

export function receiveVolumeData(volumeData) {
  return {
    type: RECEIVE_VOLUME_DATA,
    volumeData,
  };
}

// comes in as string param, but ids in JSON response are integers,
// so parse for consistency
export function receiveActiveStationAudioId(activeStationAudioId, isExpired) {
  const meta = {};
  if (isExpired) {
    meta.analytics = {
      type: 'event-playback-expired',
      payload: {
        target: 'Segment',
      },
    };
  }
  return {
    type: RECEIVE_ACTIVE_AUDIO_ID,
    activeStationAudioId,
    meta,
  };
}

export function replayStation() {
  return {
    type: REPLAY_STATION,
    meta: {
      analytics: {
        type: 'event-playback-click',
        payload: {
          target: 'Replay Station Button',
        },
      },
    },
  };
}

export function dismissDeepLinkTakeover() {
  return {
    type: '', // no actual actions
    meta: {
      analytics: {
        type: 'event-playback-click',
        payload: {
          target: 'Dismiss Deep Link Takeover',
        },
      },
    },
  };
}

export function stopShare() {
  return {
    type: STOP_SHARE,
    meta: {
      analytics: {
        type: 'event-sharing-click',
        payload: {
          target: 'Cancel Button',
        },
      },
    },
  };
}

export function startShare() {
  return {
    type: START_SHARE,
    meta: {
      analytics: {
        type: 'event-sharing-click',
        payload: {
          target: 'Share Button',
        },
      },
    },
  };
}

export function copyShareUrl(target) {
  return {
    type: '', // no actual actions
    meta: {
      analytics: {
        type: 'event-sharing-copytext',
        payload: {
          target,
        },
      },
    },
  };
}

export function shareAction(target) {
  return {
    type: '', // no actual actions
    meta: {
      analytics: {
        type: 'event-sharing-click',
        payload: {
          target,
        },
      },
    },
  };
}

// for use with routing from vanity slugs
export function receiveRequestedVanitySlug(requestedVanitySlug) {
  return {
    type: RECEIVE_REQUESTED_VANITY_SLUG,
    payload: {
      requestedVanitySlug,
    },
  };
}
export function receiveStationId(stationId) {
  return {
    type: RECEIVE_STATION_ID,
    payload: {
      stationId,
    },
  };
}

// async / thunks

export function fetchStation(
  baseUrl = '',
  stationId,
  stationAudioId,
  autoStart,
  shouldChangePageMetadata = false
) {
  return (dispatch, getState) =>
    fetch(`${baseUrl}/api/station/${stationId}`)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        return response;
      })
      // eslint-disable-next-line consistent-return
      .then(responseJson => {
        if (responseJson.status && responseJson.status !== 200) {
          return dispatch(push('/404'));
        }
        const {
          userDictionary,
          generatedImage,
          podcastUrlDictionary,
          station,
        } = responseJson;
        const creator = station
          ? { ...userDictionary[`${station.creatorUserId}`] }
          : {};
        creator.userId = station.creatorUserId;
        const {
          routing: { location },
        } = getState();
        const { pathname, search } = location || {};
        dispatch(
          receiveStation({
            station,
            creator,
            users: userDictionary,
            podcastUrlDictionary,
          })
        );
        const { activeStationAudioId, isExpired } = getActiveStationAudioId(
          station,
          stationAudioId
        );
        if (autoStart) {
          dispatch(pause());
          nextFrame(() => {
            dispatch(playOrPause());
          });
        }
        dispatch(receiveActiveStationAudioId(activeStationAudioId, isExpired));
        if (shouldChangePageMetadata) {
          dispatch(
            receivePageMetadata(
              getMetadataFromStationAndStationAudioId(
                station,
                creator,
                stationAudioId,
                getBaseUrl() + pathname + search,
                generatedImage
              )
            )
          ); // This is how pass information up
        }
      });
}

export function restartAudio(target) {
  return (dispatch, getState) => {
    const { activeIndex, audios } = getState().station;
    const activeAudio = audios[activeIndex];
    if (activeAudio) {
      dispatch(endAudio(target));
      nextFrame(() =>
        dispatch(receiveActiveStationAudioId(activeAudio.stationAudioId, true))
      );
    }
  };
}

export function playOrPause(userEventTarget) {
  return (dispatch, getState) => {
    const {
      episodePreview: { isV3Episode },
      station: { episodeId, stationId, audios, activeIndex, isPlaying },
      localStorage: { lastPlayedSegment },
    } = getState();
    const activeAudio = audios[activeIndex];
    const metadata = {
      ...getIdentifierForPlayback(activeAudio, isV3Episode),
      stationId,
      episodeId,
      lastPlayedStationAudioId: lastPlayedSegment[stationId],
      target: userEventTarget,
    };
    dispatch(isPlaying ? pause(metadata) : play(metadata));
  };
}

// reserved for plays that aren't specifically initiated by a user
// (continuous playback)
export function playbackStarted() {
  return (dispatch, getState) => {
    const {
      episodePreview: { isV3Episode },
      station: { episodeId, stationId, audios, activeIndex, isPlaying },
      localStorage: { lastPlayedSegment },
    } = getState();
    const activeAudio = audios[activeIndex];
    dispatch(
      play({
        ...getIdentifierForPlayback(activeAudio, isV3Episode),
        stationId,
        episodeId,
        lastPlayedStationAudioId: lastPlayedSegment[stationId],
      })
    );
  };
}

export function fetchStationIdFromVanitySlug(baseUrl = '', vanitySlug) {
  return (dispatch, getState) => {
    const { requestedVanitySlug } = getState().station;
    if (vanitySlug === requestedVanitySlug) {
      return Promise.resolve(); // request in progress
    }
    dispatch(receiveRequestedVanitySlug(vanitySlug));
    return new Promise((resolve, reject) => {
      fetch(`${baseUrl}/api/vanityslug?url=${vanitySlug}`, {
        credentials: 'same-origin',
        method: 'GET',
      })
        .then(resolve)
        .catch(reject);
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        return Promise.reject(new Error('Status not 200'));
      })
      .then(response => {
        if (response.stationId) {
          dispatch(receiveStationId(response.stationId));
          return Promise.resolve(response);
        }
        return Promise.reject(new Error('No station found'));
      })
      .finally(() => {
        dispatch(receiveRequestedVanitySlug(null));
      });
  };
}

export function playNextEpisodeOrReplay(autoStart) {
  return (dispatch, getState) => {
    const { episodePreview, station } = getState();
    // if playing station is last index, replay
    const currentlyPlayingEpisodeIndex = episodePreview.episodes.findIndex(
      (e = {}) => e.episodeId === station.episodeId
    );
    if (currentlyPlayingEpisodeIndex === episodePreview.episodes.length - 1) {
      if (autoStart) {
        dispatch(pause());
        nextFrame(() => {
          dispatch(playOrPause());
        });
      }
      dispatch(replayStation());
      return;
    }
    const nextEpisode =
      episodePreview.episodes[currentlyPlayingEpisodeIndex + 1];
    if (nextEpisode.shareLinkPath) {
      dispatch(push(nextEpisode.shareLinkPath));
    }
  };
}

export function updateEpisodePlaybackPosition(positionInMs) {
  return (dispatch, getState) => {
    const {
      episodePreview: { duration },
      station: { isPlaying },
    } = getState();
    dispatch(pause());
    const {
      audioPositionInMs,
    } = getSeekAudioIndexFromEpisodeAudiosAndPositionInMs(
      [{ duration }],
      positionInMs
    );

    nextFrame(() => {
      // important to seek async
      dispatch(updatePlaybackPositionInMs(audioPositionInMs, false));
      nextFrame(() => {
        dispatch(setDoSeek(true));
        if (isPlaying) {
          dispatch(play());
        }
      });
    });
  };
}

// misc

function sumAudioDuration(audios) {
  return audios.reduce(
    (duration, audio) =>
      duration + (audio && audio.duration ? audio.duration : 0),
    0
  );
}

export function getMetadataFromStationAndStationAudioId(
  station,
  creator,
  stationAudioId,
  requestedUrl,
  generatedImage = null
) {
  let title = unescaper(creator.name);
  let description;
  let oEmbedTitle;
  let stream;
  let twitterCard;
  let facebookType;
  let twitterImage;
  let twitterParams;
  description = `Listen to Anchor audio from ${unescaper(creator.name)}`;
  if (creator.bio) {
    description = `${description}: ${unescaper(creator.bio)}`;
  }
  const oEmbedUrl = `${getBaseUrl()}/api/v2/oembed?url=${safelyEncodeURIComponent(
    requestedUrl
  )}&title=${safelyEncodeURIComponent(creator.name)}`;
  oEmbedTitle = `Anchor - ${title}`;
  // set to playback image background
  const image =
    generatedImage ||
    'https://d12xoj7p9moygp.cloudfront.net/social/web-large-playback.png';
  twitterImage = image;
  if (stationAudioId) {
    const activeAudio = station.audios.find(
      a => a.stationAudioId === stationAudioId
    );
    if (activeAudio) {
      description = title;
      title = `${
        activeAudio.caption ? `${unescaper(activeAudio.caption)} by ` : ''
      }${unescaper(creator.name)}`;
      stream = activeAudio.audioUrl;
      twitterCard = 'audio';
      facebookType = 'anchorfm:wave';
      twitterParams = `${station.stationId}?at=${stationAudioId}`;
      // override to audio card preview
      twitterImage =
        'https://d12xoj7p9moygp.cloudfront.net/social/audio-card-preview.png';
      oEmbedTitle = `Anchor - ${title}`;
    }
  }
  return {
    description,
    facebookType,
    image,
    oEmbedUrl,
    oEmbedTitle,
    stream,
    title,
    twitterCard,
    twitterImage,
    twitterParams,
  };
}

function isStationAudioIdValid(audios, stationAudioId) {
  return (
    stationAudioId && !!audios.find(a => a.stationAudioId === stationAudioId)
  );
}

export function getActiveStationAudioId(station, stationAudioId) {
  // if we have an audio ID but it's expired, track that
  let isExpired = false;
  const audios = station && station.audios ? station.audios : [];
  if (stationAudioId) {
    if (isStationAudioIdValid(audios, stationAudioId)) {
      return {
        activeStationAudioId: stationAudioId,
        isExpired,
      };
    }
    isExpired = true;
  }
  return {
    // default to first if we haven't passed an audio ID
    activeStationAudioId: audios.length ? audios[0].stationAudioId : -1,
    isExpired,
  };
}

// incorporates lookup for vanity URLs (hard-coded param property set on <Route />)
export function getStationIdFromProps(props) {
  return props.match.params.stationId;
}

export function getSpotifyUrlFromAudio(audio = {}) {
  const { thirdPartySources } = audio;
  if (!thirdPartySources || !thirdPartySources.length) {
    return '';
  }
  const spotifySource = thirdPartySources.find(
    s => s.type === MUSIC_SOURCES.SPOTIFY
  );
  return spotifySource ? spotifySource.trackUrl : '';
}

export function getAppleMusicUrlFromAudio(audio = {}) {
  const { thirdPartySources } = audio;
  if (!thirdPartySources || !thirdPartySources.length) {
    return '';
  }
  const appleMusicSource = thirdPartySources.find(
    s => s.type === MUSIC_SOURCES.APPLE_MUSIC
  );
  return appleMusicSource ? appleMusicSource.trackUrl : '';
}

export function getShareUrl(stationId, vanitySlug, activeAudio) {
  let shareSlug = `/s/${stationId}`;
  if (vanitySlug) {
    shareSlug = `/${vanitySlug}`;
  }
  return `${getBaseUrl()}${shareSlug}${
    activeAudio && activeAudio.stationAudioId
      ? `?at=${activeAudio.stationAudioId}`
      : ''
  }`;
}

export function getShareEmbedHtml(stationId, vanitySlug, activeAudio) {
  return `<iframe src="${getBaseUrl()}/e/${stationId}${
    activeAudio && activeAudio.stationAudioId
      ? `?at=${activeAudio.stationAudioId}`
      : ''
  }" height="270px" width="400px" frameborder="0" scrolling="no"></iframe>`;
}

export function getMeaningfulCaption(audios, activeIndex) {
  const activeAudio = activeIndex !== -1 ? audios[activeIndex] : audios[0];
  if (activeAudio && activeAudio.caption) {
    return activeAudio.caption;
  }
  const firstAudioWithCaption = audios.find(a => !!a.caption);
  if (firstAudioWithCaption) {
    return firstAudioWithCaption.caption;
  }
  return null;
}

function getIdentifierForPlayback(activeAudio, isV3Episode = false) {
  if (!activeAudio) {
    return {};
  }
  if (isV3Episode) {
    return {
      audioId: activeAudio.audioId,
    };
  }
  return {
    stationAudioId: activeAudio.stationAudioId,
  };
}

function safelyEncodeURIComponent(str) {
  try {
    return encodeURIComponent(str);
  } catch (err) {
    return '';
  }
}
