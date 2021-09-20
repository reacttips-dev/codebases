/* global moment, Sentry, TrelloPowerUp */

const has = require('lodash.has');
const isEqual = require('lodash.isequal');

const kApiEndpoint = require('./api-endpoint.js');
const { Auth } = require('./trello-api');
const util = require('./util.js');

if (typeof $().transition !== 'function') {
  $.prototype.transition = function() {};
}

const getVersion = function() {
  let version = 'unknown';
  const urlParts = /^https:\/\/app\.butlerfortrello\.com\/([\w-]+)\//.exec(window.location.href);
  if (urlParts && urlParts[1]) {
    [, version] = urlParts;
  }
  return version;
};

const addBoardParam = function(t) {
  const idBoard = (t || window._trello).getContext().board;
  return idBoard ? `&b=${idBoard}` : '';
};

const getUserPlanLocal = function(t) {
  return (t || window._trello).get('board', 'private', 'plan').catch(function() {
    return null;
  });
};

const setAttnStatus = function(trello, type, active) {
  return trello
    .get('board', 'private', 'attn')
    .then(function(currAttn) {
      let attn = (currAttn || '').split(',').filter(function(t) {
        return !!t;
      });
      const current = attn.indexOf(type) !== -1;
      if (!!active === !!current) {
        return false;
      }
      if (!active) {
        attn = attn.filter(function(t) {
          return t !== type;
        });
      } else {
        attn.push(type);
      }
      return trello.set('board', 'private', 'attn', attn.join(','));
    })
    .catch(err => util.handleError.bind('setAttnStatus', err));
};

const getAttnStatus = function(trello, type) {
  return trello
    .get('board', 'private', 'attn')
    .then(function(currAttn) {
      const attn = (currAttn || '').split(',').filter(function(t) {
        return !!t;
      });
      return type ? attn.indexOf(type) !== -1 : attn.length;
    })
    .catch(err => util.handleError('getAttnStatus', err));
};
const updateUsageDisplay = function(t, quotaExceeded, usage) {
  if (quotaExceeded !== undefined) {
    $('.powerup-usage-ops-quota-exceeded').transition(quotaExceeded ? 'show' : 'hide');
    setAttnStatus(t || window._trello, 'quota-ops', quotaExceeded);
  }

  if (!usage) return;

  const used = usage.usage || 0;
  $('.ops-quota').text(usage.quota);
  $('.ops-used').text(used);
  $('.ops-used-percent').text(Math.round((used * 100) / usage.quota));
  if (usage.grant)
    $('.ops-grant')
      .transition('show')
      .find('.value')
      .text(usage.grant);
  else $('.ops-grant').transition('hide');
};

const updatePowerUpUsageDisplay = function(t, quotaExceeded, usage) {
  if (quotaExceeded !== undefined) {
    $('.powerup-usage-quota-exceeded').transition(quotaExceeded ? 'show' : 'hide');
    setAttnStatus(t || window._trello, 'quota', quotaExceeded);
  }

  if (!usage) return;

  $('.powerup-usage').transition('hide');
  $('.powerup-nousage').transition('hide');
  const used = usage.usage || 0;
  if (!used && !has(usage, 'quota')) {
    $('.powerup-nousage').transition('slide down');
    return;
  }
  $('.powerup-quota').text(usage.quota);
  $('.powerup-used').text(used);
  $('.powerup-used-percent').text(Math.round((used * 100) / usage.quota));
  $('.powerup-usage').transition('slide down');
  if (usage.grant)
    $('.powerup-grant')
      .transition('show')
      .find('.value')
      .text(usage.grant);
  else $('.powerup-grant').transition('hide');
};

const updateTimezoneDisplay = function(userTimezone) {
  let show = false;

  if (userTimezone && typeof moment !== 'undefined') {
    const localTimezone = moment.tz.guess();
    if (localTimezone !== userTimezone) {
      show = true;
      $('.butler-account-tz').text(userTimezone);
      $('.butler-local-tz').text(localTimezone);
      $('.butler-update-tz-btn')
        .off('click')
        .click(function() {
          $.ajax(`${kApiEndpoint}settings/pup`, {
            type: 'POST',
            data: JSON.stringify({ tz: localTimezone }),
            headers: { 'X-Butler-Trello-Token': Auth.getActiveToken() },
          })
            .done(function() {
              $('.butler-timezone-warning').transition('fade');
            })
            .fail(function() {
              $(this).transition('shake');
            });
        });
      $('.butler-ignore-tz-btn')
        .off('click')
        .click(function() {
          $('.butler-timezone-warning').transition('fade');
        });
    }
  }

  $('.butler-timezone-warning').transition(show ? 'show' : 'hide');
};

