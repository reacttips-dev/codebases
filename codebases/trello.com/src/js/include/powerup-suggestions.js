/* global moment, TrelloPowerUp */

const has = require('lodash.has');

const kApiEndpoint = require('./api-endpoint.js');
const { joinCommandPhrases } = require('./builder-util.js');
const { Auth } = require('./trello-api.js');
const { handleError, sanitize } = require('./util.js');

function processSuggestionData(suggestionData, commands, dateLastSeen) {
  // suggestionData.suggestions will include admin_suggestions
  const { suggestions, date } = suggestionData;
  let since;
  if (suggestionData.first_action_date) {
    since = moment(suggestionData.first_action_date).fromNow(true);
  }

  if (suggestions && suggestions.length) {
    const cmds = {};
    commands.forEach(function(command) {
      cmds[command.cmd] = true;
    });
    const filteredSuggestions = suggestions
      .filter(function(suggestion) {
        const has_trigger = ['rule', 'schedule', 'on-date'].includes(suggestion.type);
        const cmd = joinCommandPhrases(suggestion.cmd, has_trigger);
        return !has(cmds, cmd);
      })
      .slice(0, 20);

    const counts = {};
    // Calculate counts of unseen suggestions by command type
    filteredSuggestions.forEach(suggestion => {
      let { type } = suggestion;
      if (!type) type = 'card';
      if (!dateLastSeen || new Date(suggestion.t) > new Date(dateLastSeen)) {
        counts[type] = (counts[type] || 0) + 1;
      }
    });

    const res = {
      since,
      suggestions: filteredSuggestions,
      suggestionDataToCache: {
        dateLastSeen,
        dateLastUpdate: new Date(date).toISOString(),
        counts,
      },
    };
    return res;
  }
  return {
    since,
    suggestions,
    suggestionDataToCache: {
      dateLastSeen,
      dateLastUpdate: new Date(date).toISOString(),
      counts: {},
    },
  };
}

const fetchSuggestionPromise = {};

const getSuggestions = function(t, refresh) {
  // Avoid making multiple requests, rather share the result
  // Pending promises are per-refresh value
  if (
    fetchSuggestionPromise[refresh] ||
    // In the case where refresh is false, but there is a pending request for
    // suggestions with refresh=true, then return the pending request with
    // refresh=true rather than issuing another request
    (refresh === false && fetchSuggestionPromise.true)
  ) {
    return fetchSuggestionPromise[refresh] || (refresh === false && fetchSuggestionPromise.true);
  }
  fetchSuggestionPromise[refresh] = new TrelloPowerUp.Promise(function(resolve, reject) {
    if (!Auth.getActiveToken()) {
      return reject(new Error('NOT_AUTHENTICATED'));
    }

    const trello =
      t ||
      TrelloPowerUp.iframe({
        targetOrigin: 'https://trello.com',
      });
    const tz = moment.tz.guess();
    const idBoard = trello.getContext().board;

    return $.ajax(
      `${kApiEndpoint}powerup-suggest/${idBoard}?tz=${tz}${refresh ? '&refresh=true' : ''}`,
      {
        type: 'GET',
        headers: { 'X-Butler-Trello-Token': Auth.getActiveToken() },
      }
    )
      .done(function(response) {
        if (response.success) return resolve(response.response);
        return reject(new Error(response.error || 'NO_RESPONSE'));
      })
      .fail(function() {
        return reject(new Error('NETWORK_ERROR'));
      });
  }).finally(function(err) {
    delete fetchSuggestionPromise[refresh];
    if (err) throw err;
  });
  return fetchSuggestionPromise[refresh];
};

const getCachedSuggestionData = function(t) {
  const trello =
    t ||
    TrelloPowerUp.iframe({
      targetOrigin: 'https://trello.com',
    });

  return trello.get('board', 'private', 'suggestions');
};

const shouldRefreshSuggestions = function(dateLastUpdate) {
  const lastSuggestionRefresh = dateLastUpdate && new Date(dateLastUpdate).getTime();
  if (lastSuggestionRefresh) {
    const now = new Date();
    // Refresh suggestions every 7 days
    const threshold = new Date(lastSuggestionRefresh + 7 * 24 * 60 * 60 * 1000);
    return now > threshold;
  }
  return true;
};

