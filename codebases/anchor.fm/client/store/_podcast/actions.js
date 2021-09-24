import types from './types';

const updatePodcast = podcast => ({
  type: types.UPDATE_PODCAST,
  payload: {
    podcast,
  },
});

export default {
  updatePodcast,
};
