import styled from '@emotion/styled';
import React from 'react';
import { MarketingImage } from '../../../../components/MarketingPagesShared/MarketingImage';
import {
  BREAKPOINT_SMALL,
  BREAKPOINT_MEDIUM,
  DEFAULT_MOBILE_PADDING,
  MarketingHeading1,
  MarketingSection,
} from '../../../../components/MarketingPagesShared/styles';
import { Button } from '../../../../shared/Button/NewButton';

export function SwitchHeroSection({
  onSwitchButtonClick,
}: {
  onSwitchButtonClick?: () => void;
}) {
  return (
    <>
      <SwitchHeroPrimary>
        <SwitchHeroPrimaryText>
          <SwitchHeroTitle>
            Powering <br /> the most podcasts worldwide
          </SwitchHeroTitle>
          <Button onClick={onSwitchButtonClick} color="onDark">
            Switch in less than 5 minutes
          </Button>
        </SwitchHeroPrimaryText>
        <SwitchHeroPrimaryImages>
          <SwitchHeroGrid>
            <SwitchHeroGridImage>
              <MarketingImage
                imagePath="switch/hero/ugly-duck-cover"
                alt="‎P.K. Subban's Ugly Duck podcast cover"
                width={260}
                height={260}
              />
            </SwitchHeroGridImage>
            <SwitchHeroGridImage>
              <MarketingImage
                imagePath="switch/hero/the-garyvee-audio-experience-cover"
                alt="‎The Garyvee Audio Experience podcast cover"
                width={260}
                height={260}
              />
            </SwitchHeroGridImage>
            <SwitchHeroGridImage>
              <MarketingImage
                imagePath="switch/hero/a24-cover"
                alt="A24 podcast cover"
                width={260}
                height={260}
              />
            </SwitchHeroGridImage>
          </SwitchHeroGrid>
        </SwitchHeroPrimaryImages>
      </SwitchHeroPrimary>
      <SwitchHeroSecondary>
        <SwitchHeroSecondaryImages>
          <SwitchHeroGrid>
            <SwitchHeroGridImageReversedOnNarrow>
              <MarketingImage
                imagePath="switch/hero/office-hours-live-cover"
                alt="Office Hours Live with Tim Heidecker podcast cover"
                width={260}
                height={260}
              />
            </SwitchHeroGridImageReversedOnNarrow>
            <SwitchHeroGridImageReversedOnNarrow>
              <MarketingImage
                imagePath="switch/hero/better-together-cover"
                alt="Better Together w/ Maria Menounos podcast cover"
                width={260}
                height={260}
              />
            </SwitchHeroGridImageReversedOnNarrow>
          </SwitchHeroGrid>
        </SwitchHeroSecondaryImages>
        <SwitchHeroSecondaryText>
          With free hosting and tools for every experience level, 80% of new
          podcasts get created on Anchor. Switching is seamless—and free.
        </SwitchHeroSecondaryText>
      </SwitchHeroSecondary>
    </>
  );
}

const SwitchHeroGrid = styled.div`
  display: flex;
  flex-direction: column;
  // In SwitchHeroSecondaryImages, the parent container becomes a flex layout
  // and we need this child to take up all available space
  flex: 1;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    max-width: 66%;
  }
`;

const SwitchHeroGridImage = styled.div`
  width: 50%;

  &:nth-of-type(even) {
    align-self: flex-end;
  }
`;

const SwitchHeroGridImageReversedOnNarrow = styled.div`
  width: 50%;

  &:nth-of-type(even) {
    align-self: flex-end;
  }

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    &:nth-of-type(odd) {
      align-self: flex-end;
    }
    &:nth-of-type(even) {
      align-self: flex-start;
    }
  }
`;

const SwitchHeroPrimary = styled(MarketingSection)`
  display: grid;
  grid-template-columns: 2fr minmax(300px, 1fr);
  grid-column-gap: 45px;
  grid-row-gap: 45px;
  padding-bottom: 35px;

  @media (min-width: ${BREAKPOINT_SMALL}px) {
    padding-right: 0;
  }

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    grid-template-columns: 1fr;
  }
`;

const SwitchHeroPrimaryText = styled.div`
  align-self: center;
`;

const SwitchHeroPrimaryImages = styled.div`
  @media (max-width: ${BREAKPOINT_SMALL}px) {
    margin-left: -${DEFAULT_MOBILE_PADDING}px;
  }
`;

const SwitchHeroSecondaryImages = styled.div`
  @media (max-width: ${BREAKPOINT_SMALL}px) {
    display: flex;
    justify-content: flex-end;
    margin-right: -${DEFAULT_MOBILE_PADDING}px;
  }
`;

const SwitchHeroTitle = styled(MarketingHeading1)`
  margin: 50px 0 100px 0;

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    br {
      display: none;
    }
  }

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    font-size: 4.8rem;
    margin: 45px 0;
  }
`;

const SwitchHeroSecondary = styled(MarketingSection)`
  display: grid;
  grid-template-columns: minmax(300px, 1fr) 2fr;
  grid-column-gap: 45px;
  grid-row-gap: 45px;

  @media (min-width: ${BREAKPOINT_SMALL}px) {
    padding-left: 0;
  }

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    padding-right: ${DEFAULT_MOBILE_PADDING}px;
    padding-bottom: 80px;
  }

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    display: flex;
    flex-direction: column-reverse;
    grid-row-gap: 0;
  }
`;

const SwitchHeroSecondaryText = styled.p`
  align-self: flex-end;
  color: white;
  font-size: 3.6rem;
  line-height: 1.2;
  width: 75%;
  margin-left: 20%;

  @media (max-width: ${BREAKPOINT_MEDIUM}px) {
    width: auto;
    margin-left: 20px;
  }

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    width: auto;
    font-size: 2.8rem;
    margin: 45px 0 20px;
  }
`;
