// This comment serves as a convenient way to force R2 to build all apps for a given commit.
//
// RebuildEverything: 3

import ReactDOM from 'react-dom';
import React from 'react';

// eslint-disable-next-line import/extensions
import getLocale from 'js/lib/locale.client';
import { Router } from 'react-router';
import { StyleSheet } from '@coursera/aphrodite';
import Q from 'q';
import { setupClient as defaultSetupClient } from 'bundles/page/lib/router';
import ApplicationActionCreators from 'bundles/page/actions/ApplicationActionCreators';
import MetatagsWrapper from 'bundles/page/components/MetatagsWrapper';
import log from 'js/app/loggerSingleton';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'js/l... Remove this comment to see the full error message
import timing from 'js/lib/timing';
import { OldRouterNewContext } from 'js/lib/useRouter';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'js/a... Remove this comment to see the full error message
import setupMoment from 'js/app/setupMoment';
import { provideAppWithContext as defaultProvideAppWithContext } from 'bundles/page/lib/reactApps';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import { notifyConsole } from 'bundles/career/util/peekers';
import { createApolloClient } from 'bundles/page/lib/network/Apollo';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import axe from 'react-axe';
import 'js/app/setupEnvironment';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'js/l... Remove this comment to see the full error message
import initializeWebVitalsEventing from 'js/lib/initializeWebVitalsEventing';

// axe is replaced by an empty object by null-loader if in production environment or if the C_DISABLE_REACT_AXE environment variable is defined for the webpack process
// this configuration can be found in web/config/webpack/module/rules/index.js
if (typeof axe === 'function') {
  // https://github.com/dequelabs/react-axe
  // Automatically run's accessibility audits on components as they mount and rerender
  // Deduplicates and debounces the results and outputs them to the console.
  axe(React, ReactDOM, 1000);
}

initializeWebVitalsEventing();

const ssrStage = (stage: $TSFixMe) => `serverRendering.${stage}`;

const MOUNT_NODE = document.getElementById('rendered-content');

const rehydrateFluxible = (appEnv: $TSFixMe, dehydratedState: $TSFixMe) => {
  log.info('Rendering by rehydrating dehydratedState');
  timing.setMark(ssrStage('startRehydrate'));
  timing.time('fluxibleRehydrate');

  // @ts-expect-error ts-migrate(2350) FIXME: Only a void function can be called with the 'new' ... Remove this comment to see the full error message
  return new Q.Promise((resolve, reject) => {
    appEnv.rehydrate(dehydratedState, (err: $TSFixMe, fluxibleContext: $TSFixMe) => {
      if (err) return reject(err);

      // Used in bundles/page/lib/Timing
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'context' does not exist on type 'Window ... Remove this comment to see the full error message
      window.context = fluxibleContext;

      timing.timeEnd('fluxibleRehydrate');
      return resolve(fluxibleContext);
    });
  });
};

const renderReact = (type: $TSFixMe) => {
  const renderedEvent = new CustomEvent('rendered');

  timing.time('stylesheetRehydrate');
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'renderedClassNames' does not exist on ty... Remove this comment to see the full error message
  StyleSheet.rehydrate(window.renderedClassNames);
  timing.timeEnd('stylesheetRehydrate');

  timing.time('reactRender');
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'ssr' does not exist on type 'Window & ty... Remove this comment to see the full error message
  const renderToDOM = window.ssr ? ReactDOM.hydrate : ReactDOM.render;
  renderToDOM(React.createElement(type), MOUNT_NODE, () => {
    // Track if SSR matches CSR. SSR and CSR matches when 'data-react-checksum' exists in the DOM
    const wrappers = document.getElementsByClassName('rc-MetatagsWrapper');
    let checksum;
    Array.prototype.forEach.call(wrappers, (wrapper) => {
      checksum = wrapper.getAttribute('data-react-checksum');
    });
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'REACT_CHECKSUM' does not exist on type '... Remove this comment to see the full error message
    window.REACT_CHECKSUM = checksum; // TODO: remove when on React 16

    log.info('React app rendered');
    timing.setMark(ssrStage('completeRender'), true);
    timing.timeEnd('reactRender');
    window.dispatchEvent(renderedEvent);
  });
};

