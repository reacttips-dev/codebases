'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import * as React from 'react';
import PropTypes from 'prop-types';
import makeDecoratorDisplayName from 'reference-resolvers/lib/makeDecoratorDisplayName';
import { makeAtom } from 'atom';
import { Map as ImmutableMap } from 'immutable';
import map from 'transmute/map';
import curry from 'transmute/curry';
import identity from 'transmute/identity';
import memoizeOne from 'react-utils/memoizeOne';
import ReferenceResolversContext from './ReferenceResolversContext';
import withReferenceResolverContext from './withReferenceResolverContext';
import { referenceResolverContextPropTypes } from './ReferenceResolversContext'; // Adapted from https://ramdajs.com/docs/#binary
// Wraps a function of any arity (including nullary) in a function that accepts exactly 2 parameters. Any extraneous parameters will not be passed to the supplied function.

function binary(fn) {
  return function (a0, a1) {
    return fn.call(this, a0, a1);
  };
} // The default merge will favor the higher level cached resolvers.


var defaultMergeResolvers = function defaultMergeResolvers(providedResolvers, connectedResolvers) {
  return Object.assign({}, providedResolvers, {}, connectedResolvers);
}; // Note: `this.mergeResolvers()` is called with three args but we only want the first two to
// factor into memoization so we force the function to be binary


var getMergeResolversFn = function getMergeResolversFn(mergeResolvers) {
  return mergeResolvers instanceof Function ? mergeResolvers : mergeResolvers === true ? binary(memoizeOne(defaultMergeResolvers)) : identity;
};

var ProvideReferenceResolvers = function ProvideReferenceResolvers(resolvers, Component) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var mergeResolvers = opts.mergeResolvers;

  var ReferenceResolversProvider = /*#__PURE__*/function (_React$Component) {
    _inherits(ReferenceResolversProvider, _React$Component);

    function ReferenceResolversProvider() {
      var _this;

      _classCallCheck(this, ReferenceResolversProvider);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ReferenceResolversProvider).call(this));
      _this.getCacheAtom = _this.getCacheAtom.bind(_assertThisInitialized(_this));
      _this._cacheAtoms = ImmutableMap();
      _this.providedResolvers = map(function (resolver) {
        if (resolver instanceof Function) {
          return resolver(_this.getCacheAtom);
        }

        return resolver;
      }, resolvers);
      _this.mergeResolvers = getMergeResolversFn(mergeResolvers);
      return _this;
    }

    _createClass(ReferenceResolversProvider, [{
      key: "getCacheAtom",
      value: function getCacheAtom(id) {
        if (!this._cacheAtoms.has(id)) {
          this._cacheAtoms = this._cacheAtoms.set(id, makeAtom());
        }

        return this._cacheAtoms.get(id);
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            forwardedRef = _this$props.forwardedRef,
            connectedResolvers = _this$props.referenceResolverContext,
            rest = _objectWithoutProperties(_this$props, ["forwardedRef", "referenceResolverContext"]);

        var mergedResolvers = this.mergeResolvers(this.providedResolvers, connectedResolvers, // Note: If we can get rid of the `mergeResolvers` as function option we can drop this third `rest` param
        // and simplify the memozation code above.
        rest);
        return /*#__PURE__*/_jsx(ReferenceResolversContext.Provider, {
          value: mergedResolvers,
          children: /*#__PURE__*/_jsx(Component, Object.assign({
            ref: forwardedRef
          }, rest))
        });
      }
    }]);

    return ReferenceResolversProvider;
  }(React.Component);

  ReferenceResolversProvider.propTypes = Object.assign({}, referenceResolverContextPropTypes, {
    forwardedRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
      current: PropTypes.object
    })])
  });
  var ContextConnector = withReferenceResolverContext(ReferenceResolversProvider);
  ContextConnector.displayName = makeDecoratorDisplayName('ProvideReferenceResolvers', Component);
  ContextConnector.WrappedComponent = Component;

  if (opts.forwardRef) {
    var ForwardedRef = /*#__PURE__*/forwardRef(function (props, ref) {
      return /*#__PURE__*/_jsx(ContextConnector, Object.assign({}, props, {
        forwardedRef: ref
      }));
    });
    ForwardedRef.WrappedComponent = ContextConnector.WrappedComponent;
    return ForwardedRef;
  }

  return ContextConnector;
};

export default curry(ProvideReferenceResolvers);