'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import H2 from 'UIComponents/elements/headings/H2';
import FormattedMessage from 'I18n/components/FormattedMessage';

function SurveysSidebarHeader(props) {
  var message = props.selectedManyContacts ? 'sidebar.header.forManyContacts' : 'sidebar.header.forOneContact';
  return /*#__PURE__*/_jsx(H2, {
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: message
    })
  });
}

export default SurveysSidebarHeader;