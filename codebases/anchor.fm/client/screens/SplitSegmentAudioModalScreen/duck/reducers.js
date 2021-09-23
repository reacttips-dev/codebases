import { combineReducers } from 'redux';
import types from './types';

/* State Shape
{
    isShowing: bool,
    isPlaying: bool,
    isProcessing: bool,
    isShowingCloseConfirmation: bool,
    audio: null || {
      id: string,
      durationMS: number,
      url: string
    }
}
*/

const initialState = {
  isShowing: false,
  isProcessing: false,
  isShowingCloseConfirmation: false,
  audio: null,
};

const isShowingReducer = (state = initialState.isShowing, action) => {
  switch (action.type) {
    case types.SET_IS_SHOWING:
      return action.payload.isShowing;
    case types.RESET_STORE:
      return initialState.isShowing;
    default:
      return state;
  }
};

const isShowingCloseConfirmationReducer = (
  state = initialState.isShowingCloseConfirmation,
  action
) => {
  switch (action.type) {
    case types.SET_IS_SHOWING_CLOSE_CONFIRMATION:
      return action.payload.isShowingCloseConfirmation;
    case types.RESET_STORE:
      return initialState.isShowingCloseConfirmation;
    default:
      return state;
  }
};

const isProcessingReducer = (state = initialState.isProcessing, action) => {
  switch (action.type) {
    case types.SET_IS_PROCESSING:
      return action.payload.isProcessing;
    case types.RESET_STORE:
      return initialState.isProcessing;
    default:
      return state;
  }
};

const audioReducer = (state = initialState.audio, action) => {
  switch (action.type) {
    case types.SET_AUDIO:
      return action.payload.audio;
    case types.RESET_STORE:
      return initialState.audio;
    default:
      return state;
  }
};

const reducer = combineReducers({
  isShowing: isShowingReducer,
  isProcessing: isProcessingReducer,
  isShowingCloseConfirmation: isShowingCloseConfirmationReducer,
  audio: audioReducer,
});

export default reducer;
