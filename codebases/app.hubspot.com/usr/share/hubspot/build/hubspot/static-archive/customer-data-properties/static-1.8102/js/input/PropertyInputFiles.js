'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { isValidDomain } from 'customer-data-properties/validation/PropertyValidations';
import UILink from 'UIComponents/link/UILink';
import UIList from 'UIComponents/list/UIList';
var propTypes = {
  value: PropTypes.string.isRequired
};
var defaultProps = {
  value: ''
};

var PropertyInputFiles = /*#__PURE__*/function (_Component) {
  _inherits(PropertyInputFiles, _Component);

  function PropertyInputFiles() {
    _classCallCheck(this, PropertyInputFiles);

    return _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputFiles).apply(this, arguments));
  }

  _createClass(PropertyInputFiles, [{
    key: "getValue",
    value: function getValue() {
      var urls = this.props.value ? this.props.value.split(/[;,]+/) : [];
      return urls.filter(function (url) {
        return isValidDomain(url.trim());
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx(UIList, {
        className: "p-top-2",
        children: this.getValue().map(function (url) {
          var fileName = url.match(/\/([^/]*)$/)[1];
          return /*#__PURE__*/_jsxs(UILink, {
            href: url,
            external: true,
            children: [' ', fileName, ' ']
          }, url);
        })
      });
    }
  }]);

  return PropertyInputFiles;
}(Component);

export { PropertyInputFiles as default };
PropertyInputFiles.propTypes = propTypes;
PropertyInputFiles.defaultProps = defaultProps;