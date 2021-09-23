'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { hidden } from '../utils/propTypes/decorators';
import { getComponentPropType } from '../utils/propTypes/componentProp';
import { getIconNamePropType } from '../utils/propTypes/iconName';
import { rgba } from '../core/Color';
import HoverProvider from '../providers/HoverProvider';
import { setUiTransition } from '../utils/Styles';
import { OLAF } from 'HubStyleTokens/colors';
import { MERCURY_LAYER, MODAL_CLOSE_BUTTON_SIZE } from 'HubStyleTokens/sizes';
import UIClickable from '../button/UIClickable';
import UIIconHolder from '../icon/UIIconHolder';
var DialogButton = styled(function (_ref) {
  var __hovered = _ref.hovered,
      rest = _objectWithoutProperties(_ref, ["hovered"]);

  return /*#__PURE__*/_jsx(UIClickable, Object.assign({}, rest));
}).attrs({
  className: 'private-modal__control'
}).withConfig({
  displayName: "UIDialogButton__DialogButton",
  componentId: "sc-1w1gzf1-0"
})(["", ";align-items:center;color:", ";display:flex;flex-shrink:0;justify-content:center;height:", ";line-height:normal;position:relative;width:", ";z-index:", ";&::after{", ";background:", ";border-radius:100%;content:' ';left:50%;padding:20px;position:absolute;top:50%;transform:translate(-50%,-50%);}&[aria-disabled='true']{cursor:not-allowed;opacity:0.6;}"], setUiTransition('color'), OLAF, MODAL_CLOSE_BUTTON_SIZE, MODAL_CLOSE_BUTTON_SIZE, MERCURY_LAYER, setUiTransition('background'), function (props) {
  return props.hovered && rgba(OLAF, 0.1);
}); // fix for IE11 misaligning icons when using UIIconHolder:
// https://git.hubteam.com/HubSpot/UIComponents/issues/5105

var ICON_STYLES = {
  marginLeft: 'auto',
  marginRight: 'auto'
};
export default function UIDialogButton(props) {
  var IconHolder = props.IconHolder,
      iconName = props.iconName,
      iconSize = props.iconSize,
      rest = _objectWithoutProperties(props, ["IconHolder", "iconName", "iconSize"]);

  return /*#__PURE__*/_jsx(HoverProvider, Object.assign({}, props, {
    children: function children(hoverProviderProps) {
      return /*#__PURE__*/_jsx(DialogButton, Object.assign({}, rest, {}, hoverProviderProps, {
        children: /*#__PURE__*/_jsx(IconHolder, {
          innerStyles: ICON_STYLES,
          name: iconName,
          padding: 0,
          size: iconSize
        })
      }));
    }
  }));
}
UIDialogButton.propTypes = {
  'aria-label': PropTypes.string.isRequired,
  hovered: hidden(PropTypes.bool),
  IconHolder: getComponentPropType(UIIconHolder),
  iconName: getIconNamePropType(),
  iconSize: UIIconHolder.propTypes.size
};
UIDialogButton.defaultProps = {
  IconHolder: UIIconHolder,
  iconSize: 'xxs'
};
UIDialogButton.displayName = 'UIDialogButton';