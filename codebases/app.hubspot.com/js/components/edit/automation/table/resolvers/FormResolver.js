'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import * as ReferenceObjectTypes from 'reference-resolvers/constants/ReferenceObjectTypes';
import ResolveReferences from 'reference-resolvers/ResolveReferences';
import { isError, isLoading, isResolved } from 'reference-resolvers/utils';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';

var FormResolverInner = function FormResolverInner(_ref) {
  var formName = _ref.formName,
      formId = _ref.formId;

  if (isLoading(formName)) {
    return /*#__PURE__*/_jsx(UILoadingSpinner, {
      size: "extra-small",
      layout: "inline",
      className: "display-inline-flex m-y-0"
    });
  }

  var message = I18n.text('sequencesAutomation.trigger.formSubmission.cellLabel.unknown');

  if (isError(formName) && formId) {
    message = formId;
  }

  if (isResolved(formName)) {
    message = formName.label;
  }

  return message;
};

var mapResolversToProps = function mapResolversToProps(resolvers, props) {
  return {
    formName: resolvers[ReferenceObjectTypes.FORM].byId(props.formId)
  };
};

var FormResolver = ResolveReferences(mapResolversToProps)(FormResolverInner);
FormResolver.propTypes = {
  formId: PropTypes.string.isRequired
};
FormResolver.defaultProps = {
  formId: ''
};
export default FormResolver;