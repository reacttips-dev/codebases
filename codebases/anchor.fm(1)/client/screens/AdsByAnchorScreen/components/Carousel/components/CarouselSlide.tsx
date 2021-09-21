import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { CarouselSlideProps } from '../types';
import { SCREEN_BREAKPOINTS } from '../../../constants';

const DESKTOP_SLIDE_OFFSET: number = 100;
const MOBILE_SLIDE_OFFSET: number = 80;

const Slide = styled.div<{
  isActive?: boolean;
  isDisplayed?: boolean;
  leftViewWidth?: any;
}>`
  background: #ffffff;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  left: ${({ leftViewWidth }) => leftViewWidth?.desktop}vw;
  max-width: 100%;
  min-width: 100%;
  opacity: ${({ isDisplayed }) => (isDisplayed ? 1 : 0)};
  padding: 45px 90px;
  position: absolute;
  transition: left 0.75s ease-in-out;
  @media (max-width: ${SCREEN_BREAKPOINTS.TABLET}px) {
    padding: 40px 48px;
  }
  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    left: ${({ leftViewWidth }) => leftViewWidth?.mobile}vw;
    margin: 0 10%;
    min-height: 300px;
    max-width: 80%;
    min-width: 80%;
    padding: 15px;
  }
`;

const SlideContentContainer = styled.div`
  display: flex;
  justify-content: center;
  svg {
    max-height: 185px;
    min-height: 185px;
    max-width: 185px;
    min-width: 185px;
  }
  &[data-view='mobile'] {
    display: none;
    svg {
      margin-right: 15px;
      max-height: 100px;
      max-width: 100px;
      min-height: 100px;
      min-width: 100px;
    }
  }
  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    &[data-view='desktop'] {
      display: none;
    }
    &[data-view='mobile'] {
      display: block;
    }
  }
`;

const SlideContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 45px;
  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    align-items: center;
    flex-direction: row;
    justify-content: flex-start;
    margin-bottom: 10px;
    margin-right: 0;
  }
`;

const SlideTitle = styled.h3`
  color: #185941;
  font-size: 3.5rem;
  line-height: 4rem;
  margin: 0 0 25px;
  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    font-size: 2rem;
    line-height: 2.4rem;
    margin: 0;
  }
`;

const SlideBody = styled.p`
  color: #292f36;
  font-size: 2rem;
  line-height: 3rem;
  margin: 0;
  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    font-size: 1.4rem;
    line-height: 2.2rem;
  }
`;

export const CarouselSlide = ({
  activeAdIndex,
  ad,
  index,
  rotatingAdIndex,
  slideIndexArray,
}: CarouselSlideProps) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const isActive = activeAdIndex === index;
  const indexDistance = Math.abs(
    slideIndexArray.indexOf(index) - slideIndexArray.indexOf(activeAdIndex)
  );
  const indexDirection =
    slideIndexArray.indexOf(index) < slideIndexArray.indexOf(activeAdIndex)
      ? -1
      : 1;
  const leftViewWidth = {
    desktop: isActive
      ? 0
      : DESKTOP_SLIDE_OFFSET * indexDistance * indexDirection,
    mobile: isActive ? 0 : MOBILE_SLIDE_OFFSET * indexDistance * indexDirection,
  } as { [key: string]: number };

  // Determines the height dynamically based on what slide is the active slide
  // in the carousel
  useEffect(() => {
    if (slideRef.current) {
      const { ResizeObserver } = window;

      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          if (!isActive) {
            resizeObserver.unobserve(entry.target);
            return;
          }

          const target = entry.target as HTMLElement;
          if (
            target &&
            target.offsetHeight &&
            target.parentElement &&
            target.offsetHeight !== target.parentElement.offsetHeight
          ) {
            target.parentElement.style.height = `${target.offsetHeight}px`;
          }
        }
      });

      resizeObserver.observe(slideRef.current);
    }
  }, [isActive, slideRef]);

  return (
    <Slide
      aria-roledescription="slide"
      aria-hidden={!isActive}
      isActive={isActive}
      isDisplayed={rotatingAdIndex !== index}
      leftViewWidth={leftViewWidth}
      ref={slideRef}
      role="group"
    >
      <SlideContentContainer data-view="desktop">
        <SlideContent>
          <SlideTitle>{ad.title}</SlideTitle>
          <SlideBody>{ad.body.language}</SlideBody>
        </SlideContent>
        {ad.body.svg('desktop')}
      </SlideContentContainer>
      <SlideContentContainer data-view="mobile">
        <SlideContent>
          {ad.body.svg('mobile')}
          <SlideTitle>{ad.title}</SlideTitle>
        </SlideContent>
        <SlideBody>{ad.body.language}</SlideBody>
      </SlideContentContainer>
    </Slide>
  );
};
