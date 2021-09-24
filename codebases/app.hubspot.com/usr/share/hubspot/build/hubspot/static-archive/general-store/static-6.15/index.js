'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var hoistStatics = _interopDefault(require('hoist-non-react-statics'));

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var browser = invariant;

function isDispatcher(dispatcher) {
    return (!!dispatcher &&
        typeof dispatcher === 'object' &&
        typeof dispatcher.register === 'function' &&
        typeof dispatcher.unregister === 'function');
}
function enforceDispatcher(dispatcher) {
    browser(isDispatcher(dispatcher), 'expected `dispatcher` to be a `Flux.Dispatcher` or compatible object but' +
        'got `%s` Learn more about the dispatcher interface:' +
        ' https://github.com/HubSpot/general-store#dispatcher-interface', dispatcher);
}
function isPayload(payload) {
    return (payload !== null &&
        typeof payload === 'object' &&
        (typeof payload.actionType === 'string' || typeof payload.type === 'string'));
}

var instance = null;
function get() {
    return instance;
}
function set(dispatcher) {
    browser(isDispatcher(dispatcher), 'DispatcherInstance.set: Expected dispatcher to be an object' +
        ' with a register method, and an unregister method but got "%s".' +
        ' Learn more about the dispatcher interface:' +
        ' https://github.com/HubSpot/general-store#dispatcher-interface', dispatcher);
    instance = dispatcher;
}
function clear() {
    var oldInstance = instance;
    instance = null;
    return oldInstance;
}

var DispatcherInstance = /*#__PURE__*/Object.freeze({
  __proto__: null,
  get: get,
  set: set,
  clear: clear
});

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var EventHandler = /** @class */ (function () {
    function EventHandler(instance, key) {
        this._key = key;
        this._instance = instance;
    }
    EventHandler.prototype.getKey = function () {
        return this._key;
    };
    EventHandler.prototype.remove = function () {
        if (this._instance === null || this._instance === undefined) {
            return;
        }
        this._instance.removeHandler(this._key);
        this._instance = null;
    };
    return EventHandler;
}());

var PREFIX = 'uid_';
var nextUid = 0;
function uid() {
    return PREFIX + nextUid++;
}

var Event = /** @class */ (function () {
    function Event() {
        this._handlers = {};
    }
    /**
     * Add a subscription to this event
     *
     * @param  callback  run when the event is triggered.
     * @return this
     */
    Event.prototype.addHandler = function (callback) {
        var key = uid();
        this._handlers[key] = callback;
        return new EventHandler(this, key);
    };
    /**
     * Destroys this event. Removes all handlers.
     *
     * @return this
     */
    Event.prototype.remove = function () {
        this._handlers = {};
        return this;
    };
    /**
     * Removes a subscription by key.
     *
     * @param  key   id of the subscription to remove
     * @return this
     */
    Event.prototype.removeHandler = function (key) {
        delete this._handlers[key];
        return this;
    };
    /**
     * @protected
     * Run a handler by key if it exists
     *
     * @param  key  id of the handler to run
     */
    Event.prototype._runHandler = function (key) {
        if (this._handlers.hasOwnProperty(key)) {
            this._handlers[key].call(null);
        }
    };
    /**
     * Run all subscribed handlers.
     *
     * @return this
     */
    Event.prototype.runHandlers = function () {
        Object.keys(this._handlers).forEach(this._runHandler.bind(this));
        return this;
    };
    /**
     * Convenience method for running multiple events.
     *
     * @param  events  a list of events to run.
     */
    Event.runMultiple = function (events) {
        events.forEach(function (evt) { return evt.runHandlers(); });
    };
    return Event;
}());

var HINT_LINK = 'Learn more about using the Store API:' +
    ' https://github.com/HubSpot/general-store#using-the-store-api';
