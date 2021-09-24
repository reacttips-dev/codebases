'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import ProvideReferenceResolvers from 'reference-resolvers/ProvideReferenceResolvers';
import ConnectedAPIDropdown from 'customer-data-reference-ui-components/connector/ConnectedAPIDropdown';
export default (function (_ref) {
  var referenceObjectType = _ref.referenceObjectType,
      referenceResolver = _ref.referenceResolver;

  var ConnectedAPIDropdownProvider = /*#__PURE__*/function (_PureComponent) {
    _inherits(ConnectedAPIDropdownProvider, _PureComponent);

    function ConnectedAPIDropdownProvider() {
      _classCallCheck(this, ConnectedAPIDropdownProvider);

      return _possibleConstructorReturn(this, _getPrototypeOf(ConnectedAPIDropdownProvider).apply(this, arguments));
    }

    _createClass(ConnectedAPIDropdownProvider, [{
      key: "render",
      value: function render() {
        return /*#__PURE__*/_jsx(ConnectedAPIDropdown, Object.assign({}, this.props, {
          referenceObjectType: referenceObjectType
        }));
      }
    }]);

    return ConnectedAPIDropdownProvider;
  }(PureComponent);

  var provideResolvers = ProvideReferenceResolvers(_defineProperty({}, referenceObjectType, referenceResolver));
  return provideResolvers(ConnectedAPIDropdownProvider);
});