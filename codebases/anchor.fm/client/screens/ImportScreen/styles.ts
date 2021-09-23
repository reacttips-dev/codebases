import { css } from '@emotion/core';
import styled from '@emotion/styled';
import {
  MAX_WIDTH,
  BREAKPOINT_SMALL,
  DEFAULT_DESKTOP_PADDING,
  DEFAULT_MOBILE_PADDING,
  COLOR_DARK_PURPLE,
  COLOR_PURPLE,
  COLOR_MAROON,
} from '../../components/MarketingPagesShared/styles';

export const SwitchPageGlobalStyles = css`
  html {
    // Overscroll color
    background: ${COLOR_DARK_PURPLE};
  }
  body {
    background: ${COLOR_MAROON};
  }
`;

export const SwitchPage = styled.main``;

export const ImportSectionBackground = styled.div`
  background: ${COLOR_DARK_PURPLE};
`;

export const SignupSectionBackground = styled.section`
  background: ${COLOR_PURPLE};
  padding-top: 10vh;
`;
