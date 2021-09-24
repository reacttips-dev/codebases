import Promise from 'bluebird';

enum Scenes {
  RECORD,
  SIGN_IN,
  SIGN_UP,
  CONFIRMATION,
  SENDING,
  DISABLED,
}

interface ILocation {
  pathname: string;
}

interface IRecording {
  blob: File;
  type: string;
  url: string;
}

interface IVoiceMessageCreationModalScreenActions {
  onRecordingDidFinish: (blob: File) => void;
  onSubmitRecording: (
    audio: any,
    stationWebId: string,
    voiceMessageTitle: string
  ) => void;
  restoreVoiceMessageBlobFromStorage: () => Promise<void>;
  playRecording: () => void;
  pauseRecording: () => void;
  onClickRecordAgain: () => void;
  onClickRecordAgainConfirmation: () => void;
  onClickDismissRecordAgainConfirmation: () => void;
  onClickMessageSentConfirmation: () => void;
  onClickCloseModal: () => void;
  onClickDiscard: () => void;
  onClickDismissExitConfirmation: () => void;
  onClickSignin: (
    blob: File,
    stationWebId: string,
    voiceMessageTitle: string
  ) => void;
  onDidSignup: (
    blob: File,
    stationWebId: string,
    voiceMessageTitle: string
  ) => void;
  onClickCheckoutAnchor: () => void;
  onClickDoNotCheckoutAnchor: () => void;
  onClickEmailMe: (email: string) => void;
  onClickDoNotEmailMe: () => void;
  onChangeVoiceMessageTitle: (voiceMessageTitle: string) => void;
  onWillSubmitSignup: () => void;
  onClickStopRecording: () => void;
}

interface IVoiceMessageCreationModalScreenState {
  scene: Scenes;
  isShowing: boolean;
  isVoiceMessageRehydrating: boolean;
  voiceMessageRecording: IRecording;
  isVoiceMessagePlaying: boolean;
  isShowingRecordAgainConfirmationOverlay: boolean;
  isShowingExitConfirmationOverlay: boolean;
  loginEmail: string;
  loginPassword: string;
  signupName: string;
  signupEmail: string;
  signupPassword: string;
  loginUrlPath: string;
  captcha: string;
  currentUserEmail: string;
  email: string;
  stationWebId: string;
  voiceMessageTitle: string;
  isPublicCallinHiddenFromWeb: boolean;
  podcastName: string;
  podcastCoverartImageUrl: string;
  isLoading: boolean;
  isNewUser: boolean;
  isError: boolean;
  profileUrlPath: string;
  vanitySlug: string;
}

interface IVoiceMessageCreationModalScreenProps {
  actions: IVoiceMessageCreationModalScreenActions;
  state: IVoiceMessageCreationModalScreenState;
}

interface IUploadVoiceMessage {
  blob: File;
  voiceMessageTitle: string;
  stationWebId: string;
}

export {
  ILocation,
  IRecording,
  IUploadVoiceMessage,
  IVoiceMessageCreationModalScreenActions,
  IVoiceMessageCreationModalScreenState,
  IVoiceMessageCreationModalScreenProps,
  Scenes,
};
