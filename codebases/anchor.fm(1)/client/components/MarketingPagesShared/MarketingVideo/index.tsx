import styled from '@emotion/styled';
import React, { ReactNode, useState } from 'react';

import { EmbeddedYoutubeVideo } from '../../EmbeddedYoutubeVideo';
import { DEFAULT_DROP_SHADOW } from '../styles';
import { MarketingVideoPlayIcon } from './MarketingVideoPlayIcon';

export const MarketingVideo = ({
  width,
  height,
  youTubeVideoId,
  title,
  children,
  isDropShadowed = true,
}: {
  width: number;
  height: number;
  youTubeVideoId: string;
  children: ReactNode;
  title: string;
  isDropShadowed?: boolean;
}) => {
  const [showVideo, toggleVideo] = useState(false);
  const ratio = height / width;
  if (showVideo)
    return (
      <MarketingVideoWrapper isDropShadowed={isDropShadowed}>
        <EmbeddedYoutubeVideo
          title={title}
          youtubeVideoId={youTubeVideoId}
          paddingBottomOffset={`${Math.floor(ratio * 100)}%`}
          youtubeEmbedParameters={{
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            loop: 1,
            cc_load_policy: 1,
            mute: 1,
            rel: 0,
          }}
        />
      </MarketingVideoWrapper>
    );
  return (
    <MarketingVideoContainer
      onClick={() => toggleVideo(true)}
      aria-label={`Play ${title}`}
    >
      {children}
      <MarketingVideoIconContainer>
        <MarketingVideoPlayIcon width="max(48px, 12%)" />
      </MarketingVideoIconContainer>
    </MarketingVideoContainer>
  );
};

const MarketingVideoContainer = styled.button`
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  position: relative;

  &:focus {
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: black;
      opacity: 0.2;
      z-index: 0;
    }
  }
`;

const MarketingVideoWrapper = styled.div<{ isDropShadowed: boolean }>`
  box-shadow: ${({ isDropShadowed }) =>
    isDropShadowed ? DEFAULT_DROP_SHADOW : 0};
`;

const MarketingVideoIconContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
