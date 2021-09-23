import { push } from 'react-router-redux';

export const FETCHING_EPISODES = '@@episodes/FETCHING_EPISODES';
export const RECEIVE_EPISODES = '@@episodes/RECEIVE_EPISODES';
export const SET_IS_CREATING = '@@episodes/SET_IS_CREATING';
export const SET_IS_RENAMING = '@@episodes/SET_IS_RENAMING';

const emptyArray = [];

const initialState = {
  episodes: emptyArray,
  isFetching: false,
  isCreating: false,
};

// reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCHING_EPISODES: {
      const { isFetching } = action;
      return {
        ...state,
        isFetching,
      };
    }
    case RECEIVE_EPISODES:
      return {
        ...state,
        episodes: action.episodes,
      };
    case SET_IS_RENAMING:
      return {
        ...state,
        isRenaming: action.isRenaming,
      };
    case SET_IS_CREATING:
      return {
        ...state,
        isCreating: action.isCreating,
      };
    default:
      return state;
  }
}

// action creators
function receiveEpisodes(episodes) {
  return {
    type: RECEIVE_EPISODES,
    episodes,
  };
}

function fetchingEpisodes(isFetching) {
  return {
    type: FETCHING_EPISODES,
    isFetching,
  };
}

function setIsCreating(isCreating) {
  return {
    type: SET_IS_CREATING,
    isCreating,
  };
}

// thunks
