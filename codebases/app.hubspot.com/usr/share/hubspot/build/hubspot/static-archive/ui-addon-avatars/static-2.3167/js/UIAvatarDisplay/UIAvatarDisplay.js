'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { AVATAR_SIZES, AVATAR_TYPES, AVATAR_TYPE_ICONS, SOCIAL_MAP } from '../Constants';
import AvatarContentHolder from './baseStyledComponents/AvatarContentHolder';
import AvatarWrapper from './baseStyledComponents/AvatarWrapper';
import AvatarWrapperOverlay from './baseStyledComponents/AvatarWrapperOverlay';
import PropTypes from 'prop-types';
import { Component } from 'react';
import SocialBadge from './baseStyledComponents/SocialBadge';
import SVGIcon from './baseStyledComponents/SVGIcon';
import SVGIconEdit from './baseStyledComponents/SVGIconEdit';
import SVGImage from './baseStyledComponents/SVGImage';
import SVGText from './baseStyledComponents/SVGText';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UITruncateString from 'UIComponents/text/UITruncateString';

function delayUntilIdle(callback) {
  var delay = window.requestIdleCallback || window.setTimeout;
  var delayOptions = delay === window.requestIdleCallback ? {
    timeout: 5000
  } : 1000;
  var id = delay(callback, delayOptions);
  return window.requestIdleCallback ? function () {
    return window.cancelIdleCallback(id);
  } : function () {
    return window.clearTimeout(id);
  };
}

