'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import getHubletSuffix from 'forms-embed-utils-lib/hublets/getHubletSuffix';
import * as MessageChannels from 'feedback-schema/constants/messageChannels';
import * as MessageTypes from 'feedback-schema/constants/messageTypes';
import * as Env from '../utils/environment';
import get from '../utils/http/get';
import { getIgnoredSurveys } from '../utils/ignoreSurvey';
import { parentSender } from 'feedback-utils/messages';
import { parentListener } from 'feedback-utils/subscriptions/messages';
import { toQueryParams } from 'feedback-utils/urls';
var hublet;
var baseParams;
var envIsHubspot;
var QA_SUFFIX = Env.isQa ? 'qa' : '';
var BASE_FEEDBACK_URL = "hubapi" + QA_SUFFIX + ".com/feedback";
var BASE_FEEDBACK_AUTH_URL = "hubspot" + QA_SUFFIX + ".com/feedback";
var send = parentSender(MessageChannels.FETCHER); // fifo of urls we've visited

var backlog = [];
var currentRequest;

var getSurveyExclusionParams = function getSurveyExclusionParams() {
  var ignored = getIgnoredSurveys(baseParams.portalId);
  return Object.keys(ignored).reduce(function (acc, surveyType) {
    return Object.assign({}, acc, _defineProperty({}, "excludedIds." + surveyType, ignored[surveyType]));
  }, {});
};

var handleSurveyConfig = function handleSurveyConfig(payload) {
  currentRequest = false; // eslint-disable-next-line no-use-before-define

  maybeMakeRequest();
  if (!payload.config) return;
  send(MessageTypes.SURVEY_FETCHED, payload);
};

var handleConfigFetched = function handleConfigFetched(payload) {
  if (!payload.config) return;
  send(MessageTypes.CONFIG_FETCHED, payload);
};

var getCookie = function getCookie(cookies) {
  var csrfExpression = /csrf.app=([^;]+);?/;
  var csrfResult = csrfExpression.exec(cookies);
  return csrfResult && csrfResult[1];
};

var fetchSurvey = function fetchSurvey(surveyType, surveyId) {
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  currentRequest = true;

  var _baseParams = baseParams,
      customerPortalId = _baseParams.customerPortalId,
      portalId = _baseParams.portalId,
      otherParams = _objectWithoutProperties(_baseParams, ["customerPortalId", "portalId"]);

  var params = Object.assign({}, otherParams, {
    bundleVersion: Env.bundleVersion,
    portalId: customerPortalId || portalId
  });
  var csrfCookie = getCookie(window.document.cookie);
  var suffix = getHubletSuffix(hublet);
  var BASE_AUTH_URL = "https://api" + suffix + "." + BASE_FEEDBACK_AUTH_URL + "/v1";
  get(BASE_AUTH_URL + "/survey-config/" + surveyType + "/" + surveyId + "?" + toQueryParams(params), callback, {
    headers: {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Content-type': 'application/json',
      'X-HubSpot-CSRF-hubspotapi': csrfCookie
    },
    withCredentials: true
  });
};

var maybeMakeRequest = function maybeMakeRequest() {
  if (!baseParams.portalId) return;
  if (currentRequest || backlog.length === 0) return;
  currentRequest = true;
  var url = backlog.shift();
  var ignoredParams = getSurveyExclusionParams();
  var params = Object.assign({}, baseParams, {
    bundleVersion: Env.bundleVersion,
    pageUrl: url
  }, ignoredParams);
  if (!params.portalId) return;
  var headers = {
    'X-HS-Referer': url
  };

  if (envIsHubspot) {
    var csrfCookie = getCookie(window.document.cookie);
    headers = Object.assign({}, headers, {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Content-type': 'application/json',
      'X-HubSpot-CSRF-hubspotapi': csrfCookie
    });
  }

  var suffix = getHubletSuffix(hublet);
  var AUTH_URL = "https://api" + suffix + "." + BASE_FEEDBACK_AUTH_URL + "/v1/survey-config/web";
  var PUBLIC_URL = "https://feedback" + suffix + "." + BASE_FEEDBACK_URL + "/public/v1/web-config";
  var targetUrl = envIsHubspot ? AUTH_URL : PUBLIC_URL;
  get(targetUrl + "?" + toQueryParams(params), handleSurveyConfig, {
    headers: headers,
    withCredentials: envIsHubspot
  });
};

var listener = function listener(messageType, payload) {
  switch (messageType) {
    case MessageTypes.SETUP:
      {
        var pageUrl = payload.pageUrl,
            isHubspot = payload.isHubspot,
            hub = payload.hublet,
            rest = _objectWithoutProperties(payload, ["pageUrl", "isHubspot", "hublet"]);

        backlog.push(pageUrl);
        hublet = hub;
        baseParams = rest;
        envIsHubspot = isHubspot;
        break;
      }

    case MessageTypes.LOAD_CONFIG_ONLY:
      {
        var surveyType = payload.surveyType,
            surveyId = payload.surveyId;
        fetchSurvey(surveyType, surveyId, handleConfigFetched);
        break;
      }

    case MessageTypes.LOCATION_CHANGE:
      {
        backlog.push(payload);
        break;
      }

    case MessageTypes.LOAD_SURVEY:
      {
        var _surveyType = payload.surveyType,
            _surveyId = payload.surveyId;
        fetchSurvey(_surveyType, _surveyId, handleSurveyConfig);
        break;
      }

    default:
      break;
  }

  maybeMakeRequest();
};

parentListener(MessageChannels.FETCHER)(listener);
send(MessageTypes.READY);