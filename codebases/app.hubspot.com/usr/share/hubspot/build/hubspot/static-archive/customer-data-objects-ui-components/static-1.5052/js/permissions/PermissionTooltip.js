'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import BasePermissionTooltip from 'customer-data-ui-utilities/tooltips/permission/BasePermissionTooltip';

var PermissionTooltip = function PermissionTooltip(props) {
  var tooltipKey = props.tooltipKey,
      tooltipOptions = props.tooltipOptions,
      showEnableLang = props.showEnableLang,
      rest = _objectWithoutProperties(props, ["tooltipKey", "tooltipOptions", "showEnableLang"]);

  var title = I18n.text("customerDataObjectsUiComponents.Permissions." + tooltipKey, tooltipOptions);
  return /*#__PURE__*/_jsx(BasePermissionTooltip, Object.assign({}, rest, {
    title: title,
    showCta: showEnableLang,
    children: props.children
  }));
};

PermissionTooltip.propTypes = {
  tooltipKey: PropTypes.string.isRequired,
  tooltipOptions: PropTypes.object,
  showEnableLang: PropTypes.bool,
  children: PropTypes.node
};
PermissionTooltip.defaultProps = {
  tooltipKey: 'generic.unknown',
  tooltipOptions: {},
  showEnableLang: true
};
export default PermissionTooltip;