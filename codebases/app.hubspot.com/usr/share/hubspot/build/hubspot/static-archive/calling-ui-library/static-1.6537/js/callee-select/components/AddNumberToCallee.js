'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILink from 'UIComponents/link/UILink';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import ImmutablePropTypes from 'react-immutable-proptypes';
var AddNumberForCalleeWrapper = styled(UILink).withConfig({
  displayName: "AddNumberToCallee__AddNumberForCalleeWrapper",
  componentId: "sc-18v3dqf-0"
})(["font-size:13px;"]);

function AddNumberToCallee(_ref) {
  var onClick = _ref.onClick,
      editPermissions = _ref.editPermissions;
  var isLoadingPermissions = false;
  var canEdit = true;
  var tooltipKey = 'noAddPermissions';

  if (editPermissions) {
    isLoadingPermissions = editPermissions.get('isLoading');
    canEdit = editPermissions.get('canEdit');
    tooltipKey = isLoadingPermissions ? 'loadingPermissions' : tooltipKey;
  }

  return /*#__PURE__*/_jsx(UITooltip, {
    disabled: canEdit,
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "callee-selection.phoneNumberErrors." + tooltipKey
    }),
    children: /*#__PURE__*/_jsx(AddNumberForCalleeWrapper, {
      "data-selenium-test": "phone-property-button",
      className: "calling-phone-option align-center p-bottom-2 p-x-5",
      onClick: onClick,
      "data-enabled": !canEdit || isLoadingPermissions,
      disabled: !canEdit || isLoadingPermissions,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "callee-selection.phoneNumbers.addNewNumberProperty"
      })
    })
  });
}

AddNumberToCallee.propTypes = {
  onClick: PropTypes.func.isRequired,
  editPermissions: ImmutablePropTypes.map
};
AddNumberToCallee.defaultProps = {
  disabled: false
};
export default /*#__PURE__*/memo(AddNumberToCallee);