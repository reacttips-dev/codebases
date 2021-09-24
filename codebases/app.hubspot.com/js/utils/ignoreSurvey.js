'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";

function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }

function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

import * as SurveyTypes from 'feedback-schema/constants/surveyTypes';
import * as SurveyFrequencyTypes from 'feedback-schema/constants/surveyFrequencyTypes';
import * as BackoffTimeUnits from 'feedback-schema/constants/surveyProperties/backoffTimeUnits';
export var SURVEY_IGNORE_TIMEOUT_DAYS = 14;
var PREFIX = 'FEEDBACK_IGNORED';
var SEPARATOR = '&';

var keyIsInDate = function keyIsInDate(key) {
  var item;

  try {
    item = localStorage.getItem(key);
  } catch (err) {
    console.error(err);
  }

  if (!item) return false;

  if (new Date(item) > new Date()) {
    return true;
  }

  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(err);
  }

  return false;
}; // clear expired keys on startup


Object.keys(localStorage || {}).forEach(function (key) {
  if (key.indexOf(PREFIX) === 0) {
    keyIsInDate(key);
  }
});
export var isSurveyIgnored = function isSurveyIgnored(surveyType, surveyId, portalId, surveyFrequencyType) {
  var key = [PREFIX, surveyType, surveyId, portalId].join(SEPARATOR);
  return surveyFrequencyType !== SurveyFrequencyTypes.INFINITE && keyIsInDate(key);
};
export var getCoolOffInDays = function getCoolOffInDays(backoff, backoffTimeUnit) {
  switch (backoffTimeUnit) {
    case BackoffTimeUnits.MONTHS:
      return SURVEY_IGNORE_TIMEOUT_DAYS;

    case BackoffTimeUnits.WEEKS:
      return backoff === 1 ? 7 : SURVEY_IGNORE_TIMEOUT_DAYS;

    case BackoffTimeUnits.DAYS:
    default:
      return backoff;
  }
};
export var ignoreSurvey = function ignoreSurvey(surveyType, surveyId, portalId) {
  var surveyFrequencyType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : SurveyFrequencyTypes.SINGLE;
  var backoff = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : SURVEY_IGNORE_TIMEOUT_DAYS;
  var backoffTimeUnit = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : BackoffTimeUnits.DAYS;
  var isPreview = arguments.length > 6 ? arguments[6] : undefined;
  var isTest = arguments.length > 7 ? arguments[7] : undefined;

  if (isTest || isPreview) {
    return;
  }

  var key = [PREFIX, surveyType, surveyId, portalId].join(SEPARATOR);

  if (surveyFrequencyType !== SurveyFrequencyTypes.INFINITE) {
    var now = new Date();
    var coolOffInDays = surveyFrequencyType === SurveyFrequencyTypes.INFINITE_WITH_BACKOFF || surveyFrequencyType === SurveyFrequencyTypes.MULTIPLE_WITH_BACKOFF ? getCoolOffInDays(backoff, backoffTimeUnit) : SURVEY_IGNORE_TIMEOUT_DAYS;
    var expiry = new Date(now.getTime() + coolOffInDays * 24 * 60 * 60 * 1000);

    try {
      localStorage.setItem(key, expiry.toISOString());
    } catch (err) {
      console.error(err);
    }
  }
};

var ignoredSurveyRegex = function ignoredSurveyRegex(portalId) {
  return new RegExp("FEEDBACK_IGNORED&(CSAT|NPS)&(\\d+)&" + portalId);
};

export var getIgnoredSurveys = function getIgnoredSurveys(portalId) {
  var _Object$keys$reduce;

  var regex = ignoredSurveyRegex(portalId);
  return Object.keys(localStorage || {}).reduce(function (accumulator, key) {
    var match = key.match(regex);
    if (match === null) return accumulator;
    var id = parseInt(match[2], 10);
    var surveyType = match[1];
    if (!isSurveyIgnored(surveyType, id, portalId)) return accumulator;

    var ids = accumulator[surveyType],
        rest = _objectWithoutProperties(accumulator, [surveyType].map(_toPropertyKey));

    return Object.assign({}, rest, _defineProperty({}, surveyType, [].concat(_toConsumableArray(ids), [id]).sort()));
  }, (_Object$keys$reduce = {}, _defineProperty(_Object$keys$reduce, SurveyTypes.CSAT, []), _defineProperty(_Object$keys$reduce, SurveyTypes.NPS, []), _Object$keys$reduce));
};