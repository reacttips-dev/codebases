'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { EditorState } from 'draft-js';
import CustomerDataDialog from './CustomerDataDialog';
import I18n from 'I18n';
import GoVideoContainer from './GoVideoContainer';

var GoVideoDialog = function GoVideoDialog(props) {
  return /*#__PURE__*/_jsx(CustomerDataDialog, {
    className: "GoVideoDialog p-bottom-10",
    bodyClassName: "display-flex align-center justify-center",
    onReject: props.onClose,
    showCancelButton: false,
    showConfirmButton: false,
    title: I18n.text('draftPlugins.goVideoModal.title'),
    width: 625,
    size: "short",
    children: /*#__PURE__*/_jsx(GoVideoContainer, {
      editorState: props.editorState,
      isInServiceHub: props.isInServiceHub,
      onChange: props.onChange,
      onClose: props.onClose,
      onConfirm: props.onConfirm,
      trackingHandlers: props.trackingHandlers,
      recipientEmail: props.recipientEmail,
      isInlineVideo: props.isInlineVideo,
      showTitleCheckBox: props.showTitleCheckBox
    })
  });
};

GoVideoDialog.propTypes = {
  editorState: PropTypes.instanceOf(EditorState),
  isInServiceHub: PropTypes.bool,
  onChange: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  trackingHandlers: PropTypes.object,
  recipientEmail: PropTypes.string,
  isInlineVideo: PropTypes.bool,
  showTitleCheckBox: PropTypes.bool
};
export default GoVideoDialog;