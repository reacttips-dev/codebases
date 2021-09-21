import { combineReducers } from 'redux';
import types from './types';

/* State Shape
{
    podcast: {
      podcastId: ?????
      podcastEpisodes: [
        {
            created: string,
            createdUnixTimestamp: number
            description: "The very first episode of test test test!",
            hourOffset: number,
            isDeleted: boolean,
            isPublished: boolean,
            podcastEpisodeId: string
            publishOn: string
            publishOnUnixTimestamp: number
            title: string
            episodeImage: null || string
            shareLinkPath: string
            shareLinkEmbedPath: string
        }
      ]
      totalPodcastEpisodes: number
      vanitySlug: string,
      money: {
        hasAuthenticatedStripe: bool
        hasSupportersEnabled: bool
        loginLink: bool
        isAllowedToAuthenticateStripe: bool

      }
      status: {
        podcastStatus: string ("pending",'optedout', ???)
        vanitySlug": string,
        podcastUrlDictionary: {} ????
        isFirstTimeCreator: boolean,
        isRedirectedToAnchor: boolean
      }
      metadata: {
        authorName: string,
        userEmail: string,
        feedUrl: string,
        itunesCategory: string,
        isFirstTimeCreator: boolean,
        podcastDescription: string
        podcastImage: string
        podcastImageFull: string
        podcastName: string
        safePodcastDescription: string
        vanitySlug: string
        hasAnchorBranding: boolean
        podcastExternalSource?: string
        doHideDefaultAdSlotsInEpisodes: bool
        hasEverEnabledSponsorships: bool
      },
      // TODO: migrate to webStationId
      stationId:
      webStationId:
      profile: {
        creator: {
          generatedImage: null || string,
          name: string,
          userId: number,
          vanitySlug: string
        },
        episode: null || ??????????
        episodeAudios: [], ???? What can be in this array
        episodes: [], ???? What can be in this array
        podcastMetadata: {
          hasAnchorBrandingRemoved: bool,
          podcastAuthorName: string
          podcastCategory: string
          podcastDescription: string
          podcastImage: string
          podcastImage400: string
          podcastName: string
        },
        podcastUrlDictionary: {}, ??????
        userDictionary: {} ???????
      }

    }
}
*/

const initialState = {
  podcastDataFetchStatus: 'idle',
  podcastEpisodes: [],
  episodeMetadataByEpisodeId: {},
  status: {},
  metadata: {},
  money: { hasSupportersEnabled: false },
  profile: {
    creator: {},
    episodeAudios: [],
    episodes: [],
    podcastMetadata: {},
  },
  profileColor: '',
};

const podcastReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_PODCAST_DATA_FETCH_STATUS:
      return {
        ...state,
        podcastDataFetchStatus: action.payload.status,
      };
    case types.SET_PODCAST:
      return {
        ...state,
        ...action.payload.podcast,
      };
    case types.SET_PROFILE_COLOR:
      return {
        ...state,
        profileColor: `#${action.payload.color}`,
      };
    case types.SET_HAS_ANCHOR_BRANDING:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          hasAnchorBranding: action.payload.hasAnchorBranding,
        },
      };
    default:
      return state;
  }
};

const reducer = combineReducers({
  podcast: podcastReducer,
});

export default reducer;
