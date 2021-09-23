'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import UISection from 'UIComponents/section/UISection';

function SelectSurveysMessage(props) {
  var message = props.selectedManyContacts ? 'sidebar.chooseSurveyText.forManyContacts' : 'sidebar.chooseSurveyText.forOneContact';
  return /*#__PURE__*/_jsx(UISection, {
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: message
    })
  });
}

export default SelectSurveysMessage;