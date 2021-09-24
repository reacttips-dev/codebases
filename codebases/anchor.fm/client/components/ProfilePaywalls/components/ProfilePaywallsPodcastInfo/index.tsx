import { css } from 'emotion';
import styled from '@emotion/styled';
import React from 'react';
import { useBrowserSize } from '../../../../contexts/BrowserSize';
import { Metadata } from '../../../../types/Metadata';
import makeCaptionWithLinks from '../../../../makeCaptionWithLinks';
import {
  BORDER_RADIUS_LARGE,
  COLOR_MUTED_TEXT,
  MOBILE_BREAKPOINT,
  DEFAULT_LISTENER_MESSAGE,
  COLOR_MUTED_BACKGROUND,
  BORDER_RADIUS_DEFAULT,
} from '../../../PaywallsShared/constants';
import { ProfilePaywallsTruncatedText } from '../ProfilePaywallsTruncatedText';

const USER_MESSAGE_MAX_LINES_MOBILE = 2;
const USER_MESSAGE_MAX_LINES_DESKTOP = 6;
const COMPACT_DESCRIPTION_MAX_LINES = 2;

const mobileDefaultMessageClass = css`
  padding: 14px 14px 0 14px;
  margin-top: 10px;
`;

const getMessageView = (message?: string, isMobile: boolean = false) =>
  message ? (
    <PodcastUserMessage>
      <ProfilePaywallsTruncatedText
        numMaxLines={
          isMobile
            ? USER_MESSAGE_MAX_LINES_MOBILE
            : USER_MESSAGE_MAX_LINES_DESKTOP
        }
      >
        {message}
      </ProfilePaywallsTruncatedText>
    </PodcastUserMessage>
  ) : (
    <PodcastDescription
      className={isMobile ? mobileDefaultMessageClass : undefined}
    >
      {DEFAULT_LISTENER_MESSAGE}
    </PodcastDescription>
  );

export const ProfilePaywallsPodcastInfo = ({
  podcastMetadata,
  isCompact = false,
}: {
  podcastMetadata: Metadata;
  isCompact?: boolean;
}) => {
  const {
    podcastName,
    podcastImage,
    podcastDescription,
    stationPaywall,
  } = podcastMetadata;
  const { listenerMessage } = stationPaywall || {};
  const { width } = useBrowserSize();
  const isMobileWidth = width <= MOBILE_BREAKPOINT;
  const showListenerMessage = !isCompact;
  const maxDescriptionLines =
    isMobileWidth && isCompact ? COMPACT_DESCRIPTION_MAX_LINES : 100;

  return (
    <section>
      <PodcastContainer>
        {podcastImage && (
          <PodcastCoverContainer>
            <PodcastCover>
              <img src={podcastImage} alt={`Cover for ${podcastName}`} />
            </PodcastCover>
          </PodcastCoverContainer>
        )}
        <PodcastInfo>
          <PodcastName>{podcastName}</PodcastName>
          {podcastDescription && (
            <PodcastDescription>
              <ProfilePaywallsTruncatedText numMaxLines={maxDescriptionLines}>
                {makeCaptionWithLinks(podcastDescription)}
              </ProfilePaywallsTruncatedText>
            </PodcastDescription>
          )}
          {showListenerMessage &&
            !isMobileWidth &&
            getMessageView(listenerMessage)}
        </PodcastInfo>
      </PodcastContainer>
      {showListenerMessage &&
        isMobileWidth &&
        getMessageView(listenerMessage, true)}
    </section>
  );
};

const PodcastName = styled.div`
  font-size: 2.2rem;
  font-weight: bold;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    font-size: 1.6rem;
  }
`;

const PodcastDescription = styled.div`
  font-size: 1.4rem;
  color: ${COLOR_MUTED_TEXT};
  margin: 5px 0;
`;

const PodcastCoverContainer = styled.div`
  margin-right: 10px;
  width: 156px;

  @media (max-width: ${MOBILE_BREAKPOINT}px) {
    min-width: 48px;
    width: 25%;
  }
`;

const PodcastUserMessage = styled.div`
  font-size: 1.4rem;
  color: ${COLOR_MUTED_TEXT};
  background: ${COLOR_MUTED_BACKGROUND};
  border-radius: ${BORDER_RADIUS_DEFAULT};
  padding: 14px;
  margin-top: 10px;
  font-style: italic;
`;

// padding-bottom 100% means 1:1 ratio
const PodcastCover = styled.div`
  padding-bottom: 100%;
  position: relative;

  img {
    position: absolute;
    border-radius: ${BORDER_RADIUS_LARGE};
    top: 0;
    left: 0;
    width: 100%;
  }
`;

const PodcastContainer = styled.div`
  display: flex;
`;

const PodcastInfo = styled.div`
  flex: 1;
`;
