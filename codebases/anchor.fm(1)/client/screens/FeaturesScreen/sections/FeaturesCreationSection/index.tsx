import React, { memo } from 'react';
import { MarketingImage } from '../../../../components/MarketingPagesShared/MarketingImage';
import { MarketingVideo } from '../../../../components/MarketingPagesShared/MarketingVideo';
import { MarketingAnchor } from '../../../../components/MarketingPagesShared/styles';
import {
  FeaturesCaptionedImage,
  FeaturesSection,
  FeaturesSectionSubtitle,
  FeaturesSectionTitle,
  FeaturesHorizontalCaption,
  FeaturesSectionDescription,
} from '../../styles';

function FeaturesCreationSectionView() {
  return (
    <FeaturesSection>
      <FeaturesSectionTitle>Convenient creation tools</FeaturesSectionTitle>
      <FeaturesCaptionedImage>
        <MarketingImage
          alt="A rendering of the Anchor episode builder"
          imagePath="features/creation-recording"
          width={970}
          height={545}
        />
        <FeaturesHorizontalCaption>
          <FeaturesSectionSubtitle>
            Flexible recording and uploading
          </FeaturesSectionSubtitle>
          <FeaturesSectionDescription>
            Recording tools capture audio straight from your phone, tablet, or
            computer, and sync them across all devices. Or, you can import
            existing audio or video.
          </FeaturesSectionDescription>
        </FeaturesHorizontalCaption>
      </FeaturesCaptionedImage>

      <FeaturesCaptionedImage>
        <MarketingImage
          alt="A rendering of the Anchor audio segment arrangement tool"
          imagePath="features/creation-episode-builder"
          width={970}
          height={545}
        />
        <FeaturesHorizontalCaption>
          <FeaturesSectionSubtitle>
            Intuitive episode building
          </FeaturesSectionSubtitle>
          <FeaturesSectionDescription>
            Easy-to-visualize building blocks of audio segments don’t require
            any editing. Record your audio, arrange your segments, add
            transitions, and you’re set.
          </FeaturesSectionDescription>
        </FeaturesHorizontalCaption>
      </FeaturesCaptionedImage>

      <FeaturesCaptionedImage>
        <MarketingVideo
          width={970}
          height={546}
          title="Anchor: Introducing shows with Spotify music"
          youTubeVideoId="chMtuVpP7lk"
        >
          <MarketingImage
            alt="Man sitting on the front steps listening to music and recording into his phone"
            imagePath="features/creation-music-integration"
            width={970}
            height={546}
          />
        </MarketingVideo>

        <FeaturesHorizontalCaption>
          <FeaturesSectionSubtitle>
            Exclusive music integration
          </FeaturesSectionSubtitle>
          <FeaturesSectionDescription>
            Add any full tracks from Spotify to your episodes, and combine music
            and conversation to explore the{' '}
            <MarketingAnchor
              href="https://blog.anchor.fm/music"
              target="_blank"
              rel="noopener noreferrer"
            >
              full possibilities of audio
            </MarketingAnchor>
            .
          </FeaturesSectionDescription>
        </FeaturesHorizontalCaption>
      </FeaturesCaptionedImage>

      <FeaturesCaptionedImage>
        <MarketingImage
          alt="An image showing the Anchor recording tool on an iPhone, two images of people at different locations collaborating on a podcast"
          imagePath="features/creation-collaboration"
          width={970}
          height={545}
        />
        <FeaturesHorizontalCaption>
          <FeaturesSectionSubtitle>
            Collaborate with co-hosts, guests, and listeners
          </FeaturesSectionSubtitle>
          <FeaturesSectionDescription>
            Multiple people can record with you at the same time. You can also
            feature your listeners by inviting them to send you a voice message,
            which you can include in future episodes.
          </FeaturesSectionDescription>
        </FeaturesHorizontalCaption>
      </FeaturesCaptionedImage>

      <FeaturesCaptionedImage>
        <MarketingImage
          alt="A rendering of the Anchor cover art makers"
          imagePath="features/creation-cover-art"
          width={970}
          height={545}
        />
        <FeaturesHorizontalCaption>
          <FeaturesSectionSubtitle>Cover art creator</FeaturesSectionSubtitle>
          <FeaturesSectionDescription>
            Generate custom cover art in seconds, using images and fonts to help
            ensure your podcast has an{' '}
            <MarketingAnchor
              href="https://blog.anchor.fm/create/dos-donts-coverart"
              target="_blank"
              rel="noopener noreferrer"
            >
              eye-catching cover
            </MarketingAnchor>
            .
          </FeaturesSectionDescription>
        </FeaturesHorizontalCaption>
      </FeaturesCaptionedImage>
    </FeaturesSection>
  );
}

export const FeaturesCreationSection = memo(FeaturesCreationSectionView);
