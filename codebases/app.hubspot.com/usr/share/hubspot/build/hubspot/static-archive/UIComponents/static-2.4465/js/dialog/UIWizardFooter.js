'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useContext } from 'react';
import UIButtonWrapper from '../layout/UIButtonWrapper';
import UIDialogFooter from './UIDialogFooter';
import UITooltip from '../tooltip/UITooltip';
import UIIcon from '../icon/UIIcon';
import * as CustomRenderer from '../utils/propTypes/customRenderer';
import passthroughProps from '../utils/propTypes/passthroughProps';
import { ModalContext } from '../context/ModalContext';

var renderCancelButton = function renderCancelButton(cancelButton, cancelLabel, isFirstStep, onClickCancel) {
  return CustomRenderer.render(cancelButton, {
    children: cancelLabel,
    className: 'private-wizard__cancel-button' + (isFirstStep ? " private-wizard__button--first" : ""),
    'data-action': 'close',
    key: 'cancel',
    onClick: onClickCancel,
    use: 'link-on-bright',
    'data-wizard-action-name': 'cancel'
  });
};

var renderBackButton = function renderBackButton(backButton, backLabel, onClickBack, wizardProps) {
  if (!wizardProps.backable) {
    return null;
  }

  return CustomRenderer.render(backButton, {
    children: [/*#__PURE__*/_jsx(UIIcon, {
      name: "left"
    }, "icon"), backLabel],
    className: 'private-wizard__back-button',
    key: 'back',
    onClick: onClickBack,
    use: 'secondary',
    'data-wizard-action-name': 'back'
  });
};

var renderNextButton = function renderNextButton(nextButton, nextLabel, onClickNext, wizardProps) {
  return CustomRenderer.render(nextButton, {
    children: [nextLabel, /*#__PURE__*/_jsx(UIIcon, {
      name: "right"
    }, "icon")],
    className: 'private-wizard__primary-button',
    disabled: wizardProps.disablePrimaryButton,
    onClick: onClickNext,
    use: 'primary',
    'data-wizard-action-name': 'next'
  });
};

var renderDoneButton = function renderDoneButton(doneButton, doneLabel, onClickDone, wizardProps) {
  return CustomRenderer.render(doneButton, {
    children: doneLabel,
    className: 'private-wizard__primary-button',
    disabled: wizardProps.disablePrimaryButton,
    onClick: onClickDone,
    use: 'primary',
    'data-wizard-action-name': 'done'
  });
};

var renderPrimaryButton = function renderPrimaryButton(isLastStep, wizardProps, renderedDoneButton, renderedNextButton) {
  var renderedButton = isLastStep ? renderedDoneButton : renderedNextButton;
  var primaryButtonTooltip = wizardProps.primaryButtonTooltip,
      primaryButtonTooltipProps = wizardProps.primaryButtonTooltipProps;
  return primaryButtonTooltip ? /*#__PURE__*/_jsx(UITooltip, Object.assign({
    title: primaryButtonTooltip
  }, primaryButtonTooltipProps, {
    children: renderedButton
  })) : renderedButton;
};

var renderSecondaryButtons = function renderSecondaryButtons(isFirstStep, wizardProps, renderedBackButton, renderedCancelButton) {
  return isFirstStep ? renderedCancelButton : [renderedBackButton, wizardProps.cancellable ? renderedCancelButton : null];
};

function UIWizardFooter(_ref) {
  var backButton = _ref.backButton,
      backLabel = _ref.backLabel,
      cancelButton = _ref.cancelButton,
      cancelLabel = _ref.cancelLabel,
      doneButton = _ref.doneButton,
      doneLabel = _ref.doneLabel,
      hidePrimaryControls = _ref.hidePrimaryControls,
      hideSecondaryControls = _ref.hideSecondaryControls,
      isFirstStep = _ref.isFirstStep,
      isLastStep = _ref.isLastStep,
      nextButton = _ref.nextButton,
      nextLabel = _ref.nextLabel,
      onClickBack = _ref.onClickBack,
      onClickCancel = _ref.onClickCancel,
      onClickDone = _ref.onClickDone,
      onClickNext = _ref.onClickNext,
      __stepIndex = _ref.stepIndex,
      __stepProps = _ref.stepProps,
      wizardProps = _ref.wizardProps,
      rest = _objectWithoutProperties(_ref, ["backButton", "backLabel", "cancelButton", "cancelLabel", "doneButton", "doneLabel", "hidePrimaryControls", "hideSecondaryControls", "isFirstStep", "isLastStep", "nextButton", "nextLabel", "onClickBack", "onClickCancel", "onClickDone", "onClickNext", "stepIndex", "stepProps", "wizardProps"]);

  var modalContext = useContext(ModalContext);
  var renderedCancelButton = modalContext.use === 'fullscreen' ? renderCancelButton(cancelButton, cancelLabel, isFirstStep, onClickCancel) : null;
  var renderedBackButton = renderBackButton(backButton, backLabel, onClickBack, wizardProps);
  var renderedNextButton = renderNextButton(nextButton, nextLabel, onClickNext, wizardProps);
  var renderedDoneButton = renderDoneButton(doneButton, doneLabel, onClickDone, wizardProps);
  return /*#__PURE__*/_jsxs(UIDialogFooter, Object.assign({
    align: "between"
  }, rest, {
    className: "uiWizardFooter private-wizard__footer",
    layout: "default",
    children: [/*#__PURE__*/_jsx(UIButtonWrapper, {
      children: hideSecondaryControls ? '' : renderSecondaryButtons(isFirstStep, wizardProps, renderedBackButton, renderedCancelButton, modalContext)
    }), hidePrimaryControls ? '' : renderPrimaryButton(isLastStep, wizardProps, renderedDoneButton, renderedNextButton)]
  }));
}

UIWizardFooter.propTypes = {
  backButton: CustomRenderer.propType.isRequired,
  backLabel: PropTypes.node.isRequired,
  cancelButton: CustomRenderer.propType.isRequired,
  cancelLabel: PropTypes.node.isRequired,
  doneButton: CustomRenderer.propType.isRequired,
  doneLabel: PropTypes.node.isRequired,
  hidePrimaryControls: PropTypes.bool.isRequired,
  hideSecondaryControls: PropTypes.bool.isRequired,
  isFirstStep: PropTypes.bool.isRequired,
  isLastStep: PropTypes.bool.isRequired,
  nextButton: CustomRenderer.propType.isRequired,
  nextLabel: PropTypes.node.isRequired,
  onClickBack: PropTypes.func.isRequired,
  onClickCancel: PropTypes.func.isRequired,
  onClickDone: PropTypes.func.isRequired,
  onClickNext: PropTypes.func.isRequired,
  stepIndex: PropTypes.number,
  stepProps: PropTypes.object,
  wizardProps: PropTypes.shape({
    cancellable: PropTypes.bool.isRequired,
    disablePrimaryButton: PropTypes.bool.isRequired,
    primaryButtonTooltip: PropTypes.node,
    primaryButtonTooltipProps: passthroughProps(UITooltip)
  }).isRequired
};
UIWizardFooter.defaultProps = {
  hidePrimaryControls: false,
  hideSecondaryControls: false
};
UIWizardFooter.displayName = 'UIWizardFooter';
export default UIWizardFooter;