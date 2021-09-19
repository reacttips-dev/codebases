import React from 'react';
import { hydrate, render } from 'react-dom';
import Modal from 'react-modal';
import cookie from 'cookie';
import { match, useRouterHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import ab from 'react-redux-hydra';
import ExecutionEnvironment from 'exenv';

import { NEVER_EXPIRE_COOKIE_TIME } from 'constants/cookies';
import { REACT_CONTAINER_ID } from 'constants/appConstants';
import { RENDER_ERROR, SET_COOKIE, STORE_ZFC_SESSION_ID } from 'constants/reduxActions';
import configureStore from 'store/configureStore';
import connectStoreToLocalStorage, { saveStoreToLocalStorage } from 'helpers/connectStoreToLocalStorage';
import historyFactory from 'history/historyFactory';
import { setupDataAttributeAnalytics } from 'helpers/analytics';
import { listenForPageChange } from 'actions/pageView';
import { pageLoaded } from 'actions/pageLoad';
import { fetchAdPreferences } from 'actions/account/ads';
import createAppAdvertisement from 'helpers/AppAdvertisement';
import { generateTid } from 'helpers/RecoUtils';
import marketplace, { account, analytics, cookieDomain } from 'cfg/marketplace.json';
import { boomerangRouteChanged, setupBoomerangClientRoutingTracking } from 'history/boomerangSetup';
import { flushServerSideQueue, registerGetAssignmentsFn } from 'apis/amethyst';
import allShims from 'helpers/shims';
import { requestListener } from 'helpers/e2e';

const { hasAdPreferences } = account;

const defaultOpts = {
  elementId: REACT_CONTAINER_ID,
  storeOptions: {
    rootSaga: undefined,
    reducers: {}
  }
};

export let store;

export default function bootstrapApplication(RootComponentType, routeFactory, opts = {}) {
  const initialState = ab.flushQueue(window.__INITIAL_STATE__);
  initialState.cookies = cookie.parse(document.cookie);
  const { useHtml5History } = initialState.environmentConfig;
  // ignoring eslint rule as `useRouterHistory` is the named export of `react-router`
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const reactRouterHistory = useRouterHistory(historyFactory)({
    alwaysUseHtml5: useHtml5History,
    pageError: initialState.error
  });
  const appOptions = { ...defaultOpts, ...opts };
  store = configureStore(initialState, reactRouterHistory, appOptions.storeOptions);

  if (ExecutionEnvironment.canUseDOM) {
    // Gotta make sure shims are in place before any components mount
    allShims();
  }

  /**
   * restore the ab test assignments in the state, from the cookie.
   * this is needed for cached pages since we're stripping out assignments before
   * serving the page from the server but shouldn't hurt on non-cached pages
   * so better to be consistent.
   */
  store.dispatch(ab.actions.fetchCookieAssignments());

  // restore zfcSessionId
  const zfcSessionId = ab.zfcSessionId();
  store.dispatch({ type: STORE_ZFC_SESSION_ID, zfcSessionId });

  /**
   * fire the server-side Amethyst event queue.
   * This must happen AFTER cookies have been loaded
   * */
  flushServerSideQueue(store);

  const history = syncHistoryWithStore(reactRouterHistory, store, { adjustUrlOnReplay:false });

  const routes = routeFactory ? routeFactory(marketplace) : null;

  setupBoomerangClientRoutingTracking();

  registerGetAssignmentsFn(() => {
    const { ab: { assignments } } = store.getState();
    return assignments;
  });

  store.runSaga();

  // ensure that tid cookie is set for janus recommendations
  let tidCookie = initialState.cookies.tid;
  if (!tidCookie) {
    const tidValue = generateTid();
    tidCookie = {
      name: 'tid',
      value: tidValue,
      options: {
        domain: cookieDomain,
        expires: new Date(NEVER_EXPIRE_COOKIE_TIME)
      }
    };
    store.dispatch({
      type: SET_COOKIE,
      cookie: tidCookie
    });
  }

  if (initialState.cookies.renderTestLocators) {
    window.renderTestLocators = true;
    requestListener();
  }

  const rootElement = document.getElementById(appOptions.elementId);
  let reactStartupFunction = hydrate;
  match({ history, routes }, (error, redirectLocation, renderProps) => {
    if (initialState.error?.type === RENDER_ERROR) {
      // throw out the existing root node and render clean on the client.
      while (rootElement.lastChild) {
        rootElement.removeChild(rootElement.lastChild);
      }
      reactStartupFunction = render;
    }

    reactStartupFunction(
      <RootComponentType
        environmentConfig={initialState.environmentConfig}
        history={history}
        routes={routes}
        store={store}
        canUseScroll={true}
        renderProps={renderProps}
        onEnter={boomerangRouteChanged}/>,
      rootElement
    );

    connectStoreToLocalStorage(store);
  });

  setupDataAttributeAnalytics();
  history.listen(listenForPageChange(store));

  if (initialState.cookies.renderTestLocators) {
    window.store = store;
  }

  Modal.setAppElement(rootElement);

  withGoogleAnalyticsAccountNumber(addGoogleAnalyticsMessageEventListener);

  window.addEventListener('load', () => {
    const { dispatch } = store;
    dispatch(pageLoaded());
    createAppAdvertisement(store); // Initialize Branch native app advertisement
    hasAdPreferences && dispatch(fetchAdPreferences()); // Fetch customer advertising preferences
  });

  window.addEventListener('unload', () => {
    saveStoreToLocalStorage(store); // Save local storage before user leaves page
  });

}

/**
 * There is a pixel in hub.signal.co for a marketing vendor called Intent Media.
 * Because their pixel is executed in an iframe, it does not automatically have
 * access to the Google Analytics object (`window.ga`). This code listens for
 * "post-to-ga" messages and puts the data through Google Analytics.
 *
 * Relevant PIXL ticket: https://jira.zappos.net/browse/PIXL-440
 */
function addGoogleAnalyticsMessageEventListener(gaAccountNumber) {
  window.addEventListener('message', e => {
    if (e.data.action === 'post-to-ga' && e.data.intent_score) {
      window.ga('create', gaAccountNumber, 'auto');
      window.ga('set', 'dimension1', e.data.intent_score);
      window.ga('send', 'event', 'intent-score-update', e.data.intent_score, { nonInteraction: true });
    }
  });
}

function withGoogleAnalyticsAccountNumber(callback) {
  return analytics.google.trackers.forEach(({ id }) => {
    callback(id);
  });
}
