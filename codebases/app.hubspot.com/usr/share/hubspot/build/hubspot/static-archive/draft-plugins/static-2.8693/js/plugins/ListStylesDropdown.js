'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { createPlugin } from 'draft-extend';
import { EditorState, RichUtils } from 'draft-js';
import { Component } from 'react';
import UITextToolbarSplitSelect from 'UIComponents/editor/UITextToolbarSplitSelect';
import { LIST_TYPES } from '../lib/constants';
import handleListTabs from '../utils/handleListTabs';

var createListStyleOption = function createListStyleOption(_ref) {
  var style = _ref.style,
      icon = _ref.icon;
  return {
    icon: icon,
    value: style
  };
};

var getBlockStyleFromEditorState = function getBlockStyleFromEditorState(editorState) {
  return editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey()).getType();
};

var createListStyleDropdown = function createListStyleDropdown(options) {
  var _temp;

  return _temp = /*#__PURE__*/function (_Component) {
    _inherits(ListStyleDropdown, _Component);

    function ListStyleDropdown(props) {
      var _this;

      _classCallCheck(this, ListStyleDropdown);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ListStyleDropdown).call(this, props));

      _this.getIsActive = function () {
        var editorState = _this.props.editorState;
        var currentValue = _this.state.currentValue;
        var currentBlockStyle = getBlockStyleFromEditorState(editorState);
        return currentBlockStyle === currentValue;
      };

      _this.getSelectedValue = function () {
        var editorState = _this.props.editorState;
        var currentBlockStyle = getBlockStyleFromEditorState(editorState);
        var selectedOption = options.find(function (_ref2) {
          var value = _ref2.value;
          return value === currentBlockStyle;
        });
        return selectedOption ? selectedOption.value : undefined;
      };

      _this.handleStyleToggle = function () {
        var _this$props = _this.props,
            editorState = _this$props.editorState,
            onChange = _this$props.onChange;
        var currentValue = _this.state.currentValue;
        var newState = RichUtils.toggleBlockType(editorState, currentValue);
        onChange(EditorState.forceSelection(newState, newState.getSelection()));
      };

      _this.handleStyleChange = function (evt) {
        var shouldApplyNewStyle = _this.getIsActive();

        _this.setState({
          currentValue: evt.target.value
        }, function () {
          if (shouldApplyNewStyle) {
            _this.handleStyleToggle();
          }
        });
      };

      _this.state = {
        currentValue: _this.getSelectedValue() || options[0].value
      };
      return _this;
    }

    _createClass(ListStyleDropdown, [{
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        var editorState = this.props.editorState;
        var newSelection = editorState.getSelection();
        var newValue = this.getSelectedValue();

        if (!newSelection.equals(prevProps.editorState.getSelection()) && newValue != null) {
          this.setState({
            currentValue: newValue
          });
        }
      }
    }, {
      key: "render",
      value: function render() {
        var editorState = this.props.editorState;
        var currentValue = this.state.currentValue;
        var hasFocus = editorState.getSelection().getHasFocus();
        return /*#__PURE__*/_jsx(UITextToolbarSplitSelect, {
          active: this.getIsActive() && hasFocus,
          onButtonClick: this.handleStyleToggle,
          onChange: this.handleStyleChange,
          options: options,
          value: currentValue
        });
      }
    }]);

    return ListStyleDropdown;
  }(Component), _temp;
};

export default (function () {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref3$listStyles = _ref3.listStyles,
      listStyles = _ref3$listStyles === void 0 ? null : _ref3$listStyles;

  var options = [];

  if (Array.isArray(listStyles)) {
    var styles = LIST_TYPES.filter(function (style) {
      return listStyles.includes(style.style);
    });
    options.push.apply(options, _toConsumableArray(styles.map(createListStyleOption)));
  } else {
    options.push.apply(options, _toConsumableArray(LIST_TYPES.map(createListStyleOption)));
  }

  var dropdown = createListStyleDropdown(options);
  return createPlugin({
    keyCommandListener: handleListTabs,
    buttons: dropdown,
    blockToHTML: {
      blockquote: {
        start: '<blockquote>',
        end: '</blockquote>'
      },
      'code-block': {
        start: '<pre>',
        end: '</pre>'
      }
    }
  });
});