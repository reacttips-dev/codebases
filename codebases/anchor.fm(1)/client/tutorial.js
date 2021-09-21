/**
 * This reducer is persisted to local storage
 */
import { REHYDRATE } from 'redux-persist/constants';
import AnchorAPI from './modules/AnchorAPI';
import { duckOperations as globalPodcastDuckOperations } from './store/global/podcast';

export const DISMISS_BANNER = '@@tutorial/DISMISS_BANNER';
export const DISMISS_TUTORIAL_POPUP = '@@tutorial/DISMISS_TUTORIAL_POPUP';
export const DISMISS_TRANSCRIPTION_POPUP =
  '@@tutorial/DISMISS_TRANSCRIPTION_POPUP';
export const TOGGLE_IS_SHORT_METADATA_FORM_SHOWING =
  '@@tutorial/TOGGLE_IS_SHORT_METADATA_FORM_SHOWING';

export const DASHBOARD_TUTORIAL_POPUP_NAME = 'dashboardTutorialPopup';
export const DISTRIBUTE_EPISODE_TUTORIAL_POPUP_NAME =
  'distributeEpisodeTutorialPopup';
export const DISMISS_TRANSCRIPTION_POPUP_NAME =
  'dismissTranscriptionTutorialPopup';

export const BANNER_STATES = {
  NO_PODCAST: 'noPodcast',
  NO_EPISODE: 'noEpisode',
  NO_STATUS: 'noStatus',
  PRIVACY_NOTICE: 'privacyNotice',
  SWITCH_TO_ANCHOR: 'switchToAnchor', // redirect needed
  ACTIVATE_ANCHOR_PAY: 'activateAnchorPay',
  CURRENTLY_IMPORTING: 'currentlyImporting',
  IMPORT_FAILED: 'importFailed',
  ACTIVATE_SPONSORSHIPS: 'activateSponsorships',
};

const emptyObject = {};

const initialState = {
  dismissedBanners: emptyObject,
  dismissedTutorialPopups: emptyObject,
  // TODO: deprecate
  isOptedOutOfDistribution: false,
  isShortMetadataFormModalShowing: false,
};

// reducer

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_IS_SHORT_METADATA_FORM_SHOWING:
      return {
        ...state,
        isShortMetadataFormModalShowing: !state.isShortMetadataFormModalShowing,
      };
    case REHYDRATE: {
      // localStorage
      const { tutorial } = action.payload;
      if (tutorial) {
        return {
          ...initialState,
          ...tutorial,
        };
      }
      return state;
    }
    case DISMISS_BANNER: {
      const { dismissedBanners } = state;
      const { bannerType } = action.payload;
      const newDismissedBanners = {
        ...dismissedBanners,
      };
      newDismissedBanners[bannerType] = true;
      return {
        ...state,
        dismissedBanners: newDismissedBanners,
      };
    }
    case DISMISS_TUTORIAL_POPUP: {
      const { dismissedTutorialPopups } = state;
      const { popupType } = action.payload;
      const newDismissedTutorialPopups = {
        ...dismissedTutorialPopups,
      };
      newDismissedTutorialPopups[popupType] = true;
      return {
        ...state,
        dismissedTutorialPopups: newDismissedTutorialPopups,
      };
    }
    default:
      return state;
  }
}

// action creators

export function dismissBanner(bannerType) {
  return {
    type: DISMISS_BANNER,
    payload: {
      bannerType,
    },
  };
}

export function dismissTutorialPopup(popupType) {
  return {
    type: DISMISS_TUTORIAL_POPUP,
    payload: {
      popupType,
    },
  };
}

export function toggleIsShortMetadataFormShowing() {
  return {
    type: TOGGLE_IS_SHORT_METADATA_FORM_SHOWING,
  };
}

// thunks

// TODO: deprecate
export function migrateIsOptOutOfDistributionFromSession() {
  return (dispatch, getState) => {
    const {
      global: {
        podcast: {
          podcast: {
            status: { podcastStatus },
            webStationId,
          },
        },
      },
      tutorial,
    } = getState();
    const isOptOutOfDistributionFromSession = tutorial.isOptedOutOfDistribution;
    const isOptedOutFromDatabase = globalPodcastDuckOperations.getIsOptedOutOfDistributionFromPodcastStatus(
      podcastStatus
    );
    if (!isOptedOutFromDatabase && isOptOutOfDistributionFromSession) {
      return AnchorAPI.optOutOfPodcastDistribution({ webStationId });
    }
    return Promise.resolve();
  };
}
