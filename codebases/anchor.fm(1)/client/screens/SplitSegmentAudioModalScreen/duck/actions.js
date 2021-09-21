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

const setAudio = audio => ({
  type: types.SET_AUDIO,
  payload: {
    audio,
  },
});

const setIsProcessing = isProcessing => ({
  type: types.SET_IS_PROCESSING,
  payload: {
    isProcessing,
  },
});
const setIsShowingCloseConfirmation = isShowingCloseConfirmation => ({
  type: types.SET_IS_SHOWING_CLOSE_CONFIRMATION,
  payload: {
    isShowingCloseConfirmation,
  },
});

export default {
  setIsProcessing,
  resetStore,
  setIsShowing,
  setIsShowingCloseConfirmation,
  setAudio,
};