var hasReduxDevTools = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__;
function getNull() {
    return null;
}
var Store = /** @class */ (function () {
    function Store(_a) {
        var _this = this;
        var dispatcher = _a.dispatcher, factory = _a.factory, getter = _a.getter, initialState = _a.initialState, name = _a.name, responses = _a.responses;
        this._dispatcher = dispatcher;
        this._factory = factory;
        this._getter = getter;
        this._name = name || 'Store';
        this._state = initialState;
        this._responses = responses;
        this._event = new Event();
        this._uid = uid();
        this._dispatchToken = this._dispatcher.register(this._handleDispatch.bind(this));
        if (hasReduxDevTools) {
            this._devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
                name: name || "Store_" + this._uid,
                instanceId: this._uid,
            });
            this._unsubscribeDevTools = this._devToolsExtension.subscribe(function (message) {
                if (message.type === 'DISPATCH' &&
                    message.payload.type === 'JUMP_TO_ACTION') {
                    _this._state = JSON.parse(message.state);
                    _this.triggerChange();
                }
            });
        }
    }
    /**
     * Subscribe to changes on this store.
     *
     * @param  callback  will run every time the store responds to a dispatcher
     * @return this
     */
    Store.prototype.addOnChange = function (callback) {
        browser(typeof callback === 'function', 'Store.addOnChange: expected callback to be a function' +
            ' but got "%s" instead. %s', callback, HINT_LINK);
        return this._event.addHandler(callback);
    };
    /**
     * Returns the store's referenced value
     *
     * @param  ...  accepts any number of params
     * @return any
     */
    Store.prototype.get = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this._getter.apply(this, __spreadArrays([this._state], args));
    };
    /**
     * @protected
     * Responds to incoming messages from the Dispatcher
     */
    Store.prototype._handleDispatch = function (payload) {
        if (process.env.NODE_ENV !== 'production') {
            browser(isPayload(payload), 'Store: expected dispatched payload to be an object with a' +
                ' property "actionType" containing a string and an optional property' +
                ' "data" containing any value but got "%s" instead. Learn more about' +
                ' the dispatcher interface:' +
                ' https://github.com/HubSpot/general-store#dispatcher-interface');
        }
        var actionType = payload.actionType || payload.type;
        var data = payload.hasOwnProperty('data')
            ? payload.data
            : payload.payload;
        if (!actionType || !this._responses.hasOwnProperty(actionType)) {
            return;
        }
        this._state = this._responses[actionType](this._state, data, actionType, payload);
        this.triggerChange();
        if (this._devToolsExtension) {
            this._devToolsExtension.send(actionType, this._state);
        }
    };
    /**
     * Destroys this instance of the store.
     * Dispatch callback is unregistered. Subscriptions are removed.
     */
    Store.prototype.remove = function () {
        this._dispatcher.unregister(this._dispatchToken);
        this._event.remove();
        this._getter = getNull;
        this._responses = {};
        typeof this._unsubscribeDevTools === 'function' &&
            this._unsubscribeDevTools();
        typeof this._devToolsExtension !== 'undefined' &&
            this._devToolsExtension.unsubscribe();
    };
    Store.prototype.toString = function () {
        return this._name + "<" + this._state + ">";
    };
    /**
     * Runs all of the store's subscription callbacks
     *
     * @return this
     */
    Store.prototype.triggerChange = function () {
        if (process.env.NODE_ENV !== 'production') {
            if (!this._dispatcher.isDispatching()) {
                console.warn('Store: you called store.triggerChange() outside of a' +
                    ' dispatch loop. Send an action trough the dispatcher to' +
                    ' avoid potentailly confusing behavior.');
            }
        }
        this._event.runHandlers();
        return this;
    };
    return Store;
}());

function getActionTypes(store) {
    return Object.keys(store._responses) || [];
}
function getDispatcher(store) {
    return store._dispatcher;
}
function getDispatchToken(store) {
    return store._dispatchToken;
}
function getGetter(store) {
    return store._getter;
}
function getId(store) {
    return store._uid;
}
function getFactory(store) {
    return store._factory;
}
function getName(store) {
    return store._name;
}
function getResponses(store) {
    return store._responses;
}
function getState(store) {
    return store._state;
}
function isStore(store) {
    return store instanceof Store;
}

var InspectStore = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getActionTypes: getActionTypes,
  getDispatcher: getDispatcher,
  getDispatchToken: getDispatchToken,
  getGetter: getGetter,
  getId: getId,
  getFactory: getFactory,
  getName: getName,
  getResponses: getResponses,
  getState: getState,
  isStore: isStore
});

var HINT_LINK$1 = 'Learn more about defining stores:' +
    ' https://github.com/HubSpot/general-store#create-a-store';
