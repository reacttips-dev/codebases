import { PODCAST_AD_TYPES } from './constants';
import {
  CarouselReducerActionProps,
  CarouselStateProps,
  UPDATE_NEXT_ACTIVE_AD_INDEX,
  ROTATE_SLIDE_INDEX_ARRAY,
  CLICK_EVENT,
  TOUCH_START_EVENT,
  TOUCH_MOVE_EVENT,
  TOUCH_END_EVENT,
} from './types';
import { setUpSlideIndexRotation, setUpStartingSlideIndexArray } from './utils';

export const initialState: CarouselStateProps = {
  activeAdIndex: 0,
  activeSlide: PODCAST_AD_TYPES[0],
  didTouchRun: false,
  isRotating: false,
  nextActiveAdIndex: 0,
  rotatingAdIndex: -1,
  slideIndexArray: setUpStartingSlideIndexArray(),
  touchEnd: 0,
  touchStart: 0,
};

export const reducer = (
  state: CarouselStateProps,
  action: CarouselReducerActionProps
): CarouselStateProps => {
  switch (action.type) {
    case UPDATE_NEXT_ACTIVE_AD_INDEX:
      return { ...state, nextActiveAdIndex: action.value };
    case ROTATE_SLIDE_INDEX_ARRAY:
      return setUpSlideIndexRotation(state);
    case CLICK_EVENT:
      // On mobile, the touchEvent and clickEvent both fire (first touch and
      // then click in order of importance). In order to ensure we don't have
      // a double or broken rotation, when the touchEvent results in a rotation
      // we ignore the clickEvent
      if (state.didTouchRun) {
        return { ...state, didTouchRun: false };
      }
      return { ...state, nextActiveAdIndex: action.value };
    case TOUCH_START_EVENT:
      return { ...state, touchStart: action.value };
    case TOUCH_MOVE_EVENT:
      return { ...state, touchEnd: action.value };
    case TOUCH_END_EVENT:
      // This will set the next index value to start the rotation of the slides
      //
      // If the user tried to swipe, the touchEnd value will have been updated and
      // we check if the difference between the touchEnd and touchStart values is
      // large enough to justify a swipe.
      if (
        !!state.touchEnd &&
        Math.abs(state.touchStart - state.touchEnd) >= 100
      ) {
        return {
          ...state,
          didTouchRun: true,
          nextActiveAdIndex:
            state.slideIndexArray[
              state.slideIndexArray.indexOf(state.activeAdIndex) + action.value
            ],
          touchEnd: 0,
          touchStart: 0,
        };
      }
      return { ...state, didTouchRun: false, touchEnd: 0, touchStart: 0 };
    default:
      return state;
  }
};
