import styled from '@emotion/styled';
import React from 'react';
import { MarketingAppButtons } from '../../../../../components/MarketingPagesShared/MarketingAppButtons';
import { MarketingImage } from '../../../../../components/MarketingPagesShared/MarketingImage';
import {
  BREAKPOINT_SMALL,
  MarketingHeading1,
} from '../../../../../components/MarketingPagesShared/styles';
import {
  HomeSection,
  HomeColumns,
  HomeTextColumn,
  HomeImageColumn,
} from '../../../styles';
import {
  HomeStackedImages,
  CaptionPosition,
  SecondaryImagePosition,
  HomeStackedImagesPrimary,
  HomeStackedImagesSecondary,
  HomeStackedImagesCaption,
} from '../../HomeStackedImages';

export function HomeHero() {
  return (
    <HomeHeroSection>
      <HomeColumns>
        <HomeTextColumn>
          <HomeHeroTitle>Say it all with Anchor</HomeHeroTitle>
          <HomeHeroSubtitle>
            Create, distribute, and monetize your podcast—all for free.
          </HomeHeroSubtitle>

          <HomeHeroAppButtons>
            <MarketingAppButtons
              clickEventLocation="Hero"
              isRenderForMobileOnly={true}
            />
          </HomeHeroAppButtons>

          <HomeHeroRightAligned>
            <HomeHeroDesktopImage margin="-100px -100px 0">
              <MarketingImage
                width={100}
                height={100}
                imagePath="home/hero/sibling-rivalry"
                alt="The Sibling Rivalry podcast cover"
              />
            </HomeHeroDesktopImage>
          </HomeHeroRightAligned>

          <HomeStackedImages>
            <HomeStackedImagesCaption position={CaptionPosition.BOTTOM}>
              Samir Chaudry, co-host of{' '}
              <strong>“The Colin and Samir Podcast”</strong>
            </HomeStackedImagesCaption>
            <HomeStackedImagesPrimary>
              <MarketingImage
                width={550}
                height={367}
                imagePath="home/hero/the-colin-and-samir-podcast"
                alt="Photo of Samir recording The Colin and Samir podcast"
              />
            </HomeStackedImagesPrimary>
            <HomeStackedImagesSecondary
              position={SecondaryImagePosition.TOP_LEFT}
            >
              <MarketingImage
                width={100}
                height={100}
                imagePath="home/hero/the-colin-and-samir-podcast-cover"
                alt="The Colin and Samir podcast cover image"
              />
            </HomeStackedImagesSecondary>
          </HomeStackedImages>
          <HomeHeroDesktopImage size={150} margin="0 0 0 -150px">
            <MarketingImage
              width={150}
              height={150}
              imagePath="home/hero/the-tripping-podcast-cover"
              alt="The Trippin Podcast cover"
            />
          </HomeHeroDesktopImage>
        </HomeTextColumn>
        <HomeHeroImageColumn>
          <HomeSideImageTop>
            <HomeStackedImages>
              <HomeStackedImagesCaption position={CaptionPosition.BOTTOM}>
                Chris Black, co-host of <strong>“How Long Gone”</strong>
              </HomeStackedImagesCaption>
              <HomeStackedImagesPrimary>
                <MarketingImage
                  width={450}
                  height={300}
                  imagePath="home/hero/how-long-gone"
                  alt="Photo of Chris Black recording the How Long Gone podcast"
                />
              </HomeStackedImagesPrimary>
              <HomeStackedImagesSecondary
                position={SecondaryImagePosition.TOP_LEFT}
              >
                <MarketingImage
                  width={100}
                  height={100}
                  imagePath="home/hero/how-long-gone-cover"
                  alt="The How Long Gone podcast cover image"
                />
              </HomeStackedImagesSecondary>
            </HomeStackedImages>
          </HomeSideImageTop>
          <HomeStackedImages>
            <HomeStackedImagesCaption position={CaptionPosition.BOTTOM}>
              Kia Marie &amp; Vic Styles, co-hosts of{' '}
              <strong>“Kontent Queens”</strong>
            </HomeStackedImagesCaption>
            <HomeStackedImagesPrimary>
              <MarketingImage
                width={500}
                height={334}
                imagePath="home/hero/kontent-queens"
                alt="Photo of Kia Marie and Vic Styles"
              />
            </HomeStackedImagesPrimary>
            <HomeStackedImagesSecondary
              position={SecondaryImagePosition.TOP_RIGHT}
            >
              <MarketingImage
                width={100}
                height={100}
                imagePath="home/hero/kontent-queens-cover"
                alt="The Kontent Queens podcast cover image"
              />
            </HomeStackedImagesSecondary>
          </HomeStackedImages>
          <HomeHeroDesktopImage margin="30px 0">
            <MarketingImage
              width={100}
              height={100}
              imagePath="home/hero/couples-therapy-cover"
              alt="Couples Therapy podcast cover"
            />
          </HomeHeroDesktopImage>
        </HomeHeroImageColumn>
      </HomeColumns>
    </HomeHeroSection>
  );
}

const HomeHeroRightAligned = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const HomeHeroDesktopImage = styled.div<{
  size?: number;
  margin?: string;
}>`
  width: ${({ size = 100 }) => size}px;
  height: ${({ size = 100 }) => size}px;
  margin: ${({ margin = 0 }) => margin};

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    display: none;
  }
`;

const HomeHeroSection = styled(HomeSection)`
  padding-right: 0;
`;

const HomeSideImageTop = styled.div`
  margin-bottom: 100px;
  @media (max-width: ${BREAKPOINT_SMALL}px) {
    margin-bottom: 50px;
  }
`;

const HomeHeroImageColumn = styled(HomeImageColumn)`
  align-self: flex-start;
  margin-top: 40px;
  @media (min-width: ${BREAKPOINT_SMALL}px) {
    margin-left: 25%;
  }
`;

const HomeHeroTitle = styled(MarketingHeading1)`
  margin: 150px 0 40px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    margin-top: 40px;
  }
`;

const HomeHeroSubtitle = styled.h2`
  font-size: 3.6rem;
  line-height: 1.25;
  font-weight: normal;
  margin-bottom: 250px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    font-size: 3.2rem;
    margin-bottom: 50px;
  }
`;

const HomeHeroAppButtons = styled.div`
  display: none;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    &:not(:empty) {
      display: block;
      margin-bottom: 50px;
    }
  }
`;
