'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import UIFormControl from 'UIComponents/form/UIFormControl';
import I18n from 'I18n';
import { FORM } from 'reference-resolvers/constants/ReferenceObjectTypes';
import ConnectReferenceResolvers from 'reference-resolvers/ConnectReferenceResolvers';
import ReferenceInputEnum from 'customer-data-reference-ui-components/ReferenceInputEnum';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import { canEditSequencesContextualWorkflows } from 'SequencesUI/lib/permissions';

function FormReferenceInput(_ref) {
  var value = _ref.value,
      onChange = _ref.onChange,
      resolver = _ref.resolver;
  return /*#__PURE__*/_jsx(UIFormControl, {
    "aria-label": I18n.text('sequencesAutomation.trigger.formSubmission.objectSelectionForm.searchLabel'),
    children: /*#__PURE__*/_jsx(ReferenceInputEnum, {
      resolver: resolver,
      onChange: onChange,
      value: value,
      readOnly: !canEditSequencesContextualWorkflows()
    })
  });
}

FormReferenceInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  resolver: ReferenceResolverType
};

var mapResolversToProps = function mapResolversToProps(resolvers) {
  return {
    resolver: resolvers[FORM]
  };
};

export default ConnectReferenceResolvers(mapResolversToProps, FormReferenceInput);