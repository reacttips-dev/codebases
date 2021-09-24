'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import ResolveReferences from 'reference-resolvers/ResolveReferences';
import { EMAIL_VALIDATION } from 'reference-resolvers/constants/ReferenceObjectTypes';
import KnowledgeBaseButton from 'ui-addon-i18n/components/KnowledgeBaseButton';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import * as ReferenceTypes from 'reference-resolvers/schema/ReferenceTypes';
import { isResolved } from 'reference-resolvers/utils';
var propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  emailDraft: PropTypes.string,
  onInvalidProperty: PropTypes.func.isRequired,
  validationResults: ReferenceTypes.byId,
  gdprError: PropTypes.bool
};
var GDPR_BLOCKLISTED_EMAIL_ARTICLE_URL = 'https://knowledge.hubspot.com/contacts/how-do-i-perform-a-gdpr-compliant-delete-in-hubspot';
export var GDPR_BLOCKLISTED_MESSAGE = 'email has been GDPR blacklisted';
export var PropertyInputEmailValidationView = function PropertyInputEmailValidationView(_ref) {
  var gdprError = _ref.gdprError,
      validationResults = _ref.validationResults,
      onInvalidProperty = _ref.onInvalidProperty;
  useEffect(function () {
    if (isResolved(validationResults) && validationResults.referencedObject && validationResults.referencedObject.message === GDPR_BLOCKLISTED_MESSAGE) {
      onInvalidProperty('gdprError', true);
    } else if (isResolved(validationResults)) {
      onInvalidProperty('gdprError', false);
    }
  }, [validationResults, onInvalidProperty]);

  var renderGDPRError = function renderGDPRError() {
    var knowledgeBaseLink = /*#__PURE__*/_jsx(KnowledgeBaseButton, {
      url: GDPR_BLOCKLISTED_EMAIL_ARTICLE_URL
    });

    return /*#__PURE__*/_jsx("div", {
      className: "is--text--error p-top-2",
      children: /*#__PURE__*/_jsx(FormattedReactMessage, {
        message: "customerDataProperties.PropertyInput.errorMessageGdprDeleted",
        options: {
          knowledgeBaseLink: knowledgeBaseLink
        },
        "data-selenium-test": "contact-email-blacklisted-error"
      })
    });
  };

  return gdprError ? /*#__PURE__*/_jsx("div", {
    children: renderGDPRError()
  }) : null;
};

var mapResolversToProps = function mapResolversToProps(resolvers, props) {
  return {
    validationResults: resolvers[EMAIL_VALIDATION].byId(props.emailDraft)
  };
};

var PropertyInputEmailValdiation = ResolveReferences(mapResolversToProps)(PropertyInputEmailValidationView);
PropertyInputEmailValidationView.propTypes = propTypes;
export default PropertyInputEmailValdiation;