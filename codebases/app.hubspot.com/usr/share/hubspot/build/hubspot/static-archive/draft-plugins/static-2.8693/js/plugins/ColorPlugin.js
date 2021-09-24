'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { EditorState, Modifier } from 'draft-js';
import { OrderedSet } from 'immutable';
import { createPlugin, pluginUtils } from 'draft-extend';
import ToggleButton from '../components/ToggleButton';
import { toggleInlineStyleOverride } from '../lib/utils';
import { createTracker } from '../tracking/usageTracker';
import { APPLY_COLOR_POPOVER } from 'rich-text-lib/constants/usageTracking';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
var Tracker;
var DEFAULT_COLORS = [['#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#F7F7F7', '#FFFFFF'], ['#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF'], ['#F7C6CE', '#FFE7CE', '#FFEFC6', '#D6EFD6', '#CEDEE7', '#CEE7F7', '#D6D6E7', '#E7D6DE'], ['#E79C9C', '#FFC69C', '#FFE79C', '#B5D6A5', '#A5C6CE', '#9CC6EF', '#B5A5D6', '#D6A5BD'], ['#E76363', '#F7AD6B', '#FFD663', '#94BD7B', '#73A5AD', '#6BADDE', '#8C7BC6', '#C67BA5'], ['#CE0000', '#E79439', '#EFC631', '#6BA54A', '#4A7B8C', '#3984C6', '#634AA5', '#A54A7B'], ['#9C0000', '#B56308', '#BD9400', '#397B21', '#104A5A', '#085294', '#311873', '#731842'], ['#630000', '#7B3900', '#846300', '#295218', '#083139', '#003163', '#21104A', '#4A1031']];

