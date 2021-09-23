import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import http from 'hub-http/clients/apiClient';
import retryClient from './api/retryClient';
import { setGroupKey } from './api/userContextApi';
import { setOnboardingSettings } from './onboardingSettings';
export var USER_CONTEXT_ACTIONS_BASE_URL = 'usercontext/v1/actions';
export var USER_CONTEXT_APP_BASE_URL = 'usercontext-app/v1';
export var enableTaskCompletionModal = function enableTaskCompletionModal(actionName) {
  var bannerFrame = document.getElementById('onboarding-tours-banner-frame');

  if (!window.sessionStorage || !bannerFrame || !bannerFrame.contentWindow) {
    return;
  }

  try {
    var configKey = 'ONBOARDING_TOURS_GUIDE';
    var configJson = window.sessionStorage.getItem(configKey);

    if (!configJson) {
      return;
    }

    var config = JSON.parse(configJson);

    if (config.type === 'task' && config.key === actionName) {
      config.completed = true;
      bannerFrame.contentWindow.postMessage({
        key: configKey,
        value: config
      }, '*');
    }
  } catch (e) {
    return;
  }
};
export var markActionComplete = function markActionComplete(actionName) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return retryClient.post(USER_CONTEXT_ACTIONS_BASE_URL, {
    data: {
      actionName: actionName
    }
  }).then(function () {
    var _options$showTaskComp = options.showTaskCompletionModal,
        showTaskCompletionModal = _options$showTaskComp === void 0 ? true : _options$showTaskComp,
        source = options.source;

    if (!showTaskCompletionModal) {
      return;
    }
    /**
     * Ignore task completion modal for avoiding breaking onboarding tour when:
     *   - Any onboarding tour is active in current page
     *   - markActionComplete is not triggered from onboarding-tours lib
     * */


    if (source !== 'onboarding-tours' && document.querySelector('.onboarding-tour-container')) {
      return;
    }

    enableTaskCompletionModal(actionName);
  });
};
export var getCompletedActions = function getCompletedActions() {
  return http.get(USER_CONTEXT_ACTIONS_BASE_URL);
};
export var getIsActionCompleted = function getIsActionCompleted(actionName) {
  return http.get(USER_CONTEXT_ACTIONS_BASE_URL + "/" + actionName);
};
export var getTasksGroup = function getTasksGroup() {
  return http.get(USER_CONTEXT_APP_BASE_URL + "/onboarding/tasks/group", {
    headers: {
      accept: 'text/plain'
    }
  });
};
export var setDefaultGroupKey = function setDefaultGroupKey(groupKey, options) {
  return setGroupKey(groupKey, options);
};
export var setGettingStartedGroupKey = function setGettingStartedGroupKey(groupKey, view, userId, portalId, options) {
  var groupKeyRequests = [setDefaultGroupKey(groupKey, options)];

  if (view && userId) {
    groupKeyRequests.push(setOnboardingSettings({
      views: _defineProperty({}, view, {
        groupKey: groupKey
      }),
      selectedView: view
    }, userId, portalId, options));
  }

  return Promise.all(groupKeyRequests);
};