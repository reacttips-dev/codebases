import styled from '@emotion/styled';
import {
  BREAKPOINT_SMALL,
  DEFAULT_DESKTOP_PADDING,
  MAX_WIDTH,
  DEFAULT_MOBILE_PADDING,
  HEADER_Z_INDEX,
  HEADER_HEIGHT_AT_BREAKPOINT_SMALL,
} from '../../components/MarketingPagesShared/styles';

export const FeaturesSection = styled.div`
  position: relative;
  font-size: 2rem;
  color: white;
  min-height: 100vh;
  padding: ${DEFAULT_DESKTOP_PADDING}px ${DEFAULT_DESKTOP_PADDING}px 0 0;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    // So that it doesn't overlap with the sticky header
    padding: 130px 0 0 0;
  }
`;

export const FeaturesNavSectionsWrapper = styled.div`
  max-width: ${MAX_WIDTH}px;
  margin: 0 auto;
  font-size: 1.6rem;
  color: white;
  display: grid;
  grid-template-columns: max-content auto;
  align-items: start;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    grid-template-columns: 1fr;
  }
`;

export const FeaturesSectionTitle = styled.h2`
  font-size: 6.4rem;
  line-height: 1.1;
  font-weight: 800;
  color: white;
  margin: 0 0 80px 0;
  padding: 0;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    font-size: 4rem;
    line-height: 1.2;
    margin: 0 ${DEFAULT_MOBILE_PADDING}px ${DEFAULT_MOBILE_PADDING * 2}px
      ${DEFAULT_MOBILE_PADDING}px;
  }
`;

export const FeaturesSectionDescription = styled.p`
  font-size: 2rem;
  line-height: 1.4;
  color: white;
`;

export const FeaturesSectionSubtitle = styled.h3`
  font-size: 2.4rem;
  font-weight: bold;
  line-height: 1.3;
  color: white;
  margin: 0;
  padding: 0;
  text-transform: uppercase;
`;

export const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -1;
`;

export const Menu = styled.div`
  position: sticky;
  top: 0;
  padding-top: ${DEFAULT_DESKTOP_PADDING}px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    z-index: ${HEADER_Z_INDEX - 1};
    padding-top: ${HEADER_HEIGHT_AT_BREAKPOINT_SMALL}px;
  }
`;

export const FeaturesCaptionedImage = styled.div`
  display: grid;
  grid-template-rows: max-content;
  grid-gap: 25px;
  margin-bottom: 120px;

  &:last-of-type {
    margin-bottom: 0;
  }

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    margin-bottom: 75px;
  }
`;

export const FeaturesCaption = styled.div`
  display: grid;
  grid-template-rows: max-content;
  grid-gap: 16px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    padding: 0 ${DEFAULT_MOBILE_PADDING}px;
  }
`;

export const FeaturesHorizontalCaption = styled(FeaturesCaption)`
  display: grid;
  grid-template-columns: 40% 60%;
  grid-gap: 25px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    grid-template-columns: 1fr;
  }
`;

export const FeaturesSignupWrapper = styled.div`
  padding-top: 20vh;
`;
