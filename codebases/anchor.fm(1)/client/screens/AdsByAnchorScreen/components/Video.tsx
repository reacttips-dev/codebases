import React from 'react';
import styled from '@emotion/styled';

import { COLOR_GREEN } from 'client/components/MarketingPagesShared/styles';
import { MarketingImage } from 'client/components/MarketingPagesShared/MarketingImage';
import { MarketingVideo } from 'client/components/MarketingPagesShared/MarketingVideo';
import { SCREEN_BREAKPOINTS } from '../constants';
import { AdsWaveSVG } from './Icons';

const TITLE = 'Ads by Anchor overview';
// Fake data until we have real data to show
const VIDEO_DATA = {
  description:
    'Man sitting on the front steps listening to music and recording into his phone',
  height: 546,
  imagePath: 'features/creation-music-integration',
  title: 'Anchor: Introducing shows with Spotify music',
  videoId: 'chMtuVpP7lk',
  width: 970,
};

const VideoSection = styled.section`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;

  @media (max-width: ${SCREEN_BREAKPOINTS.TABLET}px) {
    margin: 0 auto;
    width: 90%;
  }
`;

const VideoTitle = styled.h3`
  color: ${COLOR_GREEN};
  font-size: 6rem;
  line-height: 4.4rem;
  margin: 0 0 100px;
  text-align: center;

  @media (max-width: ${SCREEN_BREAKPOINTS.TABLET}px) {
    line-height: 1;
    margin: 0 0 50px;
  }

  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    font-size: 2.8rem;
    margin: 0 0 25px;
  }
`;

const VideoWrapper = styled.div`
  background: #24203f;
  margin: 0 auto;
  max-width: 1064px;
  width: 80%;
  z-index: 1;

  @media (max-width: ${SCREEN_BREAKPOINTS.TABLET}px) {
    width: 100%;
  }
`;

const AdsWaveSVGContainer = styled.div`
  height: 0;
  overflow: hidden;
  margin-top: calc(
    70vw * -0.3733
  ); // Pull element up by just under 3/4 of the height svg ratio
  margin-bottom: -5px;
  padding-bottom: calc(100vw * 0.3733); // SVG ratio;
  position: relative;
  width: 100vw;

  svg {
    height: 100%;
    position: absolute;
    width: 100%;
  }
`;

export const Video = () => {
  return (
    <VideoSection>
      <VideoTitle>{TITLE}</VideoTitle>
      <VideoWrapper>
        <MarketingVideo
          height={VIDEO_DATA.height}
          title={VIDEO_DATA.title}
          width={VIDEO_DATA.width}
          youTubeVideoId={VIDEO_DATA.videoId}
        >
          <MarketingImage
            alt={VIDEO_DATA.description}
            height={VIDEO_DATA.height}
            imagePath={VIDEO_DATA.imagePath}
            width={VIDEO_DATA.width}
          />
        </MarketingVideo>
      </VideoWrapper>
      <AdsWaveSVGContainer>
        <AdsWaveSVG />
      </AdsWaveSVGContainer>
    </VideoSection>
  );
};
