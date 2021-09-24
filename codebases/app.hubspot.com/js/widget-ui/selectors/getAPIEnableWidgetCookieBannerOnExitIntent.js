'use es6';

import { createSelector } from 'reselect';
import { getWidgetUiState } from '../../selectors/getWidgetUiState';
import { getAPIEnableWidgetCookieBanner as getAPIEnableWidgetCookieBannerOperator } from '../operators/getAPIEnableWidgetCookieBanner';
import { ON_EXIT_INTENT } from 'conversations-internal-schema/widget-data/constants/gdprCookieConsentTypes';
export var getAPIEnableWidgetCookieBannerOnExitIntent = createSelector([getWidgetUiState], function (widgetUiState) {
  return getAPIEnableWidgetCookieBannerOperator(widgetUiState) === ON_EXIT_INTENT;
});