import React, { useEffect, useReducer } from 'react';
import styled from '@emotion/styled';
import { COLOR_GREEN } from 'client/components/MarketingPagesShared/styles';
import { PODCAST_AD_TYPES } from './constants';
import { SCREEN_BREAKPOINTS } from '../../constants';
import {
  CarouselNav,
  CarouselNavButton,
  CarouselSlide,
  CarouselStats,
  CarouselType,
} from './components';
import { initialState, reducer } from './store';
import {
  ROTATE_SLIDE_INDEX_ARRAY,
  CLICK_EVENT,
  TOUCH_START_EVENT,
  TOUCH_MOVE_EVENT,
  TOUCH_END_EVENT,
} from './types';

const CarouselSection = styled.section`
  background: ${COLOR_GREEN};
`;

const CarouselContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  overflow: hidden;
  padding: 100px 10%;
  width: 100%;
  @media (max-width: ${SCREEN_BREAKPOINTS.TABLET}px) {
    padding: 65px 5%;
  }
`;

const CarouselTitle = styled.h2`
  color: #ffffff;
  font-size: 6rem;
  margin: 0 0 100px;
  text-align: center;
  @media (max-width: ${SCREEN_BREAKPOINTS.MOBILE}px) {
    font-size: 2.8rem;
    margin: 0 0 50px;
  }
`;

const CarouselSlidesContainer = styled.div`
  margin: 50px 0;
  position: relative;
  transition: height 0.75s ease-in-out;
`;

export const Carousel = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    activeAdIndex,
    activeSlide,
    isRotating,
    nextActiveAdIndex,
    rotatingAdIndex,
    slideIndexArray,
  } = state;

  useEffect(() => {
    if (activeAdIndex !== nextActiveAdIndex) {
      setTimeout(
        () => dispatch({ type: ROTATE_SLIDE_INDEX_ARRAY }),
        isRotating ? 750 : 0
      );
    }
  }, [activeAdIndex, isRotating, nextActiveAdIndex]);

  return (
    <CarouselSection>
      <CarouselContainer>
        <CarouselTitle>Ways to earn with Anchor</CarouselTitle>
        <CarouselNav
          activeAdIndex={activeAdIndex}
          setNextActiveAdIndex={dispatch}
        />
        <CarouselType adType={activeSlide.adType} />
        <CarouselSlidesContainer role="region" aria-roledescription="carousel">
          <CarouselNavButton
            aria-label={`Previous Slide. ${
              activeAdIndex || slideIndexArray.length
            } of ${slideIndexArray.length}`}
            data-type="prev"
            onClick={() => {
              dispatch({
                type: CLICK_EVENT,
                value:
                  slideIndexArray[slideIndexArray.indexOf(activeAdIndex) - 1],
              });
            }}
            onTouchEnd={() => {
              dispatch({ type: TOUCH_END_EVENT, value: -1 });
            }}
            onTouchMove={event => {
              dispatch({
                type: TOUCH_MOVE_EVENT,
                value: event.targetTouches[0].clientX,
              });
            }}
            onTouchStart={event => {
              dispatch({
                type: TOUCH_START_EVENT,
                value: event.targetTouches[0].clientX,
              });
            }}
          />
          {PODCAST_AD_TYPES.map((ad, index) => (
            <CarouselSlide
              activeAdIndex={activeAdIndex}
              ad={ad}
              index={index}
              key={`carousel-slide__${(ad || {}).title}`}
              rotatingAdIndex={rotatingAdIndex}
              slideIndexArray={slideIndexArray}
            />
          ))}
          <CarouselNavButton
            aria-label={`Next Slide. ${
              activeAdIndex + 1 !== slideIndexArray.length
                ? activeAdIndex + 2
                : 1
            } of ${slideIndexArray.length}`}
            data-type="next"
            onClick={() => {
              dispatch({
                type: CLICK_EVENT,
                value:
                  slideIndexArray[slideIndexArray.indexOf(activeAdIndex) + 1],
              });
            }}
            onTouchEnd={() => {
              dispatch({ type: TOUCH_END_EVENT, value: 1 });
            }}
            onTouchMove={event => {
              dispatch({
                type: TOUCH_MOVE_EVENT,
                value: event.targetTouches[0].clientX,
              });
            }}
            onTouchStart={event => {
              dispatch({
                type: TOUCH_START_EVENT,
                value: event.targetTouches[0].clientX,
              });
            }}
          />
        </CarouselSlidesContainer>
        <CarouselStats stats={activeSlide.stats} />
      </CarouselContainer>
    </CarouselSection>
  );
};
