'use es6';

import once from 'hs-lodash/once';
import I18n from 'I18n';
export var FlowBuilderPanelStepIndex = {
  TRIGGER_SELECT_STEP: 0,
  TRIGGER_CONFIG_STEP: 1,
  ACTION_STEP: 2
};
export var getStepIndicatorStepNames = once(function () {
  return [I18n.text('sequencesAutomation.panel.triggerStep.stepName'), I18n.text('sequencesAutomation.panel.actionStep.stepName')];
});