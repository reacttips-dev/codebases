import { MESSAGE_ACTIONS, MESSAGE_KEY } from '../constants/TourMessageConstants';
export var subscribeToTourCompletion = function subscribeToTourCompletion(callback) {
  var handler = function handler(event) {
    var _event$data = event.data,
        key = _event$data.key,
        action = _event$data.action;

    if (key === MESSAGE_KEY && action === MESSAGE_ACTIONS.TOUR_COMPLETED) {
      callback();
    }
  };

  window.addEventListener('message', handler, false);
  return function () {
    return window.removeEventListener('message', handler, false);
  };
};