/* global moment, Sentry, TrelloPowerUp */

const kApiEndpoint = require('./api-endpoint.js');

const API_ROOT = 'https://api.trello.com';

const TOKEN_KEY = 'token';
const tokenOpts = {
  name: 'Butler',
  key: '446cbc1d6532c596ddc610207ead5576',
  scope: 'read,write,account',
};

let activeToken;

let trelloApiError;
const TrelloApiError = () => {
  if (!trelloApiError) {
    trelloApiError = TrelloPowerUp.util.makeErrorEnum('TrelloApi', [
      'BadRequest',
      'Conflict',
      'Forbidden',
      'InvalidResponse',
      'NotFound',
      'RateLimited',
      'Timeout',
      'Unauthorized',
      'Unknown',
    ]);
  }
  return trelloApiError;
};

let codeMap;
const errorForStatus = function(status, message) {
  const ErrorEnum = TrelloApiError();
  if (!codeMap) {
    codeMap = {
      400: ErrorEnum.BadRequest,
      401: ErrorEnum.Unauthorized,
      403: ErrorEnum.Forbidden,
      404: ErrorEnum.NotFound,
      409: ErrorEnum.Conflict,
      429: ErrorEnum.RateLimited,
    };
  }
  return new (codeMap[status] || ErrorEnum.Unknown)(message);
};

const withoutToken = function(string) {
  return (string || '').replace(/[0-9a-f]{64}/gi, '[TOKEN]');
};

const get = function(url) {
  return new TrelloPowerUp.Promise(function(resolve, reject) {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.timeout = 30000;
    request.onload = function() {
      if (request.status === 200) {
        let response;
        try {
          response = JSON.parse(request.responseText);
        } catch (ex) {
          return reject(new TrelloApiError().Error.InvalidResponse(ex.message));
        }
        return resolve(response);
      }
      return reject(errorForStatus(request.status, request.responseText));
    };
    request.ontimeout = function() {
      return reject(new TrelloApiError().Error.Timeout());
    };
    request.send();
  });
};

const resetToken = function(t) {
  return t
    .requestToken(tokenOpts)
    .then(token => {
      activeToken = token;
      return t.set('member', 'private', TOKEN_KEY, token).then(() => token);
    })
    .catch(err => {
      // on an old web client Butler doesn't have access to t.requestToken
      Sentry.captureMessage(`Authorization Error: ${err.message}`);
      t.alert({
        display: 'error',
        duration: 15,
        message: 'Butler is unable to complete setup. Please refresh the page.',
      }).catch(() => {});
      throw err;
    });
};

let registrationError;
const RegistrationError = () => {
  if (!registrationError) {
    registrationError = TrelloPowerUp.util.makeErrorEnum('Registration', [
      'NoNewUsers',
      'NotConfirmed',
      'NoEnterpriseBeta',
      'Unknown',
    ]);
  }
  return registrationError;
};
const registrationErrorAlert = {
  display: 'error',
  duration: 10,
  message: 'Unable to complete setup. Please refresh the page and try again.',
};
const register = function(t, suppressNotConfirmedWarn) {
  return new TrelloPowerUp.Promise((resolve, reject) => {
    $.ajax(`${kApiEndpoint}auth`, {
      type: 'POST',
      data: JSON.stringify({
        token: activeToken,
        source: 'powerup_trello',
        tz: moment.tz.guess(),
        apikey: tokenOpts.key,
      }),
      contentType: 'application/json',
    })
      .done(response => {
        t.hideAlert();

        if (response.success) {
          resolve();
          return;
        }

        // something went wrong
        let err;
        if (response.error === 'MEMBER_NOT_CONFIRMED') {
          err = new (RegistrationError().NotConfirmed)(response.error);
          if (!suppressNotConfirmedWarn) {
            t.alert({
              display: 'error',
              duration: 10,
              message:
                'Your Trello account is not confirmed. Please confirm your Trello account before using Butler.',
            });
          }
        } else {
          t.alert(registrationErrorAlert);
          err = new (RegistrationError().Unknown)(response.error);
          Sentry.captureException(err);
        }
        reject(err);
      })
      .fail(jqXHR => {
        Sentry.captureMessage(`Registration request failed: ${jqXHR.status} - ${jqXHR.statusText}`);
        t.alert(registrationErrorAlert);
        reject(new (RegistrationError().Unknown)(jqXHR.responseText));
        return false;
      });
  });
};

// go get a brand new Trello auth token and then call in and
// register that new token with Butler servers
const reauthorize = function(t) {
  return resetToken(t).then(token =>
    register(t)
      .catch(() => {
        // noop, we already captured what we needed into Sentry
      })
      .then(() => token)
  );
};

const tokenLooksValid = function(token) {
  return typeof token === 'string' && /^[0-9a-f]{64}$/i.test(token);
};

const getToken = function(t, issueNew) {
  const trello = t || window._trello;
  return new TrelloPowerUp.Promise((resolve, reject) => {
    if (activeToken && tokenLooksValid(activeToken)) {
      return resolve(activeToken);
    }
    return trello
      .get('member', 'private', TOKEN_KEY)
      .then(storedToken => {
        if (storedToken && tokenLooksValid(storedToken)) {
          activeToken = storedToken;
          return resolve(storedToken);
        }
        if (issueNew) {
          return resolve(reauthorize(trello));
        }
        return resolve(null);
      })
      .catch(reject);
  });
};

