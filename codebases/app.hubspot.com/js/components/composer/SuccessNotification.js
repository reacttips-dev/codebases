'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UIList from 'UIComponents/list/UIList';
import { broadcastGroupProp } from '../../lib/propTypes';
import { ACCOUNT_TYPES, BROADCAST_PUBLISH_TYPE } from '../../lib/constants';

var SuccessNotification = function SuccessNotification(props) {
  var broadcastGroup = props.broadcastGroup; // IG video doesn't have to process, so exempt it from this messaging.

  var hasVideo = broadcastGroup.messages.some(function (m) {
    return m.isVideo() && m.network !== ACCOUNT_TYPES.instagram;
  });
  return /*#__PURE__*/_jsxs("div", {
    className: "compose-success",
    children: [/*#__PURE__*/_jsx("p", {
      className: "blurb",
      children: I18n.text("sui.composer.success.blurb." + broadcastGroup.getPublishType(), {
        count: broadcastGroup.getNonEmptyMessages().size
      })
    }), broadcastGroup.getPublishType() === BROADCAST_PUBLISH_TYPE.schedule && /*#__PURE__*/_jsx(UIList, {
      className: "compose-success",
      children: broadcastGroup.messages.toArray().map(function (b) {
        return b.getSummaryText();
      })
    }), hasVideo && /*#__PURE__*/_jsx("p", {
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "sui.composer.success.video.processingBlurb"
      })
    })]
  });
};

SuccessNotification.propTypes = {
  broadcastGroup: broadcastGroupProp
};
export default SuccessNotification;