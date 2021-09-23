'use es6';

import { createSelector } from 'reselect';
import getIn from 'transmute/getIn';
import { getWidgetUiState } from './getWidgetUiState';
export var getShouldHideWelcomeMessage = createSelector([getWidgetUiState], getIn(['hideWelcomeMessage']));