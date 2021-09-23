'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { mapProp } from 'FileManagerCore/constants/propTypes';

var InsertButton = function InsertButton(_ref) {
  var file = _ref.file,
      onInsert = _ref.onInsert;
  var isInsertDisabled = Boolean(file.get('notSupported'));

  var button = /*#__PURE__*/_jsx(UIButton, {
    className: "m-right-6",
    use: "primary",
    onClick: onInsert,
    disabled: isInsertDisabled,
    "data-test-id": "file-detail-insert-button",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "FileManagerLib.actions.insert"
    })
  });

  if (isInsertDisabled) {
    return /*#__PURE__*/_jsx(UITooltip, {
      title: file.get('notSupportedReason'),
      "data-test-id": "file-detail-insert-disabled-tooltip",
      children: button
    });
  }

  return button;
};

InsertButton.propTypes = {
  file: mapProp.isRequired,
  onInsert: PropTypes.func.isRequired
};
export default InsertButton;