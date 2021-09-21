import { INVOKE, HISTORY } from '../constants';
export function patchHistory(callback) {
  if (!window.history) {
    return;
  }

  var nativePushState = history.pushState;

  if (typeof nativePushState === 'function') {
    history.pushState = function (state, title, url) {
      var task = {
        source: HISTORY,
        data: {
          state: state,
          title: title,
          url: url
        }
      };
      callback(INVOKE, task);
      nativePushState.apply(this, arguments);
    };
  }
}