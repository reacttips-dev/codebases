'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H2 from 'UIComponents/elements/headings/H2';
import UIButton from 'UIComponents/button/UIButton';
import UICopyButton from 'UIComponents/button/UICopyButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UITextInput from 'UIComponents/input/UITextInput';
import UIModal from 'UIComponents/dialog/UIModal';

var ShareTranscriptModal = function ShareTranscriptModal(props) {
  var transcriptUrl = props.transcriptUrl,
      onClose = props.onClose;

  var renderHeader = function renderHeader() {
    return /*#__PURE__*/_jsxs(UIDialogHeader, {
      children: [/*#__PURE__*/_jsx(H2, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "shareTranscriptModal.title"
        })
      }), /*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: onClose
      })]
    });
  };

  var renderBody = function renderBody() {
    return /*#__PURE__*/_jsxs(UIDialogBody, {
      children: [/*#__PURE__*/_jsx("p", {
        className: "m-bottom-6",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "shareTranscriptModal.body"
        })
      }), /*#__PURE__*/_jsx(UITextInput, {
        className: "m-bottom-3",
        name: "transcript-url",
        "data-unit-test": "transcriptUrl",
        "data-acceptance-test": "transcriptUrl",
        defaultValue: transcriptUrl
      })]
    });
  };

  var renderFooter = function renderFooter() {
    return /*#__PURE__*/_jsxs(UIDialogFooter, {
      children: [/*#__PURE__*/_jsx(UICopyButton, {
        value: transcriptUrl,
        use: "primary",
        "data-unit-test": "copyLink",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "shareTranscriptModal.copyLink"
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        onClick: onClose,
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "shareTranscriptModal.close"
        })
      })]
    });
  };

  return /*#__PURE__*/_jsx(Fragment, {
    children: /*#__PURE__*/_jsxs(UIModal, {
      "data-acceptance-test": "sharingModal",
      children: [renderHeader(), renderBody(), renderFooter()]
    })
  });
};

ShareTranscriptModal.props = {
  transcriptUrl: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};
export default ShareTranscriptModal;