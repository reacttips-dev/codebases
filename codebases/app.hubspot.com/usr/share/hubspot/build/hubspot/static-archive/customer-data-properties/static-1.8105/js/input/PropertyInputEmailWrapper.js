'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import emptyFunction from 'react-utils/emptyFunction';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import PropertyInputEmail from 'customer-data-properties/input/PropertyInputEmail';
var propTypes = {
  autoFocus: PropTypes.bool,
  onInvalidProperty: PropTypes.func.isRequired,
  propertyIndex: PropTypes.number,
  showError: PropTypes.bool,
  value: PropTypes.string,
  subject: PropTypes.instanceOf(ContactRecord),
  subjectId: PropTypes.string,
  resolver: ReferenceResolverType,
  className: PropTypes.string,
  size: PropTypes.object,
  suppressAlerts: PropTypes.bool
};
var defaultProps = {
  size: {
    xs: 12
  },
  className: 'p-x-0',
  wrapperClassName: 'p-left-0',
  onInvalidProperty: emptyFunction
};
var initialState = {
  hasBlurred: false
};

var PropertyInputEmailWrapper = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputEmailWrapper, _Component);

  function PropertyInputEmailWrapper() {
    var _this;

    _classCallCheck(this, PropertyInputEmailWrapper);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputEmailWrapper).call(this));

    _this.handleBlur = function () {
      _this.setState({
        hasBlurred: true
      });
    };

    _this.handleFocus = function () {
      _this.setState({
        hasBlurred: false
      });
    };

    _this.state = initialState;
    return _this;
  }

  _createClass(PropertyInputEmailWrapper, [{
    key: "focus",
    value: function focus() {
      this.refs.input.focus();
    }
  }, {
    key: "render",
    value: function render() {
      var blur = this.state.hasBlurred;
      return /*#__PURE__*/_jsx(PropertyInputEmail, Object.assign({}, this.props, {
        hasBlurred: blur,
        handleBlur: this.handleBlur,
        handleFocus: this.handleFocus,
        ref: "input"
      }));
    }
  }]);

  return PropertyInputEmailWrapper;
}(Component);

PropertyInputEmailWrapper.propTypes = propTypes;
PropertyInputEmailWrapper.defaultProps = defaultProps;
export default PropertyInputEmailWrapper;