function enforceResponse(existingResponses, actionType, response) {
    browser(typeof actionType === 'string', 'StoreFactory.defineResponses: expected actionType to be a string' +
        ' but got "%s" instead. %s', actionType, HINT_LINK$1);
    browser(!existingResponses.hasOwnProperty(actionType), 'StoreFactory.defineResponses: conflicting resposes for actionType' +
        ' "%s". Only one response can be defined per actionType per Store. %s', actionType, HINT_LINK$1);
    browser(typeof response === 'function', 'StoreFactory.defineResponses: expected response to be a function' +
        ' but got "%s" instead. %s', response);
}
function defaultGetInitialState() {
    return undefined;
}
function defaultGetter(state) {
    return state;
}
var StoreFactory = /** @class */ (function () {
    function StoreFactory(_a) {
        var _b = _a === void 0 ? {} : _a, getter = _b.getter, getInitialState = _b.getInitialState, name = _b.name, responses = _b.responses;
        this._definition = {
            getter: getter || defaultGetter,
            getInitialState: getInitialState || defaultGetInitialState,
            name: name,
            responses: responses || {},
        };
    }
    StoreFactory.prototype.defineGet = function (getter) {
        browser(this._definition.getter === defaultGetter, 'StoreFactory.defineGet: a getter is already defined.');
        return new StoreFactory(__assign(__assign({}, this._definition), { getter: getter }));
    };
    StoreFactory.prototype.defineGetInitialState = function (getInitialState) {
        browser(typeof getInitialState === 'function', 'StoreFactory.defineGetInitialState: getInitialState must be a function.');
        return new StoreFactory(__assign(__assign({}, this._definition), { getInitialState: getInitialState }));
    };
    StoreFactory.prototype.defineName = function (name) {
        var currentName = this._definition.name;
        return new StoreFactory(__assign(__assign({}, this._definition), { name: currentName ? name + "(" + currentName + ")" : name }));
    };
    StoreFactory.prototype.defineResponses = function (newResponses) {
        var responses = this._definition.responses;
        browser(newResponses && typeof newResponses === 'object', 'StoreFactory.defineResponses: newResponses must be an object');
        Object.keys(newResponses).forEach(function (actionType) {
            return enforceResponse(responses, actionType, newResponses[actionType]);
        });
        return new StoreFactory(__assign(__assign({}, this._definition), { responses: __assign(__assign({}, responses), newResponses) }));
    };
    StoreFactory.prototype.defineResponseTo = function (actionTypes, response) {
        return this.defineResponses([].concat(actionTypes).reduce(function (responses, actionType) {
            responses[actionType] = response;
            return responses;
        }, {}));
    };
    StoreFactory.prototype.getDefinition = function () {
        return this._definition;
    };
    StoreFactory.prototype.register = function (dispatcher) {
        dispatcher = dispatcher || get();
        browser(dispatcher !== null && typeof dispatcher === 'object', "StoreFactory.register: you haven't provided a dispatcher instance." +
            ' You can pass an instance to' +
            ' GeneralStore.define().register(dispatcher) or use' +
            ' GeneralStore.DispatcherInstance.set(dispatcher) to set a global' +
            ' instance.' +
            ' https://github.com/HubSpot/general-store#default-dispatcher-instance');
        enforceDispatcher(dispatcher);
        var _a = this._definition, getter = _a.getter, getInitialState = _a.getInitialState, name = _a.name, responses = _a.responses;
        return new Store({
            dispatcher: dispatcher,
            factory: this,
            getter: getter,
            initialState: getInitialState(),
            name: name,
            responses: responses,
        });
    };
    return StoreFactory;
}());

var HINT_LINK$2 = 'Learn more about defining stores:' +
    ' https://github.com/HubSpot/general-store#create-a-store';
function dropFirstArg(func) {
    return function (head) {
        var tail = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            tail[_i - 1] = arguments[_i];
        }
        return func.apply(void 0, tail);
    };
}
var StoreSingleton = /** @class */ (function () {
    function StoreSingleton() {
        var _this = this;
        this._facade = null;
        this._factory = new StoreFactory({
            getter: function (state) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (typeof _this._getter !== 'function') {
                    return undefined;
                }
                return _this._getter.apply(_this, args);
            },
        });
        this._getter = null;
    }
    StoreSingleton.prototype.defineGet = function (getter) {
        browser(!this.isRegistered(), 'StoreSingleton.defineGet: this store definition cannot be modified' +
            ' because it has already been registered with a dispatcher. %s', HINT_LINK$2);
        browser(typeof getter === 'function', 'StoreSingleton.defineGet: expected getter to be a function but got' +
            ' "%s" instead. %s', getter, HINT_LINK$2);
        this._getter = getter;
        return this;
    };
    StoreSingleton.prototype.defineName = function (name) {
        this._factory.defineName(name);
        return this;
    };
    StoreSingleton.prototype.defineResponseTo = function (actionTypes, response) {
        browser(!this.isRegistered(), 'StoreSingleton.defineResponseTo: this store definition cannot be' +
            ' modified because is has already been registered with a dispatcher. %s', HINT_LINK$2);
        this._factory = this._factory.defineResponseTo(actionTypes, dropFirstArg(response));
        return this;
    };
    StoreSingleton.prototype.isRegistered = function () {
        return this._facade instanceof Store;
    };
    StoreSingleton.prototype.register = function (dispatcher) {
        browser(typeof this._getter === 'function', 'StoreSingleton.register: a store cannot be registered without a' +
            ' getter. Use GeneralStore.define().defineGet(getter) to define a' +
            ' getter. %s', HINT_LINK$2);
        if (!this._facade) {
            this._facade = this._factory.register(dispatcher);
        }
        return this._facade;
    };
    return StoreSingleton;
}());

