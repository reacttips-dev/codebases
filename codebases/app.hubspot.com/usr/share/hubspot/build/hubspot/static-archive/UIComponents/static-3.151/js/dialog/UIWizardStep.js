'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import * as CustomRenderer from '../utils/propTypes/customRenderer';
import UIDialogBody from './UIDialogBody';

function UIWizardStep(_ref) {
  var __backButton = _ref.backButton,
      __backLabel = _ref.backLabel,
      __cancelButton = _ref.cancelButton,
      __cancelLabel = _ref.cancelLabel,
      __doneButton = _ref.doneButton,
      __doneLabel = _ref.doneLabel,
      __hidePrimaryControls = _ref.hidePrimaryControls,
      __hideSecondaryControls = _ref.hideSecondaryControls,
      __isFirstStep = _ref.isFirstStep,
      __isLastStep = _ref.isLastStep,
      __nextButton = _ref.nextButton,
      __nextLabel = _ref.nextLabel,
      rest = _objectWithoutProperties(_ref, ["backButton", "backLabel", "cancelButton", "cancelLabel", "doneButton", "doneLabel", "hidePrimaryControls", "hideSecondaryControls", "isFirstStep", "isLastStep", "nextButton", "nextLabel"]);

  return /*#__PURE__*/_jsx(UIDialogBody, Object.assign({}, rest));
}

UIWizardStep.propTypes = {
  backButton: CustomRenderer.propType,
  backLabel: PropTypes.node,
  cancelButton: CustomRenderer.propType,
  cancelLabel: PropTypes.node,
  doneButton: CustomRenderer.propType,
  doneLabel: PropTypes.node,
  hidePrimaryControls: PropTypes.bool,
  hideSecondaryControls: PropTypes.bool,

  /** I18n.text string rendered by UIWizardHeaderWithOverview */
  name: PropTypes.string,
  children: PropTypes.node,
  isFirstStep: PropTypes.bool,
  isLastStep: PropTypes.bool,
  nextButton: CustomRenderer.propType,
  nextLabel: PropTypes.node
};
UIWizardStep.displayName = 'UIWizardStep';
export default UIWizardStep;