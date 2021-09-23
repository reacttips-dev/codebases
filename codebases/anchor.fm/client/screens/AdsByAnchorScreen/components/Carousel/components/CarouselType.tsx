import React from 'react';
import styled from '@emotion/styled';
import { CarouselTypeProps } from '../types';
import { SCREEN_BREAKPOINTS } from '../../../constants';

const CarouselAdTypeElement = styled.p`
  color: #ffffff;
  font-size: 1.8rem;
  line-height: 2.8rem;
  margin: 0 0 15px;
  padding: 0 8%;
  span {
    font-weight: bold;
  }
  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    font-size: 1.4rem;
    line-height: 2.2rem;
    margin: 0 0 12px;
    padding: 0;
  }
`;

export const CarouselType = ({ adType }: CarouselTypeProps) => {
  return (
    <div>
      <CarouselAdTypeElement>{adType.type}</CarouselAdTypeElement>
      <CarouselAdTypeElement>{adType.description}</CarouselAdTypeElement>
    </div>
  );
};
