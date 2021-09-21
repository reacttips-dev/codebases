import types from './types';

const setPodcastDataFetchStatus = status => ({
  type: types.SET_PODCAST_DATA_FETCH_STATUS,
  payload: { status },
});

const setPodcast = podcast => ({
  type: types.SET_PODCAST,
  payload: {
    podcast,
  },
});

export const setProfileColor = color => ({
  type: types.SET_PROFILE_COLOR,
  payload: { color },
});

export const setHasAnchorBranding = hasAnchorBranding => ({
  type: types.SET_HAS_ANCHOR_BRANDING,
  payload: {
    hasAnchorBranding,
  },
});

export default {
  setPodcastDataFetchStatus,
  setPodcast,
};
