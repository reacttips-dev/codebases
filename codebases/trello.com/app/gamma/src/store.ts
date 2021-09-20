/* eslint-disable import/no-default-export */
import {
  applyMiddleware,
  compose,
  createStore,
  StoreEnhancerStoreCreator,
  Store,
} from 'redux';
import thunk from 'redux-thunk';

import reducers from 'app/gamma/src/modules';
import { State } from 'app/gamma/src/modules/types';
import { Action } from '@trello/redux';
import { saveLastSession } from 'app/gamma/src/util/last-session';
import { TrelloWindow } from '@trello/window-types';
declare const window: TrelloWindow;

type ReduxMiddleware = (store: Store<State>) => void;

export default (
  additionalMiddlewareFunctions?: ReduxMiddleware[],
): Store<State> => {
  // Prefer the newer Redux DevTools global, but fallback to the old one.
  const reduxDevTools =
    window.__REDUX_DEVTOOLS_EXTENSION__ || window.devToolsExtension;

  // Also apply our middleware for navigating
  const store = createStore(
    reducers,
    compose(
      applyMiddleware(thunk),
      process.env.NODE_ENV === 'development' && reduxDevTools
        ? reduxDevTools({
            serialize: {
              options: {
                function: (symbol: symbol) => symbol.toString(),
              },
            },
            // In the future this may be able to be removed if the serialize
            // object works as intended and correctly handles symbols.
            actionSanitizer: (action: Action<symbol, object>) => ({
              ...action,
              type: action.type.toString().replace(/Symbol\((.+)\)/, '$1'),
            }),
          })
        : (f: StoreEnhancerStoreCreator<object>) => f,
    ),
  ) as Store<State>;

  saveLastSession(store);

  if (Array.isArray(additionalMiddlewareFunctions)) {
    additionalMiddlewareFunctions.forEach((middlewareFunction) => {
      middlewareFunction(store);
    });
  }

  return store;
};
