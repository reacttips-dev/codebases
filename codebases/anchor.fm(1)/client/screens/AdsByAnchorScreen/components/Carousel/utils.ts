import { PODCAST_AD_TYPES } from './constants';
import { CarouselStateProps } from './types';

const rotateSlideIndexArrayLeft = (array: any[]) => {
  array.push(array.shift());
  return array;
};

const rotateSlideIndexArrayRight = (array: any[]) => {
  array.unshift(array.pop());
  return array;
};

export const setUpStartingSlideIndexArray = () => {
  const startingSlideIndexArray = Array.from(
    Array(PODCAST_AD_TYPES.length).keys()
  );
  const midPoint = Math.floor(startingSlideIndexArray.length / 2);
  return [
    ...startingSlideIndexArray.slice(
      midPoint + 1,
      startingSlideIndexArray.length
    ),
    startingSlideIndexArray[0],
    ...startingSlideIndexArray.slice(1, midPoint + 1),
  ];
};

export const setUpSlideIndexRotation = (currentState: CarouselStateProps) => {
  const { activeAdIndex, nextActiveAdIndex, slideIndexArray } = currentState;

  const isSingleTurn =
    Math.abs(
      slideIndexArray.indexOf(nextActiveAdIndex) -
        slideIndexArray.indexOf(activeAdIndex)
    ) <= 1;
  const directionValue =
    slideIndexArray.indexOf(nextActiveAdIndex) <
    slideIndexArray.indexOf(activeAdIndex)
      ? -1
      : 1;
  const currentActiveAdIndex = slideIndexArray.indexOf(activeAdIndex);
  const currentRotatingAdIndex =
    directionValue > 0
      ? slideIndexArray[0]
      : slideIndexArray[slideIndexArray.length - 1];

  let updatedArray = [...slideIndexArray];
  updatedArray =
    directionValue > 0
      ? rotateSlideIndexArrayLeft(slideIndexArray)
      : rotateSlideIndexArrayRight(slideIndexArray);

  return {
    ...currentState,
    activeAdIndex: updatedArray[currentActiveAdIndex],
    activeSlide: PODCAST_AD_TYPES[updatedArray[currentActiveAdIndex]],
    didTouchRun: false,
    isRotating: !isSingleTurn,
    rotatingAdIndex: currentRotatingAdIndex,
    slideIndexArray: updatedArray,
  };
};
