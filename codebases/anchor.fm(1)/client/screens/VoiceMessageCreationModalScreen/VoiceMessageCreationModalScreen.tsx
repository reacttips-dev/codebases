import React from 'react';
// TODO: abstract something like this to shared? Just deep require this one for prototype
import { LoginContainer } from 'components/LoginContainer';
import { SignupFormContainer } from 'components/SignupForm/SignupFormContainer';
import { Modal } from 'shared/Modal';
import Box from 'shared/Box';
import { ButtonWithHoverAndPress } from 'shared/Button';
import Heading from 'shared/Heading';
import If from 'shared/If';
import Image from 'shared/Image';
import { Linkable } from 'shared/Link';
import Mask from 'shared/Mask';
import { Spinner } from 'shared/Spinner';
import Text from 'shared/Text';
import { IVoiceMessageCreationModalScreenProps, Scenes } from './types';
import { RecordScene } from './components/RecordScene';

const serverRenderingUtils = require('../../../helpers/serverRenderingUtils');
const styles = require('./VoiceMessageCreationModalScreen.sass');

type IVoiceMessageCreationModalScreenState = {
  isRestoringVoiceMessage: boolean;
};
class VoiceMessageCreationModalScreen extends React.Component<
  IVoiceMessageCreationModalScreenProps,
  IVoiceMessageCreationModalScreenState
