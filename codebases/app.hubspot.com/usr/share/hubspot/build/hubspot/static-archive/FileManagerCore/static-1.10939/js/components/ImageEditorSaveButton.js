'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILoadingButton from 'UIComponents/button/UILoadingButton';
import { RequestStatus } from '../Constants';
import ScopedFeatureTooltip from './permissions/ScopedFeatureTooltip';

var ImageEditorSaveButton = function ImageEditorSaveButton(_ref) {
  var disabled = _ref.disabled,
      onClick = _ref.onClick,
      updateRequestStatus = _ref.updateRequestStatus;
  return /*#__PURE__*/_jsx(ScopedFeatureTooltip.WrappedComponent, {
    children: /*#__PURE__*/_jsx(UILoadingButton, {
      "data-test-selector": "save-edits-button",
      disabled: disabled,
      use: "primary",
      loading: updateRequestStatus === RequestStatus.PENDING,
      failed: updateRequestStatus === RequestStatus.FAILED,
      onClick: onClick,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "FileManagerCore.imageEditor.saveButton"
      })
    })
  });
};

ImageEditorSaveButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  updateRequestStatus: PropTypes.oneOf(Object.keys(RequestStatus)).isRequired
};
export default ImageEditorSaveButton;