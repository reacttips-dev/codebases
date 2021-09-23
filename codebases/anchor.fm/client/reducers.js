import formReducer from 'redux-form/lib/reducer';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import audioSegments from './audioSegments';
import browser from './browser';
import compliance from './compliance';
import episodePreview from './episodePreview';
import episodes from './episodes';
import errorModal from './errorModal';
import localStorage from './localStorage';
import money from './money';
import onboarding from './onboarding';
import pageMetadata from './pageMetadata';
import podcast from './podcast';
import podcastEditor from './podcastEditor';
import playbackDurationTracking from './playbackDurationTracking';
import playbackPosition from './playbackPosition';
import recorder from './recorder';
import resetPassword from './resetPassword';
import search from './search';
import sourceAudio from './sourceAudio';
import station from './station';
import transcriptions from './transcriptions';
import user from './user';
import tutorial from './tutorial';
import supportersScreenReducer from './screens/SupportersScreen/duck/reducers';
import supportersCancelScreenReducer from './screens/SupportersCancelScreen/duck/reducers';
import podcastReducer from './store/global/podcast/reducers';
import dashboardScreenReducer from './screens/DashboardScreen/duck/reducers';
import coverArtModalScreenReducer from './screens/CoverArtModalScreen/duck/reducers';
import episodeEditorScreenReducer from './screens/EpisodeEditorScreen/duck';
import splitSegmentAudioModalScreenReducer from './screens/SplitSegmentAudioModalScreen/duck';
import adRecordingModalScreenReducer from './screens/AdRecordingModalScreen/duck';
import voiceMessageCreationModalScreenReducer from './screens/VoiceMessageCreationModalScreen/duck/reducers';
import sponsorshipsTutorialModalScreenReducer from './screens/SponsorshipsTutorialModalScreen/duck';

import { _episodesByIdReducer } from './store/_episodesById/reducers';
import { _podcastReducer } from './store/_podcast/reducers';

const appReducer = combineReducers({
  adRecordingModalScreen: adRecordingModalScreenReducer,
  coverArtModalScreen: coverArtModalScreenReducer,
  dashboardScreen: dashboardScreenReducer,
  episodeEditorScreen: episodeEditorScreenReducer,
  splitSegmentAudioModalScreen: splitSegmentAudioModalScreenReducer,
  sponsorshipsTutorialModalScreen: sponsorshipsTutorialModalScreenReducer,
  supportersScreen: supportersScreenReducer,
  supportersCancelScreen: supportersCancelScreenReducer,
  _podcast: _podcastReducer,
  _episodesById: _episodesByIdReducer,
  global: combineReducers({
    podcast: podcastReducer,
  }),
  audioSegments,
  browser,
  compliance,
  episodePreview,
  episodes,
  errorModal,
  form: formReducer,
  localStorage,
  money,
  onboarding,
  pageMetadata,
  playbackDurationTracking,
  playbackPosition,
  podcast,
  podcastEditor,
  recorder,
  resetPassword,
  routing: routerReducer,
  search,
  sourceAudio,
  station,
  transcriptions,
  user,
  tutorial,
  voiceMessageCreationModalScreen: voiceMessageCreationModalScreenReducer,
});

const rootReducer = (state, action) => {
  switch (action.type) {
    case 'RESET_APP':
      /**
       * RESET_APP is used to restore the entire redux store to its initial
       * state. We call this action when the user logs out so that we don't
       * keep the previously logged in user's info in the redux store.
       *
       * Passing `undefined` will cause the sub-reducers to set the state to
       * their respecting `initialState` values.
       *
       * want to maintain the rest of state except for global and user so that
       * podcast station pages don't 404 when logging in or out
       */
      return appReducer(
        { ...state, global: undefined, user: undefined },
        action
      );
    default:
      return appReducer(state, action);
  }
};

export { rootReducer };
