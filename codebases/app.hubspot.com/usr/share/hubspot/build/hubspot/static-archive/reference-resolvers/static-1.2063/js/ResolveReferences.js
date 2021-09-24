'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import makeDecoratorDisplayName from 'reference-resolvers/lib/makeDecoratorDisplayName';
import { enforceFunction, enforceReactComponent } from 'reference-resolvers/lib/enforce';
import invariant from 'react-utils/invariant';
import curry from 'transmute/curry';
import map from 'transmute/map';
import forEach from 'transmute/forEach';
import bind from 'transmute/bind';
import isFunction from 'transmute/isFunction';
import { isAtom, watch, unwatch, deref } from 'atom';
import SymbolObjectsSet from 'reference-resolvers/lib/SymbolObjectSet';
import { isResolved } from 'reference-resolvers/utils';
import { referenceResolverContextPropTypes } from './ReferenceResolversContext';
import withReferenceResolverContext from './withReferenceResolverContext';
var unresolvedSymbol = Symbol('unresolved');

var mapAtoms = function mapAtoms(fn, structure) {
  if (isAtom(structure) || structure === unresolvedSymbol) {
    return fn(structure);
  } else if (isFunction(structure)) {
    return structure;
  } else {
    return map(function (child) {
      return mapAtoms(fn, child);
    }, structure);
  }
};

var forEachAtom = function forEachAtom(fn, structure) {
  if (structure === unresolvedSymbol) {
    return;
  }

  if (isAtom(structure)) {
    fn(structure);
  } else if (!isFunction(structure)) {
    forEach(function (child) {
      return forEachAtom(fn, child);
    }, structure);
  }
};

var isSimpleObject = function isSimpleObject(object) {
  if (object == null) {
    return false;
  }

  var proto = Object.getPrototypeOf(object);
  return proto === Object.prototype;
};
/**
 * Accepts a reference object type (checkout reference-resolvers/constants/ReferenceObjectType)
 * and a function to map the resolver to the components props.
 *
 * @param {String} referenceObjectType
 * @param {Function} mapResolverToAtoms
 * @param {React.Component | Function} Component
 * @return {React.Component} The decorated component
 */


var ResolveReferences = function ResolveReferences(mapResolversToAtoms, Component) {
  enforceFunction('mapResolverToAtoms', mapResolversToAtoms);
  enforceReactComponent('Component', Component);

  var getAtomStructure = function getAtomStructure(resolvers, props) {
    var result = mapResolversToAtoms(resolvers, props, unresolvedSymbol);
    invariant(isSimpleObject(result), 'expected `mapResolverToAtoms` to return a simple object, but got `%s`', result);
    return result;
  };

  var WithReferences = /*#__PURE__*/function (_React$Component) {
    _inherits(WithReferences, _React$Component);

    function WithReferences() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WithReferences);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WithReferences)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this.watchAtom = bind(_this.watchAtom, _assertThisInitialized(_this));
      _this.unwatchAtom = bind(_this.unwatchAtom, _assertThisInitialized(_this));
      _this.handleReferenceUpdate = bind(_this.handleReferenceUpdate, _assertThisInitialized(_this));
      return _this;
    }

    _createClass(WithReferences, [{
      key: "UNSAFE_componentWillMount",
      value: function UNSAFE_componentWillMount() {
        var resolvers = this.props.referenceResolverContext || {};
        this._atomStructure = getAtomStructure(resolvers, this.props);
        this._lastAtoms = new SymbolObjectsSet();
        this._currentAtoms = new SymbolObjectsSet();
        forEachAtom(this.watchAtom, this._atomStructure);
        this.handleReferenceUpdate();
      }
    }, {
      key: "UNSAFE_componentWillReceiveProps",
      value: function UNSAFE_componentWillReceiveProps(nextProps) {
        var resolvers = this.props.referenceResolverContext || {};
        this._atomStructure = getAtomStructure(resolvers, nextProps);
        this.updateAtoms(this._atomStructure);
        this.handleReferenceUpdate();
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this._currentAtoms.forEach(this.unwatchAtom);
      }
    }, {
      key: "updateAtoms",
      value: function updateAtoms(atoms) {
        this._lastAtoms = this._currentAtoms;
        this._currentAtoms = new SymbolObjectsSet();
        forEachAtom(this.watchAtom, atoms);

        this._lastAtoms.forEach(this.unwatchAtom);

        this._lastAtoms = null;
      }
    }, {
      key: "watchAtom",
      value: function watchAtom(atom) {
        if (atom === unresolvedSymbol) {
          return;
        }

        if (this._lastAtoms.has(atom)) {
          this._lastAtoms.remove(atom);
        } else {
          watch(atom, this.handleReferenceUpdate);
        }

        this._currentAtoms.add(atom);
      }
    }, {
      key: "unwatchAtom",
      value: function unwatchAtom(atom) {
        unwatch(atom, this.handleReferenceUpdate);
      }
    }, {
      key: "handleReferenceUpdate",
      value: function handleReferenceUpdate() {
        var unresolved = [];

        var derefGetUnresolved = function derefGetUnresolved(atom) {
          if (atom === unresolvedSymbol) {
            return unresolved;
          }

          var value = deref(atom);

          if (!isResolved(value)) {
            unresolved.push(value);
          }

          return value;
        };

        this.setState({
          resolved: mapAtoms(derefGetUnresolved, this._atomStructure)
        });
      }
    }, {
      key: "render",
      value: function render() {
        var resolved = this.state.resolved;

        var _this$props = this.props,
            __resolvers = _this$props.referenceResolverContext,
            rest = _objectWithoutProperties(_this$props, ["referenceResolverContext"]);

        return /*#__PURE__*/_jsx(Component, Object.assign({}, rest, {}, resolved));
      }
    }]);

    return WithReferences;
  }(React.Component);

  WithReferences.propTypes = Object.assign({}, referenceResolverContextPropTypes);
  var ContextConnector = withReferenceResolverContext(WithReferences);
  ContextConnector.displayName = makeDecoratorDisplayName("ResolveReferences", Component);
  ContextConnector.WrappedComponent = Component;
  return ContextConnector;
};

export default curry(ResolveReferences);