const updatePlanDisplay = function(plan) {
  let isOrg;
  let orgName;
  let idPlan = '';
  if (plan) {
    idPlan = plan.plan_id || '';
    isOrg = plan.is_org;
    orgName = plan.org_name;
    updateTimezoneDisplay(plan.tz);
  }

  const legacy = !idPlan.match(/^TRELLO_/);
  $('.butler-account-type-legacy').transition(legacy ? 'show' : 'hide');
  $('.butler-account-type-trello').transition(legacy ? 'hide' : 'show');
  const t = TrelloPowerUp.iframe({ targetOrigin: 'https://trello.com' });
  const isQuotaRepackaging = window._trello.getContext().quotaRepackaging;
  if (idPlan.match(/^ROYAL_TREATMENT/)) {
    $('.butler-bronze').transition('hide');
    $('.butler-silver').transition('hide');
    $('.butler-free').transition('hide');
    $('.butler-standard').transition('hide');
    $('.butler-team').transition('hide');
    $('.butler-enterprise').transition('hide');
    $('.butler-gold').transition('show');
  } else if (idPlan === 'TRELLO_GOLD' || idPlan.match(/^SILVER_PLATTER/)) {
    $('.butler-bronze').transition('hide');
    $('.butler-gold').transition('hide');
    $('.butler-free').transition('hide');
    $('.butler-standard').transition('hide');
    $('.butler-team').transition('hide');
    $('.butler-enterprise').transition('hide');
    $('.butler-silver').transition('show');
  } else if (idPlan === 'TRELLO_FREE' && isQuotaRepackaging) {
    $('.butler-bronze').transition('hide');
    $('.butler-silver').transition('hide');
    $('.butler-gold').transition('hide');
    $('.butler-standard').transition('hide');
    $('.butler-enterprise').transition('hide');
    $('.butler-team').transition('hide');
    $('.butler-free').transition('show');
  } else if (idPlan === 'TRELLO_STANDARD') {
    $('.butler-bronze').transition('hide');
    $('.butler-silver').transition('hide');
    $('.butler-gold').transition('hide');
    $('.butler-free').transition('hide');
    $('.butler-enterprise').transition('hide');
    $('.butler-team').transition('hide');
    $('.butler-standard').transition('show');
  } else if (idPlan === 'TRELLO_BC' || idPlan.match(/^TEAM/)) {
    $('.butler-bronze').transition('hide');
    $('.butler-silver').transition('hide');
    $('.butler-gold').transition('hide');
    $('.butler-free').transition('hide');
    $('.butler-standard').transition('hide');
    $('.butler-enterprise').transition('hide');
    $('.butler-team').transition('show');
    if (isQuotaRepackaging) {
      $('.butler-enterprise-hide').transition('hide');
      $('.butler-unlimited').transition('show');
    }
  } else if (idPlan === 'TRELLO_ENTERPRISE' || idPlan.match(/^ENTERPRISE/)) {
    $('.butler-bronze').transition('hide');
    $('.butler-silver').transition('hide');
    $('.butler-gold').transition('hide');
    $('.butler-free').transition('hide');
    $('.butler-standard').transition('hide');
    $('.butler-team').transition('hide');
    $('.butler-enterprise').transition('show');
    $('.butler-enterprise-hide').transition('hide');
    $('.butler-unlimited').transition('show');
  } else {
    $('.butler-silver').transition('hide');
    $('.butler-gold').transition('hide');
    $('.butler-free').transition('hide');
    $('.butler-standard').transition('hide');
    $('.butler-team').transition('hide');
    $('.butler-enterprise').transition('hide');
    $('.butler-bronze').transition('show');
  }
  if (isOrg) {
    $('.butler-no-org').transition('hide');
    $('.butler-org').transition('show');
    if (orgName) $('.butler-org-name').text(orgName);
    else
      $('.butler-org-name')
        .closest('.butler-org')
        .transition('hide');
  } else {
    $('.butler-org').transition('hide');
    $('.butler-no-org').transition('show');
  }
};

const savePlan = function(plan, t) {
  const short = {
    user_id: plan.user_id,
    plan_id: plan.plan_id,
    is_org: plan.is_org,
    is_admin: plan.is_admin,
    org_name: plan.org_name,
    features: plan.features,
  };

  if (has(plan, 'no_ui')) {
    short.no_ui = plan.no_ui;
  }

  // since we may call this from a capability we need to take care not to
  // introduce infinite loops since setting pluginData re-calls capabilities
  return (t || window._trello)
    .get('board', 'private', 'plan', {})
    .then(existingPlan => {
      if (isEqual(existingPlan, short)) {
        // cached plan is accurate, do nothing
        return null;
      }
      // cached plan is outdated, overwrite it
      return (t || window._trello).set('board', 'private', 'plan', short);
    })
    .catch(
      TrelloPowerUp.PostMessageIO.InvalidContext,
      TrelloPowerUp.PostMessageIO.PluginDisabled,
      () => null
    );
};

const removePlan = function(t, quiet = false) {
  const trello = t || window._trello;
  if (trello.getContext().organization) {
    trello.remove('organization', 'private', 'plan').catch(function() {
      // noop, this is obsolete and no longer used anyway
    });
  }

  TrelloPowerUp.Promise.all([
    trello.remove('board', 'private', 'plan'),
    trello.remove('member', 'private', 'plan'), // historical storage of plans
  ]).catch(() => {});

  if (!quiet) {
    try {
      updatePlanDisplay();
    } catch (e) {
      Sentry.captureException(e);
    }
  }
};

