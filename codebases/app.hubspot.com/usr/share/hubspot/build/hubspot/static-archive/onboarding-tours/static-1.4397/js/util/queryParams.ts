import { parse } from 'hub-http/helpers/params';
export var getQueryString = function getQueryString() {
  return window.location.search.slice(1);
};
export var getQueryParams = function getQueryParams() {
  return parse(getQueryString());
};
export var getQueryParam = function getQueryParam(key) {
  var params = getQueryParams();
  return params[key] || null;
};
export var getTourIdFromQueryParams = function getTourIdFromQueryParams() {
  var search = document.location.search;

  if (!search) {
    return null;
  }

  var parsedParams = getQueryParams();
  return parsedParams.tourId || parsedParams.onboardingTourId;
};