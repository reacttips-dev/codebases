import { replace } from 'react-router-redux';
import unescaper from 'anchor-server-common/utilities/unescaper';
import {
  creatorReducer,
  receivePodcastMetadata,
  receiveStation,
  receiveActiveStationAudioId,
  pause,
  playOrPause,
} from './station';
import {
  APP_INIT,
  getBaseUrl,
  getEpisodeImage,
  nextFrame,
} from '../helpers/serverRenderingUtils';
import {
  receivePageMetadata,
  updateGoogleBreadcrumbsStructuredData,
} from './pageMetadata';

import {
  RECEIVE_V3_CREATOR,
  RECEIVE_EPISODE,
  RECEIVE_V3_EPISODE,
  RECEIVE_V3_EPISODE_LIST,
} from './episodePreviewConstants';

const emptyArray = [];
const emptyObject = {};

const initialState = {
  creator: emptyObject,
  duration: 0,
  episodes: emptyArray,
  shareLinkPath: null,
  shareLinkEmbedPath: null,
  title: null,
  isV3Episode: false,
};

function episodeReducer(state = {}, action) {
  switch (action.type) {
    case APP_INIT:
      return {
        ...state,
        created: new Date(state.created),
        publishOn: new Date(state.publishOn),
      };
    case RECEIVE_V3_EPISODE_LIST: {
      return {
        ...state,
        created: new Date(state.createdUnixTimestamp * 1000),
        publishOn: new Date(state.publishOnUnixTimestamp * 1000),
      };
    }
    default:
      return state;
  }
}

// reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case APP_INIT: // format date from JSON
      return {
        ...state,
        created: new Date(state.created),
        publishOn: new Date(state.publishOn),
        episodes: state.episodes.map(e => episodeReducer(e, action)),
      };
    case RECEIVE_EPISODE:
      return {
        ...state,
        creator: creatorReducer(action.creator, action),
        isV3Episode: false,
        title: unescaper(action.title),
      };
    case RECEIVE_V3_CREATOR: {
      return {
        ...state,
        creator: creatorReducer(action.payload, action),
      };
    }
    case RECEIVE_V3_EPISODE: {
      return {
        ...state,
        created: new Date(action.payload.createdUnixTimestamp * 1000),
        publishOn: new Date(action.payload.publishOnUnixTimestamp * 1000),
        duration: action.payload.duration,
        isV3Episode: true,
        shareLinkPath: action.payload.shareLinkPath,
        shareLinkEmbedPath: action.payload.shareLinkEmbedPath,
        title: unescaper(action.payload.title),
        episodeEnclosureUrl: action.payload.episodeEnclosureUrl,
      };
    }
    case RECEIVE_V3_EPISODE_LIST: {
      return {
        ...state,
        episodes: action.payload.episodes.map(e => episodeReducer(e, action)),
      };
    }
    default:
      return state;
  }
}

// action creators

function receiveV3Creator(creator) {
  return {
    type: RECEIVE_V3_CREATOR,
    payload: creator,
  };
}

function receiveV3Episode(episode) {
  return {
    type: RECEIVE_V3_EPISODE,
    payload: episode,
  };
}

function receiveV3EpisodeList(episodes) {
  return {
    type: RECEIVE_V3_EPISODE_LIST,
    payload: {
      episodes,
    },
  };
}

function redirectTo404() {
  return (dispatch, getState) => {
    const { routing } = getState();
    if (routing) {
      const {
        location: { pathname },
      } = routing;
      if (pathname.includes('/embed/')) {
        dispatch(replace('/embed/404', { status: 404 }));
      } else {
        dispatch(replace('/404', { status: 404 }));
      }
    }
  };
}

// thunks

