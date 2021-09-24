'use es6';

import { getQueryParam } from '../util/QueryParamUtil';
import UnreadNotificationManager from './UnreadNotificationManager';
import { registerBrowserApiValue } from '../util/BrowserApiUtil';
import { NOTIFICATION_SIDEBAR_OPEN } from '../constants/PostMessageConstants';
var OPEN_SIDEBAR_PARAM = 'openSidebar';

function handleSidebarOpened() {
  if (getQueryParam(OPEN_SIDEBAR_PARAM)) {
    parent.postMessage(JSON.stringify({
      name: NOTIFICATION_SIDEBAR_OPEN
    }), window.location.origin);
  }
}

function setResetCounterFunction() {
  registerBrowserApiValue('resetBellCounter', function () {
    UnreadNotificationManager.resetCounter(true);
  });
}

function setup() {
  handleSidebarOpened();
  setResetCounterFunction();
}

export default {
  setup: setup
};