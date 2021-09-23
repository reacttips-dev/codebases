import types from './types';

const setSponsorshipsTutorialModalAutopairCampaignId = sponsorshipsTutorialModalAutopairCampaignId => ({
  type: types.SET_SPONSORSHIPS_TUTORIAL_MODAL_AUTOPAIR_CAMPAIGN_ID,
  payload: {
    sponsorshipsTutorialModalAutopairCampaignId,
  },
});

const setIsShowingSponsorshipsTutorialModal = isShowingSponsorshipsTutorialModal => ({
  type: types.SET_IS_SHOWING_SPONSORSHIPS_TUTORIAL_MODAL,
  payload: {
    isShowingSponsorshipsTutorialModal,
  },
});
const setIsShowingWaitingScene = isShowingWaitingScene => ({
  type: types.SET_IS_SHOWING_WAITING_SCENE,
  payload: {
    isShowingWaitingScene,
  },
});
const setIsOnlyShowingTutorial = isOnlyShowingTutorial => {
  const a = {
    type: types.SET_IS_ONLY_SHOWING_TUTORIAL,
    payload: {
      isOnlyShowingTutorial,
    },
  };
  return a;
};

export default {
  setIsShowingSponsorshipsTutorialModal,
  setSponsorshipsTutorialModalAutopairCampaignId,
  setIsShowingWaitingScene,
  setIsOnlyShowingTutorial,
};
