import { Link } from 'react-router-dom';
import { css } from '@emotion/core';
import styled from '@emotion/styled';

// Matches the mobile web nav and various other hardcoded breakpoints
export const BREAKPOINT_SMALL = 880;
// Rarely used, but sometimes it makes sense to start reducing some padding
export const BREAKPOINT_MEDIUM = 1100;
// Matches the footer and header components
export const MAX_WIDTH = 1400;
//  Matches the current header
export const DEFAULT_DESKTOP_PADDING = 175;
//  Matches the current header
export const DEFAULT_MOBILE_PADDING = 26;
export const DEFAULT_DROP_SHADOW = '8px 8px 80px rgba(0, 0, 0, 0.24)';

export const COLOR_MAROON = '#9a201c';
export const COLOR_DARK_LAVENDER = '#814FE6';
export const COLOR_DARK_PURPLE = '#24203F';
export const COLOR_PURPLE = '#5000B9';
export const COLOR_GREEN = '#185941';
export const COLOR_DARK_PINK = '#C74461';

// 3 because the header background will end up at 2, and there are various UI
// elements (like the switch page typeahead) that like to use 1
export const HEADER_Z_INDEX = 3;
export const HEADER_HEIGHT = 96;
export const HEADER_HEIGHT_AT_BREAKPOINT_SMALL = 76;

const baseLinkStyles = css`
  border-color: white;
  border-bottom-style: solid;
  color: inherit;

  // To override global styles
  &:hover,
  &:active,
  &:focus,
  &:active:focus {
    color: #faffab;
    border-color: #faffab;
    text-decoration: none;
  }
`;

const linkStyles = css`
  border-width: 1px;
  font-weight: inherit;
  ${baseLinkStyles}
`;

const boldLinkStyles = css`
  border-width: 2px;
  font-weight: bold;
  ${baseLinkStyles}
`;

export const MarketingBoldLink = styled(Link)`
  ${boldLinkStyles}
`;

export const MarketingBoldAnchor = styled.a`
  ${boldLinkStyles}
`;

export const MarketingAnchor = styled.a`
  ${linkStyles}
`;

export const MarketingLink = styled(Link)`
  ${linkStyles}
`;

export const MarketingHeading1 = styled.h1`
  font-size: 8rem;
  font-weight: 800;
  @media (max-width: ${BREAKPOINT_SMALL}px) {
    font-size: 4.8rem;
  }
`;

export const MarketingSection = styled.section`
  max-width: ${MAX_WIDTH}px;
  margin: 0 auto;
  font-size: 1.6rem;
  color: white;
  padding: 0 ${DEFAULT_DESKTOP_PADDING}px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    padding: 0 ${DEFAULT_MOBILE_PADDING}px;
  }
`;
