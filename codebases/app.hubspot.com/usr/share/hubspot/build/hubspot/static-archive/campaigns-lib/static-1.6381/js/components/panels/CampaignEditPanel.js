'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import H2 from 'UIComponents/elements/headings/H2';
import UIPanel from 'UIComponents/panel/UIPanel';
import UIPanelHeader from 'UIComponents/panel/UIPanelHeader';
import { EDIT_PANEL_WIDTH } from 'campaigns-lib/constants/campaignEditPanel';
import AsyncCampaignEditPanelBody from './AsyncCampaignEditPanelBody';
export default function CampaignEditPanel(_ref) {
  var _ref$uiPanelProps = _ref.uiPanelProps,
      uiPanelProps = _ref$uiPanelProps === void 0 ? {} : _ref$uiPanelProps,
      props = _objectWithoutProperties(_ref, ["uiPanelProps"]);

  return /*#__PURE__*/_jsxs(UIPanel, Object.assign({
    width: EDIT_PANEL_WIDTH,
    "data-test-id": "campaign-" + props.use + "-panel"
  }, uiPanelProps, {
    children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
      onClick: props.onClose
    }), /*#__PURE__*/_jsx(UIPanelHeader, {
      children: /*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "campaignsLib.campaignEditPanel." + props.use + "Campaign"
        })
      })
    }), /*#__PURE__*/_jsx(AsyncCampaignEditPanelBody, Object.assign({}, props))]
  }));
}
CampaignEditPanel.propTypes = {
  campaign: PropTypes.object,
  use: PropTypes.oneOf(['create', 'update', 'clone']).isRequired,
  loading: PropTypes.bool,
  failed: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  uiPanelProps: PropTypes.object
};