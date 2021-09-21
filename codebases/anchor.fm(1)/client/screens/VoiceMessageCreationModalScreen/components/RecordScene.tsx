import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import Box from '../../../shared/Box';
import { ButtonWithHoverAndPress } from '../../../shared/Button';
import ErrorBanner from '../../../shared/ErrorBanner';
import Heading from '../../../shared/Heading';
import If from '../../../shared/If';
import Image from '../../../shared/Image';
import { Linkable } from '../../../shared/Link';
import Mask from '../../../shared/Mask';
import Recordable from '../../../shared/Recordable';
import Text from '../../../shared/Text';
import { VoiceMessageEmptyIcon } from '../../EpisodeEditorScreen/components/EpisodeCreationCallIn/components/VoiceMessageEmptyIcon';
import CurrentlyRecordingSection from './CurrentlyRecordingSection';
import PreviewSection from './PreviewSection';
import { trackEvent } from '../../../modules/analytics';
import { Browser } from '../../../modules/Browser';
import { trackPlayPreview, trackStartRecording } from '../events';
import RecordingNotSupported from './RecordingNotSupported';

const serverRenderingUtils = require('../../../../helpers/serverRenderingUtils');
const styles = require('./RecordScene.sass');

type Milliseconds = number;

interface IRecordSceneProps {
  onRecordingDidFinish: (blob: File) => void;
  onPlay: () => void;
  onPause: () => void;
  audio: any;
  isPlaying: boolean;
  onSubmit: (audio: any) => void;
  onClickRecordAgain: () => void;
  onChangeVoiceMessageTitle: (voiceMessageTitle: string) => void;
  voiceMessageTitle: string;
  maxLengthInMs: number;
  podcastName: string;
  podcastCoverartImageUrl: string;
  isLoading: boolean;
  onClickCloseModal: () => void;
  onClickStopRecording: () => void;
  vanitySlug: string;
}

interface IRecordSceneState {
  errorText: string | null;
}

class RecordScene extends React.Component<
  IRecordSceneProps,
  IRecordSceneState
