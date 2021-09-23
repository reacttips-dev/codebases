import React from 'react';
import styled from '@emotion/styled';

import { RetinaPicture } from 'client/components/RetinaPicture';
import { ImageType } from './constants';
import { SCREEN_BREAKPOINTS } from '../../constants';

const QuoteImageContainer = styled.div`
  height: 0;
  margin: 0 2.5%;
  padding-bottom: 30.42%; // Ratio of SVG
  position: relative;
  width: 30%;
`;
const QuoteRetinaPicture = styled(RetinaPicture)<{
  offset?: number;
  size?: number;
}>`
  height: ${({ size }) => size}px;
  left: ${({ offset }) => offset}%;
  position: absolute;
  top: 50%;
  transform: translate(-${({ offset }) => offset}%, -50%);
  width: ${({ size }) => size}px;
  z-index: 1;

  img {
    height: 100%;
    width: 100%;
  }

  @media (max-width: ${SCREEN_BREAKPOINTS.SMALL_DESKTOP}px) {
    height: ${({ size }) => (size ? size - 40 : 0)}px;
    width: ${({ size }) => (size ? size - 40 : 0)}px;
  }

  @media (max-width: ${SCREEN_BREAKPOINTS.TABLET}px) {
    height: ${({ size }) => (size ? size - 120 : 0)}px;
    width: ${({ size }) => (size ? size - 120 : 0)}px;
  }

  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    height: ${({ size }) => (size ? size - 160 : 0)}px;
    width: ${({ size }) => (size ? size - 160 : 0)}px;
  }
`;

export const QuoteImage = ({ image }: { image: ImageType }) => {
  return (
    <QuoteImageContainer>
      <QuoteRetinaPicture
        alt={image.alt}
        fallbackExtension={image.fallbackExtension}
        imagePath={image.imagePath}
        offset={image.offset}
        size={image.size}
      />
    </QuoteImageContainer>
  );
};
