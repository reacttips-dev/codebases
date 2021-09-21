import React from 'react';
import styled from '@emotion/styled';

import { COLOR_GREEN } from 'client/components/MarketingPagesShared/styles';
import { SCREEN_BREAKPOINTS } from '../../constants';

const QUOTE_DATA = {
  blockquote: `"Anchor makes it so easy to make money of my podcast with it's wide range of monetization options."`,
  cite: `"The Colin and Samir Show"`,
  figcaption: 'Colin, co-host of',
};

const QuoteFigure = styled.figure`
  color: ${COLOR_GREEN};
  margin: 0 auto 48px;
  max-width: 1400px;
  width: 70%;

  @media (max-width: ${SCREEN_BREAKPOINTS.TABLET}px) {
    width: 90%;
  }
`;
const QuoteBlockquote = styled.blockquote`
  border: none;
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 4rem;
  margin: 0 0 24px;
  padding: 0;
  text-align: center;
`;
const QuoteFigcaption = styled.figcaption`
  font-size: 2rem;
  line-height: 3rem;
  text-align: center;
`;

export const Blockquote = () => {
  return (
    <QuoteFigure>
      <QuoteBlockquote>{QUOTE_DATA.blockquote}</QuoteBlockquote>
      <QuoteFigcaption>
        {QUOTE_DATA.figcaption} <cite>{QUOTE_DATA.cite}</cite>
      </QuoteFigcaption>
    </QuoteFigure>
  );
};
