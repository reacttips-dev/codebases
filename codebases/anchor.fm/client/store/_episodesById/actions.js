import types from './types';

const setEpisodesById = episodesById => ({
  type: types.SET_EPISODES_BY_ID,
  payload: {
    episodesById,
  },
});

export default {
  setEpisodesById,
};
