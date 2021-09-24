'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Map as ImmutableMap, List } from 'immutable';
import I18n from 'I18n';
import Request from '../../request/Request';
import * as http from '../../request/http';
import { Promise } from '../../lib/promise';
import { makeOption } from '../Option';
import { validNumerical } from '../ids';
var URL = '/cosemail/v1/emails/by-email-campaign-id/minimal/multi';
var EMAIL_CONTENT_URL = 'cosemail/v1/emails/minimal/multi';
var PREVIEW_ID = '2';

var initial = function initial() {
  return ImmutableMap(_defineProperty({}, PREVIEW_ID, makeOption(PREVIEW_ID, I18n.text('reporting-data.references.email.preview'))));
};

var getEmails = function getEmails(ids) {
  var emailCampaignIds = validNumerical(ids);
  return emailCampaignIds.isEmpty() ? Promise.resolve(ImmutableMap()) : http.retrieve(Request.get({
    url: URL,
    query: {
      emailCampaignId: validNumerical(ids)
    }
  })).then(function (emails) {
    return (// emails.map((email, id) => makeOption(id, email.get('name')))
      emails.reduce(function (options, email, id) {
        return options.set(id, makeOption(id, email.get('name')));
      }, initial())
    );
  });
};

export default getEmails;
export var emails = function emails(ids) {
  return getEmails(List(ids)).then(function (options) {
    return options.reduce(function (breakdowns, option) {
      return Object.assign({}, breakdowns, _defineProperty({}, option.get('value'), option.get('label')));
    }, {});
  });
};
export var getEmailsByContentIds = function getEmailsByContentIds(ids) {
  var emailContentIds = validNumerical(List(ids));
  return emailContentIds.isEmpty() ? Promise.resolve(ImmutableMap()) : http.retrieve(Request.get({
    url: EMAIL_CONTENT_URL,
    query: {
      emailId: validNumerical(ids)
    }
  })).then(function (emailsByContentId) {
    return emailsByContentId.reduce(function (options, email, id) {
      return options.set(id, makeOption(id, email.get('name')));
    }, initial()).reduce(function (breakdowns, option) {
      return Object.assign({}, breakdowns, _defineProperty({}, option.get('value'), option.get('label')));
    }, {});
  });
};