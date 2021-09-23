'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import H2 from 'UIComponents/elements/headings/H2';

var TemplateCreatorModalHeader = function TemplateCreatorModalHeader(_ref) {
  var headerText = _ref.headerText,
      showHeader = _ref.showHeader;

  if (!showHeader) {
    return null;
  }

  return /*#__PURE__*/_jsx(UIDialogHeader, {
    children: /*#__PURE__*/_jsx(H2, {
      className: "m-bottom-0",
      children: headerText
    })
  });
};

TemplateCreatorModalHeader.propTypes = {
  headerText: PropTypes.node,
  showHeader: PropTypes.bool
};
TemplateCreatorModalHeader.defaultProps = {
  showHeader: true
};
export default TemplateCreatorModalHeader;