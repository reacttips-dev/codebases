'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import styled from 'styled-components';
import { EditorState, Modifier } from 'draft-js';
import { OrderedSet } from 'immutable';
import classNames from 'classnames';
import emptyFunction from 'react-utils/emptyFunction';
import { createPlugin, pluginUtils } from 'draft-extend';
import { toggleInlineStyleOverride } from '../lib/utils';
import UITextToolbarSelect from 'UIComponents/editor/UITextToolbarSelect';
import UITooltip from 'UIComponents/tooltip/UITooltip';
var styleObjectToString = pluginUtils.styleObjectToString;
var FontWrapper = styled.span.withConfig({
  displayName: "StyleDropdownPlugin__FontWrapper",
  componentId: "sc-1hu26vj-0"
})(["font-family:", " !important;span button{font-family:", " !important;}"], function (props) {
  return props.font;
}, function (props) {
  return props.font;
});
export default (function (_ref) {
  var _ref$options = _ref.options,
      options = _ref$options === void 0 ? [] : _ref$options,
      _ref$styleFn = _ref.styleFn,
      styleFn = _ref$styleFn === void 0 ? emptyFunction : _ref$styleFn,
      _ref$placeholder = _ref.placeholder,
      placeholder = _ref$placeholder === void 0 ? '' : _ref$placeholder,
      _ref$matchFn = _ref.matchFn,
      matchFn = _ref$matchFn === void 0 ? function () {
    return emptyFunction.thatReturnsFalse;
  } : _ref$matchFn,
      _ref$dropdownClassNam = _ref.dropdownClassName,
      dropdownClassName = _ref$dropdownClassNam === void 0 ? '' : _ref$dropdownClassNam,
      tooltip = _ref.tooltip,
      _ref$dropdownProps = _ref.dropdownProps,
      dropdownProps = _ref$dropdownProps === void 0 ? {} : _ref$dropdownProps,
      testKey = _ref.testKey;
  var styleMap = options.reduce(function (map, option) {
    map[option.value] = styleFn(option);
    return map;
  }, {});
  var styleMatchMap = options.reduce(function (map, option) {
    map[option.value] = matchFn(option);
    return map;
  }, {});
  var styleLookupSet = options.reduce(function (set, _ref2) {
    var value = _ref2.value;
    return set.add(value);
  }, OrderedSet());

  var htmlToStyle = function htmlToStyle(nodeName, node, currentStyle) {
    if (nodeName !== 'span') {
      return currentStyle;
    }

    var styleToAdd = Object.keys(styleMap).find(function (styleKey) {
      if (styleMatchMap[styleKey](node)) {
        return true;
      }

      var styleObject = styleMap[styleKey];
      return Object.keys(styleObject).every(function (style) {
        return node.style[style] === styleObject[style];
      });
    });

    if (styleToAdd) {
      return currentStyle.add(styleToAdd);
    }

    return currentStyle;
  };

  var styleToHTML = Object.keys(styleMap).reduce(function (result, styleKey) {
    var styleObject = styleMap[styleKey];
    var styleString = styleObjectToString(styleObject);
    result[styleKey] = {
      start: "<span style=\"" + styleString + "\">",
      end: '</span>'
    };
    return result;
  }, {});
  var Dropdown = createReactClass({
    displayName: "Dropdown",
    handleSelect: function handleSelect(e) {
      var _this$props = this.props,
          editorState = _this$props.editorState,
          onChange = _this$props.onChange;
      var selection = editorState.getSelection();
      var clearedFontContentState = options.reduce(function (state, option) {
        return Modifier.removeInlineStyle(state, selection, option.value);
      }, editorState.getCurrentContent());
      var finalContentState = Modifier.applyInlineStyle(clearedFontContentState, selection, e.target.value);
      var updatedEditorState = EditorState.push(editorState, finalContentState, 'change-inline-style');

      if (selection.isCollapsed()) {
        var updatedInlineStyles = toggleInlineStyleOverride(editorState, styleLookupSet);
        updatedInlineStyles = updatedInlineStyles.add(e.target.value);
        updatedEditorState = EditorState.setInlineStyleOverride(updatedEditorState, updatedInlineStyles);
      }

      onChange(updatedEditorState);
    },
    renderItemComponent: function renderItemComponent(props) {
      var font = props.option.font;
      return /*#__PURE__*/_jsx(FontWrapper, {
        font: font,
        children: props.children
      });
    },
    render: function render() {
      var editorState = this.props.editorState;
      var currentInlineStyles = editorState.getCurrentInlineStyle();
      var value = null;
      var currentOption = options.find(function (option) {
        return currentInlineStyles.has(option.value);
      });

      if (currentOption) {
        value = currentOption.value;
      }

      var className = classNames(dropdownClassName, 'draft-toolbar-select');
      return /*#__PURE__*/_jsx(UITooltip, {
        disabled: !tooltip,
        title: tooltip,
        placement: "top",
        children: /*#__PURE__*/_jsx("span", {
          children: /*#__PURE__*/_jsx(UITextToolbarSelect, Object.assign({
            "data-test-id": testKey,
            className: className,
            itemComponent: this.renderItemComponent,
            options: options,
            onChange: this.handleSelect,
            value: value,
            placeholder: placeholder,
            minimumSearchCount: options.length + 1
          }, dropdownProps))
        })
      });
    }
  });
  Dropdown.propTypes = {
    children: PropTypes.node,
    option: PropTypes.object,
    editorState: PropTypes.object,
    onChange: PropTypes.func
  };
  return createPlugin({
    displayName: 'StyleDropdownPlugin',
    styleMap: styleMap,
    buttons: Dropdown,
    htmlToStyle: htmlToStyle,
    styleToHTML: styleToHTML
  });
});