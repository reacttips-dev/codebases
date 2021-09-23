/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useBrowserSize } from '../../../contexts/BrowserSize';
import Box from '../../../shared/Box';
import { ButtonWithHoverAndPress } from '../../../shared/Button';
import { Modal } from '../../../shared/Modal';
import { ModalContentSimple } from '../../../shared/ModalContentSimple';
import { Spinner } from '../../../shared/Spinner';
import Text from '../../../shared/Text';
import { msToDigital } from '../../../utils';
import { Caller } from '../Caller';
import { ConnectionAlert } from '../ConnectionAlert';
import { Timer } from '../Timer';
import baseStyles from '../styles.sass';
import styles from './styles.sass';

interface CurrentlyOnCallProps {
  participants: any[];
  onPressLeave: any;
  session: any;
  publisher: any;
  streams: any | null;
}

// this is used to calculate the dynamic height of the participant list
// this value is the sum of the height of:
// header, paddings, timer, button, and/or connection alert
const HEIGHT_OFFSET_WITH_ALERT = 395;
const HEIGHT_OFFSET = 323;

const CurrentlyOnCall = ({
  participants,
  onPressLeave,
  session,
  publisher,
  streams,
}: CurrentlyOnCallProps) => {
  const [isOnline, setIsOnline] = useState(true);
  const [showNotConnectedAlert, setShowNotConnectedAlert] = useState(false);
  const [
    isShowingLeaveConfirmationModal,
    setIsShowingLeaveConfirmationModal,
  ] = useState(false);
  const timeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  const [notSubscribedUuids, setNotSubscribedUuids] = useState<string[]>([]);
  const notSubscribedUuidsRef = useRef<string[]>([]);
  const { height } = useBrowserSize();
  const participantListHeight =
    height - (showNotConnectedAlert ? HEIGHT_OFFSET_WITH_ALERT : HEIGHT_OFFSET);

  const displayParticipants = getParticipants();

  useEffect(() => {
    function clearAlertTimeout() {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    }
    clearAlertTimeout();
    if (notSubscribedUuids.length > 0) {
      timeoutRef.current = setTimeout(() => {
        setShowNotConnectedAlert(true);
      }, 5000);
    } else {
      setShowNotConnectedAlert(false);
    }
    return () => {
      clearAlertTimeout();
    };
  }, [notSubscribedUuids.length]);

  useEffect(() => {
    const audioElement = document && document.querySelector('audio');
    if (audioElement) {
      audioElement.volume = 0;
      audioElement.muted = true;
    }
    window.onunload = () => {
      if (session && publisher) {
        session.unpublish(publisher);
      }
    };
    function setOnline() {
      setIsOnline(true);
    }
    function setOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);
    window.onbeforeunload = () => {
      return true;
    };
    return function cleanup() {
      window.onbeforeunload = null;
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getParticipants() {
    if (streams === null) return [];
    return (
      participants
        .filter(p => {
          // only show users that have a opentok stream
          return p.isSelf || streams[p.uuid] !== undefined;
        })
        // always have the host be the first person in the list of people
        .sort((a, b) => {
          if (a.isHost) return -1;
          if (b.isHost) return 1;
          return 0;
        })
    );
  }

  return (
    <Container>
      <div>
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          <RecordDot />
          <h2
            css={css`
              font-weight: bold;
              font-size: 2rem;
              color: #292f36;
              margin: 0;
            `}
          >
            Recording
          </h2>
        </div>
        <Timer interval={1000}>
          {({ elapsedTimeInMs }: any) => (
            <h2
              css={css`
                text-align: center;
                font-size: 5rem;
                font-weight: 800;
                color: #292f36;
                margin: 20px 0;
              `}
            >
              {`${msToDigital(elapsedTimeInMs)}`}
            </h2>
          )}
        </Timer>
        <Rule />
        <div
          css={css`
            max-width: 400px;
            width: 100%;
            margin: auto;
            position: relative;
            height: 100%;
            max-height: 354px;
            @media (max-width: 600px) {
              max-height: ${participantListHeight}px;
            }
          `}
        >
          <ScrollFade />
          <div
            className={styles.participantList}
            css={css`
              @media (max-width: 600px) {
                max-height: ${participantListHeight}px;
              }
            `}
          >
            {displayParticipants.map(participant => {
              const {
                userId,
                deviceKind,
                displayName,
                isHost,
                isSelf,
                uuid,
              } = participant;
              const stream = streams[uuid];
              return (
                <Caller
                  key={`caller-item-${uuid}`}
                  stream={stream}
                  session={session}
                  userId={userId}
                  deviceKind={deviceKind}
                  displayName={displayName}
                  isHost={isHost}
                  isSelf={isSelf}
                  uuid={uuid}
                  handleSubscribe={(isSubscribed: boolean) => {
                    // this helps determine whether or not we need to show the connection error alert
                    let newUuids: string[] = [];
                    if (isSubscribed) {
                      newUuids = notSubscribedUuidsRef.current.filter(
                        notSubscribedUuid => notSubscribedUuid !== uuid
                      );
                      setNotSubscribedUuids(newUuids);
                      notSubscribedUuidsRef.current = newUuids;
                    } else if (!notSubscribedUuidsRef.current.includes(uuid)) {
                      newUuids = [...notSubscribedUuidsRef.current, uuid];
                      setNotSubscribedUuids(newUuids);
                      notSubscribedUuidsRef.current = newUuids;
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div
        css={css`
          max-width: 300px;
          width: 100%;
          margin: 0 auto;
          padding-top: 20px;
        `}
      >
        {showNotConnectedAlert && <ConnectionAlert />}
        <ButtonWithHoverAndPress
          isDisabled={false}
          shape="pill"
          type="unelevated"
          colorTheme="black"
          text="Leave recording"
          size="md"
          isFullWidth={true}
          onPress={() => {
            setIsShowingLeaveConfirmationModal(true);
          }}
        />
      </div>
      {isShowingLeaveConfirmationModal && (
        <Modal
          isShowingCloseButton={true}
          onClickClose={() => {
            setIsShowingLeaveConfirmationModal(false);
          }}
          isShowing={true}
          renderContent={() => (
            <Box smPaddingTop={12}>
              <ModalContentSimple
                title="Are you sure you want to leave this recording?"
                renderBody={() => null}
                primaryButton={{
                  onClick: () => {
                    setIsShowingLeaveConfirmationModal(false);
                  },
                  text: 'Stay connected',
                }}
                secondaryButton={{
                  onClick: () => {
                    onPressLeave();
                  },
                  type: 'unelevated',
                  colorTheme: 'red',
                  text: 'Leave',
                }}
              />
            </Box>
          )}
        />
      )}
      {!isOnline && (
        <Modal
          isShowingCloseButton={false}
          isShowing={true}
          dialogClassName={baseStyles.modalDialog}
          renderContent={() => (
            <ModalContentSimple
              title="Trying to reconnect..."
              renderBody={() => (
                <Box>
                  <Box display="flex" justifyContent="center" marginBottom={20}>
                    <Box width={30}>
                      <Spinner />
                    </Box>
                  </Box>

                  <Text size="md" color="#292F36">
                    If we're unable to reconnect within a few minutes, we'll end
                    the call so you can try again.
                  </Text>
                </Box>
              )}
            />
          )}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
`;

const Rule = styled.hr`
  height: 2px;
  background-color: #d8d8d8;
  max-width: 540px;
  width: 100%;
  @media (max-width: 600px) {
    display: none;
  }
`;

const recordBlink = keyframes`
  0% {
    opacity: 0
  }
  50% {
    opacity: 1
  }
  100% {
    opacity: 0
  }
`;

const RecordDot = styled.div`
  background-color: #fd6767;
  height: 9px;
  width: 9px;
  border-radius: 100%;
  animation: ${recordBlink} 2s ease infinite;
  margin-right: 8px;
`;

function ScrollFade() {
  const baseCss = `
    position: absolute;
    left: 0;
    width: calc(100% - 4px);
    height: 10px;
  `;
  return (
    <Fragment>
      <div
        css={css`
          ${baseCss}
          top: 0;
          background: linear-gradient(
            to bottom,
            #ffffff,
            rgba(255, 255, 255, 0)
          );
        `}
      />
      <div
        css={css`
          ${baseCss}
          bottom: 0;
          background: linear-gradient(to top, #ffffff, rgba(255, 255, 255, 0));
        `}
      />
    </Fragment>
  );
}

export { CurrentlyOnCall };
