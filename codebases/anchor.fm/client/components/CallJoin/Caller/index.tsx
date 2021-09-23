import styled from '@emotion/styled';
import * as Sentry from '@sentry/browser';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import Icon from '../../../shared/Icon';
import { IconType } from '../../../shared/Icon/types';
import { ConnectDots } from '../ConnectDots';
import { Participant } from '../index';
import { SubscribeError } from '../types/errors';

type Props = Omit<Participant, 'podcastName'> & {
  session: any;
  stream: any;
  handleSubscribe: (isSubsribed: boolean) => void;
};
type SubscribeStatus = 'notInitialized' | 'subscribing' | 'success' | 'fail';

export function Caller({
  userId,
  deviceKind,
  displayName,
  isHost,
  isSelf,
  uuid,
  stream,
  session,
  handleSubscribe,
}: Props) {
  const [subscribeStatus, setSubscribeStatus] = useState<SubscribeStatus>(
    'notInitialized'
  );
  const retryTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  function subscribe() {
    setSubscribeStatus('subscribing');
    session.subscribe(stream, 'subscriber', {}, (err: SubscribeError) => {
      if (err) {
        Sentry.captureMessage(
          `subscriber error: Unable to subscribe to UUID: ${uuid}`
        );
        handleSubscribe(false);
        setSubscribeStatus('fail');
        retryTimeoutId.current = setTimeout(subscribe, 5000);
      } else {
        handleSubscribe(true);
        setSubscribeStatus('success');
      }
    });
  }

  useEffect(() => {
    // only subscribe to streams that are not yourself
    if (!isSelf) subscribe();
    return () => {
      if (retryTimeoutId.current !== null) {
        clearTimeout(retryTimeoutId.current);
      }
    };
  }, [isSelf]);

  function getConnectLabel() {
    if (subscribeStatus !== 'success') {
      return (
        <Fragment>
          <ConnectedLabelWrapper>Connecting</ConnectedLabelWrapper>
          <ConnectDots type="connecting" />
        </Fragment>
      );
    }
    return (
      <Fragment>
        <ConnectedLabelWrapper>Connected</ConnectedLabelWrapper>
        <ConnectDots type="connected" />
      </Fragment>
    );
  }

  function getSubText() {
    if (isHost && isSelf) return 'Host';
    if (isHost) {
      return (
        <Fragment>
          Host
          <SeparatorDot />
          {getConnectLabel()}
        </Fragment>
      );
    }
    if (isSelf) return 'You';
    return getConnectLabel();
  }

  const { fillColor, iconType, padding } = getIconProperties({
    userId,
    deviceKind,
  });

  return (
    <Container>
      <IconWrapper fillColor={fillColor} padding={padding}>
        {iconType !== null ? (
          <Icon type={iconType} fillColor="white" />
        ) : (
          <div />
        )}
      </IconWrapper>
      <NameContainer>
        <DisplayName>{displayName}</DisplayName>
        <SubTextWrapper>{getSubText()}</SubTextWrapper>
      </NameContainer>
    </Container>
  );
}

const SubTextWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ConnectedLabelWrapper = styled.span`
  display: inline-block;
  margin-right: 6px;
`;

const SeparatorDot = styled.span`
  display: inline-block;
  border-radius: 100%;
  width: 3px;
  height: 3px;
  background-color: #292f36;
  margin: 0 4px;
`;

const NameContainer = styled.div`
  padding-left: 24px;
  flex: 1;
  min-width: 0;
`;

const DisplayName = styled.h4`
  font-size: 2.2rem;
  font-weight: bold;
  color: #292f36;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Container = styled.div`
  display: flex;
  margin-bottom: 20px;
  padding-right: 20px;
`;

type FillColor = '#5000b9' | '#5499FE' | '#2CCFB2' | 'white';
type IconWrapperProps = {
  fillColor: FillColor;
  padding: string[];
};

const IconWrapper = styled.div<IconWrapperProps>`
  padding: ${(props: IconWrapperProps) => props.padding[0]};
  border-radius: 100%;
  background-color: ${(props: IconWrapperProps) => props.fillColor};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
    padding: ${(props: IconWrapperProps) => props.padding[1]};
  }
`;

function getIconProperties({
  userId,
  deviceKind,
}: Pick<Participant, 'userId' | 'deviceKind'>): {
  fillColor: FillColor;
  iconType: IconType | null;
  padding: string[];
} {
  if (userId) {
    return {
      fillColor: '#5000b9',
      iconType: 'anchor_logo',
      padding: ['14px', '12px'],
    };
  }
  if (deviceKind === 'mobile') {
    return {
      fillColor: '#5499FE',
      iconType: 'PhoneIcon',
      padding: ['16px', '14px'],
    };
  }
  if (deviceKind === 'desktop') {
    return {
      fillColor: '#2CCFB2',
      iconType: 'LaptopIcon',
      padding: ['14px', '12px'],
    };
  }
  return {
    fillColor: 'white',
    iconType: null,
    padding: ['0px', '0px'],
  };
}
