'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIConfirmModal from 'UIComponents/dialog/UIConfirmModal';

var getI18nKey = function getI18nKey(suffix) {
  return "FileManagerLib.panels.fromUrl.copyrightNotice." + suffix;
};

export default function ImportImageCopyrightConfirm(_ref) {
  var onConfirm = _ref.onConfirm,
      onReject = _ref.onReject;
  return /*#__PURE__*/_jsx(UIConfirmModal, {
    message: /*#__PURE__*/_jsx(FormattedMessage, {
      message: getI18nKey('heading')
    }),
    description: /*#__PURE__*/_jsx(FormattedMessage, {
      message: getI18nKey('description')
    }),
    confirmLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: getI18nKey('confirm')
    }),
    rejectLabel: /*#__PURE__*/_jsx(FormattedMessage, {
      message: getI18nKey('reject')
    }),
    onConfirm: onConfirm,
    onReject: onReject
  });
}
ImportImageCopyrightConfirm.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
};