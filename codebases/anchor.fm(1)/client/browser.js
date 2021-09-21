/**
 * A light wrapper on redux-responsive, to clean up reducers.js
 */
import { createResponsiveStateReducer } from 'redux-responsive';
import { windowUndefined } from '../helpers/serverRenderingUtils';

export const BREAKPOINTS = {
  SMALL: 767,
  MEDIUM: 992,
  LARGE: 1200,
};

export default createResponsiveStateReducer(
  {
    extraSmall: BREAKPOINTS.SMALL,
    small: BREAKPOINTS.MEDIUM,
    medium: BREAKPOINTS.LARGE,
    large: BREAKPOINTS.LARGE,
    extraLarge: BREAKPOINTS.LARGE,
  },
  {
    extraFields: () => ({
      width: windowUndefined() ? 0 : window.innerWidth,
    }),
    initialMediaType: 'extraSmall',
  }
);
