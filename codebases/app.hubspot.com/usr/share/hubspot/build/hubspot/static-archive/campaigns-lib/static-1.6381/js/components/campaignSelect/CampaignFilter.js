'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import CampaignSelect from 'campaigns-lib/components/CampaignSelect';
import UIInlineLabel from 'UIComponents/form/UIInlineLabel';

function CampaignFilter(_ref) {
  var hasCampaignsReadAccess = _ref.hasCampaignsReadAccess,
      value = _ref.value,
      onChange = _ref.onChange,
      _ref$showLabel = _ref.showLabel,
      showLabel = _ref$showLabel === void 0 ? false : _ref$showLabel,
      rest = _objectWithoutProperties(_ref, ["hasCampaignsReadAccess", "value", "onChange", "showLabel"]);

  if (!hasCampaignsReadAccess) {
    return null;
  }

  var campaignSelect = /*#__PURE__*/_jsx(CampaignSelect, Object.assign({
    onChange: onChange,
    placeholder: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "campaignSelect.allCampaigns"
    }),
    value: value,
    menuWidth: 300,
    buttonUse: "transparent",
    className: "p-x-0"
  }, rest));

  if (showLabel) {
    return /*#__PURE__*/_jsx(UIInlineLabel, {
      label: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "campaignSelect.dashboardLabel"
      }),
      children: campaignSelect
    });
  }

  return campaignSelect;
}

CampaignFilter.propTypes = {
  hasCampaignsReadAccess: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  showLabel: PropTypes.bool
};
export default CampaignFilter;