import React, { memo } from 'react';
import { MarketingVideo } from 'components/MarketingPagesShared/MarketingVideo';
import { MarketingImage } from 'components/MarketingPagesShared/MarketingImage';
import { MarketingLink } from 'components/MarketingPagesShared/styles';
import {
  FeaturesCaptionedImage,
  FeaturesSection,
  FeaturesSectionSubtitle,
  FeaturesSectionTitle,
  FeaturesHorizontalCaption,
  FeaturesSectionDescription,
} from '../../styles';

function FeaturesMonetizationSectionView() {
  return (
    <FeaturesSection>
      <FeaturesSectionTitle>Get paid to podcast</FeaturesSectionTitle>
      <FeaturesCaptionedImage>
        <MarketingVideo
          width={970}
          height={546}
          title="Podcast Subscriptions - From Anchor and Spotify"
          youTubeVideoId="1VSniHXVb74"
        >
          <MarketingImage
            alt="Collage showing a mouth, asound wave, a microphone and a recording signal"
            imagePath="features/podcast-subscriptions"
            width={970}
            height={545}
          />
        </MarketingVideo>
        <FeaturesHorizontalCaption>
          <FeaturesSectionSubtitle>
            Podcast Subscriptions
          </FeaturesSectionSubtitle>
          <FeaturesSectionDescription>
            The easiest way for creators to offer exclusive content.
            Creator-friendly features include a wide range of subscription
            pricing structures and the ability to email subscribers directly.
          </FeaturesSectionDescription>
        </FeaturesHorizontalCaption>
      </FeaturesCaptionedImage>

      <FeaturesCaptionedImage>
        <MarketingImage
          alt="A rendering of an Anchor modal showing a Record Ad button"
          imagePath="features/monetization-ads"
          width={970}
          height={545}
        />
        <FeaturesHorizontalCaption>
          <FeaturesSectionSubtitle>Ads, read by you</FeaturesSectionSubtitle>
          <FeaturesSectionDescription>
            Earn money every time people listen. With{' '}
            <MarketingLink to="/sponsorships">
              Anchor Sponsorships
            </MarketingLink>
            , record audio ads in your own voice, and choose where they go in
            your episodes.
          </FeaturesSectionDescription>
        </FeaturesHorizontalCaption>
      </FeaturesCaptionedImage>
      <FeaturesCaptionedImage>
        <MarketingImage
          alt="two people on a laptop recording a podcast, a couple sharing headphones while listening to a podcast, a person on the subway listening to a podcast"
          imagePath="features/monetization-listener-support"
          width={970}
          height={545}
        />
        <FeaturesHorizontalCaption>
          <FeaturesSectionSubtitle>Listener support</FeaturesSectionSubtitle>
          <FeaturesSectionDescription>
            An optional button on your Anchor profile lets listeners donate
            monthly—and they don’t even need an Anchor account to chip in.
          </FeaturesSectionDescription>
        </FeaturesHorizontalCaption>
      </FeaturesCaptionedImage>
    </FeaturesSection>
  );
}

export const FeaturesMonetizationSection = memo(
  FeaturesMonetizationSectionView
);
