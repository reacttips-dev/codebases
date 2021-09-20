/* eslint-disable @trello/disallow-filenames */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');

const getQueryParams = function () {
  const queryString = window.location.search;
  return _.chain(queryString.substring(1).split('&'))
    .map((param) => param.split('='))
    .object()
    .value();
};

const getQueryParamByKey = (key) => getQueryParams()[key];

module.exports.getQueryParamByKey = getQueryParamByKey;
