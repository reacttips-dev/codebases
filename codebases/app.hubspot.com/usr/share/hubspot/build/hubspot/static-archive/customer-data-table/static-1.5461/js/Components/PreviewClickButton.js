'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';
import UITableHoverContent from 'UIComponents/table/UITableHoverContent';

var PreviewClickButton = function PreviewClickButton(_ref) {
  var onPreviewClick = _ref.onPreviewClick,
      id = _ref.id;

  var handlePreviewClick = function handlePreviewClick() {
    return onPreviewClick(id);
  };

  return /*#__PURE__*/_jsx(UITableHoverContent, {
    shrinkOnHide: true,
    children: /*#__PURE__*/_jsx(UIButton, {
      "data-selenium-test": "table-preview-click-button",
      onClick: handlePreviewClick,
      size: "extra-small",
      use: "tertiary-light",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "customerDataTable.action.preview"
      })
    })
  });
};

PreviewClickButton.propTypes = {
  id: PropTypes.number,
  onPreviewClick: PropTypes.func
};
export default PreviewClickButton;