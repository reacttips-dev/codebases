import PropTypes from 'prop-types';

// Api status
export const API_BEFORE_SEND = 'API_BEFORE_SEND';
export const API_IN_PROGRESS = 'API_IN_PROGRESS';
export const API_SUCCESS = 'API_SUCCESS';
export const API_ERROR = 'API_ERROR';

export const apiStatusPropType = PropTypes.oneOf([API_BEFORE_SEND, API_IN_PROGRESS, API_ERROR, API_SUCCESS]);

// TODO(Audrey): add more structured error PropTypes later
export const errorPropType = PropTypes.object;

export const ApiStates = {
  API_BEFORE_SEND,
  API_IN_PROGRESS,
  API_SUCCESS,
  API_ERROR,
} as const;

export type ApiState = typeof ApiStates[keyof typeof ApiStates];
