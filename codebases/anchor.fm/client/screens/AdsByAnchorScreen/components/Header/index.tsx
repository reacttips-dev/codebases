import React from 'react';
import styled from '@emotion/styled';

import { COLOR_GREEN } from 'client/components/MarketingPagesShared/styles';
import { IMAGES_MAP } from './constants';
import { SCREEN_BREAKPOINTS } from '../../constants';
import { HeaderWaveIcon } from '../Icons';
import { HeaderContent, HeaderImage } from './components';

const HeaderSection = styled.section`
  background: ${COLOR_GREEN};
  margin-bottom: 200px;
  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    margin-bottom: 100px;
  }
`;
const HeaderTopContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  max-width: 1440px;
  padding: 10px 5%;
  width: 100%;
  @media (max-width: ${SCREEN_BREAKPOINTS.SMALL_DESKTOP}px) {
    > div:first-child,
    > div:last-child {
      display: none;
    }
  }
  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    padding: 10px 5% 20px;
  }
`;
const HeaderBottomContainer = styled.div`
  height: 0;
  padding: 0 0 13.06%; // Ratio of SVG
  position: relative;
  width: 100%;

  svg {
    bottom: 0;
    height: calc(100% + 2px);
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
`;
const HeaderBottomImagesContainer = styled.div`
  display: flex;
  height: calc(100vw * 0.1306);
  justify-content: space-between;
  margin: 0 auto;
  max-width: 1400px;
  padding: 0 10%;
  width: 100%;
  @media (max-width: ${SCREEN_BREAKPOINTS.SMALL_DESKTOP}px) {
    padding: 0 5%;
  }
  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    > div:nth-child(2) {
      display: none;
    }
  }
`;

export const Header = () => {
  return (
    <HeaderSection>
      <HeaderTopContainer>
        <HeaderImage image={IMAGES_MAP.headerOne} />
        <HeaderContent />
        <HeaderImage image={IMAGES_MAP.headerTwo} />
      </HeaderTopContainer>
      <HeaderBottomContainer>
        <HeaderBottomImagesContainer>
          <HeaderImage image={IMAGES_MAP.headerThree} />
          <HeaderImage image={IMAGES_MAP.headerFour} />
          <HeaderImage image={IMAGES_MAP.headerFive} />
        </HeaderBottomImagesContainer>
        <HeaderWaveIcon />
      </HeaderBottomContainer>
    </HeaderSection>
  );
};