export function fetchV3Episode(
  baseUrl = '',
  episodeId,
  stationAudioId,
  autoStart
) {
  return async (dispatch, getState) => {
    if (!episodeId || episodeId === '') {
      dispatch(redirectTo404());
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/api/v3/episodes/${episodeId}`, {
        credentials: 'same-origin',
      });

      /**
       * send user to 404 page if we failed to fetch episode
       */
      if (response.status !== 200) {
        dispatch(redirectTo404());
        return;
      }
      const json = await response.json();

      /**
       * redirect to main profile page if `redirect` property is present
       */
      if (json.redirect) {
        dispatch(replace(json.redirect));
        return;
      }

      const {
        episode,
        episodeAudios,
        episodes,
        creator,
        userDictionary,
        podcastMetadata,
        podcastUrlDictionary,
      } = json;
      dispatch(receiveV3Episode(episode));
      dispatch(receiveV3EpisodeList(episodes));
      dispatch(receiveV3Creator(creator));
      const {
        routing: {
          location: { pathname },
        },
      } = getState();

      const stationFromEpisode = {
        ...episode,
        audios: episodeAudios,
        vanitySlug: creator.vanitySlug,
      };
      dispatch(
        receiveStation({
          station: stationFromEpisode,
          creator,
          users: userDictionary,
          podcastUrlDictionary,
          defaultProfileHeaderColor: podcastMetadata.defaultProfileHeaderColor,
        })
      );

      dispatch(
        updateGoogleBreadcrumbsStructuredData([
          {
            name: 'Anchor',
            url: 'http://anchor.fm',
          },
          {
            name: podcastMetadata.podcastName,
            url: `http://anchor.fm/${creator.vanitySlug}`,
          },
          {
            name: episode.title,
            url: `http://anchor.fm${episode.shareLinkPath}`,
          },
        ])
      );
      dispatch(receivePodcastMetadata(podcastMetadata));
      const activeAudio = getV3ActiveAudio(episodeAudios, stationAudioId);
      if (activeAudio) {
        if (autoStart && !episode.isMT) {
          dispatch(pause());
          nextFrame(() => {
            dispatch(playOrPause());
          });
        }
        dispatch(
          receiveActiveStationAudioId(activeAudio.stationAudioId, false)
        );
      }
      dispatch(
        receivePageMetadata(
          getMetadataFromV3ProfileAndEpisode(
            stationFromEpisode,
            creator,
            podcastMetadata,
            episode,
            activeAudio,
            getEpisodeImage({ episode, podcastMetadata, creator }),
            pathname
          )
        )
      );
    } catch (err) {
      dispatch(redirectTo404());
      throw new Error(err);
    }
  };
}

export function fetchV3ProfileAndLatestEpisode(
  baseUrl = '',
  stationId,
  autoStart
) {
  return (dispatch, getState) =>
    fetch(`${baseUrl}/api/v3/profile/${stationId}`, {
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
          const { routing } = getState();
          if (routing && routing.location.pathname.includes('/embed/')) {
            dispatch(replace('/embed/404', { status: 404 }));
          } else {
            dispatch(replace('/404', { status: 404 }));
          }
          return;
        }
        const {
          episode,
          episodeAudios,
          episodes,
          creator,
          userDictionary,
          podcastMetadata,
          podcastUrlDictionary,
          trailerUrl,
        } = responseJson;
        // eslint-disable-next-line no-unused-expressions
        episode && dispatch(receiveV3Episode(episode));
        // eslint-disable-next-line no-unused-expressions
        episodes && episodes.length && dispatch(receiveV3EpisodeList(episodes));
        dispatch(receiveV3Creator(creator));
        const {
          routing: { location },
        } = getState();
        const { pathname, search } = location;
        // new episode player page
        const stationFromEpisode = {
          ...episode,
          audios: episodeAudios,
          stationId,
          vanitySlug: creator.vanitySlug,
        };
        dispatch(
          receiveStation({
            station: stationFromEpisode,
            creator,
            users: userDictionary,
            podcastUrlDictionary,
            trailerUrl,
            defaultProfileHeaderColor:
              podcastMetadata.defaultProfileHeaderColor,
          })
        );
        dispatch(
          updateGoogleBreadcrumbsStructuredData([
            {
              name: 'Anchor',
              url: 'http://anchor.fm',
            },
            {
              name: podcastMetadata.podcastName,
              url: `http://anchor.fm/${creator.vanitySlug}`,
            },
          ])
        );
        dispatch(receivePodcastMetadata(podcastMetadata));
        const activeAudio = getV3ActiveAudio(episodeAudios);
        if (activeAudio) {
          if (autoStart && !episode.isMT) {
            dispatch(pause());
            nextFrame(() => {
              dispatch(playOrPause());
            });
          }
        }
        dispatch(
          receivePageMetadata(
            getMetadataFromV3ProfileAndEpisode(
              stationFromEpisode,
              creator,
              podcastMetadata,
              null, // just base on creator
              null, // never deep-link an audio from profile level
              getEpisodeImage({ podcastMetadata, creator }),
              pathname
            )
          )
        );
        // hack - but we need to make the location no longer be a 404
        // TODO: better abstraction? This mutates state and is leaky
        if (location.state) {
          location.state.status = 200;
        }
      });
}

