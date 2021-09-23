'use es6';

import http from 'hub-http/clients/apiClient';
import SendSurveyTaskRequest from '../models/SendSurveyTaskRequest';
var SURVEYS_URI = 'surveymonkey/v1/surveys';
var SETTINGS_URI = 'surveymonkey/v1/settings';
var SEND_SURVEY_TASK_URI = 'surveymonkey/v1/send-survey-tasks';
var requestTimeout = 10000;

function fetchMoreFieldsToTheTask(sendSurveyTask) {
  return new Promise(function (resolve) {
    http.get(SURVEYS_URI + "/" + sendSurveyTask.surveyId).then(function (surveyDetails) {
      sendSurveyTask.surveyTitle = surveyDetails.title;
      sendSurveyTask.analysisUrl = surveyDetails.analysisUrl;
      return resolve(sendSurveyTask);
    }).catch(function () {
      return resolve(null);
    });
  });
}

export function fetchAllSentSurveysForContact(requestedContactVid) {
  return http.get(SEND_SURVEY_TASK_URI, {
    query: {
      contactVid: requestedContactVid
    },
    timeout: requestTimeout
  }).then(function (surveyTasksList) {
    return Promise.all(surveyTasksList.map(function (task) {
      return fetchMoreFieldsToTheTask(task);
    }));
  }).then(function (surveyTasksList) {
    return surveyTasksList.filter(function (task) {
      return task !== null;
    });
  });
}
export function scheduleSendingSurveyForContacts(portalIdParam, surveyIdParam, contactVids) {
  var sendSurveyTaskList = contactVids.map(function (vid) {
    return new SendSurveyTaskRequest({
      portalId: portalIdParam,
      surveyId: surveyIdParam,
      contactVid: vid
    });
  });
  return http.post(SEND_SURVEY_TASK_URI + "/batch", {
    data: sendSurveyTaskList,
    timeout: requestTimeout
  });
}
export function cancelSendingSurveyForContacts(portalIdParam, surveyIdParam, contactVids) {
  var sendSurveyTaskList = contactVids.map(function (vid) {
    return new SendSurveyTaskRequest({
      portalId: portalIdParam,
      surveyId: surveyIdParam,
      contactVid: vid
    });
  });
  return http.post(SEND_SURVEY_TASK_URI + "/cancel/batch", {
    data: sendSurveyTaskList,
    timeout: requestTimeout
  });
}
export function isSurveyMonkeyIntegrationInstalledOnPortal() {
  return http.get(SETTINGS_URI).then(function (response) {
    return response.enabled;
  });
}