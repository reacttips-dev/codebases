'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { getSelectedForm } from '../../lib/Triggers';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormResolver from '../resolvers/FormResolver';

var FormLabel = function FormLabel(_ref) {
  var trigger = _ref.trigger;
  var formId = getSelectedForm(trigger);

  if (formId) {
    return /*#__PURE__*/_jsx(FormattedReactMessage, {
      message: "sequencesAutomation.trigger.formSubmission.cellLabel.specific",
      options: {
        formName: /*#__PURE__*/_jsx("b", {
          children: /*#__PURE__*/_jsx(FormResolver, {
            formId: formId
          })
        })
      }
    });
  }

  return /*#__PURE__*/_jsx(FormattedHTMLMessage, {
    message: "sequencesAutomation.trigger.formSubmission.cellLabel.any"
  });
};

FormLabel.propTypes = {
  trigger: PropTypes.object.isRequired
};
export default FormLabel;