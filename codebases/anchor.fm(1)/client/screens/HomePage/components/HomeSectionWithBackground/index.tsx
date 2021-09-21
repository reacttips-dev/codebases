import styled from '@emotion/styled';
import React, { ReactElement } from 'react';
import { BREAKPOINT_SMALL } from '../../../../components/MarketingPagesShared/styles';
import { CDN_PATH } from '../../constants';
import {
  HomeColumns,
  HomeImageColumn,
  HomeSection,
  HomeTextColumn,
} from '../../styles';

export function HomeSectionWithBackground({
  backgroundImagePath,
  textColumn,
  imageColumn,
}: {
  backgroundImagePath: string;
  textColumn: ReactElement;
  imageColumn: ReactElement;
}) {
  const backgroundUrl = `${CDN_PATH}/${backgroundImagePath}`;
  return (
    <HomeSectionDesktopBackground url={backgroundUrl}>
      <HomeSection>
        <HomeColumns>
          <HomeTextColumn>{textColumn}</HomeTextColumn>
          <HomeSectionMobileBackground url={backgroundUrl}>
            <HomeImageColumn>{imageColumn}</HomeImageColumn>
          </HomeSectionMobileBackground>
        </HomeColumns>
      </HomeSection>
    </HomeSectionDesktopBackground>
  );
}

const HomeSectionDesktopBackground = styled.div<{ url: string }>`
  @media (min-width: ${BREAKPOINT_SMALL}px) {
    background-image: ${({ url }) => `url('${url}');`};
    background-repeat: repeat-x;
  }
`;

const HomeSectionMobileBackground = styled.div<{ url: string }>`
  align-self: center;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    background-image: ${({ url }) => `url('${url}');`};
    background-repeat: repeat-x;
    background-position: -100px 0;
    padding-top: 80px;
  }
`;
