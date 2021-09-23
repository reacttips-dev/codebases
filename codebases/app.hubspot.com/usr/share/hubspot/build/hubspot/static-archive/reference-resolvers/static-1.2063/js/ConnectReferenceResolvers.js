'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import * as React from 'react';
import makeDecoratorDisplayName from 'reference-resolvers/lib/makeDecoratorDisplayName';
import curry from 'transmute/curry';
import { referenceResolverContextPropTypes } from './ReferenceResolversContext';
import withReferenceResolverContext from './withReferenceResolverContext';

var ConnectReferenceResolvers = function ConnectReferenceResolvers(mapResolversToProps, Component) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var ConnectResolvers = /*#__PURE__*/function (_React$Component) {
    _inherits(ConnectResolvers, _React$Component);

    function ConnectResolvers() {
      _classCallCheck(this, ConnectResolvers);

      return _possibleConstructorReturn(this, _getPrototypeOf(ConnectResolvers).apply(this, arguments));
    }

    _createClass(ConnectResolvers, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            resolvers = _this$props.referenceResolverContext,
            forwardedRef = _this$props.forwardedRef,
            rest = _objectWithoutProperties(_this$props, ["referenceResolverContext", "forwardedRef"]);

        return /*#__PURE__*/_jsx(Component, Object.assign({
          ref: forwardedRef
        }, rest, {}, mapResolversToProps(resolvers, rest)));
      }
    }]);

    return ConnectResolvers;
  }(React.Component);

  ConnectResolvers.propTypes = Object.assign({}, referenceResolverContextPropTypes, {
    forwardedRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
      current: PropTypes.object
    })])
  });
  var ContextConnector = withReferenceResolverContext(ConnectResolvers);
  ContextConnector.displayName = makeDecoratorDisplayName('ConnectReferenceResolvers', Component);
  ContextConnector.WrappedComponent = Component;

  if (options.forwardRef) {
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

export default curry(ConnectReferenceResolvers);