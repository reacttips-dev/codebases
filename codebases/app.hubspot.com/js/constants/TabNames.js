'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
export var OVERVIEW_TAB = {
  pathname: '/overview',
  tabId: 'overview',
  title: /*#__PURE__*/_jsx(FormattedMessage, {
    message: "index.tabs.overview"
  })
};
export var MANAGE_TAB = {
  pathname: '/manage',
  tabId: 'manage',
  title: /*#__PURE__*/_jsx(FormattedMessage, {
    message: "index.tabs.manage"
  })
};
export var SCHEDULED_TAB = {
  pathname: '/scheduled',
  tabId: 'scheduled',
  title: /*#__PURE__*/_jsx(FormattedMessage, {
    message: "index.tabs.scheduled"
  })
};
export var getVisibleTabs = function getVisibleTabs() {
  return [OVERVIEW_TAB, MANAGE_TAB, SCHEDULED_TAB];
};