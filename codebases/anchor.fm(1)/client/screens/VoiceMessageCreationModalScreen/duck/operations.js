import actions from './actions';
import { Browser } from '../../../modules/Browser';

const { localStorage } = Browser;

const {
  setVoiceMessage,
  resetVoiceMessage,
  setIsVoiceMessageRehydrating,
  setIsVoiceMessagePlaying,
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
  reset,
  setIsLoading,
  setIsNewUser,
  setIsError,
} = actions;

const voiceMessageBlobKey = 'voiceMessageBlob';

const persistVoiceMessageBlobToStorage = blob =>
  localStorage.setItem(voiceMessageBlobKey, blob);

const restoreVoiceMessageBlobFromStorage = () =>
  localStorage.getItem(voiceMessageBlobKey);

export default {
  persistVoiceMessageBlobToStorage,
  restoreVoiceMessageBlobFromStorage,
  setVoiceMessage,
  resetVoiceMessage,
  setIsVoiceMessageRehydrating,
  setIsVoiceMessagePlaying,
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
  reset,
  setIsLoading,
  setIsNewUser,
  setIsError,
};
