const Promise = require('bluebird');
const xtend = require('xtend');
const $ = require('jquery');
const {
  slackTrelloDomain,
  slackTrelloMicrosDomain,
} = require('@trello/config');
const { featureFlagClient } = require('@trello/feature-flag-client');

const isSlackTrelloOnMicros = featureFlagClient.get(
  'product-integrations.trello-slack-micros',
  false,
);
const slackTrelloBaseUrl = isSlackTrelloOnMicros
  ? slackTrelloMicrosDomain
  : slackTrelloDomain;

const createPromise = (opts) =>
  new Promise(function (resolve, reject) {
    opts = xtend(opts, {
      success(...args) {
        resolve(args);
      },
      error(...args) {
        reject(args);
      },
    });
    $.ajax(opts);
  });
module.exports.ajaxTrello = function (opts) {
  opts.url = slackTrelloBaseUrl + opts.url;
  opts.data = opts.data ?? {};

  opts.headers = {
    Authorization: document.cookie,
  };
  return createPromise(opts);
};
