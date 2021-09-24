'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIFlex from 'UIComponents/layout/UIFlex';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import TemplateCreatorModalHeader from './TemplateCreatorModalHeader';
import TemplateCreatorModalFooter from './TemplateCreatorModalFooter';

var TemplateCreatorModalLoader = function TemplateCreatorModalLoader(_ref) {
  var headerText = _ref.headerText,
      showHeader = _ref.showHeader,
      onConfirm = _ref.onConfirm,
      onReject = _ref.onReject;
  return /*#__PURE__*/_jsxs("div", {
    className: "template-creator-modal",
    children: [/*#__PURE__*/_jsx(TemplateCreatorModalHeader, {
      headerText: headerText,
      showHeader: showHeader
    }), /*#__PURE__*/_jsx(UIDialogBody, {
      children: /*#__PURE__*/_jsx(UIFlex, {
        align: "center",
        justify: "center",
        style: {
          height: 439
        },
        children: /*#__PURE__*/_jsx(UILoadingSpinner, {})
      })
    }), /*#__PURE__*/_jsx(TemplateCreatorModalFooter, {
      onConfirm: onConfirm,
      onReject: onReject
    })]
  });
};

TemplateCreatorModalLoader.propTypes = {
  headerText: PropTypes.node,
  showHeader: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired
};
export default TemplateCreatorModalLoader;