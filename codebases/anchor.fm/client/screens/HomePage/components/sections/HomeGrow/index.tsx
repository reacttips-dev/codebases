import React from 'react';
import {
  MarketingImage,
  MarketingImageType,
} from '../../../../../components/MarketingPagesShared/MarketingImage';
import { MarketingBoldLink } from '../../../../../components/MarketingPagesShared/styles';
import {
  HomeImageCaption,
  HomeSectionTitle,
  HomeIconedCaption,
} from '../../../styles';
import { HomeSectionWithBackground } from '../../HomeSectionWithBackground';
import { GrowIcon } from '../../icons/GrowIcon';

export function HomeGrow({ onClickCTA }: { onClickCTA?: () => void }) {
  return (
    <HomeSectionWithBackground
      backgroundImagePath="bg-grow.svg"
      textColumn={
        <>
          <HomeSectionTitle>
            <strong>Advanced analytics and insights</strong> to help you
            understand and grow your audience.
          </HomeSectionTitle>
          <MarketingBoldLink to="/features#analytics" onClick={onClickCTA}>
            See all analytics features{' '}
          </MarketingBoldLink>
        </>
      }
      imageColumn={
        <>
          <MarketingImage
            width={574}
            height={520}
            imagePath="home/grow"
            imageType={MarketingImageType.PNG}
            alt="Athena Calderone from the More Than One Thing podcast on her laptop with headphones on"
          />
          <HomeIconedCaption>
            <GrowIcon />
            <HomeImageCaption>
              <strong>“More Than One Thing”</strong> has 25k unique listeners
              with 2M+ all-time plays.
            </HomeImageCaption>
          </HomeIconedCaption>
        </>
      }
    />
  );
}