function oForEach(subject, operation) {
    for (var key in subject) {
        if (subject.hasOwnProperty(key)) {
            operation(subject[key], key);
        }
    }
}
function oMap(subject, mapper) {
    var result = {};
    oForEach(subject, function (value, key) {
        result[key] = mapper(value, key);
    });
    return result;
}
function oMerge(subject, updates) {
    oForEach(updates, function (value, key) {
        subject[key] = value;
    });
    return subject;
}
function oReduce(subject, reducer, initialAcc) {
    var result = initialAcc;
    oForEach(subject, function (value, key) {
        result = reducer(result, value, key);
    });
    return result;
}
function isImmutable(obj) {
    return (obj &&
        typeof obj.hashCode === 'function' &&
        typeof obj.equals === 'function');
}
function _compareArrays(arr1, arr2) {
    if (!arr1 || !arr2)
        return false;
    if (arr1.length !== arr2.length) {
        return false;
    }
    if (!arr1.length) {
        return true;
    }
    for (var idx in arr1) {
        // this makes it _technically_ not a shallow equal for array values,
        // but for stores that return arrays of objects, the object identities
        // will likely not be equal so we should actually inspect the objects
        // to see if they're equal
        if (!shallowEqual(arr1[idx], arr2[idx])) {
            return false;
        }
    }
    return true;
}
// polyfill for Object.is
function objectIs(x, y) {
    return ((x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
    );
}
function shallowEqual(obj1, obj2) {
    if (objectIs(obj1, obj2)) {
        return true;
    }
    // Special handling for FB Immutables, as they must be handled specially.
    // While this technically means this is deep equality for Immutables,
    // it's better to have a more specific check than an entirely incorrect one.
    if (isImmutable(obj1) && isImmutable(obj2)) {
        return obj1.equals(obj2);
    }
    if (typeof obj1 !== typeof obj2) {
        return false;
    }
    // would have passed === check if both were same falsy value
    if (!obj1 || !obj2) {
        return false;
    }
    if (typeof obj1 !== 'object') {
        return false;
    }
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false;
    }
    for (var property in obj1) {
        if (obj1.hasOwnProperty(property) && !obj2.hasOwnProperty(property)) {
            return false;
        }
        if (!obj1.hasOwnProperty(property) && obj2.hasOwnProperty(property)) {
            return false;
        }
        if (obj1.hasOwnProperty(property) && obj2.hasOwnProperty(property)) {
            if (isImmutable(obj1[property]) && isImmutable(obj2[property])) {
                if (!obj1[property].equals(obj2[property])) {
                    return false;
                }
            }
            else if (Array.isArray(obj1[property]) ||
                Array.isArray(obj2[property])) {
                return _compareArrays(obj1[property], obj2[property]);
            }
            else if (!objectIs(obj1[property], obj2[property])) {
                return false;
            }
        }
    }
    return true;
}