export function getShareUrl(episodeId, vanitySlug, activeAudio) {
  let shareSlug = `/rr/${episodeId}`;
  if (vanitySlug) {
    shareSlug = `/${vanitySlug}/episodes/${episodeId}`;
  }
  return `${getBaseUrl()}${shareSlug}${
    activeAudio && activeAudio.stationAudioId
      ? `?at=${activeAudio.stationAudioId}`
      : ''
  }`;
}

// note - expects vanitySlug set by this point
export function getShareEmbedHtml(episodeId, vanitySlug, activeAudio) {
  return `<iframe src="${getBaseUrl()}/${vanitySlug}/episodes/${episodeId}/embed${
    activeAudio && activeAudio.stationAudioId
      ? `?at=${activeAudio.stationAudioId}`
      : ''
  }" height="270px" width="400px" frameborder="0" scrolling="no"></iframe>`;
}

function getV3ActiveAudio(audios = [], stationAudioId) {
  if (!audios.length) {
    return null;
  }
  const matchingAudio = audios.find(
    audio => audio.stationAudioId.indexOf(stationAudioId) === 0
  );
  return matchingAudio || audios[0];
}

function getMetadataFromV3ProfileAndEpisode(
  station,
  creator,
  podcastMetadata,
  episode,
  activeAudio,
  generatedImage = null,
  pathname = ''
) {
  const name = unescaper(podcastMetadata.podcastName || creator.name);
  let title = name;
  let description;
  let oEmbedUrl;
  let oEmbedTitle;
  let stream;
  let twitterCard;
  let facebookType;
  let twitterParams;
  let rssFeedTitle;
  let rssFeedUrl;
  const isProfilePage = true;
  const isVoiceMessagePage = pathname.endsWith('/message');
  description = `Listen to Anchor audio from ${name}`;
  if (creator.bio) {
    description = unescaper(creator.bio);
  }
  if (podcastMetadata.podcastDescription) {
    description = unescaper(podcastMetadata.podcastDescription);
  }
  if (podcastMetadata.podcastName) {
    // assume a valid feed
    rssFeedTitle = podcastMetadata.podcastName;
    rssFeedUrl = `${getBaseUrl()}/s/${station.stationId}/podcast/rss`;
  }
  oEmbedUrl = `${getBaseUrl()}/api/v3/profile/${
    station.stationId
  }/oembed?title=${safelyEncodeURIComponent(title)}`;
  oEmbedTitle = title;
  // set to playback image background
  const image =
    generatedImage ||
    'https://d12xoj7p9moygp.cloudfront.net/social/web-large-playback.png';
  const twitterImage = image;
  if (episode) {
    description = title;
    if (episode.title) {
      title = `${unescaper(episode.title)} by ${name}`;
      oEmbedTitle = title;
    }
    if (episode.descriptionPreview) {
      description = unescaper(episode.descriptionPreview);
    }
    oEmbedUrl = `${getBaseUrl()}/api/v3/episodes/${
      episode.episodeId
    }/oembed?title=${safelyEncodeURIComponent(title)}`;
  }
  if (isVoiceMessagePage) {
    description =
      'Send in a voice message and you could appear on a future episode of this podcast!';
  }
  return {
    description,
    facebookType,
    image,
    oEmbedUrl,
    oEmbedTitle,
    rssFeedTitle,
    rssFeedUrl,
    stream,
    title,
    twitterCard,
    twitterImage,
    twitterParams,
    isProfilePage,
    isVoiceMessagePage,
  };
}

function safelyEncodeURIComponent(str) {
  try {
    return encodeURIComponent(str);
  } catch (err) {
    return '';
  }
}
