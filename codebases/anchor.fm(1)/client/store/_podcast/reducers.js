import types from './types';

// TODO: More thought needs to be done to think about what the lifecycle of redux data looks like:
//       Maybe:
//         type LifeCycle = NotInitialized | Initialized | Loading | Updating | Ready | Error
const initialState = { kind: 'notInitialized' };

const _podcastReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_PODCAST:
      return action.payload.podcast;
    default:
      return state;
  }
};

export { _podcastReducer };
