import { css, Global } from '@emotion/core';
import styled from '@emotion/styled';
import * as Sentry from '@sentry/browser';
import queryString from 'query-string';
import React, { Component, Fragment } from 'react';
import serverRenderingUtils from '../../../helpers/serverRenderingUtils';
import { useBrowserSize } from '../../contexts/BrowserSize';
import { AnchorAPI } from '../../modules/AnchorAPI';
import Box from '../../shared/Box';
import { Modal } from '../../shared/Modal';
import Spinner from '../../shared/Spinner';
import { CallEndedOrFull } from './CallEndedOrFull';
import { CallJoinContent } from './CallJoinContent';
import { CurrentlyOnCall } from './CurrentlyOnCall';
import { Header } from './Header';
import {
  ConnectError,
  Error,
  ErrorName,
  ErrorType,
  InitializePublisherError,
  PublishError,
} from './types/errors';

declare global {
  interface Window {
    __OPENTOK_API_KEY__: string;
  }
}

const getUUIDFromData = (data: string): string => {
  return queryString.parse(data).uuid as string;
};

const ErrorContainer = styled.div`
  text-align: center;
`;
const ErrorHeader = styled.h2`
  font-weight: bold;
  margin-top: 0;
`;

type StreamEvent = any;
type ConnectionEvent = any;

export type Participant = {
  uuid: string;
  isHost: boolean;
  displayName: string;
  userId: number;
  deviceKind: string | null;
  podcastName: string;
  stream: any;
  isSelf: boolean;
};

type Props = {
  inviteCode: string;
  onPressDoneRecordingConfirmation: (isUserLoggedIn: boolean) => void;
  openInAppUrl: string;
  user: {
    imageUrl: string | null;
    name: string;
    userId: number;
  } | null;
  height: number;
};

type State = {
  scene:
    | 'activeAnonymous'
    | 'loading'
    | 'ended'
    | 'displayName'
    | 'activeLoggedIn'
    | 'maximumReached';
  displayName: string | null;
  conferenceCallId: string | null;
  participants: Participant[];
  publisher: any | null;
  session: any | null;
  hostPodcastName: string;
  hostPodcastImage: string;
  isShowingRecordingDoneConfirmation: boolean;
  email: string;
  isFetching: boolean;
  hostName: string;
  deviceId: string | null;
  selfUUID: string | null;
  isErrorModalOpen: boolean;
  error: null | {
    type: ErrorType;
    message: string | JSX.Element;
  };
  streams: any;
  isSessionPublished: boolean;
};

class CallJoinClassComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scene: 'loading',
      displayName: null,
      conferenceCallId: null,
      participants: [],
      publisher: null,
      session: null,
      hostPodcastName: '',
      hostPodcastImage: '',
      isShowingRecordingDoneConfirmation: false,
      email: '',
      isFetching: false,
      hostName: '',
      deviceId: null,
      selfUUID: null,
      isErrorModalOpen: false,
      error: null,
      streams: null,
      isSessionPublished: false,
    };
  }

  public componentDidMount() {
    const { inviteCode, user } = this.props;
    const isUserLoggedIn = !!user;
    const displayName = isUserLoggedIn && user !== null ? user.name : '';
    this.setState(
      () => ({
        displayName,
      }),
      () => {
        AnchorAPI.fetchConferenceCallInfo(inviteCode)
          .then((response: any) => {
            const {
              conferenceCallId,
              status,
              hostPodcastImage,
              hostPodcastName,
              hostName,
            } = response;
            this.setState(() => ({
              conferenceCallId,
              hostPodcastImage,
              hostPodcastName,
              hostName,
            }));
            switch (status) {
              case 'active':
                this.setState(() => ({
                  scene: isUserLoggedIn ? 'activeLoggedIn' : 'displayName',
                  hostPodcastImage,
                  hostPodcastName,
                }));
                break;
              case 'maximumReached':
                return this.setState({
                  scene: 'maximumReached',
                });
              default:
                throw new Error(`Need to handle status: ${status}`);
            }
          })
          .catch(_err => {
            // NOTE: Endpoint currently throws a 500 (internal server error) when the invite is not longer active
            this.setState(() => ({
              scene: 'ended',
            }));
          });
      }
    );
  }

  public componentWillUnmount() {
    const { session, publisher } = this.state;
    if (session && publisher) {
      session.unpublish(publisher);
    }
  }

  public handleComplete = (err: Error) => {
    if (err) this.setState({ isErrorModalOpen: true, isFetching: false });
  };

  public setError({ type, name }: { type: ErrorType; name: ErrorName }) {
    const { conferenceCallId } = this.state;
    const message = getErrorMessage(name);
    Sentry.captureMessage(
      `${type} error: ${message} - conference call ID: ${conferenceCallId}`
    );
    this.setState({
      isFetching: false,
      error: {
        type,
        message,
      },
    });
  }

  public setupOpenTok = ({
    sessionId,
    token,
  }: {
    sessionId: string;
    token: string;
  }) => {
    if (serverRenderingUtils.windowUndefined()) {
      throw new Error('window not defined');
    }

    const { deviceId, conferenceCallId } = this.state;
    const { onPressDoneRecordingConfirmation, user } = this.props;
    const isUserLoggedIn = !!user;
    if (conferenceCallId !== null) {
      const OT = require('@opentok/client');
      const session = OT.initSession(window.__OPENTOK_API_KEY__, sessionId);
      const publisher = OT.initPublisher(
        'placeholder',
        {
          videoSource: null,
          publishAudio: true,
          publishVideo: false,
          audioSource: deviceId,
        },
        (err: InitializePublisherError) => {
          if (err) {
            const { name } = err;
            this.setError({ type: 'initializePublishError', name });
          }
        }
      );
      this.setState({ session, publisher });

      session.connect(token, (connectError: ConnectError) => {
        if (connectError) {
          const { name } = connectError;
          this.setError({ type: 'connectError', name });
        } else {
          // after the user connects, store their UUID this will be used
          // to identify which participant is them so we can indicate it as 'you'
          this.setState({
            selfUUID: getUUIDFromData(session.connection.data),
          });
          session.publish(publisher, (publishError: PublishError) => {
            if (publishError) {
              const { name } = publishError;
              this.setError({ type: 'publishError', name });
            } else {
              this.setState({ isSessionPublished: true });
            }
          });
        }
      });

      // Event listeners
      // -- gonna list all the possible event listeners below, even if they're not being used
      // -- because the docs are a little hard to browse through

      // -- sessionEvents
      // sessionConnected
      // sessionDisconnected
      // sessionReconnecting
      // sessionReconnected
      // --

      // -- connectionEvents
      // connectionCreated
      // connectionDestroyed
      // --
      session.on('connectionCreated', (event: ConnectionEvent) => {
        // a connectionCreated event is fired for each caller that joins
        // we want to maintain a list of participants but also keep
        // track of which one is the one who you are -- meaning the peson
        // who is currently has RWF open
        const currentUuid = getUUIDFromData(event.connection.data);
        fetchParticipants(conferenceCallId).then(response => {
          // @ts-ignore
          const { participants } = response;
          this.setState(state => {
            const { selfUUID } = state;
            const newParticipant = participants.find(
              (p: Participant) => p.uuid === currentUuid
            );
            return {
              participants: participants.map((p: Participant) => {
                return {
                  ...p,
                  isSelf:
                    newParticipant !== undefined ? p.uuid === selfUUID : false,
                };
              }),
            };
          });
        });
      });
      session.on('connectionDestroyed', (event: ConnectionEvent) => {
        fetchParticipants(conferenceCallId).then(response => {
          // @ts-ignore
          const { participants } = response;
          const host = participants.find(
            (participant: Participant) => participant.isHost
          );
          const userUUID = getUUIDFromData(event.connection.data);
          if (host !== undefined && host.uuid && userUUID === host.uuid) {
            onPressDoneRecordingConfirmation(isUserLoggedIn);
            session.unpublish(publisher);
          } else {
            this.setState(state => ({
              participants: state.participants.filter(p => p.uuid !== userUUID),
            }));
          }
        });
      });

      // -- stream events
      // streamCreated
      // streamDestroyed
      // streamPropertyChanged
      // --
      session.on('streamCreated', (event: StreamEvent) => {
        // when a new person joins the call, a streamCreated event is fired
        // this is used to subscribe to other people 1:1 which is required to
        // actually hear each other. subscribing is handled in Caller/index.tsx
        // we wont show a person on the call if they don't have a stream
        const {
          stream: {
            connection: { data },
          },
          stream,
        } = event;
        const currentUuid = getUUIDFromData(data);
        this.setState(state => {
          const { streams } = state;
          return { ...state, streams: { ...streams, [currentUuid]: stream } };
        });
      });

      session.on('streamDestroyed', (event: StreamEvent) => {
        const {
          stream: {
            connection: { data },
          },
        } = event;
        const currentUuid = getUUIDFromData(data);
        this.setState(state => {
          const { streams } = state;
          const newStreams = streams;
          newStreams[currentUuid] = undefined;
          return { ...state, streams: newStreams };
        });
      });

      // -- signal events
      // signal
      // --
    }
  };

  public setupRWFCall = ({
    notLoggedInUserName,
  }: {
    notLoggedInUserName: string;
  }) => {
    const { conferenceCallId, email } = this.state;
    const { inviteCode, user } = this.props;
    const isUserLoggedIn = !!user;

    AnchorAPI.joinRWFCall(
      conferenceCallId!,
      inviteCode,
      notLoggedInUserName,
      isUserLoggedIn,
      email
    ).then(
      // @ts-ignore
      (response: any) => {
        const { sessionId, token, uuid } = response;
        AnchorAPI.registerSessionConnection({
          sessionId,
          anonUserUUID: uuid,
          conferenceCallId: conferenceCallId!,
        });
        this.setupOpenTok({
          sessionId,
          token,
        });
      }
    );
  };

  public renderContent = () => {
    const {
      user,
      onPressDoneRecordingConfirmation,
      inviteCode,
      height,
    } = this.props;
    const {
      scene,
      participants,
      session,
      publisher,
      hostName,
      hostPodcastName,
      isShowingRecordingDoneConfirmation,
      hostPodcastImage,
      isErrorModalOpen,
      email,
      isFetching,
      displayName,
      error,
      streams,
      isSessionPublished,
    } = this.state;
    if (
      isSessionPublished &&
      streams !== null &&
      participants.length > 0 &&
      scene !== 'ended'
    ) {
      return (
        <Container height={height}>
          <Header />
          <CurrentlyOnCall
            session={session}
            streams={streams}
            publisher={publisher}
            participants={participants}
            onPressLeave={() => {
              session.disconnect();
              this.setState(() => ({
                participants: [],
                scene: 'ended',
                isShowingRecordingDoneConfirmation: true,
              }));
            }}
          />
        </Container>
      );
    }

    return (
      <div>
        <Header />
        {(() => {
          switch (scene) {
            case 'loading':
              return (
                <Box
                  width="100%"
                  display="flex"
                  justifyContent="center"
                  paddingTop={10}
                  height="87vh"
                  color="white"
                >
                  <Box width={30}>
                    <Spinner />
                  </Box>
                </Box>
              );
            case 'activeAnonymous':
            case 'activeLoggedIn':
            case 'displayName':
              const notLoggedInUserName = displayName ? displayName : '';
              return (
                <Fragment>
                  {error !== null && (
                    <Modal
                      isShowing={true}
                      isShowingCloseButton={true}
                      onClickClose={() => this.setState({ error: null })}
                      renderContent={() => {
                        return (
                          <ErrorContainer>
                            <ErrorHeader>Oh no!</ErrorHeader>
                            <div>{error.message}</div>
                          </ErrorContainer>
                        );
                      }}
                    />
                  )}
                  <CallJoinContent
                    onReadyForRecording={(microphone: InputDeviceInfo) =>
                      this.setState({ deviceId: microphone.deviceId })
                    }
                    onCloseErrorModal={() =>
                      this.setState({ isErrorModalOpen: false })
                    }
                    isErrorModalOpen={isErrorModalOpen}
                    isUserLoggedIn={!!user}
                    podcastCreatorUserName={hostName}
                    loggedInUserName={user && user.name ? user.name : ''}
                    notLoggedInUserName={notLoggedInUserName}
                    podcastName={hostPodcastName}
                    onSubmit={() => {
                      this.setState(() => ({
                        scene: 'activeAnonymous',
                        isFetching: true,
                      }));
                      AnchorAPI.fetchConferenceCallInfo(inviteCode).then(
                        response => {
                          // @ts-ignore
                          const { status } = response;
                          if (status === 'ended') {
                            this.setState(() => ({
                              participants: [],
                              scene: 'ended',
                            }));
                          } else {
                            this.setupRWFCall({
                              notLoggedInUserName,
                            });
                          }
                        }
                      );
                    }}
                    onChangeDisplayName={(value: string) =>
                      this.setState({ displayName: value })
                    }
                    onChangeMicrophone={(deviceId: string) => {
                      this.setState(() => ({
                        deviceId,
                      }));
                    }}
                    coverartImageUrl={hostPodcastImage}
                    onChangeEmail={(changedEmail: string) => {
                      this.setState({
                        email: changedEmail,
                      });
                    }}
                    email={email}
                    isFetching={isFetching}
                  />
                </Fragment>
              );
            case 'ended':
              return (
                <CallEndedOrFull
                  scene="ended"
                  podcastCreatorUserName={hostName}
                  podcastName={hostPodcastName}
                  isShowingLeaveConfirmationModal={
                    isShowingRecordingDoneConfirmation
                  }
                  isUserLoggedIn={!!user}
                  onPressDoneRecordingConfirmation={
                    onPressDoneRecordingConfirmation
                  }
                  coverartImageUrl={hostPodcastImage}
                />
              );
            case 'maximumReached':
              return (
                <CallEndedOrFull
                  scene="full"
                  podcastCreatorUserName={hostName}
                  podcastName={hostPodcastName}
                  isShowingLeaveConfirmationModal={
                    isShowingRecordingDoneConfirmation
                  }
                  isUserLoggedIn={!!user}
                  onPressDoneRecordingConfirmation={
                    onPressDoneRecordingConfirmation
                  }
                  coverartImageUrl={hostPodcastImage}
                />
              );
            default:
              return <h1>error</h1>;
          }
        })()}
      </div>
    );
  };

  public render() {
    return (
      <Fragment>
        <Global
          styles={css`
            body {
              background-color: #fff;
            }
            .OT_root {
              height: 0 !important;
              min-height: 0 !important;
            }
          `}
        />
        {this.renderContent()}
      </Fragment>
    );
  }
}

