import './styles.global.sass';
import Promise from 'bluebird';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import {
  createResponsiveStoreEnhancer,
  calculateResponsiveState,
} from 'redux-responsive';
import Button from 'react-bootstrap/lib/Button';
import { addStyle } from 'react-bootstrap/lib/utils/bootstrapUtils';
import { runArrayFindPolyfill } from 'anchor-website-common/helpers/serverRenderingUtils';
import { history } from './history';
import { AppEntry } from './components/AppEntry';
import { rootReducer } from './reducers';
import applyMiddlewareWithHistory from './applyReduxMiddlewareWithHistory.client';
import { startSyncInterval } from './playbackDurationTracking';
import { setUpCustomAttributes } from './modules/analytics';
import AnchorErrorTracking from './modules/AnchorErrorTracking';
import { Browser } from './modules/Browser';

import { APP_INIT } from '../helpers/serverRenderingUtils';

import * as Bundle from './asyncRouteComponents'; // Replaced by AsyncBundles by webpack at build-time

import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';

import * as GlobalEventListeners from './modules/GlobalEventListeners';

const { localStorage } = Browser;

AnchorErrorTracking.init({
  commitHash: MOST_RECENT_COMMIT_HASH,
  buildEnvironmentName: BUILD_ENVIRONMENT,
});

GlobalEventListeners.addEventListeners();

// This can fail in improperly sandboxed iFrames and cause the app to stop loading
let CookieStorage;
try {
  CookieStorage = require('../vendor/redux-persist-cookie-storage');
  // possibly same risks with localStorage
  localStorage.init({
    storageName: 'anchor-website',
  });
} catch (environmentError) {}

runArrayFindPolyfill(); // IE11 support
global.__SERVER__ = false;

// Redux devtools
const composeWidthDevtools =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Custom non-redux analytics setup
setUpCustomAttributes();

const store = createStore(
  rootReducer,
  // Grab the state from a global variable injected into the server-generated HTML
  window.__STATE__ || {},
  composeWidthDevtools(
    // https://alecaivazis.gitbooks.io/redux-responsive/content/
    createResponsiveStoreEnhancer({
      performanceMode: false,
      calculateInitialState: false,
      throttleTime: 500,
    }),
    applyMiddlewareWithHistory(history)
  ),
  autoRehydrate()
);
const onStorageReady = () => {
  // async bundle splitting; components to fetch provided by SSR
  const splitPoints = window.__SPLIT_POINTS__ || [];
  Promise.all(splitPoints.map(chunk => Bundle[chunk].loadComponent())) // This is the important part
    .then(() => {
      ReactDOM.render(
        <AppEntry store={store} history={history} />,
        document.getElementById('app')
      );
    });

  // calculate the initial browser window state (only in the client, after render)
  store.dispatch(calculateResponsiveState(window));

  // start playback analytics sync timer
  // TODO: deprecate 2.0 analytics
  store.dispatch(startSyncInterval());
};

// dispatch an app initialization in case some initial data needs to be further
// converted from JSON (e.g. dates)
store.dispatch({ type: APP_INIT });

// Allow the server-injected state to be garbage-collected
delete window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
delete window.__STATE__;

// bootstrap custom button
addStyle(Button, 'listen');
addStyle(Button, 'nav');
addStyle(Button, 'overlay');

if (CookieStorage) {
  const sessionStorage = new CookieStorage({
    expiration: {
      default: 604800, // One week in seconds
    },
  });

  persistStore(
    store,
    {
      debounce: 1000, // debounce 1 second because of actions like RECEIVE_PLAYBACK_POSITION which are rapid-fire
      storage: sessionStorage,
      whitelist: [
        'compliance',
        'localStorage',
        'tutorial',
        'voiceMessageCreationModalScreen',
        'onboarding',
      ],
    },
    onStorageReady
  );
} else {
  onStorageReady();
}

if ((BUILD_ENVIRONMENT || '').startsWith('development') && module.hot) {
  module.hot.accept();
}

if (BUILD_ENVIRONMENT === 'development-mock') {
  const { server } = require('./test/msw/development-server');
  server.start();
}
