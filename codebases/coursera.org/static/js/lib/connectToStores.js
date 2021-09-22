/**
 * Custom fork of connectToStores that allows us to get type safety via flow.
 *
 * Instead of" connectToStores([CourseStore], ({CourseStore}, props) => {...})(MyComponent)
 *
 * use: connectToStores([CourseStore], (CourseStore, props) => {...})(MyComponent);
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
function connectToStoresImpl(Component, stores, getStateFromStores, customContextTypes) {
  const componentName = Component.displayName || Component.name;
  const componentContextTypes = Object.assign(
    {
      getStore: contextTypes.getStore,
    },
    customContextTypes
  );

  // Support passing in an object {[storeName: string]: $Subtype<BaseStore>}
  const storesArray = Array.isArray(stores)
    ? stores
    : Object.keys(stores || {}).map(function (storeName) {
        return stores[storeName];
      });

  const StoreConnector = React.createClass({
    displayName: componentName + 'StoreConnector',
    contextTypes: componentContextTypes,
    getInitialState: function getInitialState() {
      return this.getStateFromStores(this.props);
    },
    componentDidMount: function componentDidMount() {
      this._isMounted = true;
      storesArray.forEach(function storesEach(Store) {
        this.context.getStore(Store).addChangeListener(this._onStoreChange);
      }, this);
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      this.setState(this.getStateFromStores(nextProps));
    },
    componentWillUnmount: function componentWillUnmount() {
      this._isMounted = false;
      storesArray.forEach(function storesEach(Store) {
        this.context.getStore(Store).removeChangeListener(this._onStoreChange);
      }, this);
    },
    getStateFromStores(props) {
      props = props || this.props;
      if (typeof getStateFromStores === 'function') {
        const storeInstances = storesArray.map(
          function (store) {
            const storeName = store.name || store.storeName || store;
            return this.context.getStore(store);
          }.bind(this)
        );

        const getStateFromStoresArgs = [].concat(storeInstances).concat([props, this.context]);

        return getStateFromStores.apply(this, getStateFromStoresArgs);
      }
      const state = {};
      // @TODO deprecate?
      Object.keys(getStateFromStores).forEach(function (storeName) {
        const stateGetter = getStateFromStores[storeName];
        const store = this.context.getStore(storeName);
        objectAssign(state, stateGetter(store, props));
      }, this);

      return state;
    },
    _onStoreChange: function onStoreChange() {
      if (this._isMounted) {
        this.setState(this.getStateFromStores());
      }
    },
    render: function render() {
      return React.createElement(Component, objectAssign({}, this.props, this.state));
    },
  });

  hoistNonReactStatics(StoreConnector, Component);

  return StoreConnector;
}

export default function connectToStores() {
  const args = Array.prototype.slice.call(arguments);
  // If this is called with two arguments (usually inside _.compose) we will return a closure to be called later.
  if (args.length === 2) {
    var stores = args[0];
    var getStateFromStores = args[1];
    return function (Component) {
      return connectToStoresImpl(Component, stores, getStateFromStores);
    };
  } else if (args.length === 3 && args[0] instanceof Array) {
    // If this is called with three arguments and the first argument is an array (not a react component), we assume
    // that we want to return a closure to compose later and the third argument is instead the customContextTypes.
    var stores = args[0];
    var getStateFromStores = args[1];
    const customContextTypes = args[2];
    return function (Component) {
      return connectToStoresImpl(Component, stores, getStateFromStores, customContextTypes);
    };
  }

  return connectToStoresImpl.apply(this, arguments);
}
