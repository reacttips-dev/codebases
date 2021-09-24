import http from 'hub-http/clients/apiClient';
import { getUrl } from '../utils/urlUtils';
export var setGroupKey = function setGroupKey(groupKey, options) {
  var taskGroupPath = 'usercontext-app/v1/onboarding/tasks/group';
  return http.post(getUrl(taskGroupPath, options), {
    data: {
      groupKey: groupKey
    }
  });
};