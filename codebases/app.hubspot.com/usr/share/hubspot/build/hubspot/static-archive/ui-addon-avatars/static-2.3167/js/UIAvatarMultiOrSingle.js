'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import pickToolTipName from './UIAvatarDisplay/pickToolTipName';
import PropTypes from 'prop-types';
import { Component } from 'react';
import I18n from 'I18n';
import styled from 'styled-components';
import UIAvatarRequest from './UIAvatarRequest';
import { AVATAR_SIZES } from './Constants';
var AvatarListWrapper = styled('div').withConfig({
  displayName: "UIAvatarMultiOrSingle__AvatarListWrapper",
  componentId: "sc-1hxqwna-0"
})(["display:flex;flex-direction:row-reverse;justify-content:flex-end;"]);

var UIAvatarMultiOrSingle = /*#__PURE__*/function (_Component) {
  _inherits(UIAvatarMultiOrSingle, _Component);

  function UIAvatarMultiOrSingle() {
    _classCallCheck(this, UIAvatarMultiOrSingle);

    return _possibleConstructorReturn(this, _getPrototypeOf(UIAvatarMultiOrSingle).apply(this, arguments));
  }

  _createClass(UIAvatarMultiOrSingle, [{
    key: "makeNumberAvatar",
    value: function makeNumberAvatar() {
      var _this$props = this.props,
          _truncateAvatarListInTooltip = _this$props._truncateAvatarListInTooltip,
          hasMoreHref = _this$props.hasMoreHref,
          lookup = _this$props.lookup,
          maxAvatars = _this$props.maxAvatars;
      var offsetMax = maxAvatars - 1;
      var remainingAvatarsNumber = lookup.length - offsetMax;
      var remainingAvatarsNumberLimit = remainingAvatarsNumber > 9 ? 9 : remainingAvatarsNumber;
      var remainingAvatars = lookup.slice(offsetMax, offsetMax + 9);
      var hasMoreAvatarDisplay = remainingAvatarsNumber ? '+' : '';
      var displayList = this.avatarsToDisplayList(remainingAvatars);

      if (_truncateAvatarListInTooltip && remainingAvatars.length < remainingAvatarsNumber) {
        // i18n-lint-disable-next-line require-i18n-message
        displayList = I18n.text('uiAddonAvatars.tooltip.hasMore', {
          list: displayList
        });
      }

      return {
        displayName: remainingAvatarsNumberLimit + " " + hasMoreAvatarDisplay,
        _isHasMore: true,
        href: hasMoreHref,
        _toolTipOverWrite: displayList
      };
    }
  }, {
    key: "avatarsToDisplayList",
    value: function avatarsToDisplayList(arrayOfObjects) {
      return arrayOfObjects.map(pickToolTipName).join(', ');
    }
  }, {
    key: "renderAvatarList",
    value: function renderAvatarList() {
      var _this = this;

      var _this$props2 = this.props,
          _hasMoreOverWrite = _this$props2._hasMoreOverWrite,
          childClassName = _this$props2.childClassName,
          childStyles = _this$props2.childStyles,
          className = _this$props2.className,
          lookup = _this$props2.lookup,
          maxAvatars = _this$props2.maxAvatars,
          portalId = _this$props2.portalId,
          fetchAvatars = _this$props2.fetchAvatars,
          size = _this$props2.size,
          toolTipPlacement = _this$props2.toolTipPlacement;
      var isHiddenAvatars = !!_hasMoreOverWrite || lookup.length > maxAvatars;
      var newLookupList = isHiddenAvatars ? lookup.slice(0, maxAvatars - 1) : lookup.slice(0);

      if (isHiddenAvatars) {
        newLookupList.push(this.makeNumberAvatar());
      }

      return /*#__PURE__*/_jsx(AvatarListWrapper, {
        className: className,
        children: newLookupList.reverse().map(function (lookupObj, i) {
          var avatarLookupWithReverse = Object.assign({
            className: childClassName,
            _isListReversed: true,
            portalId: portalId,
            fetchAvatars: fetchAvatars,
            size: size,
            style: childStyles,
            toolTipPlacement: toolTipPlacement
          }, lookupObj);
          return _this.renderSingleAvatar(avatarLookupWithReverse, i);
        })
      });
    }
  }, {
    key: "renderSingleAvatar",
    value: function renderSingleAvatar(props, key) {
      var companyId = props.companyId,
          displayName = props.displayName,
          domain = props.domain,
          email = props.email,
          existsInPortal = props.existsInPortal,
          fetchAvatars = props.fetchAvatars,
          fileManagerKey = props.fileManagerKey,
          hubSpotUserEmail = props.hubSpotUserEmail,
          lookup = props.lookup,
          primaryIdentifier = props.primaryIdentifier,
          secondaryIdentifier = props.secondaryIdentifier,
          socialNetwork = props.socialNetwork,
          src = props.src,
          type = props.type,
          vid = props.vid,
          rest = _objectWithoutProperties(props, ["companyId", "displayName", "domain", "email", "existsInPortal", "fetchAvatars", "fileManagerKey", "hubSpotUserEmail", "lookup", "primaryIdentifier", "secondaryIdentifier", "socialNetwork", "src", "type", "vid"]);

      var proxyLookup = lookup || {};
      return /*#__PURE__*/_jsx(UIAvatarRequest, Object.assign({}, Object.assign({
        companyId: companyId || proxyLookup.companyId,
        displayName: displayName || proxyLookup.displayName || email || proxyLookup.email || domain || proxyLookup.domain || secondaryIdentifier || proxyLookup.secondaryIdentifier || primaryIdentifier || proxyLookup.primaryIdentifier,
        domain: domain || proxyLookup.domain,
        email: email || proxyLookup.email,
        existsInPortal: existsInPortal || proxyLookup.existsInPortal,
        fetchAvatars: fetchAvatars,
        fileManagerKey: fileManagerKey || proxyLookup.fileManagerKey,
        hubSpotUserEmail: hubSpotUserEmail || proxyLookup.hubSpotUserEmail,
        key: key,
        primaryIdentifier: primaryIdentifier || proxyLookup.primaryIdentifier,
        socialNetwork: proxyLookup.socialNetwork || socialNetwork,
        secondaryIdentifier: secondaryIdentifier || proxyLookup.secondaryIdentifier,
        src: src || proxyLookup.src,
        type: type || proxyLookup.type,
        vid: vid || proxyLookup.vid
      }, rest)));
    }
  }, {
    key: "render",
    value: function render() {
      var lookup = this.props.lookup;

      if (lookup && Array.isArray(lookup)) {
        return this.renderAvatarList();
      }

      return this.renderSingleAvatar(this.props);
    }
  }]);

  return UIAvatarMultiOrSingle;
}(Component);

