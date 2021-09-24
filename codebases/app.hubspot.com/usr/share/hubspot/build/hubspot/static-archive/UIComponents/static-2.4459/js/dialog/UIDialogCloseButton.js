'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled, { css } from 'styled-components';
import { MODAL_CLOSE_BUTTON_OFFSET } from 'HubStyleTokens/sizes';
import { rgba } from '../core/Color';
import HoverProvider from '../providers/HoverProvider';
import { MONOLITH, OLAF } from 'HubStyleTokens/colors';
import UICloseButton from '../button/UICloseButton';
var getOffset = css(["right:40px;top:40px;"]);

var getDetachedStyle = function getDetachedStyle(hovered, size) {
  return css(["@media only screen and (min-width:50em){color:", ";position:absolute;", ";&::after{background:", ";}}"], hovered && MONOLITH, size === 'xl' && getOffset, rgba(OLAF, 0.1));
};

var CloseButton = styled(function (props) {
  var __detached = props.detached,
      rest = _objectWithoutProperties(props, ["detached"]);

  return /*#__PURE__*/_jsx(UICloseButton, Object.assign({}, rest));
}).withConfig({
  displayName: "UIDialogCloseButton__CloseButton",
  componentId: "sc-1j3srlw-0"
})(["top:", ";", ";"], MODAL_CLOSE_BUTTON_OFFSET, function (props) {
  return props.detached && getDetachedStyle(props.hovered, props.size);
});
export default function UIDialogCloseButton(props) {
  var className = props.className,
      detached = props.detached,
      size = props.size,
      rest = _objectWithoutProperties(props, ["className", "detached", "size"]);

  var computedSize = detached && size == null ? 'xl' : size;
  return /*#__PURE__*/_jsx(HoverProvider, Object.assign({}, props, {
    children: function children(hoverProviderProps) {
      return /*#__PURE__*/_jsx(CloseButton, Object.assign({
        className: classNames("uiDialog-closeButton private-modal__control private-modal__close", className)
      }, rest, {}, hoverProviderProps, {
        detached: detached,
        size: computedSize
      }));
    }
  }));
}
UIDialogCloseButton.propTypes = {
  detached: PropTypes.bool.isRequired,
  size: UICloseButton.propTypes.size
};
UIDialogCloseButton.defaultProps = {
  detached: false
};
UIDialogCloseButton.displayName = 'UIDialogCloseButton';