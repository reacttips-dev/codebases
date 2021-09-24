import {
  SET_VOICE_MESSAGE,
  SET_IS_VOICE_MESSAGE_REHYDRATING,
  SET_IS_VOICE_MESSAGE_PLAYING,
  SET_IS_SHOWING_RECORD_AGAIN_CONFIRMATION_OVERLAY,
  SET_IS_SHOWING_EXIT_CONFIRMATION_OVERLAY,
  SET_LOGIN_EMAIL,
  SET_LOGIN_PASSWORD,
  SET_SIGNUP_NAME,
  SET_SINGNUP_EMAIL,
  SET_SINGNUP_PASSWORD,
  SET_CURRENT_USER_EMAIL,
  SET_CAPTCHA,
  SET_EMAIL,
  SET_VOICE_MESSAGE_TITLE,
  RESET,
  SET_IS_LOADING,
  SET_IS_NEW_USER,
  SET_IS_ERROR,
} from './types';

const reset = () => ({
  type: RESET,
  payload: {},
});

const setIsVoiceMessagePlaying = isVoiceMessagePlaying => ({
  type: SET_IS_VOICE_MESSAGE_PLAYING,
  payload: isVoiceMessagePlaying,
});

const setIsNewUser = isNewUser => ({
  type: SET_IS_NEW_USER,
  payload: { isNewUser },
});

const setIsLoading = isLoading => ({
  type: SET_IS_LOADING,
  payload: { isLoading },
});

const setIsError = isError => ({
  type: SET_IS_ERROR,
  payload: { isError },
});

const setVoiceMessageTitle = voiceMessageTitle => ({
  type: SET_VOICE_MESSAGE_TITLE,
  payload: {
    voiceMessageTitle,
  },
});
const setEmail = email => ({
  type: SET_EMAIL,
  payload: {
    email,
  },
});
const setCurrentUserEmail = currentUserEmail => ({
  type: SET_CURRENT_USER_EMAIL,
  payload: {
    currentUserEmail,
  },
});
const setLoginEmail = loginEmail => ({
  type: SET_LOGIN_EMAIL,
  payload: {
    loginEmail,
  },
});

const setLoginPassword = loginPassword => ({
  type: SET_LOGIN_PASSWORD,
  payload: {
    loginPassword,
  },
});

const setSignupName = signupName => ({
  type: SET_SIGNUP_NAME,
  payload: {
    signupName,
  },
});
const setSignupEmail = signupEmail => ({
  type: SET_SINGNUP_EMAIL,
  payload: {
    signupEmail,
  },
});

const setSignupPassword = signupPassword => ({
  type: SET_SINGNUP_PASSWORD,
  payload: {
    signupPassword,
  },
});

const setVoiceMessage = ({ type, url, blob }) => ({
  type: SET_VOICE_MESSAGE,
  payload: {
    url,
    type,
    blob,
  },
});

const setIsShowingRecordAgainConfirmationOverlay = isShowingRecordAgainConfirmationOverlay => ({
  type: SET_IS_SHOWING_RECORD_AGAIN_CONFIRMATION_OVERLAY,
  payload: {
    isShowingRecordAgainConfirmationOverlay,
  },
});
const setIsShowingExitConfirmationOverlay = isShowingExitConfirmationOverlay => ({
  type: SET_IS_SHOWING_EXIT_CONFIRMATION_OVERLAY,
  payload: {
    isShowingExitConfirmationOverlay,
  },
});
const setCaptcha = captcha => ({
  type: SET_CAPTCHA,
  payload: {
    captcha,
  },
});

const resetVoiceMessage = () => ({
  type: SET_VOICE_MESSAGE,
  payload: null,
});

const setIsVoiceMessageRehydrating = isVoiceMessageRehydrating => ({
  type: SET_IS_VOICE_MESSAGE_REHYDRATING,
  payload: isVoiceMessageRehydrating,
});

export default {
  setIsVoiceMessageRehydrating,
  setIsVoiceMessagePlaying,
  setVoiceMessage,
  resetVoiceMessage,
  setIsShowingRecordAgainConfirmationOverlay,
  setIsShowingExitConfirmationOverlay,
  setLoginEmail,
  setLoginPassword,
  setSignupName,
  setSignupEmail,
  setSignupPassword,
  setCurrentUserEmail,
  setCaptcha,
  setEmail,
  setVoiceMessageTitle,
  setIsLoading,
  setIsNewUser,
  setIsError,
  reset,
};
