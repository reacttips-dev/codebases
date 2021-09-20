// Polyfills
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'app/src/polyfills/element-closest';
import 'app/src/polyfills/request-animation-frame';
import 'event-source-polyfill/src/eventsource';
import 'intersection-observer';
import 'intl';
import 'url-polyfill';
import 'app/scripts/vendor/ChildNode.remove.polyfill'; // custom addition on line 12: if (this.parentNode !== null)
import 'whatwg-fetch';
import 'core-js/features/array/flat-map'; // https://babeljs.io/docs/en/v7-migration#remove-proposal-polyfills-in-babel-polyfill-https-githubcom-babel-babel-issues-8416
import '@trello/history-events';

import { ApolloProvider } from '@trello/graphql';
import { initializeSentry, startSession } from '@trello/error-reporting';

if (process.env.NODE_ENV === 'production') {
  initializeSentry();
}
startSession();

// Install the window.onerror trap as early as possible, as this is what
// propagates to the crash reporting
import 'app/scripts/init/error-logger';

import 'app/scripts/init';
// Extend jQuery with the format and formatHtml methods
import 'app/scripts/lib/jquery-localize';

import React from 'react';
import ReactDOM from '@trello/react-dom-wrapper';

import { defaultStore } from 'app/gamma/src/defaultStore';
import { setMember } from 'app/gamma/src/modules/state/models/session';
import { loadMemberProfile } from 'app/gamma/src/modules/loaders/load-member';

import { sendReloadedToUpdateEvent } from '@trello/client-updater';
import { TrelloStorage } from '@trello/storage';
import { memberId } from '@trello/session-cookie';
import { App } from 'app/src/components/App';
import {
  generateSupportDebugData,
  beginListeningForOptionalDebugEvents,
} from 'app/src/generateSupportDebugData';
import { recordFeatureFlags } from 'app/scripts/init/record-feature-flags';
import { handleStorageError } from 'app/scripts/init/handleStorageError';

// Import FeatureRolloutConfig as it's an unbounded object to dedupe code splits
import 'app/src/components/NewFeature/FeatureRolloutConfig';

beginListeningForOptionalDebugEvents();
window.__TRELLO_SUPPORT = generateSupportDebugData;

// Redux store setup, included here so that we can safely assume it's present early
TrelloStorage.setStore(defaultStore);
TrelloStorage.addErrorListener(handleStorageError);
if (memberId) {
  defaultStore.dispatch(setMember({ idMe: memberId }));
  defaultStore.dispatch(loadMemberProfile(memberId));
}

ReactDOM.render(
  <ApolloProvider>
    <App />
  </ApolloProvider>,
  document.getElementById('chrome-container'),
);

// If we are loading now as the result of a reload to pick up a new version,
// send an operational event
sendReloadedToUpdateEvent();

// Write current feature flags to localStorage so we can send them along with
// any support requests
recordFeatureFlags();
