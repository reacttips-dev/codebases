import styled from '@emotion/styled';
import { css } from 'emotion';
import { SM_SCREEN_MAX } from '../../modules/Styleguide';
import { Section } from '../../screens/WordpressScreen/components/Hero/styles';
import { COLOR_DARK_PURPLE } from '../MarketingPagesShared/styles';

const Header2 = styled.h2`
  color: #5000b9;
  margin: 0 auto;

  font-size: 3.6rem;
  font-weight: 800;
  @media (max-width: ${SM_SCREEN_MAX}px) {
    display: none;
  }
`;

const SwitchToAnchorOverrideCSS = css`
  padding: 56px 0 170px 0 !important;
  @media (max-width: ${SM_SCREEN_MAX}px) {
    padding: 24px 0 120px 0 !important;
  }
`;

const WordPressSectionHero = styled(Section)`
  background-color: #fff;
  background-position-y: -30px;
  padding: 56px 0 168px;
  @media (max-width: 768px) {
    height: 240px;
  }
`;

const WordPressLogoContainer = styled(Section)`
  background-color: #fff;
  background-position-y: -30px;
  padding: 56px 0 168px;
  color: ${COLOR_DARK_PURPLE};
  @media (max-width: 768px) {
    padding: 40px 0 160px;
  }
`;

export {
  WordPressSectionHero,
  SwitchToAnchorOverrideCSS,
  Header2,
  WordPressLogoContainer,
};
