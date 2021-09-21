import React, { RefObject, useEffect, useRef, useState } from 'react';
import { elementScrollIntoViewPolyfill } from 'seamless-scroll-polyfill';
import { Footer } from '../../components/Footer';
import {
  ColorShiftSection,
  ColorShiftContainer,
} from '../../components/ColorShiftContainer';

import {
  COLOR_DARK_LAVENDER,
  COLOR_DARK_PINK,
  COLOR_DARK_PURPLE,
  COLOR_GREEN,
  COLOR_MAROON,
  COLOR_PURPLE,
} from '../../components/MarketingPagesShared/styles';
import { HomeSignup } from '../HomePage/components/sections/HomeSignup';
import { rgbToRgbaString } from '../../modules/ColorUtils';
import { FeaturesNav } from './components/FeaturesNav';
import {
  FeaturesNavSectionsWrapper,
  Background,
  Menu,
  FeaturesSignupWrapper,
} from './styles';
import { FeaturesSectionURL, FeaturesSectionAnalyticsName } from './types';
import { events } from './events';
import {
  AnalyticsMarketingPageName,
  sharedEvents,
} from '../../components/MarketingPagesShared/events';
import { FeaturesHeroSection } from './sections/FeaturesHeroSection';
import { FeaturesHostingSection } from './sections/FeaturesHostingSection';
import { FeaturesAnalyticsSection } from './sections/FeaturesAnalyticsSection';
import { FeaturesMonetizationSection } from './sections/FeaturesMonetizationSection';
import { FeaturesCreationSection } from './sections/FeaturesCreationSection';
import { MarketingHeaderBackground } from '../../components/MarketingPagesShared/MarketingHeaderBackground';

type FeaturesSectionRefs = {
  [key in FeaturesSectionURL]?: RefObject<HTMLDivElement>;
};

const isFeaturesSectionUrl = (url: string): url is FeaturesSectionURL =>
  Object.values(FeaturesSectionURL).includes(url as FeaturesSectionURL);

const MENU_ITEMS = [
  {
    label: 'Hosting and Distribution',
    url: FeaturesSectionURL.HOSTING,
    analyticsName: FeaturesSectionAnalyticsName.HOSTING,
  },
  {
    label: 'Analytics',
    url: FeaturesSectionURL.ANALYTICS,
    analyticsName: FeaturesSectionAnalyticsName.ANALYTICS,
  },
  {
    label: 'Monetization',
    url: FeaturesSectionURL.MONETIZATION,
    analyticsName: FeaturesSectionAnalyticsName.MONETIZATION,
  },
  {
    label: 'Creation',
    url: FeaturesSectionURL.CREATION,
    analyticsName: FeaturesSectionAnalyticsName.CREATION,
  },
];

interface ColorShiftSectionMap {
  [key: number]: FeaturesSectionURL;
}

/**
 * Basically, some of the color shift sections we might be on don't map to a page
 * URL / hash, so this makes it easy to look up what the appropriate hash should
 * be as you scroll
 */
const COLORSHIFT_INDEX_TO_URL: ColorShiftSectionMap = {
  1: FeaturesSectionURL.HOSTING,
  2: FeaturesSectionURL.ANALYTICS,
  3: FeaturesSectionURL.MONETIZATION,
  4: FeaturesSectionURL.CREATION,
};

export const FeaturesScreen = ({ location }: { location: Location }) => {
  const { hash } = location;
  const [currentColor, setCurrentColor] = useState<string | null>(null);
  const [currentHash, setCurrentHash] = useState<
    FeaturesSectionURL | undefined
  >(isFeaturesSectionUrl(hash) ? hash : undefined);

  const sectionRefs: FeaturesSectionRefs = {
    [FeaturesSectionURL.HOSTING]: useRef<HTMLDivElement>(null),
    [FeaturesSectionURL.ANALYTICS]: useRef<HTMLDivElement>(null),
    [FeaturesSectionURL.MONETIZATION]: useRef<HTMLDivElement>(null),
    [FeaturesSectionURL.CREATION]: useRef<HTMLDivElement>(null),
  };

  const scrollToSection = (url: FeaturesSectionURL): void => {
    const ref = sectionRefs[url];
    if (!ref || !ref.current) {
      return;
    }
    ref.current.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    elementScrollIntoViewPolyfill();
    if (currentHash) {
      scrollToSection(currentHash);
    }
    // We only want this to happen once, on mount, so we bypass this check
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {currentColor && (
        <>
          <Background style={{ background: currentColor }} />
          <MarketingHeaderBackground color={currentColor} />
        </>
      )}
      <ColorShiftContainer
        onChange={({ color, currentSectionIndex }) => {
          setCurrentHash(COLORSHIFT_INDEX_TO_URL[currentSectionIndex]);
          setCurrentColor(rgbToRgbaString(color));
        }}
      >
        <ColorShiftSection color={COLOR_DARK_PURPLE}>
          <FeaturesHeroSection />
        </ColorShiftSection>
        <FeaturesNavSectionsWrapper>
          <Menu>
            <FeaturesNav
              items={MENU_ITEMS}
              selectedUrl={currentHash}
              onNav={({ url, analyticsName }) => {
                scrollToSection(url);
                events.clickNav(analyticsName);
              }}
              backgroundColor={currentColor}
            />
          </Menu>
          <main>
            <ColorShiftSection
              color={COLOR_MAROON}
              ref={sectionRefs[FeaturesSectionURL.HOSTING]}
            >
              <FeaturesHostingSection />
            </ColorShiftSection>
            <ColorShiftSection
              color={COLOR_DARK_PINK}
              ref={sectionRefs[FeaturesSectionURL.ANALYTICS]}
            >
              <FeaturesAnalyticsSection />
            </ColorShiftSection>
            <ColorShiftSection
              color={COLOR_GREEN}
              ref={sectionRefs[FeaturesSectionURL.MONETIZATION]}
            >
              <FeaturesMonetizationSection />
            </ColorShiftSection>
            <ColorShiftSection
              color={COLOR_DARK_LAVENDER}
              ref={sectionRefs[FeaturesSectionURL.CREATION]}
            >
              <FeaturesCreationSection />
            </ColorShiftSection>
          </main>
        </FeaturesNavSectionsWrapper>
        <ColorShiftSection color={COLOR_PURPLE}>
          <FeaturesSignupWrapper>
            <HomeSignup
              onClickGetStarted={() =>
                sharedEvents.clickGetStartedCTA(
                  AnalyticsMarketingPageName.FEATURES
                )
              }
              onClickSwitch={() =>
                sharedEvents.clickSwitchToAnchorLink(
                  AnalyticsMarketingPageName.FEATURES
                )
              }
            >
              <Footer />
            </HomeSignup>
          </FeaturesSignupWrapper>
        </ColorShiftSection>
      </ColorShiftContainer>
    </>
  );
};
