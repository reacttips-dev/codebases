import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
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
import actions from '../../AdRecordingModalScreen/duck/actions';

const initialState = {
  isShowingRecordAgainConfirmationOverlay: false,
  email: '',
  voiceMessageTitle: '',
  currentUserEmail: null,
  loginEmail: '',
  loginPassword: '',
  captcha: null,
  signupName: '',
  signupEmail: '',
  signupPassword: '',
  isShowingExitConfirmationOverlay: false,
  isVoiceMessagePlaying: false,
  voiceMessageRecording: null,
  isLoading: false,
  isNewUser: false,
  isError: false,
};

const isVoiceMessageRehydratingReducer = (state = false, action) => {
  switch (action.type) {
    case REHYDRATE: {
      const { voiceMessageCreationModalScreen } = action.payload;
      if (
        voiceMessageCreationModalScreen &&
        voiceMessageCreationModalScreen.voiceMessageRecording
      ) {
        return true;
      }
      return state;
    }
    case SET_IS_VOICE_MESSAGE_REHYDRATING:
      return action.payload;
    default:
      return state;
  }
};

const isNewUserReducer = (state = initialState.isNewUser, action) => {
  switch (action.type) {
    case SET_IS_NEW_USER: {
      return action.payload.isNewUser;
    }
    case RESET:
      return initialState.isNewUser;
    default:
      return state;
  }
};

const isLoadingReducer = (state = initialState.isLoading, action) => {
  switch (action.type) {
    case SET_IS_LOADING:
      return action.payload.isLoading;
    case RESET:
      return initialState.isLoading;
    default:
      return state;
  }
};

const isErrorReducer = (state = initialState.isError, action) => {
  switch (action.type) {
    case SET_IS_ERROR:
      return action.payload.isError;
    case RESET:
      return initialState.isError;
    default:
      return state;
  }
};

const isShowingRecordAgainConfirmationOverlayReducer = (
  state = initialState.isShowingRecordAgainConfirmationOverlay,
  action
) => {
  switch (action.type) {
    case SET_IS_SHOWING_RECORD_AGAIN_CONFIRMATION_OVERLAY:
      return action.payload.isShowingRecordAgainConfirmationOverlay;
    case RESET:
      return initialState.isShowingExitConfirmationOverlay;
    default:
      return state;
  }
};

const emailReducer = (state = initialState.email, action) => {
  switch (action.type) {
    case SET_EMAIL:
      return action.payload.email;
    case RESET:
      return initialState.email;
    default:
      return state;
  }
};

const voiceMessageTitleReducer = (
  state = initialState.voiceMessageTitle,
  action
) => {
  switch (action.type) {
    case SET_VOICE_MESSAGE_TITLE:
      return action.payload.voiceMessageTitle;
    case RESET:
      return initialState.voiceMessageTitle;
    default:
      return state;
  }
};

const currentUserEmailReducer = (
  state = initialState.currentUserEmail,
  action
) => {
  switch (action.type) {
    case SET_CURRENT_USER_EMAIL:
      return action.payload.currentUserEmail;
    case RESET:
      return initialState.currentUserEmail;
    default:
      return state;
  }
};
const loginEmailReducer = (state = initialState.loginEmail, action) => {
  switch (action.type) {
    case SET_LOGIN_EMAIL:
      return action.payload.loginEmail;
    case RESET:
      return initialState.loginEmail;
    default:
      return state;
  }
};
const loginPasswordReducer = (state = initialState.loginPassword, action) => {
  switch (action.type) {
    case SET_LOGIN_PASSWORD:
      return action.payload.loginPassword;
    case RESET:
      return initialState.loginPassword;
    default:
      return state;
  }
};

const captchaReducer = (state = initialState.captcha, action) => {
  switch (action.type) {
    case SET_CAPTCHA:
      return action.payload.captcha;
    case RESET:
      return initialState.captcha;
    default:
      return state;
  }
};

const signupNameReducer = (state = initialState.signupName, action) => {
  switch (action.type) {
    case SET_SIGNUP_NAME:
      return action.payload.signupName;
    case RESET:
      return initialState.signupName;
    default:
      return state;
  }
};
const signupEmailReducer = (state = initialState.signupEmail, action) => {
  switch (action.type) {
    case SET_SINGNUP_EMAIL:
      return action.payload.signupEmail;
    case RESET:
      return initialState.signupEmail;
    default:
      return state;
  }
};
const signupPasswordReducer = (state = initialState.signupPassword, action) => {
  switch (action.type) {
    case SET_SINGNUP_PASSWORD:
      return action.payload.signupPassword;
    case RESET:
      return initialState.signupPassword;
    default:
      return state;
  }
};

const isShowingExitConfirmationOverlayReducer = (
  state = initialState.isShowingExitConfirmationOverlay,
  action
) => {
  switch (action.type) {
    case SET_IS_SHOWING_EXIT_CONFIRMATION_OVERLAY:
      return action.payload.isShowingExitConfirmationOverlay;
    case RESET:
      return initialState.isShowingExitConfirmationOverlay;
    default:
      return state;
  }
};

const isVoiceMessagePlayingReducer = (
  state = initialState.isVoiceMessagePlaying,
  action
) => {
  switch (action.type) {
    case SET_IS_VOICE_MESSAGE_PLAYING: {
      return action.payload;
    }
    case RESET:
      return initialState.isVoiceMessagePlaying;
    default:
      return state;
  }
};

const voiceMessageRecordingReducer = (
  state = initialState.voiceMessageRecording,
  action
) => {
  switch (action.type) {
    case SET_VOICE_MESSAGE: {
      if (action.payload) {
        const { url, blob, type } = action.payload;
        return {
          type,
          blob,
          url,
        };
      }
      return null;
    }
    case RESET:
      return initialState.voiceMessageRecording;
    default:
      return state;
  }
};

const reducer = combineReducers({
  voiceMessageRecording: voiceMessageRecordingReducer,
  isVoiceMessageRehydrating: isVoiceMessageRehydratingReducer,
  isVoiceMessagePlaying: isVoiceMessagePlayingReducer,
  isShowingRecordAgainConfirmationOverlay: isShowingRecordAgainConfirmationOverlayReducer,
  isShowingExitConfirmationOverlay: isShowingExitConfirmationOverlayReducer,
  loginEmail: loginEmailReducer,
  loginPassword: loginPasswordReducer,
  signupName: signupNameReducer,
  signupEmail: signupEmailReducer,
  signupPassword: signupPasswordReducer,
  currentUserEmail: currentUserEmailReducer,
  captcha: captchaReducer,
  email: emailReducer,
  voiceMessageTitle: voiceMessageTitleReducer,
  isLoading: isLoadingReducer,
  isNewUser: isNewUserReducer,
  isError: isErrorReducer,
});

export default reducer;
