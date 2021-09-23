import actions from './actions';
import AnchorApi from '../../../modules/AnchorAPI';
import { duckOperations as podcastOperations } from '../../../store/global/podcast';

const { setIsProcessing } = actions;

const showCloseConfirmation = () => dispatch => {
  dispatch(actions.setIsShowingCloseConfirmation(true));
};

const hideCloseConfirmation = () => dispatch => {
  dispatch(actions.setIsShowingCloseConfirmation(false));
};

const openAndSetupForAudio = audio => dispatch => {
  dispatch(actions.setAudio(audio));
  dispatch(podcastOperations.fetchPodcastAndSet()).then(() => {
    // TODO: We should probably have a visual indication that
    //       the modal isn't ready yet (because it hasn't synced
    //       podcast from the server)
  });
  dispatch(actions.setIsShowing(true));
};

const closeAndReset = () => dispatch => {
  dispatch(actions.setIsShowing(false));
  dispatch(actions.resetStore());
};

const fetchSplit = ({ audio, splitsAtMilliseconds, mergeFiles }) => (
  dispatch,
  getState
) =>
  AnchorApi.fetchSplitAudio({
    webAudioId: audio.id,
    splitsAtMilliseconds,
    mergeFiles,
  }).then(response => response.audios);

export default {
  setIsProcessing,
  showCloseConfirmation,
  hideCloseConfirmation,
  fetchSplit,
  openAndSetupForAudio,
  closeAndReset,
};
