import React, { memo } from 'react';
import { MarketingImage } from '../../../../components/MarketingPagesShared/MarketingImage';
import {
  FeaturesHorizontalCaption,
  FeaturesCaptionedImage,
  FeaturesSection,
  FeaturesSectionDescription,
  FeaturesSectionSubtitle,
  FeaturesSectionTitle,
} from '../../styles';

function FeaturesAnalyticsSectionView() {
  return (
    <FeaturesSection>
      <FeaturesSectionTitle>
        Insightful and straightforward analytics from Spotify
      </FeaturesSectionTitle>
      <FeaturesCaptionedImage>
        <MarketingImage
          alt="A man looking at Anchor analytics on a desktop computer, with podcasting equipment nearby and the IAB 2.0 logo in the lower-right corner of the image"
          imagePath="features/analytics-data"
          width={970}
          height={545}
        />
        <FeaturesHorizontalCaption>
          <FeaturesSectionSubtitle>
            Accurate, reliable data—all in one place
          </FeaturesSectionSubtitle>
          <FeaturesSectionDescription>
            Detailed, IAB 2.0-certified metrics to better measure your audience
            and help your show grow are all available in a single dashboard.
          </FeaturesSectionDescription>
        </FeaturesHorizontalCaption>
      </FeaturesCaptionedImage>

      <FeaturesCaptionedImage>
        <MarketingImage
          alt="A graph from the Anchor analytics dashboard that shows the listenership of a podcast"
          imagePath="features/analytics-tools"
          width={970}
          height={545}
          isDropShadowed={false}
        />
        <FeaturesHorizontalCaption>
          <FeaturesSectionSubtitle>
            Performance tools to help you grow your audience
          </FeaturesSectionSubtitle>
          <FeaturesSectionDescription>
            Engagement insights help you see where your Spotify listeners are
            dropping off, so you can plan your podcast around the content that
            performs best.
          </FeaturesSectionDescription>
        </FeaturesHorizontalCaption>
      </FeaturesCaptionedImage>

      <FeaturesCaptionedImage>
        <MarketingImage
          alt="A graph from the Anchor analytics dashboard that shows audience breakdowns on aggregated age and gender"
          imagePath="features/analytics-insights"
          width={970}
          height={545}
          isDropShadowed={false}
        />
        <FeaturesHorizontalCaption>
          <FeaturesSectionSubtitle>
            Unique insights on where and how your listeners are tuning in
          </FeaturesSectionSubtitle>
          <FeaturesSectionDescription>
            Audience breakdowns on aggregated age, gender, geolocation, and
            listening apps help you learn more about your Spotify listeners, so
            you can better tailor your content.
          </FeaturesSectionDescription>
        </FeaturesHorizontalCaption>
      </FeaturesCaptionedImage>
    </FeaturesSection>
  );
}

export const FeaturesAnalyticsSection = memo(FeaturesAnalyticsSectionView);
