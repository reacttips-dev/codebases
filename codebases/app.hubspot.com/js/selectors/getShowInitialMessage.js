'use es6';

import { createSelector } from 'reselect';
import { getIsOpen } from './getIsOpen';
import { getPopOpenWelcomeMessage } from './widgetDataSelectors/getPopOpenWelcomeMessage';
import { getIsMobile } from '../selectors/getIsMobile';
import { getPopMessageOnSmallScreens } from './widgetDataSelectors/getPopMessageOnSmallScreens';
import { getInitialMessageText } from './widgetDataSelectors/getInitialMessageText';
import { getAvailabilityAwayMessage } from '../availability/selectors/getAvailabilityAwayMessage';
import { getShouldHideWelcomeMessage } from './getShouldHideWelcomeMessage';
export var getShowInitialMessage = createSelector([getPopOpenWelcomeMessage, getPopMessageOnSmallScreens, getInitialMessageText, getAvailabilityAwayMessage, getIsOpen, getIsMobile, getShouldHideWelcomeMessage], function (popOpenWelcomeMessage, popMessageOnSmallScreens, initialMessage, awayMessage, isOpen, isMobile, shouldHideWelcomeMessage) {
  if (shouldHideWelcomeMessage) {
    return false;
  }

  var popMessageOnMobile = Boolean(popMessageOnSmallScreens && isMobile);
  var popMessageOnDesktop = Boolean(popOpenWelcomeMessage && !isMobile);
  var popMessage = Boolean(popMessageOnDesktop || popMessageOnMobile);
  return Boolean(popMessage && !!initialMessage && !awayMessage && !isOpen);
});