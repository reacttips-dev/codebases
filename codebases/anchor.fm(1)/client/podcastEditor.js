import { push } from 'react-router-redux';
import unescaper from 'anchor-server-common/utilities/unescaper';
import { VALID_USER_EMAIL_REGEX } from 'anchor-server-common/utilities/user/constants';
import { mapPodcastCategories } from 'screens/SettingsScreen/components/SettingsForm/SettingsForm';
import { unsetAndRedirectUser, fetchUserVerificationState } from './user';
import AnchorAPI from './modules/AnchorAPI';
import AnchorAPIError from './modules/AnchorAPI/AnchorAPIError';
import {
  RECEIVE_PODCAST_METADATA,
  RECEIVE_PODCAST_METADATA_FETCH_REQUEST,
  RECEIVE_PODCAST_IMAGE,
  RECEIVE_PODCAST_CATEGORIES,
  RECEIVE_SOCIAL_URLS,
} from './podcastEditorActionNames';

const emptyArray = [];
const emptyObject = {};

// TODO (bui): fetching default state should not be true
const initialState = {
  isFetchingMetadata: true,
  authorName: null,
  userEmail: null,
  userBioUrl: null,
  feedUrl: null,
  podcastImage: null,
  podcastImageFull: null,
  isExplicit: false,
  itunesCategory: null,
  language: null,
  listenerSupportCustomMessage: null,
  podcastDescription: null,
  podcastName: null,
  safePodcastDescription: null,
  vanitySlug: '',
  vanitySlugIsPristine: true,
  hasAnchorBranding: true,
  doEnableListenerSupportLinkInEpisodes: false,
  isPublicCallinShownOnWeb: true,
  isPublicCallinShownFromRSS: false,
  isUserEmailInRss: false,
  podcastCategoryOptions: emptyArray,
  profileHeaderColor: '',
  userSocialUrls: emptyObject,
};

// reducers

// eslint-disable-next-line import/no-default-export
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_PODCAST_IMAGE: {
      return {
        ...state,
        podcastImage: action.payload.podcastImage,
      };
    }
    case RECEIVE_PODCAST_METADATA_FETCH_REQUEST: {
      return {
        ...state,
        isFetchingMetadata: action.payload.isFetchingMetadata,
      };
    }
    case RECEIVE_PODCAST_METADATA: {
      const {
        authorName,
        doEnableListenerSupportLinkInEpisodes,
        feedUrl,
        hasAnchorBranding,
        isExplicit,
        itunesCategory,
        language,
        listenerSupportCustomMessage,
        podcastDescription,
        podcastImage,
        podcastImageFull,
        podcastName,
        safePodcastDescription,
        userEmail,
        userBioUrl,
        vanitySlug,
        doHideDefaultAdSlotsInEpisodes,
        isPublicCallinShownOnWeb,
        isPublicCallinShownFromRSS,
        isUserEmailInRss,
        hasInternationalSponsorships,
        profileHeaderColor,
        contactabilityStatus,
        isMusicAndTalkFastTrackEnabled,
      } = action.payload;
      return {
        ...state,
        authorName: unescaper(authorName),
        doEnableListenerSupportLinkInEpisodes,
        hasAnchorBranding,
        feedUrl,
        isExplicit,
        isFetchingMetadata: false,
        itunesCategory,
        language,
        listenerSupportCustomMessage,
        podcastName: unescaper(podcastName),
        podcastImage,
        podcastImageFull,
        podcastDescription: unescaper(podcastDescription),
        safePodcastDescription: unescaper(safePodcastDescription),
        userEmail: unescaper(userEmail),
        userBioUrl: unescaper(userBioUrl),
        vanitySlug,
        doHideDefaultAdSlotsInEpisodes,
        isPublicCallinShownOnWeb,
        isPublicCallinShownFromRSS,
        isUserEmailInRss,
        hasInternationalSponsorships,
        profileHeaderColor,
        contactabilityStatus,
        isMusicAndTalkFastTrackEnabled,
      };
    }
    case RECEIVE_PODCAST_CATEGORIES: {
      return {
        ...state,
        podcastCategoryOptions: action.payload.categories,
      };
    }
    case RECEIVE_SOCIAL_URLS: {
      return {
        ...state,
        userSocialUrls: action.payload.userSocialUrls,
      };
    }
    default:
      return state;
  }
}

// action creators

function receivePodcastMetadataFetchRequest(fetching) {
  return {
    type: RECEIVE_PODCAST_METADATA_FETCH_REQUEST,
    payload: {
      isFetchingMetadata: fetching,
    },
  };
}

function receivePodcastCategories(categories) {
  return {
    type: RECEIVE_PODCAST_CATEGORIES,
    payload: {
      categories,
    },
  };
}

function receiveSocialUrls(userSocialUrls) {
  return {
    type: RECEIVE_SOCIAL_URLS,
    payload: {
      userSocialUrls,
    },
  };
}

export function receivePodcastImage(imageUrl) {
  return {
    type: RECEIVE_PODCAST_IMAGE,
    payload: {
      podcastImage: imageUrl,
    },
  };
}

export function receivePodcastMetadata(podcastMetadata) {
  return {
    type: RECEIVE_PODCAST_METADATA,
    payload: podcastMetadata,
  };
}

