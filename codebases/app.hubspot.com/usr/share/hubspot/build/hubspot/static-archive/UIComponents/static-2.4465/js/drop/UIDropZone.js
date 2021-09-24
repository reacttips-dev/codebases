'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { findDOMNode } from 'react-dom';
import styled, { css } from 'styled-components';
import classNames from 'classnames';
import UISection from '../section/UISection';
import UIIcon from '../icon/UIIcon';
import { getIconNamePropType } from '../utils/propTypes/iconName';
import { isIE11 } from '../utils/BrowserTest';
import { propTypeForSizes, toShorthandSize } from '../utils/propTypes/tshirtSize';
import { CALYPSO, CALYPSO_LIGHT, CANDY_APPLE_DARK, CANDY_APPLE_LIGHT, EERIE, GYPSUM, OBSIDIAN, OZ, OZ_DARK, OZ_LIGHT, SLINKY } from 'HubStyleTokens/colors';
import { DROP_SMALL_HEIGHT, DROP_LARGE_HEIGHT } from 'HubStyleTokens/sizes';
import { BASE_FONT_COLOR, BASE_LINK_COLOR } from 'HubStyleTokens/theme';
var CONTENT_PADDING_X = 20;
var STYLES_FOR_USE = {
  hover: {
    backgroundColor: CALYPSO_LIGHT,
    border: "1px dashed " + CALYPSO,
    iconColor: BASE_LINK_COLOR
  },
  processing: {
    border: "1px solid " + GYPSUM,
    iconColor: EERIE
  },
  selected: {
    border: "1px solid " + GYPSUM,
    color: OBSIDIAN,
    iconColor: OBSIDIAN
  },
  error: {
    backgroundColor: CANDY_APPLE_LIGHT,
    border: "1px dashed " + CANDY_APPLE_DARK,
    color: BASE_FONT_COLOR,
    iconColor: CANDY_APPLE_DARK
  },
  success: {
    backgroundColor: OZ_LIGHT,
    border: "1px dashed " + OZ_DARK,
    color: BASE_FONT_COLOR,
    iconColor: OZ
  }
};
var Outer = styled(function (props) {
  var __variantStyles = props.variantStyles,
      rest = _objectWithoutProperties(props, ["variantStyles"]);

  return /*#__PURE__*/_jsx(UISection, Object.assign({}, rest));
}).withConfig({
  displayName: "UIDropZone__Outer",
  componentId: "sc-1fgrzu0-0"
})(["display:flex;flex-direction:column;background-color:", ";border:", ";border-radius:4px;color:", ";position:relative;"], function (_ref) {
  var variantStyles = _ref.variantStyles;
  return variantStyles.backgroundColor || GYPSUM;
}, function (_ref2) {
  var variantStyles = _ref2.variantStyles;
  return variantStyles.border || "1px dashed " + SLINKY;
}, function (_ref3) {
  var variantStyles = _ref3.variantStyles;
  return variantStyles.color || EERIE;
}); // Fix for #6763: Under IE11, images don't respect `max-width: 100%` in this flex container.

var imgWidthMixin = css(["img{max-width:", "px;}"], function (_ref4) {
  var contentWidth = _ref4.contentWidth;
  return contentWidth - CONTENT_PADDING_X * 2;
});
var Content = styled.div.withConfig({
  displayName: "UIDropZone__Content",
  componentId: "sc-1fgrzu0-1"
})(["display:flex;min-height:", ";flex-direction:", ";align-items:center;justify-content:center;text-align:center;padding:24px ", "px;", ""], function (_ref5) {
  var size = _ref5.size;
  return size === 'sm' ? DROP_SMALL_HEIGHT : DROP_LARGE_HEIGHT;
}, function (_ref6) {
  var size = _ref6.size;
  return size === 'sm' ? 'row' : 'column';
}, CONTENT_PADDING_X, function (_ref7) {
  var contentWidth = _ref7.contentWidth;
  return contentWidth && imgWidthMixin;
});
var Icon = styled(function (props) {
  var __dropSize = props.dropSize,
      rest = _objectWithoutProperties(props, ["dropSize"]);

  return /*#__PURE__*/_jsx(UIIcon, Object.assign({}, rest));
}).withConfig({
  displayName: "UIDropZone__Icon",
  componentId: "sc-1fgrzu0-2"
})(["padding-right:", ";padding-bottom:", ";"], function (_ref8) {
  var dropSize = _ref8.dropSize;
  return dropSize === 'sm' && '12px';
}, function (_ref9) {
  var dropSize = _ref9.dropSize;
  return dropSize === 'lg' && '16px';
});
var Body = styled.div.withConfig({
  displayName: "UIDropZone__Body",
  componentId: "sc-1fgrzu0-3"
})(["display:flex;flex-direction:column;"]);
var emptyObject = {};

var UIDropZone = /*#__PURE__*/function (_Component) {
  _inherits(UIDropZone, _Component);

  function UIDropZone() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UIDropZone);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIDropZone)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      contentWidth: null
    };

    _this.computeWidth = function () {
      if (!isIE11()) return;
      var contentWidth = _this._contentEl.offsetWidth;

      if (contentWidth && contentWidth !== _this.state.contentWidth) {
        _this.setState({
          contentWidth: contentWidth
        });
      }
    };

    return _this;
  }

  _createClass(UIDropZone, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.computeWidth();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      // ⚠️ This condition prevents infinite loops! ⚠️
      if (prevState.contentWidth === this.state.contentWidth) {
        this.computeWidth();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          children = _this$props.children,
          className = _this$props.className,
          contentClassName = _this$props.contentClassName,
          iconName = _this$props.iconName,
          iconSize = _this$props.iconSize,
          size = _this$props.size,
          use = _this$props.use,
          rest = _objectWithoutProperties(_this$props, ["children", "className", "contentClassName", "iconName", "iconSize", "size", "use"]);

      var contentWidth = this.state.contentWidth;
      var shorthandSize = toShorthandSize(size);
      var computedClassName = classNames('private-drop-zone', className, shorthandSize === 'lg' && 'private-drop-zone--large');
      var variantStyles = STYLES_FOR_USE[use] || emptyObject;
      return /*#__PURE__*/_jsx(Outer, Object.assign({}, rest, {
        className: computedClassName,
        variantStyles: variantStyles,
        children: /*#__PURE__*/_jsxs(Content, {
          className: classNames('private-drop-zone__content', contentClassName),
          ref: function ref(_ref10) {
            _this2._contentEl = findDOMNode(_ref10);
          },
          contentWidth: contentWidth,
          size: shorthandSize,
          children: [iconName ? /*#__PURE__*/_jsx(Icon, {
            name: iconName,
            dropSize: shorthandSize,
            size: iconSize || (shorthandSize === 'sm' ? 24 : 48),
            color: variantStyles.iconColor
          }) : null, /*#__PURE__*/_jsx(Body, {
            children: children
          })]
        })
      }));
    }
  }]);

  return UIDropZone;
}(Component);

UIDropZone.displayName = 'UIDropZone';
UIDropZone.propTypes = {
  children: PropTypes.node,
  contentClassName: PropTypes.string,
  iconName: getIconNamePropType(),
  iconSize: UIIcon.propTypes.size,
  size: propTypeForSizes(['sm', 'lg']).isRequired,
  use: PropTypes.oneOf(['default', 'hover', 'processing', 'selected', 'error', 'success']).isRequired
};
UIDropZone.defaultProps = {
  size: 'sm',
  use: 'default'
};
export default UIDropZone;