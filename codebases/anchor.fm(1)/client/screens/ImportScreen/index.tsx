import { Global } from '@emotion/core';
import React, { useEffect, useRef, useState } from 'react';
import { elementScrollIntoViewPolyfill } from 'seamless-scroll-polyfill';
import { Footer } from '../../components/Footer';
import { HomeSignup } from '../HomePage/components/sections/HomeSignup';
import { SwitchHeroSection } from './sections/SwitchHeroSection';
import { ImportSection } from './sections/ImportSection';
import { SwitchReasonsSection } from './sections/SwitchReasonsSection';
import { SwitchQuotesSection } from './sections/SwitchQuotesSection';
import { SwitchVideoSection } from './sections/SwitchVideoSection';
import { events } from './events';
import {
  AnalyticsMarketingPageName,
  sharedEvents,
} from '../../components/MarketingPagesShared/events';
import {
  SwitchPageGlobalStyles,
  SwitchPage,
  ImportSectionBackground,
  SignupSectionBackground,
} from './styles';
import {
  ColorShiftContainer,
  ColorShiftSection,
} from '../../components/ColorShiftContainer';
import {
  COLOR_DARK_PURPLE,
  COLOR_PURPLE,
  COLOR_DARK_PINK,
  COLOR_MAROON,
} from '../../components/MarketingPagesShared/styles';
import { rgbToRgbaString } from '../../modules/ColorUtils';
import { MarketingHeaderBackground } from '../../components/MarketingPagesShared/MarketingHeaderBackground';

const ColorShiftContainerMemo = React.memo(ColorShiftContainer, () => true);

interface ImportScreenProps {
  autoFocusForm?: boolean;
}

export const ImportScreen = ({ autoFocusForm = false }: ImportScreenProps) => {
  const [currentColor, setCurrentColor] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  // Sadly the types don't match the react-bootstrap-typeahead library (never
  // have for certain properties like getInstance()), so we make this an "any".
  const inputRef = useRef<any>(null);

  const focusIntoSwitchInput = () => {
    const { current: currentInputRef } = inputRef;
    if (currentInputRef) {
      // https://github.com/ericgio/react-bootstrap-typeahead/blob/2.x/docs/Methods.md
      currentInputRef.getInstance().focus();
    }
  };

  const scrollFormIntoView = () => {
    const { current: currentFormRef } = formRef;
    if (!currentFormRef) {
      return;
    }
    currentFormRef.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    // There's no event that fires when the smooth scroll ends, and if we focus
    // first, the scroll moves there immediately, hence the timeout.
    setTimeout(() => {
      focusIntoSwitchInput();
    }, 1000);
  };

  const onSwitchButtonClick = () => {
    scrollFormIntoView();
    events.clickHeroCTA();
  };

  useEffect(() => {
    elementScrollIntoViewPolyfill();
  }, []);

  return (
    <>
      <Global styles={SwitchPageGlobalStyles} />
      {currentColor && <MarketingHeaderBackground color={currentColor} />}
      <SwitchPage>
        <ColorShiftContainerMemo
          onChange={({ color }) => setCurrentColor(rgbToRgbaString(color))}
        >
          <ColorShiftSection color={COLOR_MAROON}>
            <SwitchHeroSection onSwitchButtonClick={onSwitchButtonClick} />
          </ColorShiftSection>

          <ColorShiftSection color={COLOR_DARK_PINK}>
            <SwitchReasonsSection />
          </ColorShiftSection>

          <ColorShiftSection color={COLOR_DARK_PURPLE}>
            <ImportSectionBackground>
              <div ref={formRef} data-testid="switch-form">
                <ImportSection inputRef={inputRef} autoFocus={autoFocusForm} />
                <SwitchVideoSection
                  placeholderImagePath="switch/video-thumbnail"
                  youTubeVideoId="sg9wTQlt4vs"
                  placeholderImageAltText="A dimmed video thumbnail for the video: How to switch your podcast to Anchor"
                  videoTitle="How to switch your podcast to Anchor"
                />
              </div>
              <SwitchQuotesSection />
            </ImportSectionBackground>
          </ColorShiftSection>

          <ColorShiftSection color={COLOR_PURPLE}>
            <SignupSectionBackground>
              <HomeSignup
                showSwitchLink={false}
                onClickGetStarted={() =>
                  sharedEvents.clickGetStartedCTA(
                    AnalyticsMarketingPageName.SWITCH
                  )
                }
              >
                <Footer />
              </HomeSignup>
            </SignupSectionBackground>
          </ColorShiftSection>
        </ColorShiftContainerMemo>
      </SwitchPage>
    </>
  );
};

export const ImportScreenScrolledToForm = (props: ImportScreenProps) => (
  <ImportScreen autoFocusForm={true} {...props} />
);
