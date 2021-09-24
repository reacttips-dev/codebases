import styled from '@emotion/styled';
import React, { memo } from 'react';
import { MarketingImage } from '../../../../components/MarketingPagesShared/MarketingImage';
import { BREAKPOINT_SMALL } from '../../../../components/MarketingPagesShared/styles';
import {
  FeaturesCaptionedImage,
  FeaturesSection,
  FeaturesSectionDescription,
  FeaturesSectionSubtitle,
  FeaturesSectionTitle,
  FeaturesCaption,
} from '../../styles';

function FeaturesHostingSectionView() {
  return (
    <FeaturesSection>
      <FeaturesSectionTitle>
        Unlimited hosting,
        <br /> streamlined distribution
      </FeaturesSectionTitle>
      <FeaturesHostingGrid>
        <FeaturesCaptionedImage>
          <MarketingImage
            alt="A woman on her laptop with a cloud icon on top of the image"
            imagePath="features/hosting-free-unlimited"
            width={475}
            height={475}
          />
          <FeaturesCaption>
            <FeaturesSectionSubtitle>
              Free, unlimited hosting
            </FeaturesSectionSubtitle>
            <FeaturesSectionDescription>
              You own the rights to all of your content and can host unlimited
              episodes for free, always.
            </FeaturesSectionDescription>
          </FeaturesCaption>
        </FeaturesCaptionedImage>
        <FeaturesCaptionedImage>
          <MarketingImage
            alt="A photo of yellow and orange abstract art with the Spotify logo on the upper right hand corner"
            imagePath="features/distribution-update-features"
            width={475}
            height={475}
          />
          <FeaturesCaption>
            <FeaturesSectionSubtitle>
              Supported Distribution to all major listening apps
            </FeaturesSectionSubtitle>
            <FeaturesSectionDescription>
              Reach a wider audience quickly and easily, including one-step
              distribution to Spotify.
            </FeaturesSectionDescription>
          </FeaturesCaption>
        </FeaturesCaptionedImage>
      </FeaturesHostingGrid>
    </FeaturesSection>
  );
}

export const FeaturesHostingSection = memo(FeaturesHostingSectionView);

const FeaturesHostingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    grid-template-columns: 1fr;
    grid-gap: 0;
  }
`;
