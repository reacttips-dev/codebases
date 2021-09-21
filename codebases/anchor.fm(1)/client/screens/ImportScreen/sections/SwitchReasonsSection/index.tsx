import styled from '@emotion/styled';
import { css } from '@emotion/core';
import React from 'react';
import {
  BREAKPOINT_SMALL,
  COLOR_DARK_PINK,
  COLOR_DARK_PURPLE,
  MarketingSection,
} from '../../../../components/MarketingPagesShared/styles';
import { CDN_PATH } from '../../constants';
import {
  ListHeader,
  ListText,
  ListItem,
  Title,
  DualColumns,
  List,
} from '../../../../components/MarketingPagesShared/DualColumnList';
import * as ThreeColumnList from '../../../../components/MarketingPagesShared/ThreeColumnList';

export function SwitchReasonsSection() {
  return (
    <SwitchReasonsDesktopBackground>
      <SwitchReasonsMobileBackground>
        <MarketingSection>
          <DualColumns>
            <Title>Why switch?</Title>
            <List>
              <ListItem>
                <ListHeader>
                  Get unparalleled insights, powered by Spotify
                </ListHeader>
                <ListText>
                  Improve your content using analytics from all platforms and
                  exclusive insights like episode dropoff and listener
                  demographics from Spotify.
                </ListText>
              </ListItem>
              <ListItem>
                <ListHeader>
                  Earn more with free hosting and monetization
                </ListHeader>
                <ListText>
                  Upload and store unlimited episodes for free, and unlock
                  sponsorships to feature audio ads—read by you—so you can earn
                  money on your podcast.
                </ListText>
              </ListItem>
              <ListItem>
                <ListHeader>
                  Focus more on creating, less on logistics
                </ListHeader>
                <ListText>
                  We can help with everything—from distribution to audience
                  growth and monetization. Plus, get ongoing support whenever
                  you need it.
                </ListText>
              </ListItem>
              <ListItem>
                <ListHeader>You control your podcast</ListHeader>
                <ListText>
                  You own all of your content, always. During the switch, your
                  podcast won’t experience any downtime, and you’ll keep all of
                  your subscribers in the process.
                </ListText>
              </ListItem>
            </List>
          </DualColumns>
        </MarketingSection>
      </SwitchReasonsMobileBackground>

      <MarketingSection>
        <ThreeColumnList.Title>
          You’ll notice a difference, but your listeners won’t notice a thing
        </ThreeColumnList.Title>
        <ThreeColumnList.List>
          <li>
            <ThreeColumnList.Header>
              Import your episodes
            </ThreeColumnList.Header>
            <ThreeColumnList.SecondaryText>
              Simply paste in your RSS feed, and we’ll import all of your
              episodes and metadata—no manual uploading required.
            </ThreeColumnList.SecondaryText>
          </li>
          <li>
            <ThreeColumnList.Header>Redirect your feed</ThreeColumnList.Header>
            <ThreeColumnList.SecondaryText>
              Redirecting will let your listeners hear new episodes, without
              affecting your subscribers on listening apps.
            </ThreeColumnList.SecondaryText>
          </li>
          <li>
            <ThreeColumnList.Header>Start creating</ThreeColumnList.Header>
            <ThreeColumnList.SecondaryText>
              Draft new episodes by uploading audio or using our built-in
              creation tools.
            </ThreeColumnList.SecondaryText>
          </li>
        </ThreeColumnList.List>
      </MarketingSection>
    </SwitchReasonsDesktopBackground>
  );
}

const backgroundImages = css`
  background-color: ${COLOR_DARK_PINK};
  background-image: url("${CDN_PATH}/bg-red.svg"), url("${CDN_PATH}/bg-purple.svg");
  background-repeat: repeat-x;
  // Chrome has a pixel-rounding error so sometimes the background doesn't
  // land on the bottom, this is a workaround for that
  background-position: left top, left calc(100% + 2px);
`;

const SwitchReasonsDesktopBackground = styled.section`
  @media (min-width: ${BREAKPOINT_SMALL}px) {
    ${backgroundImages};
    padding-top: 200px;
    padding-bottom: 200px;
  }
  @media (max-width: ${BREAKPOINT_SMALL}px) {
    background: ${COLOR_DARK_PURPLE};
    padding-top: 0;
    padding-bottom: 100px;
  }
`;

const SwitchReasonsMobileBackground = styled.section`
  @media (max-width: ${BREAKPOINT_SMALL}px) {
    ${backgroundImages};
    background-size: 1000px auto;
  }
`;
