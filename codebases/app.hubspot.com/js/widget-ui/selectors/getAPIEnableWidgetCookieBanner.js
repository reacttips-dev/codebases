'use es6';

import { createSelector } from 'reselect';
import { getWidgetUiState } from '../../selectors/getWidgetUiState';
import { getAPIEnableWidgetCookieBanner as getEnableWidgetCookieBannerOperator } from '../operators/getAPIEnableWidgetCookieBanner';
import { ON_WIDGET_LOAD } from 'conversations-internal-schema/widget-data/constants/gdprCookieConsentTypes';
export var getAPIEnableWidgetCookieBanner = createSelector([getWidgetUiState], function (widgetUiState) {
  return getEnableWidgetCookieBannerOperator(widgetUiState) === ON_WIDGET_LOAD || getEnableWidgetCookieBannerOperator(widgetUiState) === 'true';
});