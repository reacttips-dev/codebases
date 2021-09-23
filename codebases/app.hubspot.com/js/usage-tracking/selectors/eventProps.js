'use es6';

import { createSelector } from 'reselect';
import { getPopOpenWelcomeMessage } from '../../selectors/widgetDataSelectors/getPopOpenWelcomeMessage';
import { getIsBot } from '../../selectors/widgetDataSelectors/getIsBot';
import { getUrlForMessage } from '../../utils/getUrlForMessage';
import { widgetState } from './widgetState';
export var eventProps = createSelector([widgetState, getIsBot, getPopOpenWelcomeMessage], function (state, botEnabled, promptEnabled) {
  return {
    state: state,
    botEnabled: botEnabled,
    promptEnabled: promptEnabled,
    path: getUrlForMessage()
  };
});