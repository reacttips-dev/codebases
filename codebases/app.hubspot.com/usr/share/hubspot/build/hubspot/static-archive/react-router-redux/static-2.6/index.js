'use es6';
/**
 * This action type will be dispatched when your history
 * receives a location change.
 */

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
var LOCATION_CHANGE = '@@router/LOCATION_CHANGE';
var initialState = {
  locationBeforeTransitions: null
  /**
   * This reducer will update the state with the most recent location history
   * has transitioned to. This may not be in sync with the router, particularly
   * if you have asynchronously-loaded routes, so reading from and relying on
   * this state is discouraged.
   */

};

function routerReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      type = _ref.type,
      payload = _ref.payload;

  if (type === LOCATION_CHANGE) {
    return Object.assign({}, state, {
      locationBeforeTransitions: payload
    });
  }

  return state;
}

var defaultSelectLocationState = function defaultSelectLocationState(state) {
  return state.routing;
};
/**
 * This function synchronizes your history state with the Redux store.
 * Location changes flow from history to the store. An enhanced history is
 * returned with a listen method that responds to store updates for location.
 *
 * When this history is provided to the router, this means the location data
 * will flow like this:
 * history.push -> store.dispatch -> enhancedHistory.listen -> router
 * This ensures that when the store state changes due to a replay or other
 * event, the router will be updated appropriately and can transition to the
 * correct router state.
 */


function syncHistoryWithStore(history, store) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref2$selectLocationS = _ref2.selectLocationState,
      selectLocationState = _ref2$selectLocationS === void 0 ? defaultSelectLocationState : _ref2$selectLocationS,
      _ref2$adjustUrlOnRepl = _ref2.adjustUrlOnReplay,
      adjustUrlOnReplay = _ref2$adjustUrlOnRepl === void 0 ? true : _ref2$adjustUrlOnRepl;

  // Ensure that the reducer is mounted on the store and functioning properly.
  if (typeof selectLocationState(store.getState()) === 'undefined') {
    throw new Error('Expected the routing state to be available either as `state.routing` ' + 'or as the custom expression you can specify as `selectLocationState` ' + 'in the `syncHistoryWithStore()` options. ' + 'Ensure you have added the `routerReducer` to your store\'s ' + 'reducers via `combineReducers` or whatever method you use to isolate ' + 'your reducers.');
  }

  var initialLocation;
  var isTimeTraveling;
  var unsubscribeFromStore;
  var unsubscribeFromHistory;
  var currentLocation; // What does the store say about current location?

  var getLocationInStore = function getLocationInStore(useInitialIfEmpty) {
    var locationState = selectLocationState(store.getState());
    return locationState.locationBeforeTransitions || (useInitialIfEmpty ? initialLocation : undefined);
  }; // Init initialLocation with potential location in store


  initialLocation = getLocationInStore(); // If the store is replayed, update the URL in the browser to match.

  if (adjustUrlOnReplay) {
    var handleStoreChange = function handleStoreChange() {
      var locationInStore = getLocationInStore(true);

      if (currentLocation === locationInStore || initialLocation === locationInStore) {
        return;
      } // Update address bar to reflect store state


      isTimeTraveling = true;
      currentLocation = locationInStore;
      history.transitionTo(Object.assign({}, locationInStore, {
        action: 'PUSH'
      }));
      isTimeTraveling = false;
    };

    unsubscribeFromStore = store.subscribe(handleStoreChange);
    handleStoreChange();
  } // Whenever location changes, dispatch an action to get it in the store


  var handleLocationChange = function handleLocationChange(location) {
    // ... unless we just caused that location change
    if (isTimeTraveling) {
      return;
    } // Remember where we are


    currentLocation = location; // Are we being called for the first time?

    if (!initialLocation) {
      // Remember as a fallback in case state is reset
      initialLocation = location; // Respect persisted location, if any

      if (getLocationInStore()) {
        return;
      }
    } // Tell the store to update by dispatching an action


    store.dispatch({
      type: LOCATION_CHANGE,
      payload: location
    });
  };

  unsubscribeFromHistory = history.listen(handleLocationChange); // History 3.x doesn't call listen synchronously, so fire the initial location change ourselves

  if (history.getCurrentLocation) {
    handleLocationChange(history.getCurrentLocation());
  } // The enhanced history uses store as source of truth


  return Object.assign({}, history, {
    // The listeners are subscribed to the store instead of history
    listen: function listen(listener) {
      // Copy of last location.
      var lastPublishedLocation = getLocationInStore(true); // Keep track of whether we unsubscribed, as Redux store
      // only applies changes in subscriptions on next dispatch

      var unsubscribed = false;
      var unsubscribeFromStore = store.subscribe(function () {
        var currentLocation = getLocationInStore(true);

        if (currentLocation === lastPublishedLocation) {
          return;
        }

        lastPublishedLocation = currentLocation;

        if (!unsubscribed) {
          listener(lastPublishedLocation);
        }
      }); // History 2.x listeners expect a synchronous call. Make the first call to the
      // listener after subscribing to the store, in case the listener causes a
      // location change (e.g. when it redirects)

      if (!history.getCurrentLocation) {
        listener(lastPublishedLocation);
      } // Let user unsubscribe later


      return function () {
        unsubscribed = true;
        unsubscribeFromStore();
      };
    },
    // It also provides a way to destroy internal listeners
    unsubscribe: function unsubscribe() {
      if (adjustUrlOnReplay) {
        unsubscribeFromStore();
      }

      unsubscribeFromHistory();
    }
  });
}
/**
 * This action type will be dispatched by the history actions below.
 * If you're writing a middleware to watch for navigation events, be sure to
 * look for actions of this type.
 */


var CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD';

function updateLocation(method) {
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return {
      type: CALL_HISTORY_METHOD,
      payload: {
        method: method,
        args: args
      }
    };
  };
}
/**
 * These actions correspond to the history API.
 * The associated routerMiddleware will capture these events before they get to
 * your reducer and reissue them as the matching function on your history.
 */


var push = updateLocation('push');
var replace = updateLocation('replace');
var go = updateLocation('go');
var goBack = updateLocation('goBack');
var goForward = updateLocation('goForward');
var routerActions = {
  push: push,
  replace: replace,
  go: go,
  goBack: goBack,
  goForward: goForward
};
/**
 * This middleware captures CALL_HISTORY_METHOD actions to redirect to the
 * provided history object. This will prevent these actions from reaching your
 * reducer or any middleware that comes after this one.
 */

function routerMiddleware(history) {
  return function () {
    return function (next) {
      return function (action) {
        if (action.type !== CALL_HISTORY_METHOD) {
          return next(action);
        }

        var _action$payload = action.payload,
            method = _action$payload.method,
            args = _action$payload.args;
        history[method].apply(history, _toConsumableArray(args));
      };
    };
  };
}

export { CALL_HISTORY_METHOD, LOCATION_CHANGE, go, goBack, goForward, push, replace, routerActions, routerMiddleware, routerReducer, syncHistoryWithStore };