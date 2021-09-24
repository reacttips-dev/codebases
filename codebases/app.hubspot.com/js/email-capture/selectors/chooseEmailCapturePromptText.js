'use es6';

import { createSelector } from 'reselect';
import I18n from 'I18n';
import getShouldShowOfficeHoursEmailCaptureMessage from './getShouldShowOfficeHoursEmailCaptureMessage';
import { getAskForEmailMessage } from '../../selectors/widgetDataSelectors/getAskForEmailMessage';
import { widgetIsInAwayMode } from '../../availability/selectors/widgetIsInAwayMode';
export var chooseEmailCapturePromptText = createSelector([widgetIsInAwayMode, getShouldShowOfficeHoursEmailCaptureMessage, getAskForEmailMessage], function (widgetIsAway, shouldShowOfficeHoursEmailCaptureMessage, askForEmailMessage) {
  if (widgetIsAway) {
    return I18n.text('conversations-visitor-ui.emailCapture.defaultAwayEmailCaptureMessage');
  }

  if (shouldShowOfficeHoursEmailCaptureMessage) {
    return I18n.text('conversations-visitor-ui.emailCapture.outsideOfficeHoursMessage');
  }

  return askForEmailMessage;
});