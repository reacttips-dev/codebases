'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import UIAvatarMultiOrSingle from './UIAvatarMultiOrSingle';
import devLogger from 'react-utils/devLogger';
import { AVATAR_SIZES } from './Constants';
var avatarSizeBackwardsCompat = {
  'extra-small': 'xs',
  small: 'sm',
  medium: 'md',
  large: 'lg',
  'extra-large': 'xl'
}; // This file is now just going to absorb the API changes from v1 to
// v2 so we can be waaaay cleaner down the line

var UIAvatar = /*#__PURE__*/function (_Component) {
  _inherits(UIAvatar, _Component);

  function UIAvatar() {
    _classCallCheck(this, UIAvatar);

    return _possibleConstructorReturn(this, _getPrototypeOf(UIAvatar).apply(this, arguments));
  }

  _createClass(UIAvatar, [{
    key: "companyWithWarning",
    value: function companyWithWarning(company) {
      if (company) {
        devLogger.warn({
          message: 'there is no company prop, maybe you mean domain or companyId'
        });
      }
    }
  }, {
    key: "sizeWithWarning",
    value: function sizeWithWarning(size) {
      var checkedAvatarSize = avatarSizeBackwardsCompat[size];

      if (checkedAvatarSize) {
        devLogger.warn({
          message: 'Old size prop values are supplied, please use 2 letter sizes instead'
        });
        return checkedAvatarSize;
      }

      return size;
    }
  }, {
    key: "lookupWithWarning",
    value: function lookupWithWarning(lookup, lookups, avatarLookup) {
      var oldLookup = lookups || avatarLookup;

      if (oldLookup) {
        devLogger.warn({
          message: 'lookups and avatarLook up deprecated props, please just use lookup'
        });
        return lookup || oldLookup;
      }

      return lookup;
    }
  }, {
    key: "hubSpotUserEmailWithWarning",
    value: function hubSpotUserEmailWithWarning(hubSpotUserEmail, hubspotUserEmail) {
      if (hubspotUserEmail) {
        devLogger.warn({
          message: 'I think you meant hubSpotUserEmail (S vs s)'
        });
      }

      return hubSpotUserEmail || hubspotUserEmail;
    }
  }, {
    key: "maxAvatarsWithWarning",
    value: function maxAvatarsWithWarning(maxAvatars, totalNumOfAvatars) {
      if (totalNumOfAvatars) {
        devLogger.warn({
          message: 'totalNumOfAvatars is deprecated, please use maxAvatars instead'
        });
        return maxAvatars || totalNumOfAvatars;
      }

      return maxAvatars;
    }
  }, {
    key: "catchWeirdProps",
    value: function catchWeirdProps() {
      var _this$props = this.props,
          _isHoverlayOpen = _this$props._isHoverlayOpen,
          _isHasTooltip = _this$props._isHasTooltip,
          _toolTipOverWrite = _this$props._toolTipOverWrite,
          _noDefaultSrc = _this$props._noDefaultSrc,
          _truncateAvatarListInTooltip = _this$props._truncateAvatarListInTooltip,
          avatarLookup = _this$props.avatarLookup,
          avatarType = _this$props.avatarType,
          childClassName = _this$props.childClassName,
          children = _this$props.children,
          childStyles = _this$props.childStyles,
          className = _this$props.className,
          companyId = _this$props.companyId,
          displayName = _this$props.displayName,
          company = _this$props.company,
          domain = _this$props.domain,
          email = _this$props.email,
          existsInPortal = _this$props.existsInPortal,
          fetchAvatars = _this$props.fetchAvatars,
          fileManagerKey = _this$props.fileManagerKey,
          hasMoreHref = _this$props.hasMoreHref,
          href = _this$props.href,
          hubspotUserEmail = _this$props.hubspotUserEmail,
          hubSpotUserEmail = _this$props.hubSpotUserEmail,
          isHoverlay = _this$props.isHoverlay,
          lookup = _this$props.lookup,
          lookups = _this$props.lookups,
          maxAvatars = _this$props.maxAvatars,
          onClick = _this$props.onClick,
          productId = _this$props.productId,
          portalId = _this$props.portalId,
          size = _this$props.size,
          socialNetwork = _this$props.socialNetwork,
          src = _this$props.src,
          style = _this$props.style,
          toolTipPlacement = _this$props.toolTipPlacement,
          totalNumOfAvatars = _this$props.totalNumOfAvatars,
          type = _this$props.type,
          textSpacing = _this$props.textSpacing,
          truncateLength = _this$props.truncateLength,
          vid = _this$props.vid; // avatarRenderer
      // backgroundcolor
      // color
      // name …only social is using UIAvatarIcon and that's depricated now.
      // https://private.hubteamqa.com/opengrok/search?q=%22%3CUIAvatarIcon%22&defs=&refs=&path=&hist=&type=&project=all
      // Shape
      // Warnings
      // size needs to be
      // lookups
      // avatarLookup

      return {
        _isHoverlayOpen: _isHoverlayOpen,
        _isHasTooltip: _isHasTooltip,
        _toolTipOverWrite: _toolTipOverWrite,
        _noDefaultSrc: _noDefaultSrc,
        _truncateAvatarListInTooltip: _truncateAvatarListInTooltip,
        childClassName: childClassName,
        children: children,
        childStyles: childStyles,
        className: className,
        company: this.companyWithWarning(company),
        companyId: companyId,
        displayName: displayName,
        domain: domain,
        email: email,
        existsInPortal: existsInPortal,
        fetchAvatars: fetchAvatars,
        fileManagerKey: fileManagerKey,
        hasMoreHref: hasMoreHref,
        href: href,
        hubSpotUserEmail: this.hubSpotUserEmailWithWarning(hubSpotUserEmail, hubspotUserEmail),
        isHoverlay: isHoverlay,
        lookup: this.lookupWithWarning(lookup, lookups, avatarLookup),
        maxAvatars: maxAvatars || totalNumOfAvatars,
        onClick: onClick,
        productId: productId,
        portalId: portalId,
        size: this.sizeWithWarning(size),
        socialNetwork: socialNetwork,
        src: src,
        style: style,
        type: type || avatarType,
        textSpacing: textSpacing,
        truncateLength: truncateLength,
        vid: vid,
        toolTipPlacement: toolTipPlacement
      };
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx(UIAvatarMultiOrSingle, Object.assign({}, this.catchWeirdProps(this.props)));
    }
  }]);

  return UIAvatar;
}(Component);

