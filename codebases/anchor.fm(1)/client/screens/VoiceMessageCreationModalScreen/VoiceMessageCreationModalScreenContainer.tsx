import { Promise } from 'bluebird';
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { duckOperations } from './duck';
import { VoiceMessageCreationModalScreen } from './VoiceMessageCreationModalScreen';

import AnchorAPI from '../../modules/AnchorAPI';
import { checkAuthentication, showRequestResetPassword } from '../../user';
import {
  trackLogIn,
  trackSignUp,
  trackSubmit,
  trackVoiceMessageSent,
} from './events';
import {
  ILocation,
  IRecording,
  IUploadVoiceMessage,
  IVoiceMessageCreationModalScreenActions,
  IVoiceMessageCreationModalScreenState,
  Scenes,
} from './types';

const getSceneFromLocation = (
  location: ILocation,
  isPublicCallinHiddenFromWeb: boolean
): Scenes => {
  if (isPublicCallinHiddenFromWeb) return Scenes.DISABLED;
  if (location.pathname.match(/\/sending$/)) {
    return Scenes.SENDING;
  }
  if (location.pathname.match(/\/success$/)) {
    return Scenes.CONFIRMATION;
  }
  if (location.pathname.match(/\/signin$/)) {
    return Scenes.SIGN_IN;
  }
  if (location.pathname.match(/\/signup$/)) {
    return Scenes.SIGN_UP;
  }
  return Scenes.RECORD;
};

const getIsShowingFromLocation = (location: ILocation): boolean =>
  !!location.pathname.match(/\/message(\/(success|signin|sending|signup))?$/);

const mapStateToProps = (
  state: any,
  ownProps: any
): { state: IVoiceMessageCreationModalScreenState } => {
  const voiceMessageRecording: IRecording =
    state.voiceMessageCreationModalScreen.voiceMessageRecording;
  const isVoiceMessageRehydrating: boolean =
    state.voiceMessageCreationModalScreen.isVoiceMessageRehydrating;
  const isVoiceMessagePlaying =
    state.voiceMessageCreationModalScreen.isVoiceMessagePlaying;
  const isShowingRecordAgainConfirmationOverlay =
    state.voiceMessageCreationModalScreen
      .isShowingRecordAgainConfirmationOverlay;
  const isShowingExitConfirmationOverlay =
    state.voiceMessageCreationModalScreen.isShowingExitConfirmationOverlay;
  const loginEmail = state.voiceMessageCreationModalScreen.loginEmail;
  const loginPassword = state.voiceMessageCreationModalScreen.loginPassword;
  const signupName = state.voiceMessageCreationModalScreen.signupName;
  const signupEmail = state.voiceMessageCreationModalScreen.signupEmail;
  const signupPassword = state.voiceMessageCreationModalScreen.signupPassword;
  const captcha = state.voiceMessageCreationModalScreen.captcha;
  const isNewUser = state.voiceMessageCreationModalScreen.isNewUser;
  const email = state.voiceMessageCreationModalScreen.email;
  const currentUserEmail =
    state.voiceMessageCreationModalScreen.currentUserEmail;
  const voiceMessageTitle =
    state.voiceMessageCreationModalScreen.voiceMessageTitle;
  const isLoading = state.voiceMessageCreationModalScreen.isLoading;
  const isError = state.voiceMessageCreationModalScreen.isError;
  const location: ILocation = ownProps.location;
  const podcastName = ownProps.podcastName;
  const podcastCoverartImageUrl = ownProps.podcastCoverartImageUrl;
  const profileUrlPath = ownProps.location.pathname
    .split('/')
    .splice(0, 2)
    .join('/');
  const getLoginUrlPath = () => {
    return `${profileUrlPath}/message/signin`;
  };
  const {
    station: {
      podcastMetadata: { isPublicCallinHiddenFromWeb },
      vanitySlug,
    },
  } = state;
  return {
    state: {
      scene: getSceneFromLocation(location, isPublicCallinHiddenFromWeb),
      isShowing: getIsShowingFromLocation(location),
      isVoiceMessageRehydrating,
      voiceMessageRecording,
      isVoiceMessagePlaying,
      isShowingRecordAgainConfirmationOverlay,
      isShowingExitConfirmationOverlay,
      loginEmail,
      loginPassword,
      signupName,
      signupEmail,
      signupPassword,
      loginUrlPath: getLoginUrlPath(),
      profileUrlPath,
      captcha,
      email,
      currentUserEmail,
      stationWebId: ownProps.stationWebId,
      voiceMessageTitle,
      isPublicCallinHiddenFromWeb,
      podcastName,
      podcastCoverartImageUrl,
      isLoading,
      isNewUser,
      isError,
      vanitySlug,
    },
  };
};

