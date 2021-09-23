import React from 'react';
import { MarketingImage } from '../../../../../components/MarketingPagesShared/MarketingImage';
import { MarketingBoldLink } from '../../../../../components/MarketingPagesShared/styles';
import {
  HomeImageCaption,
  HomeSectionTitle,
  HomeIconedCaption,
} from '../../../styles';
import { HomeSectionWithBackground } from '../../HomeSectionWithBackground';
import { CreateIcon } from '../../icons/CreateIcon';

export function HomeCreate({ onClickCTA }: { onClickCTA?: () => void }) {
  return (
    <HomeSectionWithBackground
      backgroundImagePath="bg-create.svg"
      textColumn={
        <>
          <HomeSectionTitle>
            <strong>Built-in uploading, recording, and editing tools</strong> so
            you can easily create and publish episodes.
          </HomeSectionTitle>
          <MarketingBoldLink to="/features#creation" onClick={onClickCTA}>
            See all creation features
          </MarketingBoldLink>
        </>
      }
      imageColumn={
        <>
          <MarketingImage
            width={520}
            height={520}
            imagePath="home/create"
            alt="Athena Calderone smiling and listening to the playback of a podcast on her phone"
          />
          <HomeIconedCaption>
            <CreateIcon />
            <HomeImageCaption>
              Athena Calderone records <strong>“More Than One Thing” </strong>
              from home.
            </HomeImageCaption>
          </HomeIconedCaption>
        </>
      }
    />
  );
}
