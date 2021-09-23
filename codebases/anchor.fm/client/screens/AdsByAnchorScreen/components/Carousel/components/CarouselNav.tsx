import React from 'react';
import styled from '@emotion/styled';
import { PODCAST_AD_TYPES } from '../constants';
import { SCREEN_BREAKPOINTS } from '../../../constants';
import { CarouselNavProps, UPDATE_NEXT_ACTIVE_AD_INDEX } from '../types';

const CarouselNavBar = styled.ul`
  border-bottom: 0.5px solid #97e0ce;
  display: flex;
  justify-content: space-between;
  list-style: none;
  margin-bottom: 50px;
  padding-bottom: 15px;
  padding-inline-start: 0;
  width: 100%;
  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    display: none;
  }
`;

const CarouselNavBarButton = styled.button<{ isActive?: boolean }>`
  color: ${({ isActive }) => (isActive ? '#E8F524' : '#97E0CE')};
  cursor: ${({ isActive }) => (isActive ? 'auto' : 'pointer')};
  font-size: 1.5rem;
  line-height: 2.1rem;
  @media (max-width: ${SCREEN_BREAKPOINTS.SMALL_DESKTOP}px) {
    font-size: 1.2rem;
    line-height: 1.8rem;
  }
  @media (max-width: ${SCREEN_BREAKPOINTS.TABLET}px) {
    font-size: 1rem;
    line-height: 1.2rem;
  }
`;

export const CarouselNav = ({
  activeAdIndex,
  setNextActiveAdIndex,
}: CarouselNavProps) => {
  return (
    <CarouselNavBar>
      {PODCAST_AD_TYPES.map((ad, index) => (
        <li key={`carousel-navigation__${ad.title}`}>
          <CarouselNavBarButton
            isActive={activeAdIndex === index}
            aria-label={`Show description on how to earn money with ${ad.title}`}
            aria-current={activeAdIndex === index}
            onClick={() =>
              setNextActiveAdIndex({
                type: UPDATE_NEXT_ACTIVE_AD_INDEX,
                value: index,
              })
            }
          >
            {ad.title}
          </CarouselNavBarButton>
        </li>
      ))}
    </CarouselNavBar>
  );
};
