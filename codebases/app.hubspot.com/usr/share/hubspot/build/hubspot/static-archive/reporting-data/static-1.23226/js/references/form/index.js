'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { List, Map as ImmutableMap, fromJS } from 'immutable';
import I18n from 'I18n';
import { Promise } from '../../lib/promise';
import toJS from '../../lib/toJS';
import * as http from '../../request/http';
import { makeOption } from '../Option';
import { GLOBAL_NULL } from '../../constants/defaultNullValues';

var fetchForms = function fetchForms(property) {
  return http.get('forms/v2/forms', {
    query: {
      property: property
    }
  }).then(toJS);
};

export var generateFormLabel = function generateFormLabel(form, key) {
  var immutableForm = fromJS(form);
  return immutableForm.get('name', key === GLOBAL_NULL ? null : key);
};

var getForms = function getForms(ids) {
  return ids.isEmpty() ? Promise.resolve(ImmutableMap()) : fetchForms(['guid', 'name']).then(function (forms) {
    return forms.reduce(function (memo, form) {
      var id = form.guid;
      var name = generateFormLabel(form);
      return ids.includes(id) ? memo.push(makeOption(id, name)) : memo;
    }, List());
  });
};

export default getForms;
export var forms = function forms(ids) {
  return getForms(ids).then(function (options) {
    return options.reduce(function (breakdowns, option) {
      return Object.assign({}, breakdowns, _defineProperty({}, option.get('value'), option.get('label')));
    }, {});
  });
};

var getVariantLabel = function getVariantLabel(idx) {
  return I18n.text("reporting-data.properties.forms.variants." + String.fromCharCode(97 + idx));
};

export var variants = function variants(ids) {
  return Promise.resolve(ids.reduce(function (result, id, idx) {
    return Object.assign({}, result, _defineProperty({}, id, getVariantLabel(idx)));
  }, {}));
};