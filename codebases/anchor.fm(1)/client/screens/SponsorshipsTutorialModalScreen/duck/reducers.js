import { combineReducers } from 'redux';
import types from './types';

const sponsorshipsTutorialModalAutopairCampaignIdReducer = (
  state = null,
  action
) => {
  switch (action.type) {
    case types.SET_SPONSORSHIPS_TUTORIAL_MODAL_AUTOPAIR_CAMPAIGN_ID:
      return action.payload.sponsorshipsTutorialModalAutopairCampaignId;
    default:
      return state;
  }
};

const isShowingSponsorshipsTutorialModalReducer = (state = false, action) => {
  switch (action.type) {
    case types.SET_IS_SHOWING_SPONSORSHIPS_TUTORIAL_MODAL:
      return action.payload.isShowingSponsorshipsTutorialModal;
    default:
      return state;
  }
};
const isOnlyShowingTutorialReducer = (state = false, action) => {
  switch (action.type) {
    case types.SET_IS_ONLY_SHOWING_TUTORIAL:
      return action.payload.isOnlyShowingTutorial;
    default:
      return state;
  }
};
const isShowingWaitingSceneReducer = (state = true, action) => {
  switch (action.type) {
    case types.SET_IS_SHOWING_WAITING_SCENE:
      return action.payload.isShowingWaitingScene;
    default:
      return state;
  }
};

const reducer = combineReducers({
  isShowingSponsorshipsTutorialModal: isShowingSponsorshipsTutorialModalReducer,
  sponsorshipsTutorialModalAutopairCampaignId: sponsorshipsTutorialModalAutopairCampaignIdReducer,
  isOnlyShowingTutorial: isOnlyShowingTutorialReducer,
  isShowingWaitingScene: isShowingWaitingSceneReducer,
});

export default reducer;
