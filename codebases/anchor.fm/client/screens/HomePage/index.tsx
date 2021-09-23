import React, { useState } from 'react';
import { Footer } from '../../components/Footer';
import {
  ColorShiftSection,
  ColorShiftContainer,
} from '../../components/ColorShiftContainer';
import { HomeHero } from './components/sections/HomeHero';
import { HomeCreate } from './components/sections/HomeCreate';
import { HomeShare } from './components/sections/HomeShare';
import { HomeMonetize } from './components/sections/HomeMonetize';
import { HomeGrow } from './components/sections/HomeGrow';
import { HomeSignup } from './components/sections/HomeSignup';
import { HomeTitleSuggestions } from './components/sections/HomeTitleSuggestions';
import {
  COLOR_DARK_LAVENDER,
  COLOR_DARK_PINK,
  COLOR_DARK_PURPLE,
  COLOR_GREEN,
  COLOR_MAROON,
  COLOR_PURPLE,
} from '../../components/MarketingPagesShared/styles';
import { rgbToRgbaString } from '../../modules/ColorUtils';
import { events } from './events';
import { FeaturesSectionAnalyticsName } from '../FeaturesScreen/types';
import {
  AnalyticsMarketingPageName,
  sharedEvents,
} from '../../components/MarketingPagesShared/events';
import { Background } from './styles';
import { MarketingHeaderBackground } from '../../components/MarketingPagesShared/MarketingHeaderBackground';

// Quick way to prevent setState from re-rendering unnecessarily
const ColorShiftContainerMemo = React.memo(ColorShiftContainer, () => true);

export const HomePage = () => {
  const [currentColor, setCurrentColor] = useState<string | null>(null);

  return (
    <>
      {currentColor && (
        <>
          <Background style={{ background: currentColor }} />
          <MarketingHeaderBackground color={currentColor} />
        </>
      )}
      <ColorShiftContainerMemo
        onChange={({ color }) => setCurrentColor(rgbToRgbaString(color))}
      >
        <ColorShiftSection color={COLOR_DARK_PURPLE}>
          <HomeHero />
        </ColorShiftSection>
        <ColorShiftSection color={COLOR_DARK_LAVENDER}>
          <HomeCreate
            onClickCTA={() =>
              events.clickFeatureCTA(FeaturesSectionAnalyticsName.CREATION)
            }
          />
        </ColorShiftSection>
        <ColorShiftSection color={COLOR_MAROON}>
          <HomeShare
            onClickCTA={() =>
              events.clickFeatureCTA(FeaturesSectionAnalyticsName.HOSTING)
            }
          />
        </ColorShiftSection>
        <ColorShiftSection color={COLOR_GREEN}>
          <HomeMonetize
            onClickCTA={() =>
              events.clickFeatureCTA(FeaturesSectionAnalyticsName.MONETIZATION)
            }
          />
        </ColorShiftSection>
        <ColorShiftSection color={COLOR_DARK_PINK}>
          <HomeGrow
            onClickCTA={() =>
              events.clickFeatureCTA(FeaturesSectionAnalyticsName.ANALYTICS)
            }
          />
        </ColorShiftSection>
        <ColorShiftSection color={COLOR_DARK_PURPLE}>
          <HomeTitleSuggestions
            onClickCTA={() => events.clickMakeYourOwnPodcastCTA()}
          />
        </ColorShiftSection>
        <ColorShiftSection color={COLOR_PURPLE}>
          <HomeSignup
            onClickGetStarted={() =>
              sharedEvents.clickGetStartedCTA(AnalyticsMarketingPageName.HOME)
            }
            onClickSwitch={() =>
              sharedEvents.clickSwitchToAnchorLink(
                AnalyticsMarketingPageName.HOME
              )
            }
          >
            <Footer />
          </HomeSignup>
        </ColorShiftSection>
      </ColorShiftContainerMemo>
    </>
  );
};
