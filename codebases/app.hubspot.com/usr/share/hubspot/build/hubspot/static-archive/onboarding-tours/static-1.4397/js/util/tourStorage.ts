import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { debug } from './debugUtil';
import { getTourIdFromQueryParams } from './queryParams';
var ONBOARDING_NEXT_TOUR_KEY = 'ONBOARDING_NEXT_TOUR';

var buildTourItem = function buildTourItem(tourId, prevTourId, prevTourLength, linkedToursTotalStepCount, returnUrl) {
  return {
    tourId: tourId,
    prevTourId: prevTourId,
    prevTourLength: prevTourLength,
    linkedToursTotalStepCount: linkedToursTotalStepCount,
    returnUrl: returnUrl
  };
};

var getSessionStorage = function getSessionStorage() {
  return window.sessionStorage || {
    setItem: function setItem(key, value) {
      var encodedKey = encodeURIComponent("TOUR:" + key);
      var encodedValue = encodeURIComponent(value); // No expires and max-age specified, it will expire at the end of session.

      document.cookie = encodedKey + "=" + encodedValue + "; path=/";
    },
    getItem: function getItem(key) {
      if (!document.cookie) return null; // document.cookie format is like: "foo=bar; baz=qux"

      var cookies = "; " + document.cookie;
      var encodedKey = encodeURIComponent("TOUR:" + key); //getItem('foo'): cookieValue will be 'bar; baz=qux'

      var _cookies$split = cookies.split("; " + encodedKey + "="),
          _cookies$split2 = _slicedToArray(_cookies$split, 2),
          cookieValue = _cookies$split2[1];

      if (cookieValue) {
        // getItem('foo'): return value will be 'bar'
        return decodeURIComponent(cookieValue.split(';')[0]);
      }

      return null;
    },
    removeItem: function removeItem(key) {
      this.setItem(key, '');
    }
  };
};

export var removeNextTourToStorage = function removeNextTourToStorage() {
  var sessionStorage = getSessionStorage();
  sessionStorage.removeItem(ONBOARDING_NEXT_TOUR_KEY);
};

var getTourValueFromStorage = function getTourValueFromStorage() {
  var sessionStorage = getSessionStorage();
  var nextTourValue = sessionStorage.getItem(ONBOARDING_NEXT_TOUR_KEY);
  return nextTourValue;
};

var getNextTourIdFromStorage = function getNextTourIdFromStorage() {
  var nextTourValue = getTourValueFromStorage();

  if (nextTourValue) {
    var nextTourData = JSON.parse(nextTourValue);
    return nextTourData.tourId;
  }

  return null;
};

export var getNextTourFromStorage = function getNextTourFromStorage() {
  var nextTourValue = getTourValueFromStorage();

  if (!nextTourValue) {
    return {};
  }

  var nextTourData = JSON.parse(nextTourValue);
  removeNextTourToStorage();

  if (!nextTourData) {
    return {};
  }

  var tourId = nextTourData.tourId,
      prevTourId = nextTourData.prevTourId,
      prevTourLength = nextTourData.prevTourLength,
      linkedToursTotalStepCount = nextTourData.linkedToursTotalStepCount,
      returnUrl = nextTourData.returnUrl;

  var _tourId$split = tourId.split(':'),
      _tourId$split2 = _slicedToArray(_tourId$split, 2),
      nextTour = _tourId$split2[0],
      targetPageRegex = _tourId$split2[1];

  if (!targetPageRegex) {
    return {
      tourId: nextTour,
      prevTourId: prevTourId,
      prevTourLength: prevTourLength,
      linkedToursTotalStepCount: linkedToursTotalStepCount,
      returnUrl: returnUrl
    };
  }

  var pathname = document.location.pathname;
  var regex = RegExp(targetPageRegex);
  var isTargetPage = regex.test(pathname);
  return {
    tourId: isTargetPage && nextTour,
    prevTourId: isTargetPage && prevTourId,
    prevTourLength: isTargetPage && prevTourLength,
    linkedToursTotalStepCount: isTargetPage && linkedToursTotalStepCount,
    returnUrl: isTargetPage && returnUrl
  };
};
export var setNextTourToStorage = function setNextTourToStorage(nextTourId, currentTourId, completedStepsCount, linkedToursTotalStepCount, returnUrl) {
  debug('Setting next tour show: ', nextTourId);
  var sessionStorage = getSessionStorage();
  var tourItem = JSON.stringify(buildTourItem(nextTourId, currentTourId, completedStepsCount, linkedToursTotalStepCount, returnUrl));
  sessionStorage.setItem(ONBOARDING_NEXT_TOUR_KEY, tourItem);
};
export var getShouldEnableTour = function getShouldEnableTour() {
  if (getTourIdFromQueryParams()) {
    return true;
  }

  var tourId = getNextTourIdFromStorage();
  return Boolean(tourId);
};