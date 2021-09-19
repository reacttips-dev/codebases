import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware, { END } from 'redux-saga';
import ab from 'react-redux-hydra';
import { createStateSyncMiddleware, initStateWithPrevTab } from 'redux-state-sync';
import { routerMiddleware } from 'react-router-redux';

import rootReducerFactory from 'reducers';
import AppEnvironment from 'helpers/AppEnvironment';
import { hydraHostForHost } from 'helpers/HydraHelpers';
import { browserMetadataMiddlewareFactory } from 'middleware/browserMetadataMiddleware';
import zfcUrlTestMiddleware from 'middleware/zfcUrlTestMiddleware';
import marketplace from 'cfg/marketplace.json';

const {
  cookieDomain,
  hydra: {
    refresh: {
      client: hydraRefreshThreshold
    },
    api: {
      relativeUrl
    }
  }
} = marketplace;

const { isClient, showDevTools } = AppEnvironment;

const noopSaga = () => ({ done: Promise.resolve() });

const reduxStateSyncConfig = {
  whitelist: [
    'RECEIVE_CART_ITEMS'
  ]
};

const checkActiveHydraTestsMiddleware = state => ab.middleware.checkActiveHydraTestsFactory({
  url: relativeUrl,
  domain: cookieDomain,
  hosts: [hydraHostForHost(window.location.hostname, state.environmentConfig)],
  threshold: hydraRefreshThreshold
});

export default function configureStore(initialState, history, storeOptions = { reducers:{}, rootSaga: undefined }) {
  const sagaMiddleware = createSagaMiddleware();
  const finalCreateStore = compose(
    isClient ? applyMiddleware(checkActiveHydraTestsMiddleware(initialState)) : f => f,
    applyMiddleware(zfcUrlTestMiddleware),
    applyMiddleware(thunk),
    applyMiddleware(sagaMiddleware),
    applyMiddleware(routerMiddleware(history)),
    isClient ? applyMiddleware(createStateSyncMiddleware(reduxStateSyncConfig)) : f => f,
    // browser metadata middleware must be after the routerMiddleware
    isClient ? applyMiddleware(browserMetadataMiddlewareFactory(history)) : f => f,
    showDevTools ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  )(createStore);

  const reduxStore = finalCreateStore(rootReducerFactory(storeOptions.reducers), initialState);
  reduxStore.runSaga = storeOptions.rootSaga ? () => sagaMiddleware.run(storeOptions.rootSaga) : noopSaga;
  reduxStore.close = () => reduxStore.dispatch(END);

  initStateWithPrevTab(reduxStore);

  return reduxStore;
}
