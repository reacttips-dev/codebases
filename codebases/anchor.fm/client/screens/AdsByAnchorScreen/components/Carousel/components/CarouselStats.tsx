import React from 'react';
import styled from '@emotion/styled';
import { CarouselStatsProps, AdStat } from '../types';
import { SCREEN_BREAKPOINTS } from '../../../constants';

const CarouselAdStatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 230px;
  padding: 0 8%;
  @media (max-width: ${SCREEN_BREAKPOINTS.TABLET}px) {
    padding: 0;
  }
  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const CarouselStat = styled.div`
  width: 30%;
  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    width: 100%;
  }
`;

const CarouselAdStatTitle = styled.h4`
  color: #ffffff;
  font-size: 1.8rem;
  line-height: 3rem;
  letter-spacing: 0.03em;
  margin: 0;
  text-transform: uppercase;
  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    font-size: 1.2rem;
    line-height: 2.2rem;
  }
`;

const CarouselAdStatBody = styled.p`
  color: #ffffff;
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 4.5rem;
  margin: 0 0 15px;
  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    font-size: 2rem;
    line-height: 2.2rem;
    margin: 0 0 5px;
  }
`;

const CarouselAdStatLink = styled.a`
  color: #e8f524;
  font-size: 3.5rem;
  line-height: 4.5rem;
  margin: 0 0 15px;
  text-decoration-line: underline;
  &:hover {
    color: #e8f524;
  }
  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    font-size: 2rem;
    line-height: 2.2rem;
    margin: 0 0 5px;
  }
`;

const CarouselAdStatSub = styled.p`
  color: #ffffff;
  font-size: 1.6rem;
  line-height: 2.4rem;
  margin: 0;
  opacity: 0.75;
  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    font-size: 1.2rem;
    line-height: 1.6rem;
    margin: 0 0 25px;
  }
`;

export const CarouselStats = ({ stats }: CarouselStatsProps) => {
  return (
    <CarouselAdStatsContainer>
      {stats.map((stat: AdStat) => (
        <CarouselStat key={`carousel-stat__${stat.title}`}>
          <CarouselAdStatTitle>{stat.title}</CarouselAdStatTitle>
          {stat.link ? (
            <CarouselAdStatLink href={stat.link}>
              {stat.body}
            </CarouselAdStatLink>
          ) : (
            <CarouselAdStatBody>{stat.body}</CarouselAdStatBody>
          )}
          <CarouselAdStatSub>{stat.subtext}</CarouselAdStatSub>
        </CarouselStat>
      ))}
    </CarouselAdStatsContainer>
  );
};
