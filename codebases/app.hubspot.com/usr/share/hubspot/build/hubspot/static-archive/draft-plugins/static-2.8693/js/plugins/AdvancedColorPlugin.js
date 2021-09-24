'use es6';
/* eslint-disable react/no-multi-comp */

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import memoize from 'transmute/memoize';
import { EditorState, Modifier } from 'draft-js';
import { createPlugin } from 'draft-extend';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Component } from 'react';
import { OrderedSet } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import UITextToolbarColorDropdown from 'UIComponents/editor/UITextToolbarColorDropdown';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import { APPLY_COLOR_POPOVER } from 'rich-text-lib/constants/usageTracking';
import { getHexToStyle, styleToHex, STYLE_DELINEATOR } from '../lib/colors';
import { createTracker } from '../tracking/usageTracker';
var Tracker;
var PureUITextToolbarColorDropdown = createReactClass({
  displayName: "PureUITextToolbarColorDropdown",
  mixins: [PureRenderMixin],
  render: function render() {
    return /*#__PURE__*/_jsx(UITextToolbarColorDropdown, Object.assign({}, this.props));
  }
});

var getAllStylesForBlock = function getAllStylesForBlock(block) {
  var startOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var endOffset = arguments.length > 2 ? arguments[2] : undefined;
  var characters = block.getCharacterList();
  var firstNonRelevantOffset = endOffset ? endOffset + 1 : characters.size;
  var relevantCharacters = characters.slice(startOffset, firstNonRelevantOffset);
  return relevantCharacters.reduce(function (styles, character) {
    return styles.union(character.getStyle());
  }, OrderedSet());
};

var getAllStylesForSelectionFromProperty = function getAllStylesForSelectionFromProperty(cssProperty) {
  return function (editorState) {
    var content = editorState.getCurrentContent();
    var selection = editorState.getSelection();
    var startBlockKey = selection.getStartKey();
    var startOffset = selection.getStartOffset();
    var startBlock = content.getBlockForKey(startBlockKey);
    var endBlockKey = selection.getEndKey();
    var endOffset = selection.getEndOffset();

    if (startBlockKey === endBlockKey) {
      return getAllStylesForBlock(startBlock, startOffset, endOffset).filter(function (style) {
        return style.indexOf(cssProperty) === 0;
      });
    }

    var endBlock = content.getBlockForKey(endBlockKey);
    var middleBlocks = content.getBlockMap().skipUntil(function (block) {
      return block.getKey() === startBlockKey;
    }).takeUntil(function (block) {
      return block.getKey() === endBlockKey;
    }).slice(1); // ditch startBlock

    var styles = getAllStylesForBlock(startBlock, startOffset);
    middleBlocks.forEach(function (block) {
      styles = styles.union(getAllStylesForBlock(block));
    });
    styles = styles.union(getAllStylesForBlock(endBlock, 0, endOffset));
    return styles.filter(function (style) {
      return style.indexOf(cssProperty) === 0;
    });
  };
};

