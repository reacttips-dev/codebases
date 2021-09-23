'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIStickyFooter from 'UIComponents/panel/UIStickyFooter';
import { universalEditableAreas } from './EditableAreas';
import { SaveBarContainer } from './SaveBarContainer';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UIButton from 'UIComponents/button/UIButton';
import UIColumn from 'UIComponents/column/UIColumn';
import UIColumnWrapper from 'UIComponents/column/UIColumnWrapper';
import UIColumnSpreads from 'UIComponents/column/UIColumnSpreads';
import UITruncateString from 'UIComponents/text/UITruncateString';

var UniversalSaveBar = function UniversalSaveBar(_ref) {
  var children = _ref.children,
      formattedChanges = _ref.formattedChanges,
      hasErrors = _ref.hasErrors,
      handleSave = _ref.handleSave,
      handleCancel = _ref.handleCancel,
      className = _ref.className,
      hasChanges = _ref.hasChanges;
  return /*#__PURE__*/_jsx(UIStickyFooter, {
    className: "UniversalSaveBar " + (className || ''),
    children: /*#__PURE__*/_jsxs(UIColumnWrapper, {
      align: "center",
      children: [/*#__PURE__*/_jsxs(UIColumn, {
        children: [/*#__PURE__*/_jsx(UIButton, {
          disabled: hasErrors || !hasChanges,
          onClick: handleSave,
          "data-selenium-test": "UniversalSaveBar-button-primary",
          use: "primary",
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "customerDataProperties.SaveBar.save"
          })
        }), /*#__PURE__*/_jsx(UIButton, {
          disabled: hasErrors || !hasChanges,
          className: "m-right-8",
          "data-selenium-test": "UniversalSaveBar-button",
          onClick: handleCancel,
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "customerDataProperties.SaveBar.cancel"
          })
        })]
      }), /*#__PURE__*/_jsxs(UIColumnSpreads, {
        children: [children, !children && /*#__PURE__*/_jsx(UITruncateString, {
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "customerDataProperties.SaveBar.info",
            options: {
              changes: formattedChanges
            }
          })
        })]
      })]
    })
  });
};

UniversalSaveBar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  formattedChanges: PropTypes.string,
  hasErrors: PropTypes.bool.isRequired,
  hasChanges: PropTypes.bool.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired
};
export default SaveBarContainer(UniversalSaveBar, universalEditableAreas);