const constructUrl = function(path, params) {
  return getToken().then(token => {
    if (!token) {
      throw new TrelloApiError().Unauthorized(
        `No token for API request. Path=${withoutToken(path)}`
      );
    }
    const paramsWithDefaults = {
      key: '446cbc1d6532c596ddc610207ead5576',
      token,
      ...(params || {}),
    };
    const qs = Object.keys(paramsWithDefaults)
      .map(function(k) {
        return `${encodeURIComponent(k)}=${encodeURIComponent(paramsWithDefaults[k])}`;
      })
      .join('&');
    return `${API_ROOT}/1/${path}?${qs}`;
  });
};

const getBoard = function(idBoard, opts) {
  return constructUrl(`boards/${idBoard}`, opts).then(url => get(url));
};

const getLists = function(idBoard, opts) {
  return constructUrl(`boards/${idBoard}/lists`, opts).then(url => get(url));
};

const getMe = function(opts) {
  return constructUrl('members/me', opts).then(url => get(url));
};

const getMember = function(idMember) {
  return constructUrl(`members/${idMember}`).then(url => get(url));
};

const getMyBoards = function(opts) {
  return constructUrl('members/me/boards', opts).then(url => get(url));
};

const getMyTeams = function() {
  return constructUrl('members/me/organizations').then(url => get(url));
};

const checkToken = function() {
  return getToken().then(token => {
    if (!token) {
      // no token to be checked is a no-op
      return null;
    }
    return constructUrl(`tokens/${token}`).then(url => get(url));
  });
};

// synchronously returns our in memory active Trello token
// You should generally use the normal getToken function over this
// this is mostly a drop in replacement for Trello.token() so we can
// remove our dependence on client.js
const getActiveToken = function() {
  return activeToken;
};

// returns a Promise that will resolve to a Trello token or null
function authorizeSoft(t = window._trello) {
  return getToken(t, false);
}

// returns a Promise that will resolve to a Trello token
// will issue itself a token if it doesn't have one already
function authorize(t = window._trello) {
  return getToken(t, true);
}

// check to see if we have a Trello auth token already
const isAuthorized = function(t) {
  return getToken(t, false)
    .then(token => token && tokenLooksValid(token))
    .catch(() => false);
};

// if we have a token, ensure that it is still good
// if not, issue ourselves a fresh new one
let lastValidityCheck = null;
let pendingValidityCheck;
const ensureTokenValidity = function(t) {
  // don't check again if we checked in the last minute
  if (pendingValidityCheck) {
    return pendingValidityCheck;
  }
  if (lastValidityCheck && lastValidityCheck > Date.now() - 60000) {
    return TrelloPowerUp.Promise.resolve();
  }

  const ErrorEnum = TrelloApiError();

  lastValidityCheck = Date.now();
  pendingValidityCheck = getToken(t)
    .then(token => {
      if (!token) {
        return null;
      }
      return checkToken()
        .then(() => {
          return null;
        })
        .catch(ErrorEnum.Unauthorized, ErrorEnum.Forbidden, ErrorEnum.NotFound, () => {
          // our token is no longer any good
          return reauthorize(t);
        })
        .catch(ErrorEnum, err => {
          // something else is up, but it doesn't necessarily mean
          // we've got a bad token
          Sentry.captureException(err);
        });
    })
    .catch(() => {
      // noop
    })
    .finally(() => {
      pendingValidityCheck = null;
    });
  return pendingValidityCheck;
};

// if we have a token but haven't already marked ourselves as having
// registered, go ahead and ask the Butler servers to register us
let registrationPromise;
// use force=true if the user is interacting in a way that you must
// guarantee that they are registered right now
const registerIfNecessary = function(t, force, CommandStorage, suppressNotConfirmedWarn) {
  // Trello can call capabilities like 'board-buttons' fairly aggressively
  // so we want to be careful to only ever have a single in-flight registration
  // request
  if (registrationPromise) {
    return registrationPromise;
  }

  registrationPromise = TrelloPowerUp.Promise.all([
    t.get('member', 'private', 'registered', false),
    isAuthorized(t),
    CommandStorage.getLocalCommands(),
  ])
    .spread((registered, hasToken, pluginCommands) => {
      if (hasToken && registered) {
        return null;
      }
      if (pluginCommands.commands.length === 0 && !force) {
        // nothing to do
        return null;
      }
      t.alert({
        message: 'Powering-Up, give us a moment...',
      });
      if (!hasToken) {
        return resetToken(t).then(() => {
          if (registered) {
            return null;
          }
          return register(t, suppressNotConfirmedWarn).then(() =>
            t.set('member', 'private', 'registered', true)
          );
        });
      }
      if (!registered) {
        return register(t, suppressNotConfirmedWarn).then(() =>
          t.set('member', 'private', 'registered', true)
        );
      }
      return null;
    })
    .finally(() => {
      registrationPromise = null;
    });

  return registrationPromise;
};

const clearMemory = function() {
  activeToken = null;
};

const Auth = {
  authorize,
  authorizeSoft,
  checkToken,
  clearMemory,
  ensureTokenValidity,
  getToken,
  getActiveToken,
  reauthorize,
  registerIfNecessary,
  resetToken,
  RegistrationError,
};

const TrelloApi = {
  Auth,
  getBoard,
  getLists,
  getMe,
  getMember,
  getMyBoards,
  getMyTeams,
};

// ensure nothing breaks while we work to get everything modularized
window.Auth = Auth;
window.TrelloApi = TrelloApi;

module.exports = TrelloApi;
