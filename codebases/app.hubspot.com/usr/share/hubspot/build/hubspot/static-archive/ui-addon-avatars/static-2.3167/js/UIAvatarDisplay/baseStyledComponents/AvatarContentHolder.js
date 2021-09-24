'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { OLAF } from 'HubStyleTokens/colors';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import UIButton from 'UIComponents/button/UIButton';
import { AVATAR_SIZES, AVATAR_TYPES } from '../../Constants';
var ContentHolder = styled('div').withConfig({
  displayName: "AvatarContentHolder__ContentHolder",
  componentId: "n7cwf4-0"
})(["align-items:center;border-radius:", ";box-sizing:border-box;color:", ";display:flex;font-size:initial;", " height:", ";overflow:hidden;position:relative;width:", ";"], function (props) {
  return AVATAR_TYPES[props.type] === AVATAR_TYPES.productId ? '3px' : '50%';
}, OLAF, function (props) {
  return props._isListReversed && "border: 2px solid " + OLAF + ";";
}, function (props) {
  return props.size && props.size !== AVATAR_SIZES.responsive ? AVATAR_SIZES[props.size] + "px" : 'inherit';
}, function (props) {
  return props.size && props.size !== AVATAR_SIZES.responsive ? AVATAR_SIZES[props.size] + "px" : '100%';
});

var AvatarContentHolder = function AvatarContentHolder(props) {
  var href = props.href,
      children = props.children,
      size = props.size,
      type = props.type,
      _isListReversed = props._isListReversed;
  var avatarWidth = size === AVATAR_SIZES.responsive ? '100%' : "$[size}";
  var avatarHeight = size === AVATAR_SIZES.responsive ? '' : "$[size}";

  if (href) {
    return /*#__PURE__*/_jsx(UIButton, {
      style: {
        width: avatarWidth,
        height: avatarHeight
      },
      use: "unstyled",
      href: href,
      children: /*#__PURE__*/_jsx(ContentHolder, {
        type: type,
        _isListReversed: _isListReversed,
        size: size,
        children: children
      })
    });
  }

  return /*#__PURE__*/_jsx(ContentHolder, {
    type: type,
    _isListReversed: _isListReversed,
    size: size,
    children: children
  });
};

AvatarContentHolder.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(AVATAR_SIZES)),
  type: PropTypes.oneOf(Object.keys(AVATAR_TYPES)),
  _isListReversed: PropTypes.bool
};
export default AvatarContentHolder;