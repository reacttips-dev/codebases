/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

const {
  isPossiblyValidOrgName,
} = require('@trello/organizations/src/isPossiblyValidOrgName');
const Queries = require('app/scripts/network/quick-queries').default;

const parseJSON = function (data) {
  try {
    return window.JSON.parse(data);
  } catch (e) {
    return null;
  }
};

const ajaxGetJSON = function (url, next) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.setRequestHeader('Accept', 'application/json,text/plain');
  xhr.setRequestHeader(
    'X-Trello-Client-Version',
    window.trelloVersion || 'dev-0',
  );
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status !== 200) {
        next([xhr.status, xhr.responseText]);
      } else {
        next(null, [parseJSON(xhr.responseText), xhr]);
      }
    }
  };

  xhr.send(null);
};

const makeUrl = function (path, query) {
  let token;
  if (query == null) {
    query = {};
  }
  const invitationTokens = [];

  const inviteRegex = /invite-token-[-a-f0-9]*=([^;]+)/g;

  while (
    (token = __guard__(inviteRegex.exec(document.cookie), (x) => x[1])) != null
  ) {
    invitationTokens.push(unescape(token));
  }

  if (invitationTokens.length > 0) {
    // Note that this behavior should match what we're doing in model-loader,
    // where invitationTokens are added after everything else
    query.invitationTokens = invitationTokens.join(',');
  }

  if (new RegExp(`^/1/search(/|$)`).test(path)) {
    const dsc = __guard__(/dsc=([^;]+)/.exec(document.cookie), (x1) => x1[1]);
    query.dsc = dsc;
  }

  const queryString = (() => {
    const result = [];
    for (const key in query) {
      const value = query[key];
      result.push([key, encodeURIComponent(value)].join('='));
    }
    return result;
  })().join('&');
  return [path, queryString].join('?');
};

// Lets see if there's any data we can pre-load
//
// The goal is to be able to anticipate which data URL we're going to need
// and load it ASAP.
//
// NOTE:
// We only want to avoid the *first* time that data URL gets loaded in the future,
// after that we'll load it fresh
const preloads = {};

const path = location.pathname.substr(1);

const getDataUrls = function () {
  let idBoard, idCard, left, orgName, search;
  if (path === '') {
    // we've come directly to trello.com, so load the data for the member boards page
    return [makeUrl('/1/Members/me', Queries.memberBoards)];
  } else if (
    (search = __guard__(new RegExp(`^/([^/]*)`).exec(path), (x) => x[1])) !=
    null
  ) {
    search = decodeURIComponent(search)
      .toLowerCase()
      .replace(/[-_ ]+/g, ' ');
    if (search) {
      return [
        makeUrl('/1/Members/me', Queries.memberQuickBoards),
        makeUrl('/1/search', Queries.quickBoardsSearch(search)),
      ];
    } else {
      return [makeUrl('/1/Members/me', Queries.memberQuickBoards)];
    }
  } else if (
    (idBoard =
      (left = __guard__(new RegExp(`^b/([^/]+)`).exec(path), (x1) => x1[1])) !=
      null
        ? left
        : __guard__(
            new RegExp(`^board/[^/]+/([^/]+)`).exec(path),
            (x2) => x2[1],
          )) != null
  ) {
    return [
      makeUrl(`/1/Boards/${idBoard}`, Queries.currentBoardMinimal),
      makeUrl(`/1/Boards/${idBoard}`, Queries.currentBoardSecondary),
      makeUrl(`/1/Boards/${idBoard}`, Queries.currentBoardPluginData),
    ];
  } else if (
    (idCard = __guard__(new RegExp(`^c/([^/]+)`).exec(path), (x3) => x3[1])) !=
    null
  ) {
    return [makeUrl(`/1/Cards/${idCard}`, Queries.card)];
  } else if (
    (orgName = __guard__(new RegExp(`^([^/]+)$`).exec(path), (x4) => x4[1])) !=
      null &&
    isPossiblyValidOrgName(orgName)
  ) {
    // This is very basic way of checking feature flags.  We don't want to
    // use the LD client because it will increase the quickload.js bundle too much.
    // eslint-disable-next-line @trello/ban-identifiers
    const flags = parseJSON(localStorage.getItem('featureFlagSnapshot'));
    const isWorkspacePageRedesignEnabled =
      'teamplates.web.workspace-page-redesign';
    if (
      flags?.remote?.[isWorkspacePageRedesignEnabled] ||
      flags?.overrides?.[isWorkspacePageRedesignEnabled]
    ) {
      return [
        makeUrl(
          `/1/Organizations/${orgName}`,
          Queries.workspaceBoardsPageMinimal,
        ),
      ];
    } else {
      return [
        makeUrl(`/1/Organizations/${orgName}`, Queries.organizationBoardsPage),
      ];
    }
  } else {
    return [];
  }
};

const removePreload = function (url) {
  if (!(url in preloads)) {
    return;
  }
  return delete preloads[url];
};

const preload = function (url) {
  if (!url) {
    return;
  }
  const preloadObject = {
    isLoading: true,
    callbacks: [],
    start: Date.now(),
    used: false,
    url,
  };
  preloads[url] = preloadObject;

  ajaxGetJSON(url, function (err, data) {
    let callback;
    preloadObject.isLoading = false;
    if (err) {
      preloadObject.error = err;
      for (callback of Array.from(preloadObject.callbacks)) {
        callback(err);
      }
      return;
    }
    preloadObject.data = data;
    for (callback of Array.from(preloadObject.callbacks)) {
      callback(null, data);
    }
    // If the request isn't made within 10 seconds, it'll have to be made again
    setTimeout(() => removePreload(url), 10000);
  });
};

const cleanPreload = function (preload) {
  const cleaned = {};
  for (const key of ['isLoading', 'start', 'used', 'url']) {
    cleaned[key] = preload[key];
  }
  return cleaned;
};

const isLoggedIn = () =>
  /token=/.test(document.cookie) || // prod
  /token3000=/.test(document.cookie) || // dev
  /token2999=/.test(document.cookie); // proxyserver
const init = function () {
  if (isLoggedIn()) {
    const memberUrl = makeUrl('/1/Members/me', Queries.memberHeader);
    for (const url of Array.from([memberUrl].concat(getDataUrls()))) {
      preload(url);
    }
  }
};

const quickload = {
  // The "init" method is called once from index.ejs to kick off preloading
  init,
  makeUrl,
  load(url, next) {
    const preloadObject = preloads[url];
    if (preloadObject != null) {
      preloadObject.used = true;
      if (preloadObject.isLoading) {
        preloadObject.callbacks.push(next);
      } else {
        next(preloadObject.error, preloadObject.data);
        removePreload(url);
      }
      return cleanPreload(preloadObject);
    } else {
      ajaxGetJSON(url, next);
    }
  },

  clear() {
    for (const url in preloads) {
      removePreload(url);
    }
  },
};

module.exports.QuickLoad = window.QuickLoad = quickload;