var hexToRgb = function hexToRgb(hexString) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hexString = hexString.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexString);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$getStyleName = _ref.getStyleName,
      getStyleName = _ref$getStyleName === void 0 ? function (hexString) {
    return "TEXT-COLOR-" + hexString;
  } : _ref$getStyleName,
      _ref$colors = _ref.colors,
      colors = _ref$colors === void 0 ? DEFAULT_COLORS : _ref$colors,
      _ref$cssProperty = _ref.cssProperty,
      cssProperty = _ref$cssProperty === void 0 ? 'color' : _ref$cssProperty,
      tooltip = _ref.tooltip,
      _ref$iconName = _ref.iconName,
      iconName = _ref$iconName === void 0 ? 'textColor' : _ref$iconName,
      buttonText = _ref.buttonText;

  if (!Tracker) {
    Tracker = createTracker();
  }

  var COLORS_FLATTENED = colors.reduce(function (result, row) {
    return result.concat(row);
  }, []);
  var COLOR_STYLES = COLORS_FLATTENED.reduce(function (map, color) {
    map[getStyleName(color)] = _defineProperty({}, cssProperty, color);
    return map;
  }, {});
  var COLOR_STYLES_RGB = COLORS_FLATTENED.reduce(function (map, color) {
    map[getStyleName(color)] = hexToRgb(color);
    return map;
  }, {});
  var styleLookupSet = COLORS_FLATTENED.reduce(function (set, color) {
    return set.add(getStyleName(color));
  }, OrderedSet());
  var styleToHTML = Object.keys(COLOR_STYLES).reduce(function (result, styleName) {
    var cssString = pluginUtils.styleObjectToString(COLOR_STYLES[styleName]);
    result[styleName] = {
      start: "<span style=\"" + cssString + "\">",
      end: '</span>'
    };
    return result;
  }, {});

  var htmlToStyle = function htmlToStyle(nodeName, node, currentStyle) {
    var colorToAdd = Object.keys(COLOR_STYLES_RGB).find(function (styleName) {
      if (!node.style || node.style[cssProperty] === undefined || node.style[cssProperty] === '') {
        return false;
      }

      var nodeRgb;
      node.style.getPropertyValue(cssProperty).replace(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i, function (match, r, g, b) {
        nodeRgb = {
          r: parseInt(r, 10),
          g: parseInt(g, 10),
          b: parseInt(b, 10)
        };
      });
      var styleRgb = COLOR_STYLES_RGB[styleName];
      return nodeRgb && nodeRgb.r === styleRgb.r && nodeRgb.g === styleRgb.g && nodeRgb.b === styleRgb.b;
    });

    if (colorToAdd) {
      return currentStyle.add(colorToAdd);
    }

    return currentStyle;
  };

  var TextColorButton = createReactClass({
    displayName: "TextColorButton",
    propTypes: {
      editorState: PropTypes.object.isRequired,
      onChange: PropTypes.func.isRequired
    },
    onClick: function onClick(selectedStyle) {
      var _this$props = this.props,
          editorState = _this$props.editorState,
          onChange = _this$props.onChange;
      var selection = editorState.getSelection();
      var currentStyle = editorState.getCurrentInlineStyle();
      var nextContentState = Object.keys(COLOR_STYLES).reduce(function (state, styleName) {
        return Modifier.removeInlineStyle(state, selection, styleName);
      }, editorState.getCurrentContent());

      if (!currentStyle.has(selectedStyle)) {
        nextContentState = Modifier.applyInlineStyle(nextContentState, selection, selectedStyle);
      }

      if (selection.isCollapsed()) {
        var updatedInlineStyles = toggleInlineStyleOverride(editorState, styleLookupSet);

        if (currentStyle.has(selectedStyle)) {
          updatedInlineStyles = updatedInlineStyles.delete(selectedStyle);
        } else {
          updatedInlineStyles = updatedInlineStyles.add(selectedStyle);
        }

        onChange(EditorState.setInlineStyleOverride(editorState, updatedInlineStyles));
      } else {
        onChange(EditorState.push(editorState, nextContentState, 'change-inline-style'));
      }

      Tracker.track('draftChangeColor', {
        action: APPLY_COLOR_POPOVER,
        format: cssProperty === 'color' ? 'forecolor' : 'hilitecolor'
      });
    },
    renderColorButton: function renderColorButton(color) {
      var _this = this;

      var style = getStyleName(color);

      var onClick = function onClick() {
        _this.onClick(style);
      };

      return /*#__PURE__*/_jsx(UIButton, {
        style: {
          display: 'inline-block',
          padding: 0,
          height: 16,
          width: 'auto'
        },
        onClick: onClick,
        use: "unstyled",
        children: /*#__PURE__*/_jsx("div", {
          style: {
            display: 'inline-block',
            width: 16,
            height: 16,
            border: 'solid 1px #fff',
            background: COLOR_STYLES[style][cssProperty]
          }
        })
      }, style);
    },
    renderColors: function renderColors() {
      var _this2 = this;

      return colors.map(function (row, index) {
        return /*#__PURE__*/_jsx("div", {
          className: "color-row text-center align-center",
          children: row.map(_this2.renderColorButton)
        }, index);
      });
    },
    renderDropdown: function renderDropdown() {
      return /*#__PURE__*/_jsx(UIDropdown, {
        iconName: iconName,
        buttonText: buttonText,
        buttonUse: "unstyled",
        className: "transparent-dropdown p-all-0",
        children: /*#__PURE__*/_jsx("div", {
          className: "p-all-1",
          children: this.renderColors()
        })
      });
    },
    renderButton: function renderButton() {
      var _this3 = this;

      var editorState = this.props.editorState;
      var style = getStyleName(COLORS_FLATTENED[0]);
      var currentStyle = editorState.getCurrentInlineStyle();

      var onToggle = function onToggle() {
        _this3.onClick(style);
      };

      return /*#__PURE__*/_jsx("span", {
        children: /*#__PURE__*/_jsx(ToggleButton, {
          active: currentStyle.has(style),
          icon: iconName,
          onClick: onToggle
        })
      });
    },
    render: function render() {
      var inner = COLORS_FLATTENED.length === 1 ? this.renderButton() : this.renderDropdown();
      return /*#__PURE__*/_jsx(UITooltip, {
        disabled: !tooltip,
        title: tooltip,
        placement: "top",
        children: inner
      });
    }
  });
  return createPlugin({
    styleMap: COLOR_STYLES,
    styleToHTML: styleToHTML,
    htmlToStyle: htmlToStyle,
    buttons: TextColorButton
  });
});