'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import UITooltip from 'UIComponents/tooltip/UITooltip';
var propTypes = {
  children: PropTypes.node,
  showCta: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired
};
var defaultProps = {
  showCta: false
};

var BasePermissionTooltip = function BasePermissionTooltip(props) {
  var title = props.title,
      showCta = props.showCta,
      rest = _objectWithoutProperties(props, ["title", "showCta"]);

  var tooltipTitle = title;

  if (showCta) {
    tooltipTitle = title + " " + I18n.text('customerDataUiUtilities.PermissionTooltip.cta');
  }

  return /*#__PURE__*/_jsx(UITooltip, Object.assign({}, rest, {
    title: tooltipTitle,
    children: props.children
  }));
};

BasePermissionTooltip.propTypes = propTypes;
BasePermissionTooltip.defaultProps = defaultProps;
export default BasePermissionTooltip;