'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import Immutable from 'immutable';
import FileInput from './FilenameInput';

var Filename = /*#__PURE__*/function (_Component) {
  _inherits(Filename, _Component);

  function Filename(props) {
    var _this;

    _classCallCheck(this, Filename);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Filename).call(this, props));
    _this.state = {
      filename: props.file.get('name')
    };
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.handleBlur = _this.handleBlur.bind(_assertThisInitialized(_this));
    _this.handleKeyDown = _this.handleKeyDown.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Filename, [{
    key: "handleChange",
    value: function handleChange(event) {
      this.setState({
        filename: event.target.value
      });
    }
  }, {
    key: "handleBlur",
    value: function handleBlur() {
      var _this$props = this.props,
          onUpdate = _this$props.onUpdate,
          file = _this$props.file;
      var filename = this.state.filename;

      if (filename && filename !== file.get('name')) {
        onUpdate(filename);
      } else {
        this.setState({
          filename: file.get('name')
        });
      }
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(event) {
      var file = this.props.file;
      var filename = this.state.filename;

      if (event.key === 'Enter' && filename && filename !== file.get('name')) {
        this.input.blur();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var filename = this.state.filename;
      var isReadOnly = this.props.isReadOnly;
      return /*#__PURE__*/_jsx(FileInput, {
        ref: function ref(c) {
          _this2.input = c;
        },
        value: filename,
        onChange: this.handleChange,
        onBlur: this.handleBlur,
        onKeyDown: this.handleKeyDown,
        isReadOnly: isReadOnly
      });
    }
  }]);

  return Filename;
}(Component);

export { Filename as default };
Filename.propTypes = {
  file: PropTypes.instanceOf(Immutable.Map).isRequired,
  onUpdate: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired
};