> {
  constructor(props: IVoiceMessageCreationModalScreenProps) {
    super(props);
    this.state = {
      isRestoringVoiceMessage: false,
    };
  }

  public tryToRestoreVoiceMessage() {
    const {
      actions: { restoreVoiceMessageBlobFromStorage },
      state: { isVoiceMessageRehydrating },
    } = this.props;
    const { isRestoringVoiceMessage } = this.state;
    if (isVoiceMessageRehydrating && !isRestoringVoiceMessage) {
      this.setState(() => ({
        isRestoringVoiceMessage: true,
      }));
      restoreVoiceMessageBlobFromStorage().finally(() => {
        this.setState(() => ({
          isRestoringVoiceMessage: false,
        }));
      });
    }
  }

  public componentDidMount() {
    this.tryToRestoreVoiceMessage();
  }

  public componentDidUpdate() {
    this.tryToRestoreVoiceMessage();
  }

  public renderRecordScene() {
    const {
      state: {
        voiceMessageRecording,
        isVoiceMessagePlaying,
        voiceMessageTitle,
        podcastName,
        podcastCoverartImageUrl,
        isLoading,
        isError,
        stationWebId,
        isPublicCallinHiddenFromWeb,
        vanitySlug,
      },
      actions: {
        onRecordingDidFinish,
        onSubmitRecording,
        pauseRecording,
        playRecording,
        onClickRecordAgain,
        onChangeVoiceMessageTitle,
        onClickDiscard,
        onClickCloseModal,
        onClickStopRecording,
      },
    } = this.props;
    const handleCloseModal =
      isPublicCallinHiddenFromWeb || !voiceMessageRecording
        ? onClickDiscard
        : onClickCloseModal;

    if (isError) {
      return (
        <Box
          testId="VoiceMessagesSubmitErrorOverlay"
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="100%"
          padding={46}
          smPadding={16}
        >
          <Box maxWidth={460} width="100%">
            <Box paddingTop={9} paddingBottom={9}>
              <Heading size="sm" align="center" isBold={true}>
                Unable to send voice message
              </Heading>
            </Box>
            <Box paddingTop={9} paddingBottom={9}>
              <Text size="xl" align="center" color="rgba(41, 47, 54, 0.6)">
                We’re sorry, but we had trouble uploading your recording. Please
                double check your internet connection and try again.
              </Text>
            </Box>
            <Box display="flex" justifyContent="center" marginTop={22}>
              <Box maxWidth={300} width="100%">
                <ButtonWithHoverAndPress
                  isDisabled={false}
                  shape="pill"
                  type="unelevated"
                  colorTheme="primary"
                  text="Retry"
                  size="sm"
                  isFullWidth={true}
                  onPress={() => {
                    onSubmitRecording(
                      voiceMessageRecording,
                      stationWebId,
                      voiceMessageTitle
                    );
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      );
    }
    return (
      <RecordScene
        podcastName={podcastName}
        podcastCoverartImageUrl={podcastCoverartImageUrl}
        onChangeVoiceMessageTitle={onChangeVoiceMessageTitle}
        voiceMessageTitle={voiceMessageTitle}
        onRecordingDidFinish={onRecordingDidFinish}
        onPlay={playRecording}
        onPause={pauseRecording}
        audio={voiceMessageRecording}
        maxLengthInMs={60000}
        isPlaying={isVoiceMessagePlaying}
        onSubmit={audio => {
          onSubmitRecording(audio, stationWebId, voiceMessageTitle);
        }}
        isLoading={isLoading}
        onClickRecordAgain={() => {
          onClickRecordAgain();
        }}
        onClickCloseModal={handleCloseModal}
        onClickStopRecording={onClickStopRecording}
        vanitySlug={vanitySlug}
      />
    );
  }

  public renderScene(scene: Scenes) {
    const {
      actions: {
        onClickDiscard,
        onDidSignup,
        onClickSignin,
        onWillSubmitSignup,
        onClickDoNotCheckoutAnchor,
        onClickCheckoutAnchor,
        onClickMessageSentConfirmation,
      },
      state: {
        podcastName,
        podcastCoverartImageUrl,
        voiceMessageRecording,
        stationWebId,
        voiceMessageTitle,
        profileUrlPath,
        isLoading,
        isNewUser,
      },
    } = this.props;
    const {
      isIOS,
      isAndroidChrome,
      appStoreLink,
      playStoreLink,
    } = serverRenderingUtils;

    if (scene === Scenes.DISABLED) {
      return (
        <Box
          testId="VoiceMessagesDisabledOverlay"
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="100%"
          padding={46}
          smPadding={16}
        >
          <Box maxWidth={460} width="100%">
            <Box paddingTop={9} paddingBottom={9}>
              <Heading size="sm" align="center" isBold={true}>
                This podcast has disabled voice messages
              </Heading>
            </Box>
            <Box paddingTop={9} paddingBottom={9}>
              <Text size="xl" align="center" color="rgba(41, 47, 54, 0.6)">
                Messages have been disabled for this podcast for now. Check back
                later!
              </Text>
            </Box>
            <Box display="flex" justifyContent="center" marginTop={22}>
              <Box maxWidth={300} width="100%">
                <ButtonWithHoverAndPress
                  isDisabled={false}
                  shape="pill"
                  type="unelevated"
                  colorTheme="primary"
                  text="Ok, thanks"
                  size="sm"
                  isFullWidth={true}
                  onPress={onClickDiscard}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      );
    }
    if (scene === Scenes.SIGN_UP) {
      return (
        <Box
          testId="VoiceMessagesSignUpOverlay"
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          mdHeight={550}
          lgHeight={550}
          smHeight="100%"
        >
          <Box maxWidth={640} width="100%" height="100%">
            <Box marginBottom={10}>
              <Heading size="sm" align="center" isBold={true}>
                Create an Anchor account to send your voice message
              </Heading>
            </Box>
            <Box marginBottom={18}>
              <Text size="xl" align="center" color="rgba(41, 47, 54, 0.6)">
                We need this info so we can let the podcaster know who sent it.
                We’ll also notify you if your message gets published in a
                podcast episode!
              </Text>
            </Box>
            <SignupFormContainer
              onWillSubmit={onWillSubmitSignup}
              onDidSubmit={() =>
                onDidSignup(
                  voiceMessageRecording.blob,
                  stationWebId,
                  voiceMessageTitle
                )
              }
              isLoading={isLoading}
            />
            <Box display="flex" justifyContent="center" marginTop={20}>
              <Linkable to={`${profileUrlPath}/message/signin`}>
                <Text size="lg" color="#5f6369" align="center" isBold={true}>
                  Already have an Anchor account? Log in.
                </Text>
              </Linkable>
            </Box>
          </Box>
        </Box>
      );
    }
    if (scene === Scenes.CONFIRMATION) {
      return (
        <Box mdHeight={444} lgHeight={444} smHeight="100%">
          <Box
            display="flex"
            direction="column"
            alignItems="center"
            justifyContent="between"
            height="100%"
          >
            <Box
              width="100%"
              display="flex"
              direction="column"
              alignItems="center"
            >
              <Box maxWidth={405} width="100%">
                <Heading size="sm" align="center" isBold={true}>
                  Your message has been sent!
                </Heading>
              </Box>
            </Box>
            <Box
              width="100%"
              display="flex"
              direction="column"
              alignItems="center"
            >
              <Box maxWidth={449} width="100%" smMarginTop={12} marginTop={30}>
                <Box>
                  <Box isHidingAtLgScreen={true} isHidingAtMdScreen={true}>
                    <Text
                      sizeAtSmScreen="lg"
                      sizeAtMdScreen="xl"
                      sizeAtLgScreen="xl"
                      align="center"
                      color="#7f8287"
                    >
                      We’ll email you if this voice message gets published in a
                      future episode of this podcast.
                    </Text>
                  </Box>
                  <Box isHidingAtSmScreen={true}>
                    <Text
                      sizeAtSmScreen="lg"
                      sizeAtMdScreen="xl"
                      sizeAtLgScreen="xl"
                      align="center"
                      color="#7f8287"
                    >
                      We’ll email you if this voice message gets published in a
                      future episode of{' '}
                      <Text
                        size="xl"
                        align="center"
                        isInline={true}
                        isBold={true}
                        color="#7f8287"
                      >
                        {podcastName}
                      </Text>
                      .
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box isHidingAtMdScreen={true} isHidingAtLgScreen={true}>
              <If
                condition={Boolean(podcastCoverartImageUrl)}
                ifRender={() => (
                  <Mask shape="rounded">
                    <Image
                      width={177}
                      height={177}
                      imageUrl={podcastCoverartImageUrl}
                    />
                  </Mask>
                )}
                elseRender={() => (
                  <Image
                    width={177}
                    height={177}
                    imageUrl="https://d12xoj7p9moygp.cloudfront.net/images/logos/app-icon-logo.png"
                  />
                )}
              />
            </Box>
            <If
              condition={isNewUser}
              ifRender={() => (
                <Box
                  maxWidth={449}
                  width="100%"
                  smMarginTop={12}
                  marginTop={30}
                >
                  <Box marginBottom={10}>
                    <Box>
                      <Text
                        sizeAtSmScreen="lg"
                        sizeAtMdScreen="xl"
                        sizeAtLgScreen="xl"
                        align="center"
                        color="#7f8287"
                      >
                        In the meantime, want to try making your own podcast?
                        Anchor makes it super easy, and you’re already a natural
                        at recording…
                      </Text>
                    </Box>
                  </Box>
                </Box>
              )}
            />
            <If
              condition={isNewUser}
              // condition={true}
              ifRender={() => (
                <Box>
                  <Linkable
                    to={
                      isIOS()
                        ? appStoreLink()
                        : isAndroidChrome()
                        ? playStoreLink()
                        : '/dashboard'
                    }
                    target={isIOS() || isAndroidChrome() ? '_blank' : '_self'}
                    isFullWidth={true}
                  >
                    <Box marginTop={35} width="100%" maxWidth={300}>
                      <ButtonWithHoverAndPress
                        isEventBubblingAllowed={true}
                        isDisabled={false}
                        shape="pill"
                        type="unelevated"
                        colorTheme="primary"
                        text={
                          isIOS() || isAndroidChrome()
                            ? 'Get the free Anchor app'
                            : 'Check out Anchor (it’s free)'
                        }
                        size="sm"
                        isFullWidth={true}
                        onPress={onClickCheckoutAnchor}
                      />
                    </Box>
                  </Linkable>
                  <Box marginTop={20} width="100%" maxWidth={300}>
                    <ButtonWithHoverAndPress
                      isDisabled={false}
                      shape="pill"
                      type="outlined"
                      colorTheme="primary"
                      text="Not right now, thanks"
                      size="sm"
                      isFullWidth={true}
                      onPress={onClickDoNotCheckoutAnchor}
                    />
                  </Box>
                </Box>
              )}
              elseRender={() => (
                <Box marginTop={20} width="100%" maxWidth={300}>
                  <ButtonWithHoverAndPress
                    isDisabled={false}
                    shape="pill"
                    type="unelevated"
                    colorTheme="primary"
                    text="Ok, thanks!"
                    size="sm"
                    isFullWidth={true}
                    onPress={onClickMessageSentConfirmation}
                  />
                </Box>
              )}
            />
          </Box>
        </Box>
      );
    }
    if (scene === Scenes.SIGN_IN) {
      return (
        <Box
          testId="VoiceMessagesSignUpOverlay"
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          padding={46}
          smPadding={16}
          mdHeight={380}
          lgHeight={380}
          smHeight="100%"
        >
          <Box
            maxWidth={640}
            width="100%"
            display="flex"
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Heading size="sm" align="center" isBold={true}>
              Log in to Anchor to send your voice message
            </Heading>
            <Box
              width="100%"
              maxWidth={408}
              display="flex"
              marginTop={24}
              direction="column"
              justifyContent="center"
            >
              {/*
              // @ts-ignore */}
              <LoginContainer
                showSocialLogin={false}
                showHelpLinks={false}
                loginCallback={() =>
                  onClickSignin(
                    voiceMessageRecording.blob,
                    stationWebId,
                    voiceMessageTitle
                  )
                }
              />
              <Box display="flex" justifyContent="center" marginTop={20}>
                <Linkable
                  to="/login?menuMode=REQUEST_RESET_PASSWORD"
                  target="_blank"
                >
                  <Text size="lg" color="#5f6369" align="center" isBold={true}>
                    Forgot your password? Reset it.
                  </Text>
                </Linkable>
              </Box>
              <Box display="flex" justifyContent="center" marginTop={20}>
                <Linkable to={`${profileUrlPath}/message/signup`}>
                  <Text size="lg" color="#5f6369" align="center" isBold={true}>
                    Don’t have an Anchor account? Sign up.
                  </Text>
                </Linkable>
              </Box>
            </Box>
          </Box>
        </Box>
      );
    }
    if (scene === Scenes.RECORD) {
      return (
        <Box mdHeight={444} lgHeight={444} smHeight="100%">
          {this.renderRecordScene()}
        </Box>
      );
    }
    if (scene === Scenes.SENDING) {
      return (
        <Box
          display="flex"
          direction="column"
          justifyContent="between"
          mdHeight={444}
          lgHeight={444}
          smHeight="100%"
        >
          <Box display="flex" justifyContent="center">
            <Box maxWidth={589}>
              <Box>
                <Heading size="sm" color="#292f36" isBold={true} align="center">
                  Sending your voice message…
                </Heading>
              </Box>
            </Box>
          </Box>
          <Box display="flex" justifyContent="center">
            <Box width={30} height={30}>
              <Spinner color="#dfe0e1" type="circle" />
            </Box>
          </Box>
          <Box>
            <Box>
              <Text size="xl" color="rgba(41, 47, 54, 0.6)" align="center">
                Please stay on this page until we’re done.
              </Text>
            </Box>
          </Box>
        </Box>
      );
    }
    return null;
  }

  public render() {
    const {
      state: {
        isShowing,
        scene,
        isShowingRecordAgainConfirmationOverlay,
        isShowingExitConfirmationOverlay,
        isPublicCallinHiddenFromWeb,
        voiceMessageRecording,
      },
      actions: {
        onClickRecordAgainConfirmation,
        onClickDismissRecordAgainConfirmation,
        onClickCloseModal,
        onClickDiscard,
        onClickDismissExitConfirmation,
      },
    } = this.props;
    const isShowingModalOverlay =
      isShowingRecordAgainConfirmationOverlay ||
      isShowingExitConfirmationOverlay;

    // do not show confirmation modal on close if callin is hidden from web
    // or if the user hasn't already finished recording a voice message
    const handleCloseModal =
      isPublicCallinHiddenFromWeb || !voiceMessageRecording
        ? onClickDiscard
        : onClickCloseModal;

    return (
      <Modal
        isShowing={isShowing}
        isShowingCloseButton={true}
        contentClassName={styles.modalContent}
        dialogClassName={styles.modalDialog}
        onClickClose={handleCloseModal}
        renderContent={() => (
          <Box
            height="100%"
            paddingLeft={18}
            paddingRight={18}
            paddingBottom={46}
            paddingTop={46}
          >
            {this.renderScene(scene)}
          </Box>
        )}
        showOverlayContent={isShowingModalOverlay}
        renderOverlayContent={() => (
          <If
            condition={isShowingModalOverlay}
            ifRender={() => (
              <>
                <If
                  condition={isShowingRecordAgainConfirmationOverlay}
                  ifRender={() => (
                    <Box
                      testId="RecordAgainConfirmationOverlay"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      height="100%"
                      width="100%"
                      padding={10}
                    >
                      <Box maxWidth={430} width="100%">
                        <Box paddingTop={9} paddingBottom={9}>
                          <Box isHidingAtSmScreen={true}>
                            <Heading size="sm" align="center" isBold={true}>
                              Are you sure you want to start over?
                            </Heading>
                          </Box>
                          <Box
                            isHidingAtLgScreen={true}
                            isHidingAtMdScreen={true}
                          >
                            <Text size="xl" align="center">
                              Are you sure you want to start over?
                            </Text>
                          </Box>
                        </Box>
                        <Box paddingTop={9} paddingBottom={9}>
                          <Text
                            sizeAtLgScreen="xl"
                            sizeAtMdScreen="xl"
                            sizeAtSmScreen="lg"
                            align="center"
                            color="rgba(41, 47, 54, 0.6)"
                          >
                            Your most recent recording will be permanently
                            deleted to make way for the new one.
                          </Text>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent="center"
                          paddingTop={6}
                          paddingBottom={6}
                        >
                          <Box maxWidth={300} width="100%">
                            <Box paddingTop={9} paddingBottom={9}>
                              <ButtonWithHoverAndPress
                                isDisabled={false} // TODO: This should be specific to the state of fetching microphones
                                shape="pill"
                                type="unelevated"
                                colorTheme="primary"
                                text="Yes, start over"
                                size="sm"
                                isFullWidth={true}
                                onPress={onClickRecordAgainConfirmation}
                              />
                            </Box>
                            <Box paddingTop={14} paddingBottom={14}>
                              <ButtonWithHoverAndPress
                                isDisabled={false} // TODO: This should be specific to the state of fetching microphones
                                shape="pill"
                                type="outlined"
                                colorTheme="primary"
                                text="No, keep this one"
                                size="sm"
                                isFullWidth={true}
                                onPress={onClickDismissRecordAgainConfirmation}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  )}
                />
                <If
                  condition={isShowingExitConfirmationOverlay}
                  ifRender={() => (
                    <Box
                      testId="NotInterestedConfirmationOverlay"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      height="100%"
                      width="100%"
                      padding={20}
                    >
                      <Box maxWidth={460} width="100%">
                        <Box paddingTop={9} paddingBottom={9}>
                          <Box isHidingAtSmScreen={true}>
                            <Heading size="sm" align="center">
                              Are you sure you want to exit?
                            </Heading>
                          </Box>
                          <Box
                            isHidingAtLgScreen={true}
                            isHidingAtMdScreen={true}
                          >
                            <Text size="xl" align="center">
                              Are you sure you want to exit?
                            </Text>
                          </Box>
                        </Box>
                        <Box paddingTop={9} paddingBottom={9}>
                          <Box>
                            <Text
                              sizeAtLgScreen="xl"
                              sizeAtMdScreen="xl"
                              sizeAtSmScreen="lg"
                              align="center"
                              color="rgba(41, 47, 54, 0.6)"
                            >
                              If you leave now, you won’t be able to send your
                              voice message.
                            </Text>
                          </Box>
                          <Box marginTop={10}>
                            <Text
                              sizeAtLgScreen="xl"
                              sizeAtMdScreen="xl"
                              sizeAtSmScreen="lg"
                              align="center"
                              color="rgba(41, 47, 54, 0.6)"
                            >
                              This podcaster would love to hear from you!
                            </Text>
                          </Box>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent="center"
                          marginTop={22}
                        >
                          <Box maxWidth={300} width="100%">
                            <ButtonWithHoverAndPress
                              isDisabled={false}
                              shape="pill"
                              type="unelevated"
                              colorTheme="primary"
                              text="No, I want to send it"
                              size="sm"
                              isFullWidth={true}
                              onPress={onClickDismissExitConfirmation}
                            />
                          </Box>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent="center"
                          marginTop={18}
                        >
                          <Box maxWidth={300} width="100%">
                            <ButtonWithHoverAndPress
                              isDisabled={false}
                              shape="pill"
                              type="unelevated"
                              colorTheme="red"
                              text="Yes, discard my message"
                              size="sm"
                              isFullWidth={true}
                              onPress={onClickDiscard}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  )}
                />
              </>
            )}
          />
        )}
      />
    );
  }
}

export { VoiceMessageCreationModalScreen };