var UIAvatarDisplay = /*#__PURE__*/function (_Component) {
  _inherits(UIAvatarDisplay, _Component);

  function UIAvatarDisplay(props) {
    var _this;

    _classCallCheck(this, UIAvatarDisplay);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(UIAvatarDisplay).call(this, props));
    _this.state = {
      isDropdownMenuOpen: false,
      isTooltipLoaded: false
    };
    return _this;
  }

  _createClass(UIAvatarDisplay, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.cancelTimeout = delayUntilIdle(function () {
        return _this2.setState({
          isTooltipLoaded: true
        });
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.cancelTimeout();
    }
  }, {
    key: "handleMouseEnter",
    value: function handleMouseEnter() {
      this.setState(function () {
        return {
          isDropdownMenuOpen: true
        };
      });
    }
  }, {
    key: "getDefaultAvatar",
    value: function getDefaultAvatar(type) {
      var _options;

      var options = (_options = {}, _defineProperty(_options, AVATAR_TYPES.contact, 'https://static.hsappstatic.net/salesImages/static-1.362/avatars/default-avatar.png'), _defineProperty(_options, AVATAR_TYPES.company, 'https://static.hsappstatic.net/salesImages/static-1.362/avatars/default-company-avatar.png'), _options);
      return options[type];
    }
  }, {
    key: "MaybeAvatarHover",
    value: function MaybeAvatarHover(_ref) {
      var _isHasTooltip = _ref._isHasTooltip,
          _isHoverlayOpen = _ref._isHoverlayOpen,
          _isListReversed = _ref._isListReversed,
          _ref$_isTooltipLoaded = _ref._isTooltipLoaded,
          _isTooltipLoaded = _ref$_isTooltipLoaded === void 0 ? false : _ref$_isTooltipLoaded,
          className = _ref.className,
          outerChildren = _ref.outerChildren,
          isHoverlay = _ref.isHoverlay,
          size = _ref.size,
          style = _ref.style,
          toolTipName = _ref.toolTipName,
          toolTipPlacement = _ref.toolTipPlacement,
          rest = _objectWithoutProperties(_ref, ["_isHasTooltip", "_isHoverlayOpen", "_isListReversed", "_isTooltipLoaded", "className", "outerChildren", "isHoverlay", "size", "style", "toolTipName", "toolTipPlacement"]);

      className = className || '';
      className = _isHoverlayOpen ? className + " hover-test" : className;
      var sizeStyle = size && size !== AVATAR_SIZES.responsive ? {
        width: size + "px"
      } : {
        width: '100%'
      };
      var calculatedOverlayOffset = {
        overlapOffset: (size || 40) * 0.15
      };
      style = Object.assign({}, style, sizeStyle);
      var AvatarWrapperProps = Object.assign({
        _isListReversed: _isListReversed,
        className: className,
        style: style
      }, calculatedOverlayOffset, rest);

      if (!isHoverlay && !_isHoverlayOpen && _isHasTooltip) {
        return outerChildren && !_isTooltipLoaded ? /*#__PURE__*/_jsx(AvatarWrapper, Object.assign({}, AvatarWrapperProps)) : /*#__PURE__*/_jsx(UITooltip, {
          title: toolTipName,
          placement: toolTipPlacement,
          children: /*#__PURE__*/_jsx(AvatarWrapper, Object.assign({}, AvatarWrapperProps))
        });
      }

      return /*#__PURE__*/_jsx(AvatarWrapperOverlay, Object.assign({}, AvatarWrapperProps));
    }
  }, {
    key: "tryToGetANameOutOfEmailAddress",
    value: function tryToGetANameOutOfEmailAddress(aString) {
      if (!aString || !aString.indexOf('@')) {
        return aString;
      }

      return aString.split('_').join(' ');
    }
  }, {
    key: "isLatinCharacters",
    value: function isLatinCharacters(aString) {
      var nonLatin = /[^\u0020-\u01BF]/;
      return nonLatin.test(aString);
    }
  }, {
    key: "displayNameToInitials",
    value: function displayNameToInitials(aString, passed) {
      var _this$props = this.props,
          displayName = _this$props.displayName,
          _isHasMore = _this$props._isHasMore,
          _isListReversed = _this$props._isListReversed,
          size = _this$props.size,
          type = _this$props.type;

      if (passed || !aString || typeof aString !== 'string') {
        return /*#__PURE__*/_jsx(SVGImage, Object.assign({}, {
          size: size,
          _isListReversed: _isListReversed,
          src: this.getDefaultAvatar(AVATAR_TYPES[type])
        }));
      }

      if (!aString || this.isLatinCharacters(aString) && !passed) {
        return this.displayNameToInitials(this.tryToGetANameOutOfEmailAddress(displayName), true);
      }

      var names = aString.split(' ');
      var initials = names[0].substring(0, 1);

      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1);
      }

      return /*#__PURE__*/_jsx(SVGText, {
        wrapperProps: {
          _isHasMore: _isHasMore
        },
        y: "55",
        children: initials
      });
    }
  }, {
    key: "renderOverlay",
    value: function renderOverlay() {
      var _this3 = this;

      var _this$props2 = this.props,
          isHoverlay = _this$props2.isHoverlay,
          _isHoverlayOpen = _this$props2._isHoverlayOpen,
          size = _this$props2.size;
      var isRenderingOverlay = !!isHoverlay || !!_isHoverlayOpen;
      return isRenderingOverlay && /*#__PURE__*/_jsx(SVGIconEdit, {
        wrapperProps: {
          onMouseEnter: function onMouseEnter() {
            return _this3.handleMouseEnter();
          },
          onClick: function onClick() {},
          size: size
        },
        size: AVATAR_SIZES[size]
      });
    }
  }, {
    key: "renderAvatarImageOrText",
    value: function renderAvatarImageOrText() {
      var _this$props3 = this.props,
          src = _this$props3.src,
          displayName = _this$props3.displayName,
          type = _this$props3.type,
          _isHasMore = _this$props3._isHasMore,
          size = _this$props3.size;

      if (src) {
        return /*#__PURE__*/_jsx(SVGImage, {
          size: size,
          src: src
        });
      }

      if (AVATAR_TYPES[type] === AVATAR_TYPES.company) {
        return /*#__PURE__*/_jsx(SVGImage, {
          size: size,
          src: this.getDefaultAvatar(AVATAR_TYPES.company)
        });
      }

      if (_isHasMore || AVATAR_TYPES[type] === AVATAR_TYPES.contact || AVATAR_TYPES[type] === AVATAR_TYPES.company) {
        return this.displayNameToInitials(displayName);
      }

      return /*#__PURE__*/_jsx(SVGIcon, {
        wrapperProps: {
          size: size
        },
        y: 65,
        icon: AVATAR_TYPE_ICONS[AVATAR_TYPES[type]]
      });
    }
  }, {
    key: "renderSocialBadge",
    value: function renderSocialBadge(socialNetwork) {
      if (!socialNetwork) {
        return undefined;
      }

      return /*#__PURE__*/_jsx(SocialBadge, {
        socialNetwork: socialNetwork
      });
    }
  }, {
    key: "renderContentAndOverlay",
    value: function renderContentAndOverlay() {
      var _this$props4 = this.props,
          href = _this$props4.href,
          _isListReversed = _this$props4._isListReversed,
          size = _this$props4.size,
          type = _this$props4.type;
      return /*#__PURE__*/_jsxs(AvatarContentHolder, {
        _isListReversed: _isListReversed,
        size: size,
        href: href,
        type: type,
        children: [this.renderAvatarImageOrText(), this.renderOverlay()]
      });
    }
  }, {
    key: "renderAvatarContent",
    value: function renderAvatarContent(SwitchComponent, props, socialNetwork) {
      return /*#__PURE__*/_jsxs(SwitchComponent, Object.assign({}, props, {
        children: [this.renderContentAndOverlay(), this.renderSocialBadge(socialNetwork)]
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var MaybeAvatarHover = this.MaybeAvatarHover,
          props = this.props;
      var _isHasTooltip = props._isHasTooltip,
          _isHasMore = props._isHasMore,
          _isHoverlayOpen = props._isHoverlayOpen,
          _isListReversed = props._isListReversed,
          _toolTipOverWrite = props._toolTipOverWrite,
          className = props.className,
          children = props.children,
          displayName = props.displayName,
          isHoverlay = props.isHoverlay,
          onClick = props.onClick,
          size = props.size,
          socialNetwork = props.socialNetwork,
          style = props.style,
          textSpacing = props.textSpacing,
          truncateLength = props.truncateLength,
          toolTipPlacement = props.toolTipPlacement;
      var maybeWrapperProps = {
        _isHasTooltip: _isHasTooltip,
        _isHasMore: _isHasMore,
        _isHoverlayOpen: _isHoverlayOpen,
        _isListReversed: _isListReversed,
        _isTooltipLoaded: this.state.isTooltipLoaded,
        className: className,
        outerChildren: children,
        displayName: displayName,
        isHoverlay: isHoverlay,
        onClick: onClick,
        size: AVATAR_SIZES[size],
        style: style,
        toolTipName: _toolTipOverWrite || displayName,
        toolTipPlacement: toolTipPlacement
      };
      var avatarComponent = this.renderAvatarContent(MaybeAvatarHover, maybeWrapperProps, socialNetwork);
      return children ? /*#__PURE__*/_jsx(UITruncateString, {
        onClick: onClick,
        maxWidth: truncateLength,
        children: /*#__PURE__*/_jsxs("span", {
          className: "align-center",
          children: [avatarComponent, /*#__PURE__*/_jsx("span", {
            className: "m-left-" + textSpacing,
            children: children
          })]
        })
      }) : avatarComponent;
    }
  }]);

  return UIAvatarDisplay;
}(Component);

UIAvatarDisplay.propTypes = {
  _isHasMore: PropTypes.bool,
  _isHasTooltip: PropTypes.bool,
  _isHoverlayOpen: PropTypes.bool,
  _isListReversed: PropTypes.bool,
  _toolTipOverWrite: PropTypes.string,
  className: PropTypes.string,
  displayName: PropTypes.any,
  href: PropTypes.string,
  isHoverlay: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(Object.keys(AVATAR_SIZES)),
  socialNetwork: PropTypes.oneOf(Object.keys(SOCIAL_MAP)),
  src: SVGImage.propTypes.image,
  type: PropTypes.oneOf(Object.keys(AVATAR_TYPES)),
  textSpacing: PropTypes.number,
  truncateLength: PropTypes.number,
  toolTipPlacement: PropTypes.string
};
UIAvatarDisplay.defaultProps = {
  _isHasMore: false,
  _isHasTooltip: true,
  _isListReversed: false,
  _isHoverLayOpen: false,
  size: 'sm',
  textSpacing: 3,
  truncateLength: 200
};
export default UIAvatarDisplay;