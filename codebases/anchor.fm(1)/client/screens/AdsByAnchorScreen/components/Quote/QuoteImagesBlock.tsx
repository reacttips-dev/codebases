import React from 'react';
import styled from '@emotion/styled';

import { QuoteWaveIcon } from '../Icons';
import { QuoteImage } from './QuoteImage';
import { IMAGE_MAP } from './constants';

const QuoteImageContainer = styled.div`
  display: flex;
  height: 0;
  padding-bottom: 30.42%; // Ratio of SVG
  position: relative;
  width: 100%;

  svg {
    bottom: 0;
    height: 100%;
    position: absolute;
    width: 100%;
  }
`;

export const QuoteImagesBlock = () => {
  return (
    <QuoteImageContainer>
      <QuoteImage image={IMAGE_MAP.imageOne} />
      <QuoteImage image={IMAGE_MAP.imageTwo} />
      <QuoteImage image={IMAGE_MAP.imageThree} />
      <QuoteWaveIcon />
    </QuoteImageContainer>
  );
};
