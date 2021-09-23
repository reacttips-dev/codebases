'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { PanelContext } from '../context/PanelContext';
import memoWithDisplayName from '../utils/memoWithDisplayName';
import UIDialogCloseButton from './UIDialogCloseButton';
import UIDialogHeader from './UIDialogHeader';
var UIWizardHeader = memoWithDisplayName('UIWizardHeader', function (props) {
  var stepProps = props.stepProps,
      wizardProps = props.wizardProps,
      rest = _objectWithoutProperties(props, ["stepProps", "wizardProps"]);

  var _useContext = useContext(PanelContext),
      inPanel = _useContext.inPanel;

  var stepHeading = stepProps.heading;
  var defaultHeading = wizardProps.defaultHeading;
  var heading = stepHeading || defaultHeading;
  if (heading == null) return null;
  return /*#__PURE__*/_jsxs("div", Object.assign({}, rest, {
    children: [inPanel && /*#__PURE__*/_jsx(UIDialogCloseButton, {
      onClick: wizardProps.onReject,
      "data-wizard-action-name": "close"
    }), /*#__PURE__*/_jsx(UIDialogHeader, {
      className: "uiWizardHeader",
      children: /*#__PURE__*/_jsx("h2", {
        children: heading
      })
    })]
  }));
});
UIWizardHeader.propTypes = {
  stepProps: PropTypes.object.isRequired,
  wizardProps: PropTypes.object.isRequired
};
export default UIWizardHeader;