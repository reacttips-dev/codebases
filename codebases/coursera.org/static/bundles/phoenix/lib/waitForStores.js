/**
 * This file is a Coursera modification of Fluxible's connectToStores.
 *
 * Modification 1:
 * waitForStores allows the author to specify which stores need to be loaded before rendering a component.
 * For this to work, two things must be true:
 * 1. All stores must be loaded at the top-level (this connector does not actually load the stores).
 * 2. Each store must expose a `hasLoaded` function that returns true if the store is loaded
 * and false if not.
 *
 * When an array of store names is passed as the second parameter (as in stock connectToStores), waitForStores
 * waits for all of the specified stores to be loaded before rendering the wrapped component. It does so by
 * calling `hasLoaded()` on each of these stores.
 *
 * waitForStores also accepts an object of the following form as the second parameter:
 * {
 *   requiredStores: ['S12nStore'],
 *   lazyStores: ['CourseStore']
 * }
 * In this case, "requiredStores" must be loaded before rendering, and "lazyStores" do not have to be.
 *
 * Modification 2:
 * Fix bug where connectToStores handler would not run when props were updated.
 * Added componentWillReceiveProps method and props argument to getStateFromStores.
 *
 */

/**
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

'use strict';

import React from 'react';
import objectAssign from 'vendor/cnpm/object-assign.v3/index';
import contextTypes from 'vendor/cnpm/fluxible.v0-4/lib/contextTypes';
import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';

/**
 * Registers change listeners and retrieves state from stores using `getStateFromStores`
 * method. Concept provided by Dan Abramov via
 * https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750
 * @method connectToStores
 * @param {React.Component} Component component to pass state as props to
 * @param {array} stores List of stores to listen for changes
 * @param {function} getStateFromStores function that receives all stores and should return
 *      the full state object. Receives `stores` hash and component `props` as arguments
 * @returns {React.Component}
 */
function waitForStoresImpl(Component, stores, getStateFromStores) {
  let requiredStores;
  let allStores = [];

  if (stores instanceof Array) {
    requiredStores = stores;
    allStores = stores;
  } else if (stores.hasOwnProperty('requiredStores') || stores.hasOwnProperty('lazyStores')) {
    requiredStores = stores.requiredStores || [];
    const lazyStores = stores.lazyStores || [];
    allStores = allStores.concat(requiredStores, lazyStores);
  }

  const componentName = Component.displayName || Component.name;

  class StoreConnector extends React.Component {
    static displayName = componentName + 'StoreConnector';

    static contextTypes = {
      getStore: contextTypes.getStore,
    };

    componentDidMount() {
      allStores.forEach(function storesEach(Store) {
        this.context.getStore(Store).addChangeListener(this._onStoreChange);
      }, this);
    }

    componentWillReceiveProps(nextProps) {
      this.setState(this.getStateFromStores(nextProps));
    }

    componentWillUnmount() {
      allStores.forEach(function storesEach(Store) {
        this.context.getStore(Store).removeChangeListener(this._onStoreChange);
      }, this);
    }

    getStateFromStores = (_props) => {
      if (!this.haveRequiredStoresLoaded()) {
        return {};
      }

      const props = _props || this.props;
      if (typeof getStateFromStores === 'function') {
        const storeInstances = {};
        allStores.forEach(function (store) {
          const storeName = store.name || store.storeName || store;
          storeInstances[storeName] = this.context.getStore(store);
        }, this);
        return getStateFromStores(storeInstances, props);
      }
      const state = {};
      // @TODO deprecate?
      Object.keys(getStateFromStores).forEach(function (storeName) {
        const stateGetter = getStateFromStores[storeName];
        const store = this.context.getStore(storeName);
        objectAssign(state, stateGetter(store, props));
      }, this);
      return state;
    };

    _onStoreChange = () => {
      this.setState(this.getStateFromStores());
    };

    haveRequiredStoresLoaded = () => {
      return requiredStores.every(
        function storesEach(Store) {
          const storeInstance = this.context.getStore(Store);
          if (!storeInstance.hasLoaded) {
            throw new Error(
              `waitForStores wrapping ${this.displayName}: hasLoaded is not defined for ${Store}.
 Define the method or, if the method cannot be defined, include the store in 'lazyStores' instead.`
            );
          } else {
            return storeInstance.hasLoaded();
          }
        }.bind(this)
      );
    };

    state = this.getStateFromStores(this.props);

    render() {
      if (!this.haveRequiredStoresLoaded()) {
        if (Component.LOADING_COMPONENT) {
          return React.createElement(Component.LOADING_COMPONENT);
        } else {
          return null;
        }
      }
      return React.createElement(Component, objectAssign({}, this.props, this.state));
    }
  }

  hoistNonReactStatics(StoreConnector, Component);

  return StoreConnector;
}

export default function waitForStores() {
  const args = Array.prototype.slice.call(arguments);
  if (args.length === 2) {
    const stores = args[0];
    const getStateFromStores = args[1];
    return function (Component) {
      return waitForStoresImpl(Component, stores, getStateFromStores);
    };
  }

  return waitForStoresImpl.apply(this, arguments);
}
