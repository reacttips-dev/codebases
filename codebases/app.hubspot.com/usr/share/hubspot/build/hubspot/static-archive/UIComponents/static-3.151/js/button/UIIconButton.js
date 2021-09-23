'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import UITooltip from '../tooltip/UITooltip';
import passthroughProps from '../utils/propTypes/passthroughProps';
import { toShorthandSize } from '../utils/propTypes/tshirtSize';
import omit from '../utils/underscore/omit';
import UIButton from './UIButton';
var Button = styled(UIButton).withConfig({
  displayName: "UIIconButton__Button",
  componentId: "sc-1gmthqs-0"
})(["&&&{padding-left:0;padding-right:0;text-align:center;text-overflow:clip;}&&{font-size:", ";width:", ";}"], function (_ref) {
  var size = _ref.size;
  if (size === 'xs') return '12px';
  if (size === 'sm') return '16px';
  return '18px';
}, function (_ref2) {
  var size = _ref2.size,
      use = _ref2.use;
  if (use === 'unstyled' || use.includes('link')) return 'auto';
  if (size === 'xs') return '26px';
  if (size === 'sm') return '32px';
  return '40px';
});

var UIIconButton = function UIIconButton(props) {
  var autoPlacement = props.autoPlacement,
      className = props.className,
      placement = props.placement,
      shape = props.shape,
      size = props.size,
      tooltip = props.tooltip,
      tooltipProps = props.tooltipProps,
      TooltipContent = props.TooltipContent,
      rest = _objectWithoutProperties(props, ["autoPlacement", "className", "placement", "shape", "size", "tooltip", "tooltipProps", "TooltipContent"]);

  return /*#__PURE__*/_jsx(UITooltip, Object.assign({
    autoPlacement: autoPlacement,
    Content: TooltipContent,
    title: tooltip,
    placement: placement
  }, tooltipProps, {
    children: /*#__PURE__*/_jsx(Button, Object.assign({}, rest, {
      className: classNames('private-button--icon-only', className, shape === 'circle' && 'private-button--circle'),
      responsive: false,
      size: toShorthandSize(size)
    }))
  }));
};

UIIconButton.propTypes = Object.assign({}, omit(UIButton.propTypes, ['block', 'responsive']), {
  autoPlacement: UITooltip.propTypes.autoPlacement,
  children: PropTypes.node,
  iconClassName: PropTypes.string,
  placement: UITooltip.propTypes.placement,
  shape: PropTypes.oneOf(['square', 'circle']),
  tooltip: UITooltip.propTypes.title,
  tooltipProps: passthroughProps(UITooltip),
  TooltipContent: UITooltip.propTypes.Content
});
UIIconButton.defaultProps = Object.assign({}, UIButton.defaultProps, {
  block: false,
  placement: UITooltip.defaultProps.placement,
  shape: 'square',
  use: 'tertiary-light'
});
UIIconButton.displayName = 'UIIconButton';
export default UIIconButton;