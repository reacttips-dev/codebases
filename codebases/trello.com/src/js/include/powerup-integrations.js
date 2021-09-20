/* global Auth, Sentry, TrelloPowerUp */

const IntegrationsAtlassian = require('./powerup-integrations-atlassian.js');
const IntegrationsSlack = require('./powerup-integrations-slack.js');
const kApiEndpoint = require('./api-endpoint.js');

const AppRegistry = {};
let integrationError;
const IntegrationError = () => {
  if (!integrationError) {
    integrationError = TrelloPowerUp.util.makeErrorEnum('Integration', ['Unknown']);
  }
  return integrationError;
};

let _is_init = false;
let Builder;
const init = builder => {
  if (_is_init) return;
  _is_init = true;
  Builder = builder;

  IntegrationsAtlassian.registerApps(registerApp);
  IntegrationsSlack.registerApps(registerApp);
};

const registerApp = (appName, handler) => {
  if (AppRegistry.hasOwnProperty(appName)) {
    console.error('App already registered', appName);
  }
  if (typeof handler !== 'function') {
    throw new Error(`Invalid handler for ${appName}: ${JSON.stringify(handler)}`);
  }
  AppRegistry[appName] = { handler };
};

const handleAction = (appName, verb, params) => {
  const app = AppRegistry[appName];
  if (!app) {
    return new TrelloPowerUp.Promise((resolve, reject) => reject(`Unknown app "${appName}"`));
  }

  const t =
    window._trello ||
    TrelloPowerUp.iframe({
      targetOrigin: 'https://trello.com',
    });

  const context = {
    t,
    params,
    submitIntegrationConnectRequest: submitIntegrationConnectRequest.bind(null, appName),
  };

  return new TrelloPowerUp.Promise(resolve => resolve(app.handler(verb, context)));
};

const handleActionSync = (appName, verb, params) => {
  const app = AppRegistry[appName];
  if (!app) {
    throw new Error(`Unknown app "${appName}"`);
  }
  const context = {
    params,
  };
  return app.handler(verb, context);
};

const getUserIntegrations = () => {
  return new TrelloPowerUp.Promise((resolve, reject) => {
    $.ajax(`${kApiEndpoint}integrations`, {
      type: 'GET',
      headers: { 'X-Butler-Trello-Token': Auth.getActiveToken() },
    })
      .done(response => {
        if (response.success) {
          resolve(response.response);
          return;
        }
        const err = new IntegrationError().Unknown(response.error);
        Sentry.captureException(err);
        reject(err);
      })
      .fail(jqXHR => {
        Sentry.captureMessage(
          `Get user integrations failed: ${jqXHR.status} - ${jqXHR.statusText}`
        );
        reject(new IntegrationError().Unknown(jqXHR.responseText));
        return false;
      });
  });
};

const submitIntegrationConnectRequest = (appName, connectData) => {
  return new TrelloPowerUp.Promise((resolve, reject) => {
    $.ajax(`${kApiEndpoint}integration-connect`, {
      type: 'POST',
      data: JSON.stringify({
        appName,
        data: connectData,
      }),
      contentType: 'application/json',
      headers: { 'X-Butler-Trello-Token': Auth.getActiveToken() },
    })
      .done(response => {
        if (response.success) {
          Builder.refreshAutoCompleteCache();
          $(`.unauthorized-${appName.toLowerCase()}`).transition('hide');
          resolve(response.response);
          return;
        }
        const err = new IntegrationError().Unknown(response.error);
        Sentry.captureException(err);
        reject(err);
      })
      .fail(jqXHR => {
        Sentry.captureMessage(
          `Integration connect request failed: ${jqXHR.status} - ${jqXHR.statusText}`
        );
        reject(new IntegrationError().Unknown(jqXHR.responseText));
        return false;
      });
  });
};

const getIntegrationDetails = function(integrationType) {
  return function(resolve, reject) {
    $.ajax(`${kApiEndpoint}integration-details?integrationType=${integrationType}`, {
      type: 'GET',
      headers: { 'X-Butler-Trello-Token': Auth.getActiveToken() },
      contentType: 'application/json',
    })
      .done(function(response) {
        console.log(response);
        if (response.success) {
          return resolve(response.response);
        }
        return reject(new Error(response.error || 'Unknown error'));
      })
      .fail(function(error) {
        return reject(error);
      });
  };
};

module.exports = {
  init,
  getIntegrationDetails,
  getUserIntegrations,
  handleAction,
  handleActionSync,
};
