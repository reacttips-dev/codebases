import styled from '@emotion/styled';
import {
  BREAKPOINT_SMALL,
  DEFAULT_DESKTOP_PADDING,
  DEFAULT_MOBILE_PADDING,
  MarketingHeading1,
  MAX_WIDTH,
} from '../../components/MarketingPagesShared/styles';

export const HomeSection = styled.div`
  max-width: ${MAX_WIDTH}px;
  margin: 0 auto;
  font-size: 1.6rem;
  color: white;
  padding: 0 ${DEFAULT_DESKTOP_PADDING}px ${DEFAULT_DESKTOP_PADDING / 2}px
    ${DEFAULT_DESKTOP_PADDING}px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    padding: 0 0 ${DEFAULT_DESKTOP_PADDING}px 0;
  }
`;

export const HomeColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(300px, 1fr);
  grid-column-gap: 45px;
  grid-row-gap: 45px;
  min-height: 850px;
  font-size: 1.6rem;
  color: white;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    grid-template-columns: 1fr;
    min-height: 0;
  }
`;

export const HomeTextColumn = styled.div`
  align-self: center;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    padding: 0 ${DEFAULT_MOBILE_PADDING}px;
  }
`;

export const HomeImageColumn = styled.div`
  align-self: center;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    padding: 0 ${DEFAULT_MOBILE_PADDING}px;
  }
`;

export const HomeHeroTitle = styled(MarketingHeading1)`
  margin-bottom: 40px;
`;

export const HomeHeroSubtitle = styled.h2`
  font-size: 4.4rem;
  line-height: 1.25;
  font-weight: normal;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    font-size: 3.2rem;
  }
`;

export const HomeSectionTitle = styled.h3`
  font-size: 3.6rem;
  line-height: 1.25;
  font-weight: normal;
  margin-bottom: 32px;

  strong {
    font-weight: 800;
  }

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    font-size: 2.8rem;

    strong {
      font-weight: bold;
    }
  }
`;

export const HomeIconedCaption = styled.div`
  display: grid;
  grid-template-columns: min-content auto;
  align-items: center;
  grid-gap: 15px;
`;

export const HomeImageCaption = styled.figcaption`
  font-size: 2rem;
  line-height: 1.4;
  margin: 15px 0;
`;

export const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -1;
`;
