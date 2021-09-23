/**
 * This reducer is persisted to local storage
 */
import { REHYDRATE } from 'redux-persist/constants';
import { DEFAULT_PODCAST_IMAGE } from '../helpers/serverRenderingUtils';
import { searchRSSFeeds, receiveRSSSearchResults } from './search';

export const FETCHING_VANITY_SLUG = '@@onboarding/FETCHING_VANITY_SLUG';

export const RECEIVE_PODCAST_NAME = '@@onboarding/RECEIVE_PODCAST_NAME';
export const RECEIVE_PODCAST_DESCRIPTION =
  '@@onboarding/RECEIVE_PODCAST_DESCRIPTION';
export const RECEIVE_IMAGE = '@@onboarding/RECEIVE_IMAGE';
export const RECEIVE_ITUNES_CATEGORY = '@@onboarding/RECEIVE_ITUNES_CATEGORY';
export const RECEIVE_VALID_BETA_CODE = '@@onboarding/RECEIVE_VALID_BETA_CODE';
export const RECEIVE_VANITY_SLUG = '@@onboarding/RECEIVE_VANITY_SLUG';
export const RECEIVE_VANITY_SLUG_IS_AVAILABLE =
  '@@onboarding/RECEIVE_VANITY_SLUG_IS_AVAILABLE';
export const RECEIVE_RSS_FEED_METADATA =
  '@@onboarding/RECEIVE_RSS_FEED_METADATA';
export const RECEIVE_RSS_IMPORT_REQUEST =
  '@@onboarding/RECEIVE_RSS_IMPORT_REQUEST';
export const RECEIVE_REQUEST_BETA_CODE_CONFIRMATION =
  '@@onboarding/RECEIVE_REQUEST_BETA_CODE_CONFIRMATION';
export const RESET_ONBOARDING = '@@onboarding/RESET_ONBOARDING';

export const ONBOARDING_BETA_CODE_REQUEST_FORM =
  'onboardingBetaCodeRequestForm';
export const ONBOARDING_BETA_CODE_SUBMISSION_FORM =
  'onboardingBetaCodeSubmission';
export const ONBOARDING_IMPORT_RSS_FORM = 'onboardingImportRss';
export const ONBOARDING_PODCAST_NAME_FORM = 'onboardingPodcastName';
export const ONBOARDING_PODCAST_DESCRIPTION_FORM =
  'onboardingPodcastDescription';
export const ONBOARDING_EMAIL_FORM = 'onboardingEmailForm';
export const ONBOARDING_PLACEHOLDER_EPISODE_FORM =
  'onboardingPlaceholderEpisodeForm';
export const ONBOARDING_ITUNES_CATEGORY_FORM = 'onboardingItunesCategoryForm';
export const ONBOARDING_VANITY_URL_FORM = 'onboardingVanityUrlForm';

export const DASHBOARD_TUTORIAL_POPUP_NAME = 'dashboardTutorialPopup';
export const DISTRIBUTE_EPISODE_TUTORIAL_POPUP_NAME =
  'distributeEpisodeTutorialPopup';
export const DEFAULT_IMAGE = DEFAULT_PODCAST_IMAGE;
export const DEFAULT_PODCAST_DESCRIPTION = 'This is my podcast!';

export const DISTRIBUTION_SUPPORT_LINK =
  'https://help.anchor.fm/hc/en-us/articles/360000625971';
export const SWITCH_TO_ANCHOR_SUPPORT_LINK =
  'https://help.anchor.fm/hc/en-us/articles/115001185692-Redirecting-your-RSS-feed-to-Anchor';
export const PODCAST_IMPORT_SUPPORT_LINK =
  'https://help.anchor.fm/hc/en-us/sections/115000330092';

const emptyObject = {};

const initialState = {
  fetchingRSSFeedImport: false,
  image: null,
  itunesCategory: null,
  podcastDescription: null,
  podcastName: null,
  rssFeed: null,
  rssFeedMetadata: emptyObject,
  rssFeedError: null,
  rssFeedIsValid: false,
  submittedBetaCodeRequest: false,
  validBetaCode: null,
  vanitySlug: null,
};

// reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE: {
      // localStorage
      const { onboarding } = action.payload;
      if (onboarding) {
        return {
          ...initialState,
          ...onboarding,
        };
      }
      return state;
    }
    case RECEIVE_PODCAST_NAME: {
      const { podcastName } = action.payload;
      return {
        ...state,
        podcastName,
      };
    }
    case RECEIVE_PODCAST_DESCRIPTION: {
      const { podcastDescription } = action.payload;
      return {
        ...state,
        podcastDescription,
      };
    }
    case RECEIVE_IMAGE: {
      const { image } = action.payload;
      return {
        ...state,
        image,
      };
    }
    case RECEIVE_RSS_IMPORT_REQUEST: {
      const { rssFeed, fetchingRSSFeedImport = false } = action.payload;
      // Clear existing metadata
      return {
        ...state,
        rssFeed,
        fetchingRSSFeedImport,
      };
    }
    case RECEIVE_RSS_FEED_METADATA: {
      if (action.error) {
        return {
          ...state,
          rssFeedError: action.payload,
          rssFeedIsValid: false,
          rssFeedMetadata: emptyObject,
        };
      }
      const { rssFeedMetadata = emptyObject } = action.payload;
      return {
        ...state,
        rssFeedMetadata,
        rssFeedIsValid: true,
        rssFeedError: null,
      };
    }
    case RECEIVE_ITUNES_CATEGORY: {
      const { itunesCategory } = action.payload;
      return {
        ...state,
        itunesCategory,
      };
    }
    case RECEIVE_VALID_BETA_CODE: {
      const { validBetaCode } = action.payload;
      return {
        ...state,
        validBetaCode,
      };
    }
    case RECEIVE_VANITY_SLUG: {
      const { vanitySlug } = action.payload;
      return {
        ...state,
        vanitySlug,
      };
    }
    case RECEIVE_REQUEST_BETA_CODE_CONFIRMATION: {
      return {
        ...state,
        submittedBetaCodeRequest: true,
      };
    }
    case RESET_ONBOARDING:
      return initialState;
    default:
      return state;
  }
}

