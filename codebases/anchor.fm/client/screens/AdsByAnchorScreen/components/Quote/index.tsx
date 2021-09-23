import React from 'react';
import styled from '@emotion/styled';

import { Blockquote } from './Blockquote';
import { QuoteImagesBlock } from './QuoteImagesBlock';
import { SCREEN_BREAKPOINTS } from '../../constants';

const QuoteSection = styled.section`
  padding: 50px 0;

  @media (max-width: ${SCREEN_BREAKPOINTS.TABLET}px) {
    padding: 50px 0 100px;
  }
`;

export const Quote = () => {
  return (
    <QuoteSection>
      <Blockquote />
      <QuoteImagesBlock />
    </QuoteSection>
  );
};
