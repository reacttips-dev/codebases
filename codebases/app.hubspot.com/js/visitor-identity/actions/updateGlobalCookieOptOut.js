'use es6';

import get from 'transmute/get';
import { createAction } from 'flux-actions';
import { UPDATE_GLOBAL_COOKIE_OPT_OUT } from '../constants/ActionTypes';
import { updateIsFirstVisitorSession } from './updateIsFirstVisitorSession';
import { localStorageKeys } from '../../localStorage/constants/storageKeys';
import { trackInteraction } from '../../usage-tracking/actions/trackInteraction';
import { getIsPortal53Prod } from '../../widget-data/operators/getIsPortal53Prod';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
export var updateGlobalCookieOptOut = createAction(UPDATE_GLOBAL_COOKIE_OPT_OUT, function (globalCookieOptOut) {
  return {
    globalCookieOptOut: globalCookieOptOut
  };
});
export var onGlobalCookieOptOut = function onGlobalCookieOptOut(globalCookieOptOut) {
  return function (dispatch, getState) {
    var widgetData = getLatestWidgetData(getState());
    dispatch(updateGlobalCookieOptOut(globalCookieOptOut));
    var chatFlowId = get('chatflowId', widgetData);

    if (getIsPortal53Prod() && globalCookieOptOut === 'no' && chatFlowId) {
      dispatch(updateIsFirstVisitorSession(false));
      dispatch(trackInteraction('pageviewFiftyThree', {
        screen: 'widget',
        subscreen: 'thread view',
        action: 'rendered widget',
        chatflowId: chatFlowId
      }));
    }

    if (globalCookieOptOut === 'yes') {
      dispatch(updateIsFirstVisitorSession(true));

      try {
        localStorage.removeItem(localStorageKeys.HUBLYTICS_EVENTS_53);
        localStorage.removeItem(localStorageKeys.HMPL);
      } catch (e) {
        return;
      }
    }
  };
};