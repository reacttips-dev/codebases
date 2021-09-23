'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import styled from 'styled-components';
var PreviewContainer = styled.div.withConfig({
  displayName: "Preview__PreviewContainer",
  componentId: "sc-1u3c6y9-0"
})(["height:30px;width:30px;display:inline-block;position:relative;overflow:hidden;border-radius:2px;box-shadow:0 0 2px #808080 inset;background-image:url('data:image/png;base64,R0lGODdhCgAKAPAAAOXl5f///ywAAAAACgAKAEACEIQdqXt9GxyETrI279OIgwIAOw==');cursor:pointer;"]);
var PreviewInner = styled.span.withConfig({
  displayName: "Preview__PreviewInner",
  componentId: "sc-1u3c6y9-1"
})(["position:absolute;display:block;height:100%;width:30px;border-radius:2px;box-shadow:0 0 2px #808080 inset;"]);
var PreviewInput = styled.input.withConfig({
  displayName: "Preview__PreviewInput",
  componentId: "sc-1u3c6y9-2"
})(["position:absolute;display:block;height:100%;width:30px;border-radius:2px;box-shadow:0 0 2px #808080 inset;opacity:0;"]);

var Preview = /*#__PURE__*/function (_Component) {
  _inherits(Preview, _Component);

  function Preview() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Preview);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Preview)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.onChange = function (evt) {
      _this.props.onChange({
        hex: evt.target.value
      });

      evt.stopPropagation();
    };

    return _this;
  }

  _createClass(Preview, [{
    key: "render",
    value: function render() {
      var hex = this.props.hex;
      return /*#__PURE__*/_jsxs(PreviewContainer, {
        "data-test-id": "color-preview",
        children: [/*#__PURE__*/_jsx(PreviewInner, {
          style: {
            backgroundColor: hex,
            opacity: this.props.alpha / 100
          }
        }), /*#__PURE__*/_jsx(PreviewInput, {
          type: "color",
          defaultValue: hex,
          onChange: this.onChange,
          onClick: this.props.onInputClick
        })]
      });
    }
  }]);

  return Preview;
}(Component);

export { Preview as default };
Preview.propTypes = {
  hex: PropTypes.string,
  alpha: PropTypes.number,
  onChange: PropTypes.func,
  onInputClick: PropTypes.func
};