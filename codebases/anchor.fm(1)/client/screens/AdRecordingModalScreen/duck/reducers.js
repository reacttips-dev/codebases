import { combineReducers } from 'redux';
import types from './types';

/* State Shape
{
    isShowing: bool,
    isHouseAd: bool,
    campaignId: number,
    adDetails: string,
    adScript: string | null
    adAudio: {
        type: 'recording'
        blob: Blob,
        url: string,
      } | {
        type: 'upload',
        file: File,
        url: string,
      } | null
    companyUrl: string,
    currentTab: 'script' | 'details' | 'tips'
    cpmInCents: number,
    companyName: string,
    isPlayingAd: boolean,
    exampleAdAudioUrl: string,
    isPlayingExampleAd: boolean
    setIsShowingRecordAgainConfirmationOverlay: boolean
    setIsShowingSubmissionProgressOverlay: boolean
    setIsShowingNotInterestedConfirmationOverlay: boolean
    setIsShowingSuccessConfirmationOverlay: boolean
    setIsShowingSuccessConfirmationWithAllEpisodesActivationOverlay : boolean
    isAnchorPaymentsActivated: boolean,
}
*/

// TODO: Remove hardcoded initial state values used for testing
const initialState = {
  campaignId: -1,
  isShowing: false,
  isHouseAd: false,
  isMidrollRequired: false,
  adDetails: '',
  currentTab: 'details',
  adScript: null,
  adAudio: null,
  companyUrl: '',
  cpmInCents: null,
  companyName: '',
  isPlayingAd: false,
  exampleAdAudioUrl: '',
  isPlayingExampleAd: false,
  isShowingRecordAgainConfirmationOverlay: false,
  isShowingSubmissionProgressOverlay: false,
  isShowingNotInterestedConfirmationOverlay: false,
  isShowingSuccessConfirmationOverlay: false,
  isShowingSuccessConfirmationWithAllEpisodesActivationOverlay: false,
  isShowingMidrollRequirementOverlay: false,
  isAnchorPaymentsActivated: false,
};

const isShowingReducer = (state = initialState.isShowing, action) => {
  switch (action.type) {
    case types.SET_IS_SHOWING:
      return action.payload.isShowing;
    case types.RESET_STORE:
      return initialState.isShowing;
    default:
      return state;
  }
};

const isHouseAdReducer = (state = initialState.isHouseAd, action) => {
  switch (action.type) {
    case types.SET_IS_HOUSE_AD:
      return action.payload.isHouseAd;
    case types.RESET_STORE:
      return initialState.isHouseAd;
    default:
      return state;
  }
};

const isMidrollRequiredReducer = (
  state = initialState.isMidrollRequired,
  action
) => {
  switch (action.type) {
    case types.SET_IS_MIDROLL_REQUIRED:
      return action.payload.isMidrollRequired;
    case types.RESET_STORE:
      return initialState.isMidrollRequired;
    default:
      return state;
  }
};

const isAnchorPaymentsActivatedReducer = (
  state = initialState.isAnchorPaymentsActivated,
  action
) => {
  switch (action.type) {
    case types.SET_IS_ANCHOR_PAYMENTS_ACTIVATED:
      return action.payload.isAnchorPaymentsActivated;
    case types.RESET_STORE:
      return initialState.isAnchorPaymentsActivated;
    default:
      return state;
  }
};

const isShowingRecordAgainConfirmationOverlayReducer = (
  state = initialState.isShowingRecordAgainConfirmationOverlay,
  action
) => {
  switch (action.type) {
    case types.SET_IS_SHOWING_RECORD_AGAIN_CONFIRMATION_OVERLAY:
      return action.payload.isShowingRecordAgainConfirmationOverlay;
    case types.RESET_STORE:
      return initialState.isShowingRecordAgainConfirmationOverlay;
    default:
      return state;
  }
};
const isShowingSubmissionProgressOverlayReducer = (
  state = initialState.isShowingSubmissionProgressOverlay,
  action
) => {
  switch (action.type) {
    case types.SET_IS_SHOWING_SUBMISSION_PROGRESS_OVERLAY:
      return action.payload.isShowingSubmissionProgressOverlay;
    case types.RESET_STORE:
      return initialState.isShowingSubmissionProgressOverlay;
    default:
      return state;
  }
};

const isShowingNotInterestedConfirmationOverlayReducer = (
  state = initialState.isShowingNotInterestedConfirmationOverlay,
  action
) => {
  switch (action.type) {
    case types.SET_IS_SHOWING_NOT_INTERESTED_CONFIRMATION_OVERLAY:
      return action.payload.isShowingNotInterestedConfirmationOverlay;
    case types.RESET_STORE:
      return initialState.isShowingNotInterestedConfirmationOverlay;
    default:
      return state;
  }
};

const isShowingSuccessConfirmationOverlayReducer = (
  state = initialState.isShowingSuccessConfirmationOverlay,
  action
) => {
  switch (action.type) {
    case types.SET_IS_SHOWING_SUCCESS_CONFIRMATION_OVERLAY:
      return action.payload.isShowingSuccessConfirmationOverlay;
    case types.RESET_STORE:
      return initialState.isShowingSuccessConfirmationOverlay;
    default:
      return state;
  }
};
const isShowingSuccessConfirmationWithAllEpisodesActivationOverlayReducer = (
  state = initialState.isShowingSuccessConfirmationWithAllEpisodesActivationOverlay,
  action
) => {
  switch (action.type) {
    case types.SET_IS_SHOWING_SUCCESS_CONFIRMATION_WITH_ALL_EPISODES_ACTIVATION_OVERLAY:
      return action.payload
        .isShowingSuccessConfirmationWithAllEpisodesActivationOverlay;
    case types.RESET_STORE:
      return initialState.isShowingSuccessConfirmationWithAllEpisodesActivationOverlay;
    default:
      return state;
  }
};

