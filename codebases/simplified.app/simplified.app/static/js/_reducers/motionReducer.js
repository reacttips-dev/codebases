/**
 * Reducer for timeline, playback and animations
 *
 */

import { UPDATE_STORY_MUSIC_PLAYBACK } from "../_actions/types";

export const initialState = {
  playbackState: "",
  isMusicExpandedView: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_STORY_MUSIC_PLAYBACK:
      return { ...state, playbackState: action.payload };
    default:
      return state;
  }
}
