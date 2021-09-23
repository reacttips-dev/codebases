import React from 'react';
import { MarketingImage } from '../../../../../components/MarketingPagesShared/MarketingImage';
import { MarketingBoldLink } from '../../../../../components/MarketingPagesShared/styles';
import {
  HomeImageCaption,
  HomeSectionTitle,
  HomeIconedCaption,
} from '../../../styles';
import { HomeSectionWithBackground } from '../../HomeSectionWithBackground';
import { MonetizeIcon } from '../../icons/MonetizeIcon';

export function HomeMonetize({ onClickCTA }: { onClickCTA?: () => void }) {
  return (
    <HomeSectionWithBackground
      backgroundImagePath="bg-monetize.svg"
      textColumn={
        <>
          <HomeSectionTitle>
            <strong>Unlock sponsorships or set up a subscription</strong> so you
            can make money as your audience grows.
          </HomeSectionTitle>
          <MarketingBoldLink to="/features#monetization" onClick={onClickCTA}>
            See all monetization features
          </MarketingBoldLink>
        </>
      }
      imageColumn={
        <>
          <MarketingImage
            width={520}
            height={520}
            imagePath="home/monetize"
            alt="Athena Calderone from the More Than One Thing podcast tending to her plants at home"
          />
          <HomeIconedCaption>
            <MonetizeIcon />
            <HomeImageCaption>
              <strong>“More Than One Thing”</strong> has matched with multiple
              brand campaigns through Sponsorships.
            </HomeImageCaption>
          </HomeIconedCaption>
        </>
      }
    />
  );
}
