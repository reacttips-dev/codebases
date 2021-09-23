'use es6';

import { createSelector } from 'reselect';
import { getIsNewThread } from '../../selected-thread/selectors/getIsNewThread';
import { getInputFocus } from '../../visitor-widget/selectors/getInputFocus';
import { getIsMobile } from '../../selectors/getIsMobile';
import { isIOSDevice } from 'conversations-visitor-experience-components/visitor-widget/util/isIOSDevice';
export var getShouldResizeContainer = createSelector([getIsNewThread, getIsMobile, getInputFocus], function (isNewThread, isMobile, inputFocus) {
  return isNewThread && isMobile && inputFocus && isIOSDevice();
});