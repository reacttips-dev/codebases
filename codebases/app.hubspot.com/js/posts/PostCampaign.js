'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import CampaignModal from '../components/broadcast/CampaignModal';
import I18n from 'I18n';
import PortalIdParser from 'PortalIdParser';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import UIButton from 'UIComponents/button/UIButton';
import UIDescriptionList from 'UIComponents/list/UIDescriptionList';
import { reportingPostProp } from '../lib/propTypes';
import { useSelector } from 'react-redux';
import { getUserIsPublisher, getCampaignsEnabled, getCampaignsWriteEnabled } from '../redux/selectors/user';
import { BROADCAST_STATUS_TYPE, CAMPAIGN_EDIT_MODES } from '../lib/constants';

function PostCampaign(_ref) {
  var reportingPost = _ref.reportingPost,
      updatePostsCampaign = _ref.updatePostsCampaign;
  var userIsPublisher = useSelector(getUserIsPublisher);
  var hasCampaignsReadAccess = useSelector(getCampaignsEnabled);
  var hasCampaignsWriteAccess = useSelector(getCampaignsWriteEnabled);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      campaignModalOpen = _useState2[0],
      setCampaignModalOpen = _useState2[1];

  var campaignGuid = reportingPost.campaignGuid,
      campaignName = reportingPost.campaignName;
  var canManageCampaign = hasCampaignsReadAccess && userIsPublisher;
  var editMode = campaignGuid ? CAMPAIGN_EDIT_MODES.edit : CAMPAIGN_EDIT_MODES.add;
  var portalId = PortalIdParser.get();
  var handleSubmit = useCallback(function (newCampaignGuid) {
    updatePostsCampaign([reportingPost.id], newCampaignGuid);
    setCampaignModalOpen(false);
  }, [reportingPost, updatePostsCampaign]);
  var handleOpen = useCallback(function () {
    setCampaignModalOpen(true);
  }, []);
  var handleClose = useCallback(function () {
    setCampaignModalOpen(false);
  }, []);
  return /*#__PURE__*/_jsxs(UIDescriptionList, {
    className: "broadcast-details-campaign",
    children: [/*#__PURE__*/_jsx("dt", {
      children: I18n.text('sui.details.campaign.label')
    }), /*#__PURE__*/_jsxs("dd", {
      children: [campaignGuid ? /*#__PURE__*/_jsx(UIButton, {
        external: true,
        href: "/campaigns/" + portalId + "/" + campaignGuid,
        target: "_blank",
        use: "link",
        children: campaignName
      }) : /*#__PURE__*/_jsx("span", {
        className: "m-right-4",
        children: I18n.text('sui.details.campaign.none')
      }), canManageCampaign && /*#__PURE__*/_jsx(UIButton, {
        onClick: handleOpen,
        use: "tertiary-light",
        size: "small",
        children: I18n.text("sui.details.campaign." + editMode)
      }), campaignModalOpen && /*#__PURE__*/_jsx(CampaignModal, {
        broadcastStatusType: BROADCAST_STATUS_TYPE.published,
        campaignGuid: campaignGuid,
        mode: editMode,
        onSubmit: handleSubmit,
        onClose: handleClose,
        hasCampaignsReadAccess: hasCampaignsReadAccess,
        hasCampaignsWriteAccess: hasCampaignsWriteAccess
      })]
    })]
  });
}

PostCampaign.propTypes = {
  reportingPost: reportingPostProp,
  updatePostsCampaign: PropTypes.func
};
export default PostCampaign;