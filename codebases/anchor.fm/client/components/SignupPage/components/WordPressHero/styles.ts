import styled from '@emotion/styled';
import { Section } from '../../../../screens/WordpressScreen/components/Hero/styles';
import {
  BREAKPOINT_SMALL,
  COLOR_DARK_PURPLE,
} from '../../../MarketingPagesShared/styles';

const WordPressSectionHero = styled(Section)`
  background-color: #fff;
  background-position-y: -30px;
  padding: 56px 0 168px;
  color: ${COLOR_DARK_PURPLE};
  @media (max-width: 768px) {
    padding: 40px 0 160px;
  }
`;

const DesktopHeading = styled.h2`
  display: block;
  @media (max-width: ${BREAKPOINT_SMALL}px) {
    display: none;
  }
`;

const MobileHeading = styled.h2`
  display: none;
  font-size: 1.4rem;
  line-height: 1.8rem;
  text-align: center;
  font-weight: normal;
  @media (max-width: ${BREAKPOINT_SMALL}px) {
    display: block;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  .anchorLogo {
    height: 44px;
  }
  .wpLogo {
    height: 51px;
  }
  @media (max-width: 768px) {
    .wpLogo,
    .anchorLogo {
      height: 32px;
    }
  }
  @media (max-width: 378px) {
    .wpLogo,
    .anchorLogo {
      height: 26px;
    }
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  height: 32px;
  svg {
    width: 100%;
  }
`;

const CollabX = styled.span<{ fillColor: string }>`
  font-style: italic;
  font-weight: normal;
  font-size: 2.8rem;
  line-height: 3.2rem;
  display: inline-block;
  padding: 0 24px;
  color: ${({ fillColor }) => fillColor};
  opacity: 0.5;
  position: relative;
  @media (max-width: 768px) {
    font-size: 1.8rem;
    line-height: 2rem;
    padding: 0 20px 0 16px;
  }
`;

export {
  WordPressSectionHero,
  DesktopHeading,
  MobileHeading,
  LogoWrapper,
  LogoContainer,
  CollabX,
};
