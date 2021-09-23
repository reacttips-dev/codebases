'use es6';

import emptyFunction from 'react-utils/emptyFunction';
import { notification } from './audio';

var setupNotifier = function setupNotifier() {
  if (typeof window.Audio !== 'function') {
    return emptyFunction;
  }

  var canPlay = true;
  var focusEvent = null;
  var playPromise = null;

  var playSafely = function playSafely() {
    var notificationSound = new window.Audio(notification);

    if (canPlay) {
      canPlay = false;
      playPromise = notificationSound.play();

      if (playPromise !== undefined) {
        playPromise.then(function () {
          canPlay = true;
        }).catch(function () {
          // notification prevented
          canPlay = true;
        });
      } else {
        canPlay = true;
      }
    }
  };

  return function (isAdmin) {
    playSafely();

    if (isAdmin) {
      window.removeEventListener('focus', focusEvent);
      playSafely(); // clear the interval if a user focus into the app

      focusEvent = window.addEventListener('focus', function () {
        window.removeEventListener('focus', focusEvent);
      });
    }
  };
};

export var notifyBySound = setupNotifier();