const updatePlan = function(plan, t) {
  updatePowerUpUsageDisplay(t, plan.powerup_usage_exceeded, plan.powerup_usage);
  updateUsageDisplay(t, plan.usage_exceeded, plan.usage);
  updatePlanDisplay(plan);

  const { features } = plan;
  if (typeof features === 'object') {
    if (typeof features.show === 'string')
      $(
        features.show
          .split(',')
          .map(function(c) {
            return `.${c}`;
          })
          .join(',')
      ).transition('show');
    if (typeof features.hide === 'string')
      $(
        features.hide
          .split(',')
          .map(function(c) {
            return `.${c}`;
          })
          .join(',')
      ).transition('hide');
  }

  savePlan(plan, t);
};

const fetchUserPlan = t => {
  const uri = `${kApiEndpoint}plan?usage=true&powerup_usage=true&v=${getVersion()}${addBoardParam(
    t
  )}`;
  return Auth.getToken(t).then(token => {
    if (!token) {
      return null;
    }

    return fetch(uri, {
      method: 'GET',
      headers: {
        'X-Butler-Trello-Token': token,
      },
    })
      .then(resp => resp.json())
      .then(json => {
        if (json.success) {
          return json.response;
        }
        console.warn('Unable to fetch Butler plan', json.error);
        Sentry.captureMessage(`Fetch user plan got error: ${json.error}`);
        return null;
      })
      .catch(err => {
        // this is generally for network errors
        if (!(err instanceof TypeError && err.message === 'Failed to fetch')) {
          Sentry.captureException(err);
        }
        return null;
      });
  });
};

const refreshUserPlan = function(t = window._trello) {
  return Auth.getToken(t).then(function(token) {
    // t.getContext().dontUpsell is set by the trello web client
    // This attribute will only be true for the Desktop client
    // This logic is here because we require a Trello iframe so that we can
    // getContext(). Also, in the future, whether or not as well as how we
    // upsell a user may be more closely tied to what plan they currently have.
    if (t.getContext().dontUpsell) {
      $('.trello-upsell').transition('hide');
    }
    if (!token) {
      return updatePlanDisplay();
    }

    return getUserPlanLocal(t).then(function(plan) {
      if (!plan) {
        updatePlanDisplay();
      } else {
        updatePlanDisplay(plan);
      }

      $.ajax(
        `${kApiEndpoint}plan?usage=true&powerup_usage=true&v=${getVersion()}${addBoardParam(t)}`,
        {
          type: 'GET',
          headers: { 'X-Butler-Trello-Token': token },
        }
      )
        .done(function(response) {
          if (response.success) {
            updatePlan(response.response, t);
          } else {
            removePlan(t);
            if (response.error === 'USER_NOT_FOUND') {
              Auth.reauthorize(t);
            }
          }
        })
        .fail(function(jqXHR) {
          // E.g. network error, do not clear locally-stored value.
          Sentry.captureMessage(
            `Refresh user plan request failed: ${jqXHR.status} - ${jqXHR.statusText}`
          );
        });
    });
  });
};

const delayedRefreshUserPlan = function(temporaryPlan, delay) {
  updatePlanDisplay(temporaryPlan);
  setTimeout(refreshUserPlan, delay);
};

let lastQuotaCheck = 0;
const checkUserQuota = function(t) {
  const now = Date.now();
  const threshold = lastQuotaCheck + 5 * 60 * 1000;
  if (now < threshold) {
    return TrelloPowerUp.Promise.resolve();
  }
  lastQuotaCheck = now;

  return TrelloPowerUp.Promise.all([
    Auth.getToken(t, false),
    t.get('member', 'private', 'registered', false),
  ]).spread(function(token, isRegistered) {
    if (!token || !isRegistered) {
      return TrelloPowerUp.Promise.resolve();
    }

    return fetchUserPlan(t).then(plan => {
      if (!plan) {
        // remove the plan, but don't update any UI since this is called
        // from the index connector, not the dashboard
        return removePlan(t, true);
      }

      const pupQuotaExceeded = plan.powerup_usage_exceeded;
      setAttnStatus(t, 'quota', pupQuotaExceeded);

      const opsQuotaExceeded = plan.usage_exceeded;
      setAttnStatus(t, 'quota-ops', opsQuotaExceeded);

      return savePlan(plan, t);
    });
  });
};

const Plan = {
  checkUserQuota,
  delayedRefreshUserPlan,
  fetchUserPlan,
  getAttnStatus, // (trello, type?)
  getUserPlanLocal,
  refreshUserPlan,
  savePlan,
  updatePlan,
};
// ensure we don't break anything while we work towards modularizing everything
window.Plan = Plan;

module.exports = Plan;
