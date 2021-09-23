'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import I18n from 'I18n';
import formatName from 'I18n/utils/formatName';
import { Map as ImmutableMap } from 'immutable';
import chunk from '../../lib/async/chunk';
import toJS from '../../lib/toJS';
import * as http from '../../request/http';
import { validNumerical } from '../ids';
import { makeOption } from '../Option';

var format = function format(_ref) {
  var firstName = _ref.firstName,
      lastName = _ref.lastName,
      email = _ref.email;
  return formatName({
    firstName: firstName,
    lastName: lastName,
    email: email
  });
};

var batch = function batch(ids) {
  return chunk(function (group) {
    return http.post("owners/v2/owners/batch-get/remotes/HUBSPOT", {
      data: group
    }).then(toJS);
  }, function (responses) {
    return responses.reduce(function (memo, response) {
      return Object.assign({}, memo, {}, response);
    }, {});
  }, ids);
};

var remote = function remote(ids) {
  return batch(validNumerical(ids)).then(function (remotes) {
    return Object.keys(remotes).reduce(function (options, remoteId) {
      return options.set(String(remoteId), makeOption(remoteId, format(remotes[remoteId])));
    }, ImmutableMap());
  });
};

export default remote;
export var getRemotes = function getRemotes(ids) {
  return remote(ids).then(function (options) {
    return options.reduce(function (breakdowns, option) {
      return Object.assign({}, breakdowns, _defineProperty({}, option.get('value'), option.get('label')));
    }, {
      '-1': I18n.text('reporting-data.properties.sales-templates.rootUser')
    });
  });
};