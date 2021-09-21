import styled from '@emotion/styled';
import {
  BREAKPOINT_SMALL,
  MarketingHeading1,
} from '../../../../components/MarketingPagesShared/styles';

const Section = styled.section`
  color: #fff;
  text-align: center;
  padding: 56px 24px 0;
  background-size: cover;
  @media (max-width: 768px) {
    padding: 40px 16px 40px 16px;
    background-image: none;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1068px;
  width: 100%;
  margin: auto;
`;

const Heading = styled(MarketingHeading1)`
  text-align: center;
  max-width: 880px;
  width: 100%;
  margin: auto;
  margin-top: 32px;
`;

const SubHeader = styled.h2`
  font-size: 1.4rem;
  line-height: 2rem;
  text-align: center;
  color: #ffffff;
  opacity: 0.85;
  max-width: 256px;
  width: 100%;
  margin: auto;
`;

const HeroImageContainer = styled.div`
  margin: 92px 0 164px;
  display: grid;
  grid-template-columns: repeat(32, 1fr);
  grid-template-rows: repeat(8, 1fr);
  padding: 0 24px;
  img {
    width: 100%;
  }
  @media (max-width: ${BREAKPOINT_SMALL}px) {
    margin: 64px 0;
    padding: 0;
  }
`;

const HeroImagePictureWrapper1 = styled.div`
  grid-column: 2 / 33;
  grid-row: 1 / 9;
  @media (max-width: ${BREAKPOINT_SMALL}px) {
    grid-column: 1 / 33;
  }
`;

const HeroImagePictureWrapper2 = styled.div`
  position: relative;
  grid-column-start: 1;
  grid-column-end: 14;
  grid-row: 5 / 9;
  right: 20px;
  bottom: 16px;
  @media (max-width: ${BREAKPOINT_SMALL}px) {
    display: none;
  }
`;

export {
  Section,
  ContentWrapper,
  Heading,
  SubHeader,
  HeroImageContainer,
  HeroImagePictureWrapper1,
  HeroImagePictureWrapper2,
};
