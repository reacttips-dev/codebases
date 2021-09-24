'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import SVGClose from 'visitor-ui-component-library-icons/icons/SVGClose';
import VizExIconButton from './VizExIconButton';
import VizExIcon from '../icon/VizExIcon';
import styled, { css, ThemeConsumer } from 'styled-components';
import themePropType from '../utils/themePropType';
import { TRANSPARENT_ON_BACKGROUND } from './constants/IconButtonUses';
import { CIRCLE } from './constants/IconButtonShapes';
import { EXTRA_SMALL, MEDIUM, SMALL } from '../constants/sizes';
import { setTransparentOnBackgroundIconButton } from './theme/iconButtonThemeOperators';
import { getCloseButtonColor } from './theme/closeButtonThemeOperators';
import { ICON_BUTTON_SIZE_TO_ICON_SIZE } from './constants/IconButtonSizeToIconSize';

var getMarginStyles = function getMarginStyles(_ref) {
  var size = _ref.size;

  switch (size) {
    case EXTRA_SMALL:
    case SMALL:
      return css(["margin-top:8px;margin-right:8px;"]);

    case MEDIUM:
    default:
      return css(["margin-top:12px;margin-right:12px;"]);
  }
};

export var ButtonContainer = styled(VizExIconButton).withConfig({
  displayName: "VizExCloseButton__ButtonContainer",
  componentId: "meuza3-0"
})(["right:0;position:absolute;top:0;", ""], getMarginStyles);

var VizExCloseButton = function VizExCloseButton(props) {
  var onClick = props.onClick,
      theme = props.theme,
      size = props.size,
      rest = _objectWithoutProperties(props, ["onClick", "theme", "size"]);

  return /*#__PURE__*/_jsx(ThemeConsumer, {
    children: function children(contextTheme) {
      return /*#__PURE__*/_jsx(ButtonContainer, Object.assign({}, rest, {
        onClick: onClick,
        theme: setTransparentOnBackgroundIconButton(getCloseButtonColor(theme || contextTheme), theme || contextTheme),
        use: TRANSPARENT_ON_BACKGROUND,
        shape: CIRCLE,
        size: size,
        children: /*#__PURE__*/_jsx(VizExIcon, {
          icon: /*#__PURE__*/_jsx(SVGClose, {}),
          size: ICON_BUTTON_SIZE_TO_ICON_SIZE[size]
        })
      }));
    }
  });
};

VizExCloseButton.displayName = 'VizExCloseButton';
VizExCloseButton.propTypes = {
  onClick: PropTypes.func,
  size: PropTypes.oneOf([EXTRA_SMALL, SMALL, MEDIUM]),
  theme: themePropType
};
export default VizExCloseButton;