var PropTypeChildClassName = function PropTypeChildClassName(props, propName, componentName) {
  for (var _len = arguments.length, rest = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    rest[_key - 3] = arguments[_key];
  }

  PropTypes.string.apply(PropTypes, [props, propName, componentName].concat(rest));

  if (props[propName] && !Array.isArray(props.lookup)) {
    return new Error(componentName + ": " + propName + " is only applied when lookup is an array.");
  }

  return null;
};

var PropTypeChildStyles = function PropTypeChildStyles(props, propName, componentName) {
  for (var _len2 = arguments.length, rest = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
    rest[_key2 - 3] = arguments[_key2];
  }

  PropTypes.string.apply(PropTypes, [props, propName, componentName].concat(rest));

  if (props[propName] && !Array.isArray(props.lookup) && props.lookup.length > 1) {
    return new Error(componentName + ": " + propName + " is only applied when lookup is an array that can make children.");
  }

  return null;
};

var PropTypeMaxAvatars = function PropTypeMaxAvatars(props, propName, componentName) {
  if (props[propName] < 2) {
    return new Error(propName + " needs to be at least 2 in " + componentName + ".");
  }

  return null;
};

var PropTypeHasMoreHref = function PropTypeHasMoreHref(props, propName, componentName) {
  if (props[propName] && !props.maxAvatars) {
    return new Error(propName + " will only work if maxAvatars is set in " + componentName);
  }

  return null;
};

UIAvatarMultiOrSingle.propTypes = Object.assign({}, UIAvatarRequest.propTypes, {
  _truncateAvatarListInTooltip: PropTypes.bool,
  childClassName: PropTypeChildClassName,
  childStyles: PropTypeChildStyles,
  className: PropTypes.string,
  fetchAvatars: PropTypes.func,
  hasMoreHref: PropTypeHasMoreHref,
  lookup: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  maxAvatars: PropTypeMaxAvatars,
  portalId: PropTypes.number,
  size: PropTypes.oneOf(Object.keys(AVATAR_SIZES))
});
export default UIAvatarMultiOrSingle;