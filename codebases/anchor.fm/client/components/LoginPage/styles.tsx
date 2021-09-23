import styled from '@emotion/styled';
import { css } from 'emotion';
import { SM_SCREEN_MAX } from '../../modules/Styleguide';

export const SwitchToAnchorOverrideCSS = css`
  padding: 56px 0 170px 0 !important;
  @media (max-width: ${SM_SCREEN_MAX}px) {
    padding: 24px 14px 120px 14px !important;
  }
`;

export const Header1 = styled.h1`
  font-size: 2.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 8px;
`;
export const Header2 = styled.h2`
  font-size: 3.6rem;
  font-weight: 800;
  margin: 0 0 20px 0;
  color: #5000b9;
  @media (max-width: ${SM_SCREEN_MAX}px) {
    font-size: 1.6rem;
    font-weight: bold;
  }
`;
export const Header3 = styled.h3`
  font-size: 2rem;
  font-weight: normal;
  margin: 0;
  @media (max-width: ${SM_SCREEN_MAX}px) {
    font-size: 1.4rem;
  }
`;

export const Paragraph = styled.p`
  text-align: center;
  font-size: 1.4rem;
`;

export const OverlayOverrideCSS = css`
  margin: -106px 8px 0 !important;
`;
