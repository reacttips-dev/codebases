/**
 * Utilities to manage the mixture of patterns we are migrating between.
 */
import React from 'react';

import { isAuthenticatedUser } from 'js/lib/user';
import logger from 'js/app/loggerSingleton';

function applicationStoreIn(component: React.Component) {
  if (typeof component.context.getStore !== 'function') {
    return false;
  }

  // UNTIL FRONT-130 (all fluxible apps should register ApplicationStore)
  try {
    if (component.context.getStore('ApplicationStore')) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    logger.warn('ApplicationStore missing from Fluxible app');
    return false;
  }
}

function naptimeStoreIn(component: React.Component) {
  if (typeof component.context.getStore !== 'function') {
    return false;
  }

  try {
    if (component.context.getStore('NaptimeStore')) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    logger.warn('NaptimeStore missing from Fluxible app');
    return false;
  }
}

function reactRouterIn(component: React.Component) {
  return !!component.context.router;
}

function currentPathnameOf(component: React.Component) {
  if (reactRouterIn(component)) {
    return component.context.router.location.pathname;
  } else {
    return window.location.pathname;
  }
}

function userAuthenticatedIn(component: React.Component) {
  // TODO: Previously, we made use of the userIdentity backbone model to determine if the user was authenticated, so we may have to revisit
  // this change when we migrate VLP and XDP to next
  return applicationStoreIn(component)
    ? component.context.getStore('ApplicationStore').getUserData().authenticated
    : isAuthenticatedUser();
}

const exported = {
  applicationStoreIn,
  currentPathnameOf,
  naptimeStoreIn,
  reactRouterIn,
  userAuthenticatedIn,
};

export default exported;
export { applicationStoreIn, currentPathnameOf, naptimeStoreIn, reactRouterIn, userAuthenticatedIn };