// Remove SSR-injected styles that are duplicated during CSR.
const removeDuplicatedSsrStyles = () => {
  const cdsStyles = document.querySelector('style[data-coursera-design-system]');
  if (cdsStyles) {
    // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
    cdsStyles.parentElement.removeChild(cdsStyles);
  }
};

// @ts-expect-error ts-migrate(2339) FIXME: Property 'App' does not exist on type 'Window & ty... Remove this comment to see the full error message
const appStarterFactory = (fluxibleAppEnv, { fluxibleData = window.App } = {}, overrideCb?: $TSFixMe) => {
  // Interop with ES modules
  if (fluxibleAppEnv.default) {
    fluxibleAppEnv = fluxibleAppEnv.default;
  }

  // Interop with factory functions (to get away from singletons)
  if (typeof fluxibleAppEnv === 'function') {
    fluxibleAppEnv = fluxibleAppEnv();
  }

  // Optional function overrides
  const { setupClient = defaultSetupClient, provideAppWithContext = defaultProvideAppWithContext } = overrideCb
    ? overrideCb()
    : {};

  // TODO(jon): find a less fragile abstraction for skipping hydration.
  if (fluxibleData === 'SKIP_CLIENT') {
    return null;
  }

  setupMoment();

  // Let devs who are peeking under the hood know we are hiring!
  notifyConsole();

  const initializeAppEnvironment = () => {
    timing.time('initializeAppEnvironment');
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'all' does not exist on type '<T>(resolve... Remove this comment to see the full error message
    return Q.Promise.all([
      fluxibleData ? rehydrateFluxible(fluxibleAppEnv, fluxibleData) : fluxibleAppEnv.createContext(),
      createApolloClient(),
    ]).then((values: $TSFixMe) => {
      timing.timeEnd('initializeAppEnvironment');
      return values;
    });
  };

  // TODO refactor during react-intl v2 migration
  const reactIntlContext = {
    locale: getLocale(),
    // note: [FLEX-19325] temporary fix does not pass messages property which will be required by react-intl v2 migration
  };

  const promise = initializeAppEnvironment()
    // @ts-ignore ts-migrate(7031) FIXME: Binding element 'fluxibleContext' implicitly has a... Remove this comment to see the full error message
    .then(([fluxibleContext, apolloClient]) => {
      const routerConfiguration = fluxibleAppEnv.getComponent();

      timing.time('setupRoutes');
      return setupClient({ routes: routerConfiguration })
        .then((renderProps: $TSFixMe) => {
          timing.timeEnd('setupRoutes');
          timing.setMark(ssrStage('startFresh'));
          return (
            fluxibleContext
              // TODO: Deprecate setUserAgent? (do we need this?)
              .executeAction(ApplicationActionCreators.setUserAgent, navigator.userAgent)
              .then(() => renderProps)
          );
        })
        .then((renderProps: $TSFixMe) => {
          const { history, location, router } = renderProps;
          const routerContextValue = { history, location, router };
          return provideAppWithContext({
            routing: () => (
              <MetatagsWrapper url={window.location.href}>
                <OldRouterNewContext.Provider value={routerContextValue}>
                  <Router {...renderProps} />
                </OldRouterNewContext.Provider>
              </MetatagsWrapper>
            ),
            fluxibleContext,
            apolloClient,
            reactIntlContext,
          });
        })
        .then((type: $TSFixMe) => {
          renderReact(type);
          removeDuplicatedSsrStyles();
        });
    })
    .catch((err: $TSFixMe) => {
      throw err;
    });

  promise.done();

  return promise;
};

export default appStarterFactory;
