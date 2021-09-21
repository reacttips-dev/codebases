import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { HomeSection } from '../../../styles';
import {
  BREAKPOINT_SMALL,
  DEFAULT_MOBILE_PADDING,
  MarketingAnchor,
  MarketingBoldLink,
} from '../../../../../components/MarketingPagesShared/styles';
import { MarketingButton } from '../../../../../components/MarketingPagesShared/MarketingButton';

export function HomeSignup({
  showSwitchLink = true,
  onClickGetStarted,
  onClickSwitch,
  children,
}: {
  showSwitchLink?: boolean;
  onClickGetStarted?: () => void;
  onClickSwitch?: () => void;
  children?: ReactNode;
}) {
  return (
    <HomeSignupBackground>
      <HomeSection>
        <HomeSignupContainer>
          <HomeSignupHeader>
            For everyone, everywhere, for free
          </HomeSignupHeader>
          <HomeSignupText>
            We believe everyone’s stories can and should be heard, so we’re
            giving creators around the world—from first-time podcasters to
            pros—a powerful platform to{' '}
            <MarketingAnchor
              href="https://blog.anchor.fm/updates/why-podcasting-is-free-with-anchor"
              target="_blank"
              rel="noopener noreferrer"
            >
              share their voices
            </MarketingAnchor>
            .
          </HomeSignupText>
          <HomeSignupButton>
            <MarketingButton kind="link" href="/signup" onClick={onClickGetStarted}>
              Get started
            </MarketingButton>
          </HomeSignupButton>
          {showSwitchLink && (
            <HomeSignupFooter>
              Already have a podcast?{' '}
              <MarketingBoldLink to="/switch" onClick={onClickSwitch}>
                Switch to Anchor
              </MarketingBoldLink>
            </HomeSignupFooter>
          )}
        </HomeSignupContainer>
      </HomeSection>
      {children}
    </HomeSignupBackground>
  );
}

const HomeSignupBackground = styled.div`
  background-image: url("data:image/svg+xml,%3Csvg width='1439' height='854' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M610.426 309.724l3.041 1.162c269.775 102.588 545.422 162.068 817.671 180.18l7.862.511V856l-46.656-44.162c-219.777-201.592-479.439-368.897-769.1-496.505l-8.876-3.894-3.942-1.715zM0 0c149.493 96.279 309.748 182.495 480 256.44l-1.28-.557-3.025-1.158C321.007 195.645 164.951 149.88 9.27 115.908l-4.815-1.047L0 113.899V0z' fill='%23FFF' fill-rule='nonzero' fill-opacity='.35'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: 100% 100%;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    background-size: 100% auto;
    background-position: center top;
  }
`;

const HomeSignupContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  padding-top: 280px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    width: auto;
    padding: 0 ${DEFAULT_MOBILE_PADDING}px 0 ${DEFAULT_MOBILE_PADDING}px;
  }
`;

const HomeSignupHeader = styled.h3`
  font-size: 6.4rem;
  line-height: 1.15;
  font-weight: 800;
  margin-bottom: 40px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    font-size: 4rem;
  }
`;

const HomeSignupText = styled.p`
  font-size: 2rem;
  line-height: 1.5;
  color: inherit;
  margin-bottom: 40px;
  width: 80%;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    width: auto;
  }
`;

const HomeSignupButton = styled.div`
  margin-bottom: 30px;
`;

const HomeSignupFooter = styled.div`
  font-weight: bold;
`;
