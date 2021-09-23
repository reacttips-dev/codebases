'use es6';

import { scrollTriggerEnabled } from '../../scroll-percentage-trigger/operators/scrollTriggerEnabled';
import { timeOnPageTriggerEnabled } from '../../time-on-page-trigger/operators/timeOnPageTriggerEnabled';
import { exitIntentTriggerEnabled } from '../../exit-intent-trigger/operators/exitIntentTriggerEnabled';
import { gdprCookieConsentOnExitIntentEnabled } from '../../utils/gdprCookieConsentPromptHelpers';
export var hasClientTriggers = function hasClientTriggers(widgetData) {
  return scrollTriggerEnabled(widgetData) || timeOnPageTriggerEnabled(widgetData) || exitIntentTriggerEnabled(widgetData) || gdprCookieConsentOnExitIntentEnabled(widgetData);
};