/* global Auth, Sentry, TrelloPowerUp */

const kApiEndpoint = require('./api-endpoint.js');

const registerApps = registerApp => {
  registerApp('Slack', handleSlackIntegration);
};

const handleSlackIntegration = (verb, context) => {
  switch (verb) {
    case 'describe':
      return handleSlackDescribe(context);
    case 'connect':
      return handleSlackConnect(context);
    case 'revoke':
      return handleSlackDisconnect(context);
    case 'setupRevocation':
      return handleSlackSetupRevocation(context);
    default:
      console.error(`Unknown verb: ${verb}`);
      return '';
  }
};

const handleSlackDescribe = context => {
  return `Connected workspaces: \`${context.params
    .map(appData => {
      return `${Object.values(appData)
        .map(team => team.team_name)
        .join(', ')}`;
    })
    .join(', ')}\``;
};

const handleSlackConnect = context => {
  const { t } = context;
  let digest;
  return Auth.getToken(t)
    .then(token => {
      if (!token) throw new Error('SLACK OAUTH: NO TRELLO TOKEN');
      const { crypto } = TrelloPowerUp.util;
      const iv = [];
      crypto.generateInitVector().forEach(b => iv.push(`0${b.toString(16)}`.substr(-2)));
      return crypto.sha256Digest(`${iv.join('')}:${t.getContext().member}:${token}`);
    })
    .then(_digest => {
      digest = _digest;
      const clientId = '522979612549.970973374022';
      const redirectURI = 'https://app.butlerfortrello.com/internal/powerup-oauth-slack.html';
      const bot_scopes = ['chat:write', 'chat:write.public'];
      const user_scopes = [
        'channels:read',
        'chat:write',
        'groups:read',
        'identify',
        'im:read',
        'mpim:read',
        'team:read',
        'users.profile:read',
        'users:read',
        'users:read.email',
      ];
      const authUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${encodeURIComponent(
        bot_scopes.join(' ')
      )}&user_scope=${encodeURIComponent(user_scopes.join(' '))}&redirect_uri=${encodeURIComponent(
        redirectURI
      )}&state=${digest}`;
      return t.authorize(authUrl, {});
    })
    .then(token => {
      const [code, status] = token.split(':');
      if (status !== digest) {
        throw new Error('SLACK OAUTH: STATUS MISMATCH');
      }
      return context.submitIntegrationConnectRequest({ code });
    });
};

const handleSlackDisconnect = context => {
  const { t, params } = context;
  const workspaceName = $(params.event.target)
    .text()
    .trim(' ');
  if (workspaceName) {
    return Auth.getToken(t).then(token => {
      if (!token) throw new Error('SLACK DISCONNECT: NO TRELLO TOKEN');
      return new Promise((resolve, reject) => {
        $.ajax(`${kApiEndpoint}integration-disconnect`, {
          type: 'POST',
          headers: { 'X-Butler-Trello-Token': Auth.getActiveToken() },
          data: JSON.stringify({
            appName: 'Slack',
            resourceName: workspaceName,
          }),
          contentType: 'application/json',
        })
          .done(function(response) {
            if (response.success) {
              return resolve();
            }
            return reject(new Error(response.error || 'Unknown error'));
          })
          .fail(function(error) {
            return reject(error);
          });
      });
    });
  }
  return '';
};

const handleSlackSetupRevocation = context => {
  // Return the name of each auth'd Slack workspace
  const elements = [];
  context.params.forEach(appData => {
    Object.values(appData).forEach(team => {
      elements.push(team.team_name);
    });
  });
  return elements;
};

const showStatus = status => {
  $('.oauth-slack-status').addClass('hidden');
  $(`.oauth-slack-status.status-${status}`).removeClass('hidden');
};

const oauthCallback = () => {
  const code = (window.location.search.match(/[?&]code=([-_a-zA-Z0-9.]*)/) || [])[1];
  const state = (window.location.search.match(/[?&]state=([a-fA-F0-9]*)/) || [])[1];

  if (!code) {
    showStatus('error');
    return;
  }

  showStatus('requesting');

  const token = `${code}:${state}`;

  try {
    window.opener.authorize(token);
  } catch (e) {
    try {
      localStorage.setItem('token', token);
    } catch (e) {
      showStatus('error');
      throw new Error('SLACK OAUTH: CANNOT RETURN CODE');
    }
  }

  showStatus('success');
  setTimeout(window.close, 1000);
};

const getSlackChannelsForWorkspace = team_id => {
  return function(resolve, reject) {
    $.ajax(`${kApiEndpoint}slack-channels-for-workspace?team_id=${team_id}`, {
      type: 'GET',
      headers: { 'X-Butler-Trello-Token': Auth.getActiveToken() },
      contentType: 'application/json',
    })
      .done(function(response) {
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
  getSlackChannelsForWorkspace,
  registerApps,
};

window.SlackOAuthCallback = oauthCallback;
