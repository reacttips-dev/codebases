import styled from '@emotion/styled';
import React, { useEffect, useState, memo } from 'react';
import { CDN_PATH } from '../../constants';
import {
  BREAKPOINT_SMALL,
  DEFAULT_DESKTOP_PADDING,
  DEFAULT_MOBILE_PADDING,
  MarketingHeading1,
  MAX_WIDTH,
} from '../../../../components/MarketingPagesShared/styles';
import { getFormattedTimestamp } from '../../../../modules/Time';
import { HeroPhone } from '../../components/HeroPhone';

function FeaturesHeroSectionView() {
  const [seconds, setSeconds] = useState<number>(173);
  const text = getFormattedTimestamp(seconds * 1000, {
    roundMilliseconds: true,
    omitZeroHours: true,
  });

  useEffect(() => {
    const intervalId = setInterval(
      () => setSeconds(stateSeconds => stateSeconds + 1),
      1000
    );
    return () => clearInterval(intervalId);
    // We only want this to happen once, on mount, so we bypass this check
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FeaturesHeroContainer>
      <HeroTitle>Tools to power any podcast</HeroTitle>
      <HeroBackgroundContainer>
        <HeroPhoneContainer>
          <HeroPhone text={text} width="100%" />
        </HeroPhoneContainer>
      </HeroBackgroundContainer>
    </FeaturesHeroContainer>
  );
}

export const FeaturesHeroSection = memo(FeaturesHeroSectionView);

const HeroTitle = styled(MarketingHeading1)`
  margin: 0;
  padding: 0;
  color: white;
  padding: ${DEFAULT_DESKTOP_PADDING / 2}px ${DEFAULT_DESKTOP_PADDING}px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    padding: ${DEFAULT_MOBILE_PADDING * 2}px ${DEFAULT_MOBILE_PADDING}px;
  }
`;

const FeaturesHeroContainer = styled.div`
  max-width: ${MAX_WIDTH}px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    text-align: left;
  }
`;

const HeroBackgroundContainer = styled.div`
  background-image: url("${CDN_PATH}/hero-bg.svg");
  background-repeat: repeat-x;
  background-position: center 45%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    background-size: 1000px;
  }
`;

const HeroPhoneContainer = styled.div`
  width: 100%;
  max-width: 350px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    padding: 0 50px;
  }
`;