UIAvatar.propTypes = {
  lookups: PropTypes.any,
  avatarLookup: PropTypes.any,
  totalNumOfAvatars: PropTypes.number,
  avatarType: PropTypes.string,
  _truncateAvatarListInTooltip: PropTypes.bool,
  _isHoverlayOpen: PropTypes.bool,
  _isHasTooltip: PropTypes.bool,
  _toolTipOverWrite: PropTypes.bool,
  _noDefaultSrc: PropTypes.bool,
  authed: PropTypes.bool,
  childClassName: PropTypes.string,
  children: PropTypes.node,
  childStyles: PropTypes.object,
  className: PropTypes.string,
  company: PropTypes.string,
  companyId: PropTypes.number,
  displayName: PropTypes.string,
  domain: PropTypes.string,
  email: PropTypes.string,
  existsInPortal: PropTypes.bool,
  fetchAvatars: PropTypes.func,
  fileManagerKey: PropTypes.string,
  hasMoreHref: PropTypes.string,
  href: PropTypes.string,
  hubspotUserEmail: PropTypes.string,
  hubSpotUserEmail: PropTypes.string,
  isHoverlay: PropTypes.bool,
  lookup: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  maxAvatars: PropTypes.number,
  onClick: PropTypes.func,
  productId: PropTypes.number,
  portalId: PropTypes.number,
  size: PropTypes.oneOf(Object.keys(AVATAR_SIZES)),
  socialNetwork: PropTypes.string,
  src: PropTypes.string,
  style: PropTypes.object,
  toolTipPlacement: PropTypes.string,
  type: PropTypes.string,
  textSpacing: PropTypes.number,
  truncateLength: PropTypes.number,
  vid: PropTypes.number
};
UIAvatar.displayName = 'UIAvatar';
export default UIAvatar;
export var WEBPACK_3_FORCE_MODULE_IMPORT = 1;