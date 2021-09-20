/* global Auth, Sentry, TrelloPowerUp */

const kApiEndpoint = require('./api-endpoint.js');

const handleJIRAIntegration = (verb, context) => {
  switch (verb) {
    case 'describe':
      return handleJIRADescribe(context);
    case 'connect':
      return handleJIRAConnect(context);
    case 'setupRevocation':
      // The JIRA Api does not support token revocation, so nothing to setup here
      // Token revocation will have to be done manually by the User
      return '';
    default:
      console.error(`Unknown verb: ${verb}`);
      return '';
  }
};

const registerApps = registerApp => {
  registerApp('JIRA', handleJIRAIntegration);
};

const handleJIRADescribe = context => {
  return `Connected sites: \`${context.params
    .map(appData => {
      return `${Object.values(appData)
        .map(resource => resource.name)
        .join(', ')}`;
    })
    .join(', ')}\``;
};

const handleJIRAConnect = context => {
  const { t } = context;
  let digest;
  return Auth.getToken(t)
    .then(token => {
      if (!token) throw new Error('ATLASSIAN OAUTH: NO TRELLO TOKEN');
      const { crypto } = TrelloPowerUp.util;
      const iv = [];
      crypto.generateInitVector().forEach(b => iv.push(`0${b.toString(16)}`.substr(-2)));
      return crypto.sha256Digest(`${iv.join('')}:${t.getContext().member}:${token}`);
    })
    .then(_digest => {
      digest = _digest;
      const clientId = 'wX2bLMmD2VP17QmjP9OfJFdvpMlRWjGS';
      const redirectURI = 'https://app.butlerfortrello.com/internal/powerup-oauth-atlassian.html';
      const scopes = ['read:jira-user', 'read:jira-work', 'write:jira-work', 'offline_access'];
      const authUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${clientId}&scope=${encodeURIComponent(
        scopes.join(' ')
      )}&redirect_uri=${encodeURIComponent(
        redirectURI
      )}&state=${digest}&response_type=code&prompt=consent`;
      return t.authorize(authUrl, {});
    })
    .then(token => {
      const [code, status] = token.split(':');
      if (status !== digest) {
        throw new Error('ATLASSIAN OAUTH: STATUS MISMATCH');
      }
      return context.submitIntegrationConnectRequest({ code });
    });
};

const oauthCallback = () => {
  const code = (window.location.search.match(/[?&]code=([-_a-zA-Z0-9]*)/) || [])[1];
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
      throw new Error('ATLASSIAN OAUTH: CANNOT RETURN CODE');
    }
  }

  showStatus('success');
  setTimeout(window.close, 1000);
};

const showStatus = status => {
  $('.oauth-atlassian-status').addClass('hidden');
  $(`.oauth-atlassian-status.status-${status}`).removeClass('hidden');
};

const getJiraSiteData = site_id => {
  return function(resolve, reject) {
    $.ajax(`${kApiEndpoint}jira-site-data?site_id=${site_id}`, {
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
  registerApps,
  getJiraSiteData,
};

window.AtlassianOAuthCallback = oauthCallback;
