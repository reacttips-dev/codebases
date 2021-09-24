'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { EditorState } from 'draft-js';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { EERIE } from 'HubStyleTokens/colors';
import UICloseButton from 'UIComponents/button/UICloseButton';
import H5 from 'UIComponents/elements/headings/H5';
import UIPopoverBody from 'UIComponents/tooltip/UIPopoverBody';
import UIPopoverHeader from 'UIComponents/tooltip/UIPopoverHeader';
import GoVideoContainer from './GoVideoContainer';

var GoVideoPopoverContent = function GoVideoPopoverContent(_ref) {
  var editorState = _ref.editorState,
      isInServiceHub = _ref.isInServiceHub,
      onChange = _ref.onChange,
      onClose = _ref.onClose,
      showHeader = _ref.showHeader,
      trackingHandlers = _ref.trackingHandlers,
      recipientEmail = _ref.recipientEmail,
      isInlineVideo = _ref.isInlineVideo,
      showTitleCheckBox = _ref.showTitleCheckBox;
  return /*#__PURE__*/_jsxs("div", {
    children: [showHeader && /*#__PURE__*/_jsxs(UIPopoverHeader, {
      children: [/*#__PURE__*/_jsx(H5, {
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "draftPlugins.goVideoModal.title"
        })
      }), /*#__PURE__*/_jsx(UICloseButton, {
        color: EERIE,
        size: "medium",
        onClick: onClose
      })]
    }), /*#__PURE__*/_jsx(UIPopoverBody, {
      children: /*#__PURE__*/_jsx("div", {
        style: {
          height: 378
        },
        children: /*#__PURE__*/_jsx(GoVideoContainer, {
          editorState: editorState,
          isInServiceHub: isInServiceHub,
          onChange: onChange,
          onClose: onClose,
          trackingHandlers: trackingHandlers,
          recipientEmail: recipientEmail,
          isInlineVideo: isInlineVideo,
          showTitleCheckBox: showTitleCheckBox
        })
      })
    })]
  });
};

GoVideoPopoverContent.propTypes = {
  editorState: PropTypes.instanceOf(EditorState).isRequired,
  isInServiceHub: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  showHeader: PropTypes.bool,
  trackingHandlers: PropTypes.object,
  recipientEmail: PropTypes.string,
  isInlineVideo: PropTypes.bool,
  showTitleCheckBox: PropTypes.bool
};
GoVideoPopoverContent.defaultProps = {
  isInServiceHub: false
};
export default GoVideoPopoverContent;