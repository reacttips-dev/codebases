import React from 'react';
import styled from '@emotion/styled';

import { RetinaPicture } from 'client/components/RetinaPicture';
import { FallbackExtension, HeaderImageType } from '../types';
import { SCREEN_BREAKPOINTS } from '../../../constants';

const HeaderImageContainer = styled.div`
  position: relative;
  width: 20%;

  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    width: 50%;
  }
`;

const HeaderRetinaPicture = styled(RetinaPicture)<{
  anchorPosition?: string;
  size?: number;
}>`
  height: ${({ size }) => size}px;
  position: absolute;
  top: 0;
  width: ${({ size }) => size}px;
  z-index: 1;
  ${({ anchorPosition }) => anchorPosition};

  img {
    height: 100%;
    width: 100%;
  }

  @media (max-width: ${SCREEN_BREAKPOINTS.SMALL_DESKTOP}px) {
    height: ${({ size }) => (size ? size - 40 : 0)}px;
    width: ${({ size }) => (size ? size - 40 : 0)}px;
  }

  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    height: ${({ size }) => (size ? size - 60 : 0)}px;
    left: 50%;
    transform: translateX(-50%);
    width: ${({ size }) => (size ? size - 60 : 0)}px;
  }
`;

export const HeaderImage = ({ image }: { image: HeaderImageType }) => {
  return (
    <HeaderImageContainer>
      <HeaderRetinaPicture
        alt={image.alt}
        anchorPosition={image.anchorPosition}
        fallbackExtension={image.fallbackExtension as FallbackExtension}
        imagePath={image.imagePath}
        size={image.size}
      />
    </HeaderImageContainer>
  );
};
