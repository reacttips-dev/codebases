import types from './types';

const resetStore = () => ({
  type: types.RESET_STORE,
});

const setIsShowing = isShowing => ({
  type: types.SET_IS_SHOWING,
  payload: {
    isShowing,
  },
});

const setIsHouseAd = isHouseAd => ({
  type: types.SET_IS_HOUSE_AD,
  payload: {
    isHouseAd,
  },
});

const setIsMidrollRequired = isMidrollRequired => ({
  type: types.SET_IS_MIDROLL_REQUIRED,
  payload: {
    isMidrollRequired,
  },
});

const setIsAnchorPaymentsActivated = isAnchorPaymentsActivated => ({
  type: types.SET_IS_ANCHOR_PAYMENTS_ACTIVATED,
  payload: {
    isAnchorPaymentsActivated,
  },
});

const setCampaignId = campaignId => ({
  type: types.SET_CAMPAIGN_ID,
  payload: {
    campaignId,
  },
});

const setCurrentTab = currentTab => ({
  type: types.SET_CURRENT_TAB,
  payload: {
    currentTab,
  },
});

const setAdDetails = adDetails => ({
  type: types.SET_AD_DETAILS,
  payload: {
    adDetails,
  },
});

const setAdScript = adScript => ({
  type: types.SET_AD_SCRIPT,
  payload: {
    adScript,
  },
});

const setAdAudio = adAudio => ({
  type: types.SET_AD_AUDIO,
  payload: {
    adAudio,
  },
});

const setCompanyUrl = companyUrl => ({
  type: types.SET_COMPANY_URL,
  payload: {
    companyUrl,
  },
});

const setCpmInCents = cpmInCents => ({
  type: types.SET_CPM_IN_CENTS,
  payload: {
    cpmInCents,
  },
});

const setCompanyName = companyName => ({
  type: types.SET_COMPANY_NAME,
  payload: {
    companyName,
  },
});

const setIsPlayingAd = isPlayingAd => ({
  type: types.SET_IS_PLAYING_AD,
  payload: {
    isPlayingAd,
  },
});

const setExampleAdAudioUrl = exampleAdAudioUrl => ({
  type: types.SET_EXAMPLE_AD_AUDIO_URL,
  payload: {
    exampleAdAudioUrl,
  },
});

const setIsPlayingExampleAd = isPlayingExampleAd => ({
  type: types.SET_IS_PLAYING_EXAMPLE_AD,
  payload: {
    isPlayingExampleAd,
  },
});

const setIsShowingRecordAgainConfirmationOverlay = isShowingRecordAgainConfirmationOverlay => ({
  type: types.SET_IS_SHOWING_RECORD_AGAIN_CONFIRMATION_OVERLAY,
  payload: {
    isShowingRecordAgainConfirmationOverlay,
  },
});

const setIsShowingSubmissionProgressOverlay = isShowingSubmissionProgressOverlay => ({
  type: types.SET_IS_SHOWING_SUBMISSION_PROGRESS_OVERLAY,
  payload: {
    isShowingSubmissionProgressOverlay,
  },
});

const setIsShowingNotInterestedConfirmationOverlay = isShowingNotInterestedConfirmationOverlay => ({
  type: types.SET_IS_SHOWING_NOT_INTERESTED_CONFIRMATION_OVERLAY,
  payload: {
    isShowingNotInterestedConfirmationOverlay,
  },
});

const setIsShowingSuccessConfirmationOverlay = isShowingSuccessConfirmationOverlay => ({
  type: types.SET_IS_SHOWING_SUCCESS_CONFIRMATION_OVERLAY,
  payload: {
    isShowingSuccessConfirmationOverlay,
  },
});
const setIsShowingSuccessConfirmationWithAllEpisodesActivationOverlay = isShowingSuccessConfirmationWithAllEpisodesActivationOverlay => ({
  type:
    types.SET_IS_SHOWING_SUCCESS_CONFIRMATION_WITH_ALL_EPISODES_ACTIVATION_OVERLAY,
  payload: {
    isShowingSuccessConfirmationWithAllEpisodesActivationOverlay,
  },
});

const setIsShowingMidrollRequirementOverlay = isShowingMidrollRequirementOverlay => ({
  type: types.SET_IS_SHOWING_MIDROLL_REQUIREMENT_OVERLAY,
  payload: { isShowingMidrollRequirementOverlay },
});

export default {
  resetStore,
  setCampaignId,
  setAdAudio,
  setAdScript,
  setAdDetails,
  setCurrentTab,
  setIsShowing,
  setCompanyUrl,
  setCpmInCents,
  setCompanyName,
  setIsPlayingAd,
  setIsHouseAd,
  setIsMidrollRequired,
  setExampleAdAudioUrl,
  setIsPlayingExampleAd,
  setIsAnchorPaymentsActivated,
  setIsShowingRecordAgainConfirmationOverlay,
  setIsShowingSubmissionProgressOverlay,
  setIsShowingNotInterestedConfirmationOverlay,
  setIsShowingSuccessConfirmationOverlay,
  setIsShowingSuccessConfirmationWithAllEpisodesActivationOverlay,
  setIsShowingMidrollRequirementOverlay,
};
