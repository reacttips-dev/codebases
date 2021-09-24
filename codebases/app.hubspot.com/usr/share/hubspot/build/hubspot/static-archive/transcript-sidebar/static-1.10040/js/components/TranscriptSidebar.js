'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import ShareTranscriptModal from './ShareTranscriptModal';
import { useState, Fragment, memo, useRef, useEffect, useCallback } from 'react';
import I18n from 'I18n';
import UIModalIFrame from 'ui-addon-iframeable/host/UIModalIFrame';
import Raven from 'Raven';
import { parseQueryParams, getRootUrl } from '../utils/urls';
import { MSG_TYPE_MODAL_DIALOG_CLOSE } from 'ui-addon-iframeable/messaging/IFrameMessageTypes';
import { parseUrl } from 'hub-http/helpers/url';
import { MSG_TYPE_SHARE_TRANSCRIPT, MSG_TYPE_USAGE_TRACKING } from '../constants/CallTranscriptMessageTypes';
import { getFullUrl } from 'hubspot-url-utils';
import { BaseUrl } from '../constants/BaseUrl';

var handleError = function handleError(errorParams) {
  Raven.captureMessage('[trancript-sidebar-ui] On captured by the iframe', {
    extra: {
      errorParams: errorParams
    }
  });
};

var TranscriptSidebar = function TranscriptSidebar(props) {
  var engagementId = props.engagementId,
      width = props.width,
      onCloseSidebar = props.onCloseSidebar;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isShareModalVisible = _useState2[0],
      setIsShareModalVisible = _useState2[1];

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      sharingUrl = _useState4[0],
      setSharingUrl = _useState4[1];

  var _useState5 = useState(null),
      _useState6 = _slicedToArray(_useState5, 2),
      hostContext = _useState6[0],
      setHostContext = _useState6[1];

  var uiModalRef = useRef();

  var handleClose = function handleClose() {
    onCloseSidebar();
  };

  var handleOnMessage = useCallback(function (message) {
    var type = message.payload.type;

    if (type === MSG_TYPE_MODAL_DIALOG_CLOSE) {
      onCloseSidebar();
    }

    if (type === MSG_TYPE_SHARE_TRANSCRIPT) {
      var transcriptUrl = message.payload.transcriptUrl;
      setSharingUrl(transcriptUrl);
      setIsShareModalVisible(true);
    }
  }, [onCloseSidebar]);
  useEffect(function () {
    // TODO: Remove when https://git.hubteam.com/HubSpot/ui-addon-iframeable/issues/95 gets solved
    var fakeContext = {
      sendMessage: function sendMessage(type) {
        return handleOnMessage({
          payload: {
            type: type
          }
        });
      }
    };
    uiModalRef.current.hostContext = fakeContext;
    setHostContext(fakeContext);
  }, [handleOnMessage]);

  var handleOnReady = function handleOnReady(_hostContext) {
    if (!hostContext) {
      setHostContext(_hostContext);
    }
  };

  var handleCopyLink = function handleCopyLink() {
    if (hostContext) {
      hostContext.sendMessage(MSG_TYPE_USAGE_TRACKING, {
        eventName: 'shareTranscript',
        eventProps: {
          action: 'copy link'
        }
      });
    }
  };

  var handleCloseShareModal = function handleCloseShareModal() {
    setIsShareModalVisible(false);

    if (hostContext) {
      hostContext.sendMessage(MSG_TYPE_USAGE_TRACKING, {
        eventName: 'shareTranscript',
        eventProps: {
          action: 'close modal'
        }
      });
    }
  };

  var getTargetUrl = function getTargetUrl() {
    return "" + getFullUrl('app') + getRootUrl(BaseUrl);
  };

  var initialTime = +parseQueryParams(parseUrl(window.location.href).query).t;
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [/*#__PURE__*/_jsx(UIModalIFrame, {
      iframePassthruProps: {
        id: 'transcriptIframe',
        'data-acceptance-test': 'transcriptIframe'
      },
      "data-unit-test": "transcriptIframe",
      embeddedPassthruProps: {
        engagementId: engagementId,
        initialTime: initialTime
      },
      appName: "CRM-TranscriptSidebar",
      height: "100%",
      name: "transcript-sidebar",
      use: "panel",
      title: I18n.text('transcriptSidebar.title'),
      onClose: handleClose,
      onInitError: handleError,
      onMessage: handleOnMessage,
      onReady: handleOnReady,
      onReadyError: handleError,
      src: getTargetUrl(),
      scrolling: true,
      width: width || 720,
      ref: uiModalRef
    }), isShareModalVisible && /*#__PURE__*/_jsx(ShareTranscriptModal, {
      onClose: handleCloseShareModal,
      transcriptUrl: sharingUrl,
      onCopyLink: handleCopyLink
    })]
  });
};

TranscriptSidebar.propTypes = {
  engagementId: PropTypes.number.isRequired,
  onCloseSidebar: PropTypes.func.isRequired,
  width: PropTypes.number
};
TranscriptSidebar.defaultProps = {
  width: 720
};
export default /*#__PURE__*/memo(TranscriptSidebar);