// Looks into pluginData and determines the count of suggestions to display
const getUnseenSuggestionCount = function(t) {
  return getCachedSuggestionData(t).then(function(suggestionData) {
    if (!suggestionData) {
      return 0;
    }
    const counts = suggestionData.counts || {};
    counts.total = Object.values(counts).reduce((total, count) => total + count, 0);
    return counts;
  });
};
let badgeRemovalTimeout;
const setSuggestionTabUnseenCount = function(t) {
  // Used to set the title of the Suggestions Tab to include the count of
  // unseen suggestions
  return getUnseenSuggestionCount(t).then(function(unseenSuggestionCounts) {
    if (unseenSuggestionCounts.total) {
      if ($('.unseen-suggestion-count').length) {
        $('.unseen-suggestion-count').text(sanitize(unseenSuggestionCounts.total));
      } else {
        const suggestionCountElem = $(
          `<div class="ui label unseen-suggestion-count">${sanitize(
            unseenSuggestionCounts.total
          )}</div>`
        );
        $('.dashboard-tabs .item[data-tab="tab-suggestions"]').append(suggestionCountElem);
      }
    } else if ($('.unseen-suggestion-count').length) {
      if (badgeRemovalTimeout) clearTimeout(badgeRemovalTimeout);
      badgeRemovalTimeout = setTimeout(function() {
        $('.unseen-suggestion-count').remove();
      }, 4000);
    }
  });
};

const updateSuggestionCounts = function(t, CommandStorage) {
  const trello =
    t ||
    TrelloPowerUp.iframe({
      targetOrigin: 'https://trello.com',
    });
  // We cache card back suggestions
  return TrelloPowerUp.Promise.all([
    getCachedSuggestionData(trello),
    trello.get('member', 'private', 'registered', false),
  ]).spread((suggestionData, registered) => {
    if (!registered) {
      return (suggestionData && suggestionData.counts) || {};
    }
    const suggestionDataDate = suggestionData && suggestionData.dateLastUpdate;
    const dateLastSeen = suggestionData && suggestionData.dateLastSeen;
    const shouldRefresh = shouldRefreshSuggestions(suggestionDataDate);
    if (!shouldRefresh) {
      return (suggestionData && suggestionData.counts) || {};
    }
    return TrelloPowerUp.Promise.join(getSuggestions(t, true), CommandStorage.getLocalCommands())
      .spread((refreshedSuggestionData, { commands }) => {
        // Fetch updated suggestion data and process it
        const { suggestionDataToCache } = processSuggestionData(
          refreshedSuggestionData,
          commands,
          dateLastSeen
        );
        if (suggestionDataToCache) {
          return t
            .set('board', 'private', 'suggestions', suggestionDataToCache)
            .then(() => suggestionDataToCache.counts || {})
            .catch(err => {
              // If their pluginData is already full of buttons, then unfortunately
              // we can't give them a Board button suggestions "badge"
              handleError('updateSuggestionCounts', err);
              return {};
            });
        }
        return suggestionDataToCache.counts;
      })
      .catch(err => {
        if (err.message !== 'NOT_AUTHENTICATED') handleError('getCachedSuggestions', err);
        return {};
      });
  });
};

const submitAction = function(suggestion, action) {
  if (!Auth.getActiveToken())
    return new TrelloPowerUp.Promise(function(resolve, reject) {
      reject(new Error('NOT_AUTHENTICATED'));
    });

  const trello = TrelloPowerUp.iframe({
    targetOrigin: 'https://trello.com',
  });

  const idBoard = trello.getContext().board;
  return new TrelloPowerUp.Promise(function(resolve, reject) {
    $.ajax(`${kApiEndpoint}powerup-suggest/${idBoard}`, {
      type: 'POST',
      data: JSON.stringify({
        suggestion,
        action,
      }),
      contentType: 'application/json',
      headers: { 'X-Butler-Trello-Token': Auth.getActiveToken() },
    })
      .done(function(response) {
        if (response.success) resolve(response.response);
        else reject(new Error(response.error || 'NO_RESPONSE'));
      })
      .fail(function() {
        reject(new Error('NETWORK_ERROR'));
      });
  });
};

const accept = function(suggestion) {
  return submitAction(suggestion, 'accept');
};

const discard = function(suggestion) {
  return submitAction(suggestion, 'discard');
};

const Suggestions = {
  processSuggestionData,
  getCachedSuggestionData,
  getSuggestions,
  getUnseenSuggestionCount,
  setSuggestionTabUnseenCount,
  updateSuggestionCounts,
  accept,
  discard,
};

module.exports = Suggestions;
