'use es6';

import get from 'transmute/get';
import { createSelector } from 'reselect';
export var getMosScoreFromState = get('networkQuality');
export var getMosScore = createSelector([getMosScoreFromState], get('mosScore'));