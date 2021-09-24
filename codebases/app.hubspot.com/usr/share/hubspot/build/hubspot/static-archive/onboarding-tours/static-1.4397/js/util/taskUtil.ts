import { markActionComplete } from 'user-context/onboarding';
export var markTaskComplete = function markTaskComplete(completeActionKey, options) {
  return markActionComplete(completeActionKey, Object.assign({}, options, {
    source: 'onboarding-tours'
  }));
};