export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$applyColorOnClic = _ref.applyColorOnClick,
      applyColorOnClick = _ref$applyColorOnClic === void 0 ? false : _ref$applyColorOnClic,
      _ref$cssProperty = _ref.cssProperty,
      cssProperty = _ref$cssProperty === void 0 ? 'color' : _ref$cssProperty,
      ColorPicker = _ref.ColorPicker,
      _ref$defaultColor = _ref.defaultColor,
      defaultColor = _ref$defaultColor === void 0 ? '#000' : _ref$defaultColor,
      _ref$iconName = _ref.iconName,
      iconName = _ref$iconName === void 0 ? 'textColor' : _ref$iconName,
      _ref$placement = _ref.placement,
      placement = _ref$placement === void 0 ? 'top right' : _ref$placement;

  if (!Tracker) {
    Tracker = createTracker();
  }

  var hexToStyle = getHexToStyle(cssProperty);

  var ColorButton = /*#__PURE__*/function (_Component) {
    _inherits(ColorButton, _Component);

    function ColorButton(props) {
      var _this;

      _classCallCheck(this, ColorButton);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ColorButton).call(this, props));
      _this.handleColorChange = _this.handleColorChange.bind(_assertThisInitialized(_this));
      _this.handleOpenChange = _this.handleOpenChange.bind(_assertThisInitialized(_this));
      _this.handleResetClick = _this.handleResetClick.bind(_assertThisInitialized(_this));
      _this.memoizedGetColorObject = memoize(_this.getColorObject);
      return _this;
    }

    _createClass(ColorButton, [{
      key: "getCurrentColor",
      value: function getCurrentColor() {
        var editorState = this.props.editorState;
        var currentStyle = editorState.getCurrentInlineStyle().find(function (style) {
          return style.indexOf(cssProperty) === 0;
        });
        return currentStyle ? styleToHex(currentStyle) : defaultColor;
      }
    }, {
      key: "getColorObject",
      value: function getColorObject(color) {
        return {
          color: color,
          alpha: 100
        };
      }
    }, {
      key: "handleColorChange",
      value: function handleColorChange(e) {
        var _this$props = this.props,
            editorState = _this$props.editorState,
            onChange = _this$props.onChange;
        var color = e.target.value.color;
        var selection = editorState.getSelection();
        var currentStyles = getAllStylesForSelectionFromProperty(cssProperty)(editorState);
        var nextContent = currentStyles.reduce(function (content, style) {
          return Modifier.removeInlineStyle(content, selection, style);
        }, editorState.getCurrentContent());
        var colorStyle = hexToStyle(color);
        nextContent = Modifier.applyInlineStyle(nextContent, selection, colorStyle);

        if (selection.isCollapsed()) {
          var currentInlineStyle = editorState.getCurrentInlineStyle();
          var styleOverrideToSet = currentInlineStyle.has(colorStyle) ? currentInlineStyle.delete(colorStyle) : currentInlineStyle.add(colorStyle);
          onChange(EditorState.setInlineStyleOverride(editorState, styleOverrideToSet));
        } else {
          onChange(EditorState.push(editorState, nextContent, 'change-inline-styles'));
        }

        Tracker.track('draftChangeColor', {
          action: APPLY_COLOR_POPOVER,
          format: cssProperty === 'color' ? 'forecolor' : 'hilitecolor'
        });
      }
    }, {
      key: "handleOpenChange",
      value: function handleOpenChange(e) {
        if (!applyColorOnClick) {
          return;
        }

        var isOpening = e.target.value;

        if (!isOpening) {
          return;
        }

        var color = this.getCurrentColor();
        this.handleColorChange(SyntheticEvent({
          color: color
        }));
      }
    }, {
      key: "handleResetClick",
      value: function handleResetClick() {
        this.handleColorChange(SyntheticEvent({
          color: defaultColor
        }));
      }
    }, {
      key: "render",
      value: function render() {
        return /*#__PURE__*/_jsx(PureUITextToolbarColorDropdown, {
          color: this.memoizedGetColorObject(this.getCurrentColor()),
          DropdownContent: ColorPicker,
          icon: iconName,
          menuWidth: 300,
          onColorChange: this.handleColorChange,
          onOpenChange: this.handleOpenChange,
          onResetClick: this.handleResetClick,
          placement: placement
        });
      }
    }]);

    return ColorButton;
  }(Component);

  ColorButton.propTypes = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  var getInlineStyleFromStyleString = function getInlineStyleFromStyleString(styleString) {
    var _styleString$split = styleString.split(STYLE_DELINEATOR),
        _styleString$split2 = _slicedToArray(_styleString$split, 2),
        property = _styleString$split2[0],
        hex = _styleString$split2[1];

    return _defineProperty({}, property, hex);
  };

  var styleFn = function styleFn(styles) {
    var relevantStyles = styles.filter(function (style) {
      return style.includes(STYLE_DELINEATOR);
    });

    if (!relevantStyles.size) {
      return {};
    }

    return relevantStyles.reduce(function (acc, styleString) {
      return Object.assign({}, acc, {}, getInlineStyleFromStyleString(styleString));
    }, {});
  };

  var styleToHTML = function styleToHTML(style) {
    if (style.indexOf("" + cssProperty + STYLE_DELINEATOR) !== 0) {
      return undefined;
    }

    return /*#__PURE__*/_jsx("span", {
      style: getInlineStyleFromStyleString(style)
    });
  };

  var rgbValToPaddedHex = function rgbValToPaddedHex(val) {
    var hex = val.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  var rbgStringToHex = function rbgStringToHex(rgbString) {
    var rgb;
    rgbString.replace(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i, function (match, r, g, b) {
      rgb = {
        r: rgbValToPaddedHex(parseInt(r, 10)),
        g: rgbValToPaddedHex(parseInt(g, 10)),
        b: rgbValToPaddedHex(parseInt(b, 10))
      };
    });

    if (!rgb) {
      return undefined;
    }

    return "#" + rgb.r + rgb.g + rgb.b;
  };

  var htmlToStyle = function htmlToStyle(nodeName, node, currentStyle) {
    if (!node.style) {
      return currentStyle;
    }

    var nodeStyle = node.style.getPropertyValue(cssProperty);
    var hexColor = rbgStringToHex(nodeStyle);

    if (hexColor) {
      return currentStyle.add(hexToStyle(hexColor));
    }

    return currentStyle;
  };

  return createPlugin({
    buttons: ColorButton,
    htmlToStyle: htmlToStyle,
    styleFn: styleFn,
    styleToHTML: styleToHTML
  });
});