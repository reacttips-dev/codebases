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
import emptyFunction from 'react-utils/emptyFunction';
import I18n from 'I18n';
import classNames from 'classnames';
import styled from 'styled-components';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import Controllable from 'UIComponents/decorators/Controllable';
import UIButton from 'UIComponents/button/UIButton';
import UILink from 'UIComponents/link/UILink';
import UIFormLabel from 'UIComponents/form/UIFormLabel';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIPopoverBody from 'UIComponents/tooltip/UIPopoverBody';
import UITabs from 'UIComponents/nav/UITabs';
import UITab from 'UIComponents/nav/UITab';
import ColorPicker from '../ColorPicker';
import { ColorPickerModes, DefaultColorGrid } from '../constants';
import SquatchGrid from './SquatchGrid';
import { isValidFavorites } from '../utils/validateColor';
var FavoritesLabelContainer = styled.div.withConfig({
  displayName: "ColorPickerPopoverBody__FavoritesLabelContainer",
  componentId: "cbtycj-0"
})(["margin-bottom:2px;display:flex;justify-content:space-between;"]);
var ResetButton = styled(UIButton).withConfig({
  displayName: "ColorPickerPopoverBody__ResetButton",
  componentId: "cbtycj-1"
})(["width:100%;"]);

var ColorPickerPopoverBody = /*#__PURE__*/function (_Component) {
  _inherits(ColorPickerPopoverBody, _Component);

  function ColorPickerPopoverBody() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ColorPickerPopoverBody);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ColorPickerPopoverBody)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleResetClick = function () {
      var _this$props = _this.props,
          defaultAlpha = _this$props.defaultAlpha,
          defaultColor = _this$props.defaultColor,
          onChange = _this$props.onChange,
          onResetClick = _this$props.onResetClick,
          onOpenChange = _this$props.onOpenChange;

      if (onResetClick) {
        onResetClick();
      } else {
        onChange({
          color: defaultColor,
          alpha: defaultAlpha
        });
      } // Always close the picker on reset


      if (onOpenChange) {
        onOpenChange(SyntheticEvent(false));
      }
    };

    _this.handleColorChange = function (_ref) {
      var color = _ref.color,
          alpha = _ref.alpha;
      var _this$props2 = _this.props,
          onChange = _this$props2.onChange,
          onOpenChange = _this$props2.onOpenChange,
          pickerMode = _this$props2.pickerMode;
      onChange({
        color: color,
        alpha: alpha
      }); // Close the picker when on the SIMPLE tab

      if (pickerMode === ColorPickerModes.SIMPLE && onOpenChange) {
        onOpenChange(SyntheticEvent(false));
      }
    };

    return _this;
  }

  _createClass(ColorPickerPopoverBody, [{
    key: "renderFavoritesLink",
    value: function renderFavoritesLink() {
      var _this$props3 = this.props,
          editFavoritesLink = _this$props3.editFavoritesLink,
          showFavoritesLink = _this$props3.showFavoritesLink;

      if (!editFavoritesLink || !showFavoritesLink) {
        return null;
      }

      return /*#__PURE__*/_jsx(UILink, {
        external: true,
        href: editFavoritesLink,
        children: I18n.text('colorPicker.popover.edit')
      });
    }
  }, {
    key: "renderFavorites",
    value: function renderFavorites() {
      var _this$props4 = this.props,
          color = _this$props4.color,
          favorites = _this$props4.favorites;

      if (!isValidFavorites(favorites)) {
        return null;
      }

      return /*#__PURE__*/_jsxs("div", {
        "data-test-id": "colorpicker-favorites",
        className: "private-react-colorpicker-popover--favorites m-top-2",
        children: [/*#__PURE__*/_jsxs(FavoritesLabelContainer, {
          children: [/*#__PURE__*/_jsx(UIFormLabel, {
            className: "p-y-0",
            children: I18n.text('colorPicker.favorites')
          }), this.renderFavoritesLink()]
        }), /*#__PURE__*/_jsx(SquatchGrid, {
          currentColor: color,
          grid: favorites,
          onClick: this.handleColorChange
        })]
      });
    }
  }, {
    key: "renderReset",
    value: function renderReset() {
      var showResetToDefault = this.props.showResetToDefault;

      if (!showResetToDefault) {
        return null;
      }

      return /*#__PURE__*/_jsx(UIFlex, {
        children: /*#__PURE__*/_jsx(ResetButton, {
          "data-test-id": "colorpicker-reset-button",
          className: "private-react-colorpicker-popover--reset m-top-3",
          onClick: this.handleResetClick,
          size: "small",
          use: "tertiary-light",
          children: I18n.text('colorPicker.popover.reset')
        })
      });
    }
  }, {
    key: "renderSimpleTab",
    value: function renderSimpleTab() {
      var _this$props5 = this.props,
          color = _this$props5.color,
          colorGrid = _this$props5.colorGrid,
          favorites = _this$props5.favorites;
      var isFavoriteColor = color && isValidFavorites(favorites) && favorites.indexOf(color.toLowerCase()) >= 0;
      return /*#__PURE__*/_jsxs(UITab, {
        onMouseDown: function onMouseDown(evt) {
          return evt.preventDefault();
        },
        tabId: ColorPickerModes.SIMPLE,
        title: I18n.text('colorPicker.popover.mode.simple'),
        children: [/*#__PURE__*/_jsx(SquatchGrid, {
          currentColor: color,
          grid: colorGrid,
          onClick: this.handleColorChange,
          showMatchedSquatch: !isFavoriteColor
        }), this.renderFavorites(), this.renderReset()]
      });
    }
  }, {
    key: "renderAdvancedTab",
    value: function renderAdvancedTab() {
      var _this$props6 = this.props,
          alpha = _this$props6.alpha,
          alphaClassName = _this$props6.alphaClassName,
          boardClassName = _this$props6.boardClassName,
          color = _this$props6.color,
          colorsClassName = _this$props6.colorsClassName,
          colorPickerClassName = _this$props6.colorPickerClassName,
          includeAlpha = _this$props6.includeAlpha,
          ribbonClassName = _this$props6.ribbonClassName;
      var advancedClasses = classNames(colorPickerClassName, 'p-all-0');
      return /*#__PURE__*/_jsxs(UITab, {
        onMouseDown: function onMouseDown(evt) {
          return evt.preventDefault();
        },
        tabId: ColorPickerModes.ADVANCED,
        title: I18n.text('colorPicker.popover.mode.advanced'),
        children: [/*#__PURE__*/_jsx(ColorPicker, {
          alpha: alpha,
          alphaClassName: alphaClassName,
          boardClassName: boardClassName,
          className: advancedClasses,
          color: color,
          colorsClassName: colorsClassName,
          fieldsetSize: "small",
          hexOnly: false,
          includeAlpha: includeAlpha,
          onChange: this.handleColorChange,
          ribbonClassName: ribbonClassName
        }), this.renderReset()]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props7 = this.props,
          className = _this$props7.className,
          onPickerModeChange = _this$props7.onPickerModeChange,
          pickerMode = _this$props7.pickerMode;
      return /*#__PURE__*/_jsx(UIPopoverBody, {
        flush: true,
        className: className,
        children: /*#__PURE__*/_jsxs(UITabs, {
          fill: true,
          onSelectedChange: onPickerModeChange,
          panelClassName: "p-all-4 m-all-0",
          selected: pickerMode,
          use: "toolbar",
          children: [this.renderSimpleTab(), this.renderAdvancedTab()]
        })
      });
    }
  }]);

  return ColorPickerPopoverBody;
}(Component);

ColorPickerPopoverBody.propTypes = {
  alpha: PropTypes.number,
  alphaClassName: PropTypes.string,
  boardClassName: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  colorGrid: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
    color: PropTypes.string,
    alpha: PropTypes.string
  })])),
  colorPickerClassName: PropTypes.string,
  colorsClassName: PropTypes.string,
  defaultAlpha: PropTypes.number,
  defaultColor: PropTypes.string,
  editFavoritesLink: PropTypes.string,
  favorites: PropTypes.arrayOf(PropTypes.string),
  includeAlpha: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onPickerModeChange: PropTypes.func,
  onOpenChange: PropTypes.func,
  onResetClick: PropTypes.func,
  pickerMode: PropTypes.oneOf(Object.keys(ColorPickerModes).map(function (key) {
    return ColorPickerModes[key];
  })),
  ribbonClassName: PropTypes.string,
  showFavoritesLink: PropTypes.bool,
  showResetToDefault: PropTypes.bool
};
ColorPickerPopoverBody.defaultProps = {
  colorGrid: DefaultColorGrid,
  defaultAlpha: 100,
  defaultColor: '#FFFFFF',
  includeAlpha: false,
  pickerMode: ColorPickerModes.SIMPLE,
  onPickerModeChange: emptyFunction.thatReturnsNull,
  showResetToDefault: true
};
export default Controllable(ColorPickerPopoverBody, ['pickerMode']);