function enforceValidDependencies(dependencies) {
    browser(dependencies && typeof dependencies === 'object', 'expected `dependencies` to be an `object` but got `%s`', dependencies);
    oForEach(dependencies, function (dependency, field) {
        if (dependency instanceof Store) {
            return;
        }
        browser(dependency && typeof dependency === 'object', 'expected `%s` to be an `object` but got `%s`', field, dependency);
        var deref = dependency.deref, stores = dependency.stores;
        browser(typeof deref === 'function', 'expected `%s.deref` to be a function but got `%s`', field, deref);
        browser(Array.isArray(stores), 'expected `%s.stores` to be an Array but got `%s`', field, dependency.stores);
        stores.forEach(function (store, index) {
            browser(store instanceof Store, 'expected `%s.stores.%s` to be a `Store` but got `%s`', field, index, store);
        });
    });
    return dependencies;
}
function dependencyPropTypes(dependencies, existingPropTypes) {
    if (existingPropTypes === void 0) { existingPropTypes = {}; }
    var unrelatedPropTypes = oReduce(existingPropTypes, function (keep, type, name) {
        if (!dependencies.hasOwnProperty(name)) {
            keep[name] = type;
        }
        return keep;
    }, {});
    return oReduce(dependencies, function (types, dependency) {
        if (dependency instanceof Store) {
            return types;
        }
        // eslint-disable-next-line react-app/react/forbid-foreign-prop-types
        var propTypes = dependency.propTypes;
        if (!propTypes || typeof propTypes !== 'object') {
            return types;
        }
        return oMerge(types, propTypes);
    }, unrelatedPropTypes);
}
function calculate(dependency, props, state) {
    if (dependency instanceof Store) {
        return dependency.get();
    }
    var deref = dependency.deref, stores = dependency.stores;
    return deref(props, state, stores);
}
function calculateInitial(dependencies, props, state) {
    return oMap(dependencies, function (dependency) {
        return calculate(dependency, props, state);
    });
}
function calculateForDispatch(dependencies, dependencyIndexEntry, props, state) {
    return oMap(dependencyIndexEntry.fields, function (_, field) {
        return calculate(dependencies[field], props, state);
    });
}
function makeIndexEntry() {
    return {
        fields: {},
        dispatchTokens: {},
    };
}
function makeDependencyIndex(dependencies) {
    enforceValidDependencies(dependencies);
    return oReduce(dependencies, function (index, dep, field) {
        var stores = dep instanceof Store ? [dep] : dep.stores;
        stores.forEach(function (store) {
            getActionTypes(store).forEach(function (actionType) {
                var entry = index[actionType];
                if (!entry) {
                    entry = index[actionType] = makeIndexEntry();
                }
                var token = getDispatchToken(store);
                entry.dispatchTokens[token] = true;
                entry.fields[field] = true;
            });
        });
        return index;
    }, {});
}

function makeDisplayName(prefix, BaseComponent) {
    var baseComponentName = BaseComponent.displayName || BaseComponent.name || 'Component';
    return prefix + "(" + baseComponentName + ")";
}
function focuser(instance) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (!instance.wrappedInstance ||
        typeof instance.wrappedInstance.focus !== 'function') {
        return undefined;
    }
    return (_a = instance.wrappedInstance).focus.apply(_a, args);
}

function waitForStores(dispatcher, tokens) {
    dispatcher.waitFor(tokens);
}
function handleDispatch(dispatcher, dependencyIndex, then, payload) {
    var actionType = payload.actionType || payload.type;
    if (!dependencyIndex[actionType]) {
        return;
    }
    var entry = dependencyIndex[actionType];
    waitForStores(dispatcher, Object.keys(entry.dispatchTokens));
    then(entry);
}

function connect(dependencies, dispatcher) {
    if (dispatcher === void 0) { dispatcher = get(); }
    enforceDispatcher(dispatcher);
    var dependencyIndex = makeDependencyIndex(dependencies);
    return function connector(BaseComponent) {
        var ConnectedComponent = /** @class */ (function (_super) {
            __extends(ConnectedComponent, _super);
            function ConnectedComponent(props) {
                var _this = _super.call(this, props) || this;
                _this.state = {};
                _this.wrappedInstance = null;
                _this.focus = typeof BaseComponent.prototype.focus === 'function'
                    ? function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        return focuser.apply(void 0, __spreadArrays([_this], args));
                    }
                    : undefined;
                _this.setWrappedInstance = function (ref) {
                    _this.wrappedInstance = ref;
                };
                if (dispatcher) {
                    _this.dispatchToken = dispatcher.register(handleDispatch.bind(null, dispatcher, dependencyIndex, _this.handleDispatch.bind(_this)));
                }
                _this.state = calculateInitial(dependencies, _this.props, {});
                return _this;
            }
            ConnectedComponent.getDerivedStateFromProps = function (props, state) {
                return calculateInitial(dependencies, props, state);
            };
            ConnectedComponent.prototype.componentWillUnmount = function () {
                var dispatchToken = this.dispatchToken;
                if (dispatcher && dispatchToken) {
                    this.dispatchToken = null;
                    dispatcher.unregister(dispatchToken);
                }
            };
            ConnectedComponent.prototype.handleDispatch = function (entry) {
                this.setState(calculateForDispatch(dependencies, entry, this.props, this.state));
            };
            ConnectedComponent.prototype.render = function () {
                var refProps = typeof BaseComponent === 'function'
                    ? {}
                    : { ref: this.setWrappedInstance };
                return React.createElement(BaseComponent, __assign({}, this.props, this.state, refProps));
            };
            ConnectedComponent.defaultProps = BaseComponent.defaultProps;
            ConnectedComponent.dependencies = dependencies;
            ConnectedComponent.displayName = makeDisplayName('Connected', BaseComponent);
            ConnectedComponent.propTypes = dependencyPropTypes(dependencies, 
            // eslint-disable-next-line react-app/react/forbid-foreign-prop-types
            BaseComponent.propTypes);
            ConnectedComponent.WrappedComponent = BaseComponent;
            return ConnectedComponent;
        }(React.Component));
        return hoistStatics(ConnectedComponent, BaseComponent);
    };
}