const isShowingMidrollRequirementOverlayReducer = (
  state = initialState.isShowingMidrollRequirementOverlay,
  action
) => {
  switch (action.type) {
    case types.SET_IS_SHOWING_MIDROLL_REQUIREMENT_OVERLAY:
      return action.payload.isShowingMidrollRequirementOverlay;
    case types.RESET_STORE:
      return initialState.isShowingMidrollRequirementOverlay;
    default:
      return state;
  }
};

const adDetailsReducer = (state = initialState.adDetails, action) => {
  switch (action.type) {
    case types.SET_AD_DETAILS:
      return action.payload.adDetails;
    case types.RESET_STORE:
      return initialState.adDetails;
    default:
      return state;
  }
};

const currentTabReducer = (state = initialState.currentTab, action) => {
  switch (action.type) {
    case types.SET_CURRENT_TAB:
      return action.payload.currentTab;
    case types.RESET_STORE:
      return initialState.currentTab;
    default:
      return state;
  }
};

const adScriptReducer = (state = initialState.adScript, action) => {
  switch (action.type) {
    case types.SET_AD_SCRIPT:
      return action.payload.adScript;
    case types.RESET_STORE:
      return initialState.adScript;
    default:
      return state;
  }
};

const campaignIdReducer = (state = initialState.campaignId, action) => {
  switch (action.type) {
    case types.SET_CAMPAIGN_ID:
      return action.payload.campaignId;
    case types.RESET_STORE:
      return initialState.campaignId;
    default:
      return state;
  }
};

const adAudioReducer = (state = initialState.adAudio, action) => {
  switch (action.type) {
    case types.SET_AD_AUDIO:
      return action.payload.adAudio;
    case types.RESET_STORE:
      return initialState.adAudio;
    default:
      return state;
  }
};

const companyUrlReducer = (state = initialState.companyUrl, action) => {
  switch (action.type) {
    case types.SET_COMPANY_URL:
      return action.payload.companyUrl;
    case types.RESET_STORE:
      return initialState.companyUrl;
    default:
      return state;
  }
};

const cpmInCentsReducer = (state = initialState.cpmInCents, action) => {
  switch (action.type) {
    case types.SET_CPM_IN_CENTS:
      return action.payload.cpmInCents;
    case types.RESET_STORE:
      return initialState.cpmInCents;
    default:
      return state;
  }
};

const companyNameReducer = (state = initialState.companyName, action) => {
  switch (action.type) {
    case types.SET_COMPANY_NAME:
      console.log(action.payload.companyName);
      return action.payload.companyName;
    case types.RESET_STORE:
      return initialState.companyName;
    default:
      return state;
  }
};

const isPlayingAdReducer = (state = initialState.isPlayingAd, action) => {
  switch (action.type) {
    case types.SET_IS_PLAYING_AD:
      return action.payload.isPlayingAd;
    case types.RESET_STORE:
      return initialState.isPlayingAd;
    default:
      return state;
  }
};

const exampleAdAudioUrlReducer = (
  state = initialState.exampleAdAudioUrl,
  action
) => {
  switch (action.type) {
    case types.SET_EXAMPLE_AD_AUDIO_URL:
      return action.payload.exampleAdAudioUrl;
    case types.RESET_STORE:
      return initialState.exampleAdAudioUrl;
    default:
      return state;
  }
};

const isPlayingExampleAdReducer = (
  state = initialState.isPlayingExampleAd,
  action
) => {
  switch (action.type) {
    case types.SET_IS_PLAYING_EXAMPLE_AD:
      return action.payload.isPlayingExampleAd;
    case types.RESET_STORE:
      return initialState.isPlayingExampleAd;
    default:
      return state;
  }
};

const reducer = combineReducers({
  isShowing: isShowingReducer,
  campaignId: campaignIdReducer,
  adDetails: adDetailsReducer,
  adScript: adScriptReducer,
  adAudio: adAudioReducer,
  currentTab: currentTabReducer,
  companyUrl: companyUrlReducer,
  cpmInCents: cpmInCentsReducer,
  isHouseAd: isHouseAdReducer,
  isMidrollRequired: isMidrollRequiredReducer,
  companyName: companyNameReducer,
  isPlayingAd: isPlayingAdReducer,
  exampleAdAudioUrl: exampleAdAudioUrlReducer,
  isPlayingExampleAd: isPlayingExampleAdReducer,
  isShowingRecordAgainConfirmationOverlay: isShowingRecordAgainConfirmationOverlayReducer,
  isShowingSubmissionProgressOverlay: isShowingSubmissionProgressOverlayReducer,
  isShowingNotInterestedConfirmationOverlay: isShowingNotInterestedConfirmationOverlayReducer,
  isShowingSuccessConfirmationOverlay: isShowingSuccessConfirmationOverlayReducer,
  isShowingSuccessConfirmationWithAllEpisodesActivationOverlay: isShowingSuccessConfirmationWithAllEpisodesActivationOverlayReducer,
  isShowingMidrollRequirementOverlay: isShowingMidrollRequirementOverlayReducer,
  isAnchorPaymentsActivated: isAnchorPaymentsActivatedReducer,
});

export default reducer;
