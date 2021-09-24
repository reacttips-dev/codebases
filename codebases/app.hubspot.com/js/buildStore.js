'use es6';

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Immutable from 'immutable';
import AgentResponseTimeoutMiddleware from './email-capture/middleware/AgentResponseTimeoutMiddleware';
import VisitorLastSeenMiddleware from './last-seen/middleware/VisitorLastSeenMiddleware';
import VisitorNotificationMiddleware from './middleware/VisitorNotificationMiddleware';
import { visitorErrorMiddleware } from './error-reporting/middleware/visitorErrorMiddleware';
import { realtime } from './pubsub/middleware/realtime';
import { INITIALIZE_PUBSUB } from './pubsub/constants/asyncActionTypes';
import visitorUIRootReducer from './reducers/visitorUIRootReducer';

var getCompose = function getCompose() {
  var shouldEnableDevTools = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

  if (shouldEnableDevTools) {
    return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      maxAge: 200,
      serialize: {
        options: {
          circular: '[CIRCULAR]'
        },
        immutable: Immutable
      },
      // Ably's client is quite large and serializing it slows down redux devtools
      actionSanitizer: function actionSanitizer(action) {
        if (action.type === INITIALIZE_PUBSUB.SUCCEEDED) {
          return Object.assign({}, action, {
            payload: {
              client: '<< PUBSUB CLIENT >>'
            }
          });
        }

        return action;
      },
      stateSanitizer: function stateSanitizer(state) {
        if (state.pubSubClient.data) {
          return Object.assign({}, state, {
            pubSubClient: state.pubSubClient.set('data', '<< PUBSUB CLIENT >>')
          });
        }

        return state;
      }
    });
  }

  return compose;
};

export default function buildStore(initialState, extraArgs) {
  var middleware = [thunk.withExtraArgument(extraArgs), visitorErrorMiddleware, VisitorLastSeenMiddleware, VisitorNotificationMiddleware, AgentResponseTimeoutMiddleware, realtime];
  var composeEnhancers = getCompose();
  return createStore(visitorUIRootReducer, initialState, composeEnhancers(applyMiddleware.apply(void 0, middleware)));
}