type FetchParticipantsResponse = {
  status: string;
  participants: Participant[];
};

async function fetchParticipants(conferenceCallId: string) {
  try {
    return await AnchorAPI.fetchConferenceCallParticipants(conferenceCallId);
  } catch (err) {
    throw new Error(err.message);
  }
}

function getErrorMessage(name: ErrorName): string | JSX.Element {
  switch (name) {
    case 'OT_CHROME_MICROPHONE_ACQUISITION_ERROR':
    case 'OT_USER_MEDIA_ACCESS_DENIED':
    case 'OT_HARDWARE_UNAVAILABLE':
    case 'OT_NO_DEVICES_FOUND':
      return (
        <Fragment>
          <p>We had some trouble accessing your browser{`'`}s microphone</p>
          <p>
            Please make sure you have allowed access to your microphone, verify
            that it isn{`'`}t being used by another application, and restart
            your browser to try again.
          </p>
        </Fragment>
      );
    case 'OT_NOT_CONNECTED':
    case 'OT_MEDIA_ERR_NETWORK':
      return (
        <Fragment>
          <p>We{`'`}re having some trouble joining this recording.</p>
          <p>
            Make sure you have a reliable internet connection and try again.
          </p>
        </Fragment>
      );
    default:
      return (
        <Fragment>
          <p>Something went wrong when trying to join this recording.</p>
          <p>
            Try refreshing the page and try again. If the issue persists, please
            contact us:{' '}
            <a
              href="https://help.anchor.fm"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://help.anchor.fm
            </a>
            .
          </p>
        </Fragment>
      );
  }
}

type ContainerProps = {
  height: number;
};
const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  height: 800px;
  @media (max-width: 600px) {
    height: ${(props: ContainerProps) => props.height}px;
  }
`;

function CallJoin(props: Props) {
  const { height } = useBrowserSize();
  return <CallJoinClassComponent {...props} height={height} />;
}

export default CallJoin;