// thunks

export function fetchPodcastCategories() {
  return dispatch => {
    AnchorAPI.fetchPodcastCategories().then(({ podcastCategoryOptions }) =>
      dispatch(
        receivePodcastCategories(mapPodcastCategories(podcastCategoryOptions))
      )
    );
  };
}

export function fetchSocialUrls(stationId) {
  return dispatch => {
    AnchorAPI.fetchSocialUrls({ stationId }).then(res => {
      const payload = res.userSocialUrls.reduce(
        (acc, platform) => ({
          [platform.type]: platform.username,
          ...acc,
        }),
        {}
      );
      dispatch(receiveSocialUrls(payload));
    });
  };
}

export function fetchMyPodcastMetadata() {
  return (dispatch, getState) => {
    dispatch(receivePodcastMetadataFetchRequest(true));
    return fetch('/api/podcast/metadata', {
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
          return responseJson;
        }
        if (responseJson && responseJson.isFirstTimeCreator) {
          // no metadata; first time podcast creator
          const {
            onboarding,
            user: { user },
          } = getState();
          if (!onboarding.image) {
            // TODO: What text? Move this until submission? (comes as 'null')
          }
          dispatch(
            receivePodcastMetadata({
              ...responseJson,
              ...preFillPodcastForCreation({
                podcast: responseJson,
                user,
              }),
            })
          );
          return responseJson;
        }
        dispatch(receivePodcastMetadata(responseJson));
        return responseJson;
      })
      .then(responseJson => {
        dispatch(receivePodcastMetadataFetchRequest(false));
        return responseJson;
      })
      .catch(() => dispatch(receivePodcastMetadataFetchRequest(false)));
  };
}

// important that this returns a promise to the form submit handler
export function submitUpdatePodcastMetadataShortForm(data) {
  submitUpdatePodcastMetadataForm(data, true);
}

/**
 * @name submitUpdatePodcastMetadataForm
 * @typedef {Object} FormData - Settings Form state in key/value pair ( `{ [key]: any }` )
 * @param {FormData} formData - the user's metadata
 */
export function submitUpdatePodcastMetadataForm(formData) {
  return (dispatch, getState) => {
    const {
      podcast,
      podcastEditor,
      user: { user },
    } = getState();
    const { podcastUrlDictionary } = podcast;
    const { vanitySlug } = podcastEditor;
    const { userId } = user;
    const {
      doShowDefaultAdSlotsInEpisodes,
      facebookSocialUsername,
      instagramSocialUsername,
      youtubeSocialUsername,
      ...restData
    } = formData;
    const data = {
      ...restData,
      doHideDefaultAdSlotsInEpisodes: !doShowDefaultAdSlotsInEpisodes,
    };
    const socialUrls = {
      facebookSocialUsername,
      instagramSocialUsername,
      youtubeSocialUsername,
    };
    if (vanitySlug === data.vanitySlug) {
      delete data.vanitySlug;
    }
    const { externalLinks } = data;
    const newExternalLinks = {};

    if (externalLinks) {
      delete externalLinks.anchor; // always read-only
      Object.keys(externalLinks).forEach(key => {
        if (externalLinks[key] === podcastUrlDictionary[key]) {
          delete externalLinks[key];
        } else if (externalLinks[key] === '') {
          newExternalLinks[key] = null;
        } else {
          newExternalLinks[key] = externalLinks[key];
        }
      });
    }

    const putData = { ...data, externalLinks: newExternalLinks };
    return AnchorAPI.updatePodcastMetadataDeprecated(putData)
      .then(() => AnchorAPI.updateSocialUrls({ userId, socialUrls }))
      .then(() => {
        if (podcastEditor.userEmail !== restData.userEmail) {
          dispatch(fetchUserVerificationState());
        }
        dispatch(fetchMyPodcastMetadata());
      })
      .catch(err => {
        if (err.constructor === AnchorAPIError) {
          const apiError = err;
          const { response } = apiError;
          const { status } = response;
          switch (status) {
            case 400:
              return response.text().then(responseText => {
                window.scrollTo(0, 0);
                throw new Error(responseText);
              });
            case 403:
              dispatch(push('/404'));
              return Promise.resolve();
            case 401:
              dispatch(unsetAndRedirectUser());
              return Promise.resolve();
            default:
              throw err; // We didn't expect this
          }
        } else {
          throw err; // We didn't expect this
        }
      });
  };
}

function preFillPodcastForCreation({ podcast, user }) {
  const { vanitySlug } = podcast;
  return {
    authorName: user.name,
    vanitySlug,
  };
}

function validateEmail(email) {
  return VALID_USER_EMAIL_REGEX.test(email);
}

export const validVanitySlugRegex = new RegExp('^[a-zA-Z0-9-]+$');

export function validate(values) {
  const { userEmail, vanitySlug } = values;
  const errors = {};
  if (!userEmail || !validateEmail(userEmail)) {
    errors.userEmail = 'Must provide a valid email address.';
  }
  if (!vanitySlug || !validVanitySlugRegex.test(vanitySlug)) {
    errors.vanitySlug = 'Must provide a valid URL.';
  }
  return errors;
}
