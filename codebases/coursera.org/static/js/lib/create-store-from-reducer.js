/**
 * Create a Fluxible Store from a reducer function. Registers okay
 * with fluxible apps
 */

/* eslint-disable no-console */
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';

import store from 'js/lib/coursera.store';

const repeat = (str, times) => new Array(times + 1).join(str);
const pad = (num, maxLength) => repeat('0', maxLength - num.toString().length) + num;

// TODO: Determine a better way to do this that doesn't have to be aware
// of localStorage or the url path.
const showLogging = store.get('enableReducerLogging');

class ReducerStore extends BaseStore {
  getState() {
    return this.state;
  }

  dehydrate() {
    return this.getState();
  }

  rehydrate(state) {
    this.state = state;
  }
}

/**
 * Create Fluxible compatible store from reducer. Dev logging shamelessly
 * adapted from https://github.com/fcomb/redux-logger/
 */
function createStoreFromReducer(reducer, storeNameString, actionNames, initialState, options = {}) {
  // This action is used to bootstrap initial state.

  class WrappedReducerStore extends ReducerStore {
    static storeName = storeNameString;

    static handlers = actionNames.reduce((memo, actionName) => {
      memo[actionName] = function (data = {}) {
        const prevState = this.getState();
        const action = { type: actionName, ...data };
        const nextState = (this.state = reducer(prevState, action)); // eslint-disable-line no-multi-assign
        if (showLogging) {
          const time = new Date();

          const formattedTime = ` @ ${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(
            time.getSeconds(),
            2
          )}.${pad(time.getMilliseconds(), 3)}`; // eslint-disable-line
          const message = `${storeNameString} action ${action.type}${formattedTime}`;
          const startMessage = console.group;

          try {
            startMessage.call(console, message);
          } catch (e) {
            console.log(message);
          }

          console.log('%c prev state', 'color: #9E9E9E; font-weight: bold', prevState);
          console.log('%c action', 'color: #03A9F4; font-weight: bold', action);
          console.log('%c next state', 'color: #4CAF50; font-weight: bold', nextState);

          try {
            console.groupEnd();
          } catch (e) {
            console.log('—— log end ——');
          }
        }

        this.emitChange();
      };

      return memo;
    }, {});

    constructor(dispatcher) {
      super(dispatcher);
      this.state = initialState;
    }

    getState() {
      return this.state;
    }

    dehydrate() {
      if (options.dehydrate) {
        return options.dehydrate.call(this);
      } else {
        return this.getState();
      }
    }

    rehydrate(state) {
      if (options.rehydrate) {
        options.rehydrate.call(this, state);
      } else {
        this.state = state;
      }
    }
  }

  return WrappedReducerStore;
}

export default createStoreFromReducer;
