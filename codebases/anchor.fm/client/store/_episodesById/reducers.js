import types from './types';

const initialState = { kind: 'notInitialized' };

const _episodesByIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_EPISODES_BY_ID:
      return action.payload.episodesById;
    default:
      return state;
  }
};

export { _episodesByIdReducer };
