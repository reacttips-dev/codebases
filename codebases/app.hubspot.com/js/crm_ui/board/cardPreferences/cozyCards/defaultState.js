'use es6';

import { Map as ImmutableMap } from 'immutable';
import { STYLES, BOTTOM_PANEL } from './constants';
/**
 * defaultState differentiats from initialState in that initialState loads any existing preferences
 * from UserSettingsStore, while defaultState is used per objectType if no preferences have been
 * set for that objectType
 */

export var getDefaultState = function getDefaultState() {
  return ImmutableMap({
    STYLE: STYLES.DEFAULT,
    BOTTOM_PANEL: BOTTOM_PANEL.DEFAULT
  });
};