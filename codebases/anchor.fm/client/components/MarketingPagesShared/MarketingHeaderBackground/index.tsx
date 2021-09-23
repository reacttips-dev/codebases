import styled from '@emotion/styled';
import React from 'react';
import {
  BREAKPOINT_SMALL,
  HEADER_HEIGHT,
  HEADER_HEIGHT_AT_BREAKPOINT_SMALL,
  HEADER_Z_INDEX,
} from '../styles';

export function MarketingHeaderBackground({ color }: { color: string }) {
  return <MarketingHeaderBackgroundContainer style={{ background: color }} />;
}

const MarketingHeaderBackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: ${HEADER_Z_INDEX - 1};
  height: ${HEADER_HEIGHT}px;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    height: ${HEADER_HEIGHT_AT_BREAKPOINT_SMALL}px;
  }
`;
