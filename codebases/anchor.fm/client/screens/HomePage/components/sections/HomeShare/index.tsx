import React from 'react';
import {
  MarketingImage,
  MarketingImageType,
} from '../../../../../components/MarketingPagesShared/MarketingImage';
import { MarketingBoldLink } from '../../../../../components/MarketingPagesShared/styles';
import { HomeSectionTitle } from '../../../styles';
import { HomeSectionWithBackground } from '../../HomeSectionWithBackground';

export function HomeShare({ onClickCTA }: { onClickCTA?: () => void }) {
  return (
    <HomeSectionWithBackground
      backgroundImagePath="bg-share.svg"
      textColumn={
        <>
          <HomeSectionTitle>
            <strong>
              Distribute your podcast to the most popular listening apps,
              including Spotify with just a single tap
            </strong>
            &#8212;and host unlimited content completely free, forever.
          </HomeSectionTitle>
          <MarketingBoldLink to="/features#hosting" onClick={onClickCTA}>
            See all hosting and distribution features
          </MarketingBoldLink>
        </>
      }
      imageColumn={
        <MarketingImage
          width={574}
          height={520}
          imagePath="home/distribution"
          imageType={MarketingImageType.PNG}
          alt="Athena Calderone from the More Than One Thing podcast next to Spotify, Pocket Casts, Google Podcasts, Overcast and Apple Podcasts icons"
        />
      }
    />
  );
}
