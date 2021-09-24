'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import UISection from 'UIComponents/section/UISection';

var TriggerStepHeader = function TriggerStepHeader() {
  return /*#__PURE__*/_jsx(UISection, {
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequencesAutomation.panel.triggerStep.description"
    })
  });
};

TriggerStepHeader.propTypes = {};
export default TriggerStepHeader;