const mapDispatchToProps = (
  dispatch: any,
  ownProps: any
): { actions: IVoiceMessageCreationModalScreenActions } => {
  const profileUrlPath = ownProps.location.pathname
    .split('/')
    .splice(0, 2)
    .join('/');

  const setVoiceMessageFailedUploadState = (err: any) => {
    dispatch(duckOperations.setIsLoading(false));
    dispatch(duckOperations.setIsError(true));
    dispatch(push(`${profileUrlPath}/message`));
  };

  const uploadVoiceMessage = ({
    blob,
    voiceMessageTitle,
    stationWebId,
  }: IUploadVoiceMessage) => {
    dispatch(push(`${profileUrlPath}/message/sending`));
    AnchorAPI.uploadAudioFile(blob, () => null, () => null, voiceMessageTitle, {
      audioType: 'callin',
    })
      .then((response: any) => {
        const webAudioId = response.audio.audioId;
        AnchorAPI.createVoiceMessage(
          webAudioId,
          stationWebId,
          ownProps.loggedInUserId
        )
          .then(() => {
            trackVoiceMessageSent();
            dispatch(duckOperations.setIsLoading(false));
            dispatch(duckOperations.resetVoiceMessage());
            dispatch(push(`${profileUrlPath}/message/success`));
          })
          .catch((err: any) => {
            setVoiceMessageFailedUploadState(err);
          });
      })
      .catch((err: any) => {
        setVoiceMessageFailedUploadState(err);
      });
  };

  return {
    actions: {
      onRecordingDidFinish: blob => {
        duckOperations.persistVoiceMessageBlobToStorage(blob).then(() => {
          dispatch(
            duckOperations.setVoiceMessage({
              type: 'recording',
              blob,
              url: URL.createObjectURL(blob),
            })
          );
          dispatch(duckOperations.setIsLoading(false));
        });
      },
      onSubmitRecording: (audio, stationWebId, voiceMessageTitle) => {
        trackSubmit();
        if (ownProps.loggedInUserId) {
          dispatch(duckOperations.setIsLoading(true));
          dispatch(duckOperations.setIsError(false));
          uploadVoiceMessage({
            stationWebId,
            voiceMessageTitle,
            blob: audio.blob,
          });
        } else {
          dispatch(push(`${profileUrlPath}/message/signup`));
        }
      },
      restoreVoiceMessageBlobFromStorage: () => {
        return duckOperations
          .restoreVoiceMessageBlobFromStorage()
          .then(blob => {
            dispatch(
              duckOperations.setVoiceMessage({
                type: 'recording',
                blob,
                url: URL.createObjectURL(blob),
              })
            );
          })
          .catch(err => {
            // keep stores in sync if we can't find stored audio
            dispatch(duckOperations.resetVoiceMessage());
          })
          .finally(() => {
            dispatch(duckOperations.setIsVoiceMessageRehydrating(false));
          });
      },
      pauseRecording: () => {
        dispatch(duckOperations.setIsVoiceMessagePlaying(false));
      },
      playRecording: () => {
        dispatch(duckOperations.setIsVoiceMessagePlaying(true));
      },
      onClickRecordAgain: () => {
        dispatch(duckOperations.setVoiceMessageTitle(''));
        dispatch(
          duckOperations.setIsShowingRecordAgainConfirmationOverlay(true)
        );
      },
      onClickStopRecording: () => {
        dispatch(duckOperations.setIsLoading(true));
      },
      onClickRecordAgainConfirmation: () => {
        dispatch(duckOperations.resetVoiceMessage());
        dispatch(
          duckOperations.setIsShowingRecordAgainConfirmationOverlay(false)
        );
      },
      onClickDismissRecordAgainConfirmation: () => {
        dispatch(
          duckOperations.setIsShowingRecordAgainConfirmationOverlay(false)
        );
      },
      onClickCloseModal: () => {
        dispatch(duckOperations.setIsShowingExitConfirmationOverlay(true));
      },
      onClickDiscard: () => {
        dispatch(push(`${profileUrlPath}`));
        dispatch(duckOperations.reset());
      },
      onClickDismissExitConfirmation: () => {
        dispatch(duckOperations.setIsShowingExitConfirmationOverlay(false));
      },
      onWillSubmitSignup: () => {
        trackSignUp();
        dispatch(duckOperations.setIsLoading(true));
      },
      onClickSignin: (blob, stationWebId, voiceMessageTitle) => {
        trackLogIn();
        dispatch(duckOperations.setIsLoading(true));
        setTimeout(() => {
          uploadVoiceMessage({
            blob,
            stationWebId,
            voiceMessageTitle,
          });
        }, 1000);
      },
      onDidSignup: (blob, stationWebId, voiceMessageTitle) => {
        dispatch(duckOperations.setIsLoading(true));
        dispatch(duckOperations.setIsNewUser(true));
        setTimeout(() => {
          uploadVoiceMessage({
            blob,
            stationWebId,
            voiceMessageTitle,
          });
        }, 1000);
      },
      onClickCheckoutAnchor: () => {
        dispatch(duckOperations.reset());
      },
      onClickDoNotCheckoutAnchor: () => {
        dispatch(duckOperations.reset());
        AnchorAPI.logoutCurrentUser().then(() => {
          dispatch(checkAuthentication());
        });
        dispatch(push(`${profileUrlPath}`));
      },
      onClickMessageSentConfirmation: () => {
        dispatch(duckOperations.reset());
        dispatch(push(`${profileUrlPath}`));
      },
      onClickEmailMe: email => {
        // TODO: Need to save the email address to the user
        AnchorAPI.updateCurrentUserEmail(email).then(() => {
          dispatch(push(`${profileUrlPath}`));
        });
      },
      onClickDoNotEmailMe: () => {
        dispatch(push(`${profileUrlPath}`));
      },
      onChangeVoiceMessageTitle: voiceMessageTitle => {
        dispatch(duckOperations.setVoiceMessageTitle(voiceMessageTitle));
      },
    },
  };
};
const VoiceMessageCreationModalScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(VoiceMessageCreationModalScreen);

export { VoiceMessageCreationModalScreenContainer };
