'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import I18n from 'I18n';
import UIAlert from 'UIComponents/alert/UIAlert';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIButton from 'UIComponents/button/UIButton';
import { BROADCAST_STATUS_TYPE, CAMPAIGN_EDIT_MODES } from '../../lib/constants';
import { broadcastStatusTypeProp } from '../../lib/propTypes';
import H2 from 'UIComponents/elements/headings/H2';
import CampaignSelectFormControl from 'campaigns-lib/components/campaignSelect/CampaignSelectFormControl';

var CampaignModal = /*#__PURE__*/function (_Component) {
  _inherits(CampaignModal, _Component);

  function CampaignModal() {
    var _this;

    _classCallCheck(this, CampaignModal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CampaignModal).call(this));

    _this.onChange = function (e, campaign) {
      _this.setState({
        campaignGuid: e.target.value,
        selectedCampaign: campaign
      });
    };

    _this.state = {
      campaignGuid: null,
      selectedCampaign: null
    };
    return _this;
  }

  _createClass(CampaignModal, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      this.setState({
        campaignGuid: this.props.campaignGuid
      });
    }
  }, {
    key: "renderWarning",
    value: function renderWarning() {
      if (this.props.broadcastStatusType !== BROADCAST_STATUS_TYPE.published) {
        return null;
      }

      return /*#__PURE__*/_jsx(UIAlert, {
        className: "m-top-4",
        type: this.props.mode === CAMPAIGN_EDIT_MODES.edit ? 'warning' : 'info',
        titleText: I18n.text("sui.broadcasts.editCampaign.warning." + this.props.mode + ".heading"),
        children: I18n.text("sui.broadcasts.editCampaign.warning." + this.props.mode + ".blurb")
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return /*#__PURE__*/_jsxs(UIModal, {
        className: "broadcast-campaign-modal",
        children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
          children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: this.props.onClose
          }), /*#__PURE__*/_jsx(H2, {
            children: I18n.text('sui.broadcasts.editCampaign.heading')
          })]
        }), /*#__PURE__*/_jsxs(UIDialogBody, {
          children: [/*#__PURE__*/_jsx(CampaignSelectFormControl, {
            assetObjectType: "SOCIAL_BROADCAST",
            hasCampaignsReadAccess: this.props.hasCampaignsReadAccess,
            hasCampaignsWriteAccess: this.props.hasCampaignsWriteAccess,
            onChange: this.onChange,
            value: this.state.campaignGuid
          }), this.renderWarning()]
        }), /*#__PURE__*/_jsxs(UIDialogFooter, {
          children: [/*#__PURE__*/_jsx(UIButton, {
            use: "primary",
            onClick: function onClick() {
              _this2.props.onSubmit(_this2.state.campaignGuid, _this2.state.selectedCampaign);
            },
            children: I18n.text('sui.broadcasts.editCampaign.buttonText')
          }), /*#__PURE__*/_jsx(UIButton, {
            use: "tertiary-light",
            onClick: this.props.onClose,
            children: I18n.text('sui.broadcasts.editCampaign.cancel')
          })]
        })]
      });
    }
  }]);

  return CampaignModal;
}(Component);

CampaignModal.propTypes = {
  mode: PropTypes.oneOf(Object.keys(CAMPAIGN_EDIT_MODES)).isRequired,
  campaignGuid: PropTypes.string,
  broadcastStatusType: broadcastStatusTypeProp,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  hasCampaignsReadAccess: PropTypes.bool.isRequired,
  hasCampaignsWriteAccess: PropTypes.bool.isRequired
};
CampaignModal.defaultProps = {
  mode: CAMPAIGN_EDIT_MODES.add
};
export { CampaignModal as default };