> {
  constructor(props: IRecordSceneProps) {
    super(props);
    this.state = {
      errorText: null,
    };
  }

  public handleErrorText = (errorText: string) => this.setState({ errorText });

  public clearErrorText = () => this.setState({ errorText: null });

  public render() {
    const { errorText } = this.state;
    const {
      onRecordingDidFinish,
      audio,
      isPlaying,
      onPause,
      onPlay,
      onSubmit,
      onClickRecordAgain,
      maxLengthInMs,
      isLoading,
      podcastCoverartImageUrl,
      podcastName,
      onClickCloseModal,
      onClickStopRecording,
      onChangeVoiceMessageTitle,
      voiceMessageTitle,
      vanitySlug,
    } = this.props;
    const {
      isIOS,
      isAndroidChrome,
      appStoreLink,
      playStoreLink,
    } = serverRenderingUtils;

    return (
      <Box testId="AdRecordingFlow_recording-section" height="100%">
        {errorText && <ErrorBanner text={errorText} />}
        <Recordable
          onRecordingDidStart={this.clearErrorText}
          onRecordingDidFinish={(blob: any) => {
            onRecordingDidFinish(blob);
          }}
          onTick={(durationInMs: number, stopRecording: () => void) => {
            if (durationInMs > maxLengthInMs) {
              onClickStopRecording();
              stopRecording();
            }
          }}
        >
          {({
            // @ts-ignore
            isReadyForRecording,
            // @ts-ignore
            availableMicrophoneLabels,
            // @ts-ignore
            currentMicrophoneLabel,
            // @ts-ignore
            selectMicrophoneWithLabel,
            // @ts-ignore
            startRecording,
            // @ts-ignore
            stopRecording,
            // @ts-ignore
            isRecording,
            // @ts-ignore
            durationInMs: recordingDurationInMs,
            // @ts-ignore
            isMicrophoneBlocked,
            // @ts-ignore
            isRecordingSupported,
          }) => {
            if (!isRecordingSupported) {
              return (
                <RecordingNotSupported
                  link={Browser.getFullUrlForUrlPath(`/${vanitySlug}/message`)}
                  headingText="Open in Safari to send voice message"
                  bodyText="Unfortunately, recording isn't supported from within this app. To send your voice message, follow these quick steps:"
                  onDidPressCopyLink={() => {
                    trackEvent(
                      null,
                      {
                        eventCategory: 'Voice Message',
                        eventAction: 'Copy Text',
                        eventLabel: 'Tap here to copy link',
                      },
                      // eslint-disable-next-line no-undef
                      { providers: [ga] }
                    );
                  }}
                  onComponentDidMount={() => {
                    trackEvent(
                      null,
                      {
                        eventCategory: 'Voice Message',
                        eventAction: 'Viewed on Mobile',
                        eventLabel: 'Recording Not Supported',
                      },
                      // eslint-disable-next-line no-undef
                      { providers: [ga] }
                    );
                  }}
                />
              );
            }
            return (
              <>
                <If
                  condition={isMicrophoneBlocked}
                  ifRender={() => (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      height="100%"
                      width="100%"
                      padding={10}
                    >
                      <Box maxWidth={589} width="100%">
                        <Box paddingTop={9} paddingBottom={9}>
                          <Heading size="sm" align="center" isBold={true}>
                            Microphone access required
                          </Heading>
                        </Box>
                        <Box paddingTop={9} paddingBottom={9}>
                          <Text
                            size="xl"
                            align="center"
                            color="rgba(41, 47, 54, 0.6)"
                          >
                            We’ve detected that Anchor does not have permissions
                            to record from this browser. To fix this, please
                            allow anchor.fm to access your microphone. (You can
                            find this in your browser settings.)
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
                                text="Ok, thanks"
                                size="sm"
                                isFullWidth={true}
                                onPress={onClickCloseModal}
                              />
                            </Box>
                          </Box>
                        </Box>
                        <Box
                          display="flex"
                          justifyContent="center"
                          marginTop={20}
                        >
                          <Linkable to="https://help.anchor.fm/hc/en-us/requests/new">
                            <Text
                              size="lg"
                              color="#5f6369"
                              align="center"
                              isBold={true}
                            >
                              Still not working? Contact Anchor support
                            </Text>
                          </Linkable>
                        </Box>
                      </Box>
                    </Box>
                  )}
                  elseRender={() => (
                    <If
                      condition={isRecording || isLoading}
                      ifRender={() => {
                        return (
                          <Box
                            height="100%"
                            display="flex"
                            direction="column"
                            justifyContent="between"
                          >
                            <CurrentlyRecordingSection
                              warningColorAfterMs={45000}
                              recordingDurationInMs={recordingDurationInMs}
                              stopRecording={() => {
                                onClickStopRecording();
                                stopRecording();
                              }}
                              isLoading={isLoading}
                            />
                          </Box>
                        );
                      }}
                      elseRender={() => (
                        <If
                          condition={audio}
                          ifRender={() => (
                            <Box
                              height="100%"
                              display="flex"
                              direction="column"
                              justifyContent="between"
                            >
                              <Box display="flex" justifyContent="center">
                                <Box maxWidth={589}>
                                  <Box>
                                    <Heading
                                      size="sm"
                                      color="#292f36"
                                      isBold={true}
                                      align="center"
                                    >
                                      Preview and send
                                    </Heading>
                                  </Box>
                                  <Box marginTop={10}>
                                    <Text
                                      sizeAtLgScreen="xl"
                                      sizeAtMdScreen="xl"
                                      sizeAtSmScreen="lg"
                                      color="rgba(41, 47, 54, 0.6)"
                                      align="center"
                                    >
                                      Remember, your message could end up on a
                                      future episode of this podcast.
                                    </Text>
                                  </Box>
                                </Box>
                              </Box>
                              <Box paddingTop={0}>
                                <PreviewSection
                                  onChangeVoiceMessageTitle={
                                    onChangeVoiceMessageTitle
                                  }
                                  adAudioUrl={audio.url}
                                  isPlaying={isPlaying}
                                  onPause={onPause}
                                  onPlay={() => {
                                    trackPlayPreview();
                                    onPlay();
                                  }}
                                  voiceMessageTitle={voiceMessageTitle}
                                />
                              </Box>
                              <Box
                                width="100%"
                                display="flex"
                                justifyContent="center"
                              >
                                <Box
                                  maxWidth={522}
                                  reverseWrap={true}
                                  display="flex"
                                  justifyContent="between"
                                  width="100%"
                                >
                                  <Box
                                    lgWidth={238}
                                    mdWidth={238}
                                    smWidth="100%"
                                    isHidingAtSmScreen={true}
                                  >
                                    <ButtonWithHoverAndPress
                                      isDisabled={
                                        !isReadyForRecording || isLoading
                                      } // TODO: This should be specific to the state of fetching microphones
                                      shape="pill"
                                      type="unelevated"
                                      colorTheme="red"
                                      text="Record again"
                                      size="sm"
                                      isFullWidth={true}
                                      onPress={() => {
                                        onClickRecordAgain();
                                      }}
                                    />
                                  </Box>
                                  <Box
                                    lgWidth={226}
                                    mdWidth={226}
                                    smWidth="100%"
                                    isHidingAtLgScreen={true}
                                    isHidingAtMdScreen={true}
                                  >
                                    <ButtonWithHoverAndPress
                                      isDisabled={
                                        !isReadyForRecording || isLoading
                                      } // TODO: This should be specific to the state of fetching microphones
                                      shape="pill"
                                      type="text"
                                      colorTheme="red"
                                      text="Record again"
                                      size="sm"
                                      isFullWidth={true}
                                      onPress={() => {
                                        onClickRecordAgain();
                                      }}
                                    />
                                  </Box>
                                  <Box
                                    lgWidth={238}
                                    mdWidth={238}
                                    smWidth="100%"
                                  >
                                    <ButtonWithHoverAndPress
                                      isDisabled={
                                        (errorText || '').length > 0 ||
                                        isLoading
                                      }
                                      shape="pill"
                                      type="unelevated"
                                      colorTheme="primary"
                                      text="Send this message!"
                                      size="sm"
                                      isProcessing={isLoading}
                                      isFullWidth={true}
                                      onPress={() => {
                                        onSubmit(audio);
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          )}
                          elseRender={() => (
                            <Box
                              height="100%"
                              display="flex"
                              direction="column"
                              justifyContent="between"
                            >
                              <Box display="flex" justifyContent="center">
                                <Box maxWidth={589}>
                                  <Box>
                                    <Heading
                                      size="sm"
                                      color="#292f36"
                                      isBold={true}
                                      align="center"
                                    >
                                      Send a voice message to
                                    </Heading>
                                  </Box>
                                  <Box marginTop={10} isHidingAtSmScreen={true}>
                                    <Heading
                                      align="center"
                                      size="sm"
                                      color="#292f36"
                                    >
                                      {podcastName}
                                    </Heading>
                                  </Box>
                                  <Box
                                    marginTop={10}
                                    isHidingAtMdScreen={true}
                                    isHidingAtLgScreen={true}
                                  >
                                    <Text
                                      align="center"
                                      size="xl"
                                      color="#292f36"
                                    >
                                      {podcastName}
                                    </Text>
                                  </Box>
                                  <Box marginTop={10}>
                                    <Text
                                      sizeAtSmScreen="lg"
                                      sizeAtMdScreen="xl"
                                      sizeAtLgScreen="xl"
                                      color="rgba(41, 47, 54, 0.6)"
                                      align="center"
                                    >
                                      Your message could end up on a future
                                      episode of this podcast!
                                    </Text>
                                  </Box>
                                </Box>
                              </Box>
                              <Box
                                testId="AdRecordingFlow_recording-section-controls-container"
                                display="flex"
                                justifyContent="center"
                              >
                                <Box
                                  testId="AdRecordingFlow_recording-section-controls"
                                  width={500}
                                >
                                  <Box
                                    width="100%"
                                    testId="AdRecordingFlow_recording-input-selection-container"
                                    display="flex"
                                    justifyContent="between"
                                    alignItems="center"
                                    isHidingAtSmScreen={true}
                                  >
                                    <Text>Input</Text>
                                    <Box
                                      testId="AdRecordingFlow_recording-input-dropdown-container"
                                      width={440}
                                    >
                                      {/* TODO: Do not use the bootstrap compoenent. Instead, use and Anchor
                shared component */}
                                      <div className={styles.control}>
                                        <DropdownButton
                                          // onClick={(e)=> {console.log(e)}}
                                          onSelect={(microphoneLabel: any) => {
                                            selectMicrophoneWithLabel(
                                              microphoneLabel
                                            );
                                          }}
                                          title={currentMicrophoneLabel || ''}
                                          id="Input Dropdown"
                                        >
                                          {availableMicrophoneLabels.map(
                                            (label: any) => (
                                              <MenuItem
                                                eventKey={label}
                                                key={label}
                                              >
                                                <Text size="lg" color="#7f8287">
                                                  {label}
                                                </Text>
                                              </MenuItem>
                                            )
                                          )}
                                        </DropdownButton>
                                      </div>
                                    </Box>
                                  </Box>
                                  <Box
                                    display="flex"
                                    justifyContent="center"
                                    isHidingAtMdScreen={true}
                                    isHidingAtLgScreen={true}
                                  >
                                    <If
                                      condition={Boolean(
                                        podcastCoverartImageUrl
                                      )}
                                      ifRender={() => (
                                        <Mask shape="rounded">
                                          <Image
                                            width={177}
                                            height={177}
                                            imageUrl={podcastCoverartImageUrl}
                                            retinaImageUrl={
                                              podcastCoverartImageUrl
                                            }
                                          />
                                        </Mask>
                                      )}
                                      elseRender={() => (
                                        <Box width={200}>
                                          <VoiceMessageEmptyIcon />
                                        </Box>
                                      )}
                                    />
                                  </Box>
                                </Box>
                              </Box>
                              <Box>
                                <Box
                                  display="flex"
                                  justifyContent="center"
                                  isHidingAtMdScreen={true}
                                  isHidingAtLgScreen={true}
                                  marginBottom={16}
                                >
                                  <Box marginTop={20} maxWidth={350}>
                                    <Text
                                      sizeAtLgScreen="xl"
                                      sizeAtMdScreen="xl"
                                      sizeAtSmScreen="md"
                                      color="rgba(41, 47, 54, 0.6)"
                                      align="center"
                                    >
                                      Recording will start as soon as you tap
                                    </Text>
                                  </Box>
                                </Box>
                                <Box display="flex" justifyContent="center">
                                  <Box
                                    testId="AdRecordingFlow_recording-buttons-container"
                                    width="100%"
                                    maxWidth={300}
                                  >
                                    <ButtonWithHoverAndPress
                                      isDisabled={!isReadyForRecording} // TODO: This should be specific to the state of fetching microphones
                                      shape="pill"
                                      type="unelevated"
                                      colorTheme="red"
                                      text="Start recording now!"
                                      size="sm"
                                      isFullWidth={true}
                                      onPress={() => {
                                        trackStartRecording();
                                        startRecording();
                                      }}
                                    />
                                  </Box>
                                </Box>
                                <If
                                  condition={isIOS() || isAndroidChrome()}
                                  ifRender={() => (
                                    <Linkable
                                      to={
                                        isIOS()
                                          ? appStoreLink()
                                          : playStoreLink()
                                      }
                                      target={
                                        isIOS() || isAndroidChrome()
                                          ? '_blank'
                                          : '_self'
                                      }
                                      isFullWidth={true}
                                    >
                                      <Box width="100%">
                                        <ButtonWithHoverAndPress
                                          isEventBubblingAllowed={true}
                                          shape="pill"
                                          type="text"
                                          colorTheme="default"
                                          text="Get the Anchor app"
                                          size="sm"
                                          isFullWidth={true}
                                          onPress={() => {}}
                                        />
                                      </Box>
                                    </Linkable>
                                  )}
                                />
                              </Box>
                            </Box>
                          )}
                        />
                      )}
                    />
                  )}
                />
              </>
            );
          }}
        </Recordable>
      </Box>
    );
  }
}

export { RecordScene };
