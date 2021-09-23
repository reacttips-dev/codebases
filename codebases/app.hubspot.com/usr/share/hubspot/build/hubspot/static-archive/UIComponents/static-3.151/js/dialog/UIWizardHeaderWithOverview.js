'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { Children, useContext } from 'react';
import devLogger from 'react-utils/devLogger';
import UIStepIndicator from '../connectedStep/UIStepIndicator';
import { PanelContext } from '../context/PanelContext';
import H4 from '../elements/headings/H4';
import UIFlex from '../layout/UIFlex';
import UIPanelSection from '../panel/UIPanelSection';
import memoWithDisplayName from '../utils/memoWithDisplayName';
import UIDialogCloseButton from './UIDialogCloseButton';
import UIDialogHeader from './UIDialogHeader';

var getStepNames = function getStepNames(wizardProps, inPanel) {
  var steps = Children.toArray(wizardProps.children);
  var stepNames = [];
  var stepLimit = inPanel ? 4 : 6;
  var prevStepName;
  steps.forEach(function (step) {
    var stepName = step.props.name;

    if (process.env.NODE_ENV !== 'production') {
      if (stepName != null && !(typeof stepName === 'string' && stepName.length > 0)) {
        devLogger.warn({
          message: 'UIWizardHeaderWithOverview: a UIWizardStep is missing a `name` attribute. Expected `name` to be an I18n.text (string).',
          key: 'UIWizardHeaderWithOverview: missing wizard step name'
        });
      }
    }

    if (stepName && stepName !== prevStepName) {
      stepNames.push(stepName);
      prevStepName = stepName;
    }
  });

  if (stepNames.length > stepLimit) {
    if (process.env.NODE_ENV !== 'production') {
      devLogger.warn({
        message: "UIWizardHeaderWithOverview: " + stepNames.length + " steps given, but the maximum is " + stepLimit + ".",
        key: 'UIWizardHeaderWithOverview: Too many steps'
      });
    }
  }

  return stepNames;
};

var renderStepIndicator = function renderStepIndicator(stepNames, currentStepName, inPanel) {
  return currentStepName ? /*#__PURE__*/_jsx(UIStepIndicator, {
    direction: "horizontal",
    stepIndex: stepNames.indexOf(currentStepName),
    stepNames: stepNames,
    use: inPanel ? 'flush' : 'default'
  }) : '';
};

var renderStepCount = function renderStepCount(stepNames, currentStepName) {
  if (!currentStepName) {
    return null;
  }

  var stepNumber = stepNames.indexOf(currentStepName) + 1;
  var stepCount = stepNames.length;
  return /*#__PURE__*/_jsx("div", {
    className: "private-wizard__header-step-count",
    children: I18n.text('salesUI.UIWizard.stepCount', {
      stepNumber: stepNumber,
      stepCount: stepCount
    })
  });
};

var UIWizardHeaderWithOverview = memoWithDisplayName('UIWizardHeaderWithOverview', function (props) {
  var stepProps = props.stepProps,
      wizardProps = props.wizardProps;

  var _useContext = useContext(PanelContext),
      inPanel = _useContext.inPanel;

  var stepHeading = stepProps.heading;
  var defaultHeading = wizardProps.defaultHeading;
  var stepNames = getStepNames(wizardProps, inPanel);
  var classes = 'uiWizardHeader' + (!inPanel ? " private-wizard__header-with-overview" : "");
  var currentStepName = stepProps && stepProps.name;
  return /*#__PURE__*/_jsxs("div", {
    children: [inPanel && /*#__PURE__*/_jsx(UIDialogCloseButton, {
      onClick: wizardProps.onReject,
      "data-wizard-action-name": "close"
    }), /*#__PURE__*/_jsxs(UIDialogHeader, {
      className: classes,
      children: [inPanel ? /*#__PURE__*/_jsx(H4, {
        children: wizardProps.defaultHeading
      }) : /*#__PURE__*/_jsx("span", {
        "aria-level": 2,
        className: "private-wizard__title",
        role: "heading",
        children: stepHeading || defaultHeading
      }), !inPanel && renderStepIndicator(stepNames, currentStepName, inPanel), currentStepName && !inPanel && renderStepCount(stepNames, currentStepName)]
    }), inPanel && /*#__PURE__*/_jsx(UIPanelSection, {
      className: "private-panel__steps",
      children: /*#__PURE__*/_jsx(UIFlex, {
        children: renderStepIndicator(stepNames, currentStepName, inPanel)
      })
    })]
  });
});
UIWizardHeaderWithOverview.propTypes = {
  stepProps: PropTypes.object.isRequired,
  wizardProps: PropTypes.object.isRequired
};
export default UIWizardHeaderWithOverview;