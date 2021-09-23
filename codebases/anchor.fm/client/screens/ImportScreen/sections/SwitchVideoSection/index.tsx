import { css } from 'emotion';
import styled from '@emotion/styled';
import React from 'react';
import { MarketingImage } from '../../../../components/MarketingPagesShared/MarketingImage';
import { MarketingVideo } from '../../../../components/MarketingPagesShared/MarketingVideo';
import {
  BREAKPOINT_SMALL,
  MarketingBoldAnchor,
  MarketingSection,
} from '../../../../components/MarketingPagesShared/styles';

export function SwitchVideoSection({
  hideLearnMore = false,
  isFullWidth = false,
  marginBottom = [200, 125],
  youTubeVideoId,
  placeholderImagePath,
  placeholderImageAltText,
  videoTitle,
}: {
  hideLearnMore?: boolean;
  isFullWidth?: boolean;
  marginBottom?: [number, number];
  youTubeVideoId: string;
  placeholderImagePath: string;
  placeholderImageAltText: string;
  videoTitle: string;
}) {
  const width = 700;
  const height = 393;
  return (
    <SwitchPageVideoContainer
      className={css`
        margin-bottom: ${marginBottom[0]}px !important;
        @media (max-width: ${BREAKPOINT_SMALL}px) {
          margin-bottom: ${marginBottom[1]}px !important;
        }
      `}
    >
      <SwitchPageVideoWrapper isFullWidth={isFullWidth}>
        <MarketingVideo
          width={width}
          height={height}
          title={videoTitle}
          youTubeVideoId={youTubeVideoId}
        >
          <MarketingImage
            width={width}
            height={height}
            alt={placeholderImageAltText}
            imagePath={placeholderImagePath}
          />
        </MarketingVideo>
        {!hideLearnMore && (
          <SwitchPageVideoAnchor
            href="https://help.anchor.fm/hc/en-us/articles/360023100411-Switching-your-podcast-to-Anchor"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about how switching works.
          </SwitchPageVideoAnchor>
        )}
      </SwitchPageVideoWrapper>
    </SwitchPageVideoContainer>
  );
}

const SwitchPageVideoAnchor = styled(MarketingBoldAnchor)`
  display: inline-block;
  margin-top: 10px;
`;

const SwitchPageVideoWrapper = styled.div<{ isFullWidth: boolean }>`
  width: ${({ isFullWidth }) => (isFullWidth ? '100%' : '70%')};

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    width: 100%;
  }
`;

const SwitchPageVideoContainer = styled(MarketingSection)`
  display: flex;
  justify-content: center;
`;