export function receivePodcastName(podcastName) {
  return {
    type: RECEIVE_PODCAST_NAME,
    payload: {
      podcastName,
    },
  };
}

export function receivePodcastDescription(podcastDescription) {
  return {
    type: RECEIVE_PODCAST_DESCRIPTION,
    payload: {
      podcastDescription,
    },
  };
}

export function receiveRSSImportRequest(rssFeed, fetchingRSSFeedImport) {
  return {
    type: RECEIVE_RSS_IMPORT_REQUEST,
    payload: {
      rssFeed,
      fetchingRSSFeedImport,
    },
  };
}

export function receiveRSSFeedMetadata(rssFeedMetadata) {
  return {
    type: RECEIVE_RSS_FEED_METADATA,
    payload: {
      rssFeedMetadata,
    },
  };
}

export function receiveRSSFeedError({ title, subTitle, message }) {
  const error = new Error(message);
  error.title = title;
  error.subTitle = subTitle;
  return {
    type: RECEIVE_RSS_FEED_METADATA,
    payload: error,
    error: true,
  };
}

export function receiveItunesCategory(itunesCategory) {
  return {
    type: RECEIVE_ITUNES_CATEGORY,
    payload: {
      itunesCategory,
    },
  };
}

export function receiveVanitySlug({ vanitySlug }) {
  return {
    type: RECEIVE_VANITY_SLUG,
    payload: {
      vanitySlug,
    },
  };
}

export function resetOnboarding() {
  return {
    type: RESET_ONBOARDING,
  };
}

export function receiveRSSSearch(value) {
  return dispatch => {
    // reset anything in the store
    dispatch(receiveRSSFeedMetadata({}));
    return new Promise((resolve, reject) => {
      // if the feed has a period, we should check first if it's a URL
      if (!value.includes('.')) {
        throw new Error('Not an RSS feed URL.');
      }
      fetch('/api/onboarding/feedurl', {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          feedUrl: value,
        }),
      })
        .then(resolve)
        .catch(reject);
    })
      .then(response => {
        if (response.status !== 200) {
          if (response.status === 500) {
            throw new Error('Sorry! Something went wrong on our end.');
          }
          return response.text().then(err => {
            throw new Error(err);
          });
        }
        return response.json();
      })
      .then(responseJson => {
        // UI displays result as a search result
        const rssMetadataSearchObject = {
          ...responseJson,
          feedUrl: value,
          type: 'direct',
        };
        dispatch(receiveRSSSearchResults([rssMetadataSearchObject]));
      })
      .catch(() => {
        dispatch(searchRSSFeeds(value));
      });
  };
}

export function submitRSSFeed(feedUrl) {
  return dispatch => {
    if (!feedUrl) {
      dispatch(receiveRSSFeedError({ message: 'A feed is required' }));
      return;
    }
    dispatch(receiveRSSImportRequest(feedUrl, true));
    // eslint-disable-next-line consistent-return
    return new Promise((resolve, reject) => {
      fetch('/api/onboarding/feedurl', {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          feedUrl,
        }),
      })
        .then(resolve)
        .catch(reject);
    })
      .then(response => {
        if (response.status !== 200) {
          if (response.status === 500) {
            throw new Error('Sorry! Something went wrong on our end.');
          }
          return response.text().then(err => {
            throw new Error(err);
          });
        }
        return response.json();
      })
      .then(responseJson => {
        dispatch(receiveRSSFeedMetadata(responseJson));
        // pre-fill podcastName in this flow for vanity URL in account step
        if (responseJson.podcastName) {
          dispatch(receivePodcastName(responseJson.podcastName));
        }
      })
      .catch(err => {
        dispatch(receiveRSSFeedError(err));
      })
      .finally(() => dispatch(receiveRSSImportRequest(feedUrl, false)));
  };
}

export function fetchTempVanitySlugFromPodcastName() {
  return (dispatch, getState) => {
    const { onboarding } = getState();
    return new Promise((resolve, reject) => {
      fetch('/api/onboarding/vanityurl/generate', {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          podcastName: onboarding.podcastName,
        }),
      })
        .then(resolve)
        .catch(reject);
    })
      .then(response => {
        if (response.status !== 200) {
          return response;
        }
        return response.json();
      })
      .then(responseJson => {
        if (responseJson.status && responseJson.status !== 200) {
          return;
        }
        dispatch(receiveVanitySlug(responseJson));
        // eslint-disable-next-line consistent-return
        return responseJson;
      });
  };
}

export function fetchIsVanitySlugAvailable(vanitySlug) {
  return fetch(`/api/onboarding/vanityurl/${vanitySlug}`, {
    method: 'GET',
    credentials: 'same-origin',
  }).then(({ status }) => status === 404);
}
