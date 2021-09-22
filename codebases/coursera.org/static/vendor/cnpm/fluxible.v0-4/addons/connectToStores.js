// Coursera modification:
//   - Fix bug where connectToStores handler would not run when props were updated.
//   - Added componentWillReceiveProps method and props argument to getStateFromStores.
//   - Added support for decorator syntax/composing (available in 0.5)
//   - Added hoisting statics
//   - Pull in _isMounted from newer versions
//   - Pull in customContextTypes from newer versions

/**
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';

import React from 'react';
import createReactClass from 'create-react-class';
import objectAssign from 'vendor/cnpm/object-assign.v3/index';
import contextTypes from '../lib/contextTypes';
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
    var componentName = Component.displayName || Component.name;
    var componentContextTypes = Object.assign({
        getStore: contextTypes.getStore
    }, customContextTypes);
    var StoreConnector = createReactClass({
        displayName: componentName + 'StoreConnector',
        contextTypes: componentContextTypes,
        getInitialState: function getInitialState() {
            return this.getStateFromStores(this.props);
        },
        componentDidMount: function componentDidMount() {
            this._isMounted = true;
            stores.forEach(function storesEach(Store) {
                this.context.getStore(Store).addChangeListener(this._onStoreChange);
            }, this);
        },
        componentWillReceiveProps: function componentWillReceiveProps(nextProps){
            this.setState(this.getStateFromStores(nextProps));
        },
        componentWillUnmount: function componentWillUnmount() {
            this._isMounted = false;
            stores.forEach(function storesEach(Store) {
                this.context.getStore(Store).removeChangeListener(this._onStoreChange);
            }, this);
        },
        getStateFromStores: function (props) {
          props = props || this.props;
            if ('function' === typeof getStateFromStores) {
                var storeInstances = {};
                stores.forEach(function (store) {
                    var storeName = store.name || store.storeName || store;
                    storeInstances[storeName] = this.context.getStore(store);
                }, this);
                return getStateFromStores(storeInstances, props, this.context);
            }
            var state = {};
            //@TODO deprecate?
            Object.keys(getStateFromStores).forEach(function (storeName) {
                var stateGetter = getStateFromStores[storeName];
                var store = this.context.getStore(storeName);
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
        }
    });

    hoistNonReactStatics(StoreConnector, Component);

    return StoreConnector;
};

export default function connectToStores() {
  var args = Array.prototype.slice.call(arguments);
  // If this is called with two arguments (usually inside _.compose) we will return a closure to be called later.
  if (args.length === 2) {
    var stores = args[0];
    var getStateFromStores = args[1];
    return function(Component) {
      return connectToStoresImpl(Component, stores, getStateFromStores);
    };
  } else if (args.length === 3 && args[0] instanceof Array) {
    // If this is called with three arguments and the first argument is an array (not a react component), we assume
    // that we want to return a closure to compose later and the third argument is instead the customContextTypes.
    var stores = args[0];
    var getStateFromStores = args[1];
    var customContextTypes = args[2];
    return function(Component) {
      return connectToStoresImpl(Component, stores, getStateFromStores, customContextTypes);
    };
  }

  return connectToStoresImpl.apply(this, arguments);
};