function subscribe(dependencies, dependencyIndex, dispatcher, callback, props, state) {
    if (props === void 0) { props = {}; }
    if (state === void 0) { state = null; }
    var dispatchToken;
    var storeState = {};
    function remove() {
        if (dispatchToken) {
            dispatcher.unregister(dispatchToken);
            dispatchToken = null;
        }
    }
    function handleUpdate(entry) {
        var prevStoreState = storeState;
        try {
            storeState = __assign(__assign({}, prevStoreState), calculateForDispatch(dependencies, entry, props, state));
            callback(null, storeState, prevStoreState, remove);
        }
        catch (error) {
            remove();
            callback(error, storeState, prevStoreState, remove);
        }
    }
    dispatchToken = dispatcher.register(handleDispatch.bind(null, dispatcher, dependencyIndex, handleUpdate));
    try {
        storeState = calculateInitial(dependencies, props, state);
        callback(null, storeState, {}, remove);
    }
    catch (error) {
        remove();
        callback(error, storeState, {}, remove);
    }
    return { remove: remove };
}
function connectCallback(dependencies, dispatcher) {
    if (dispatcher === void 0) { dispatcher = get(); }
    enforceDispatcher(dispatcher);
    if (!dispatcher) {
        return null;
    }
    return subscribe.bind(null, dependencies, makeDependencyIndex(dependencies), dispatcher);
}

function useCurrent(value) {
    var ref = React.useRef(value);
    ref.current = value;
    return ref;
}
function _useDispatchSubscription(dependencyMap, currentProps, dispatcher, dependencyValue, setDependencyValue) {
    React.useEffect(function () {
        var dependencyIndex = makeDependencyIndex(dependencyMap);
        var dispatchToken = dispatcher.register(handleDispatch.bind(null, dispatcher, dependencyIndex, function (entry) {
            var newValue = calculateForDispatch(dependencyMap, entry, currentProps.current, dependencyValue);
            if (Object.keys(newValue)
                .map(function (k) { return shallowEqual(newValue[k], dependencyValue[k]); })
                .some(function (el) { return !el; })) {
                setDependencyValue(newValue);
            }
        }));
        return function () {
            dispatcher.unregister(dispatchToken);
        };
    }, [
        currentProps,
        dependencyMap,
        dependencyValue,
        dispatcher,
        setDependencyValue,
    ]);
}
function useStoreDependency(dependency, props, dispatcher) {
    if (dispatcher === void 0) { dispatcher = get(); }
    enforceDispatcher(dispatcher);
    var newValue = { dependency: calculate(dependency, props) };
    var _a = React.useState(newValue), dependencyValue = _a[0], setDependencyValue = _a[1];
    var currProps = useCurrent(props);
    var dependencyMap = React.useMemo(function () { return ({ dependency: dependency }); }, [dependency]);
    _useDispatchSubscription(dependencyMap, currProps, dispatcher, dependencyValue, setDependencyValue);
    if (!shallowEqual(newValue.dependency, dependencyValue.dependency)) {
        setDependencyValue(newValue);
        return newValue.dependency;
    }
    return dependencyValue.dependency;
}

function define() {
    return new StoreSingleton();
}
function defineFactory() {
    return new StoreFactory({});
}

exports.DispatcherInstance = DispatcherInstance;
exports.InspectStore = InspectStore;
exports.StoreFactory = StoreFactory;
exports.connect = connect;
exports.connectCallback = connectCallback;
exports.define = define;
exports.defineFactory = defineFactory;
exports.useStoreDependency = useStoreDependency;
