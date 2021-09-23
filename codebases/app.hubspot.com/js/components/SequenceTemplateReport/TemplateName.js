'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import ResolveReferences from 'reference-resolvers/ResolveReferences';
import * as ReferenceObjectTypes from 'reference-resolvers/constants/ReferenceObjectTypes';
import { isError, isLoading, isResolved } from 'reference-resolvers/utils';
import { getTemplateUrl } from '../../lib/links';
import UILink from 'UIComponents/link/UILink';
import Small from 'UIComponents/elements/Small';
import FormattedMessage from 'I18n/components/FormattedMessage';

function TemplateNameDisplay(_ref) {
  var template = _ref.template,
      templateId = _ref.templateId;

  if (isLoading(template)) {
    return /*#__PURE__*/_jsx(UILoadingSpinner, {
      size: "extra-small"
    });
  } else if (isError(template)) {
    return /*#__PURE__*/_jsx(Small, {
      use: "error",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sequences.emailPerformanceReport.templateNameError"
      })
    });
  } else if (isResolved(template)) {
    return /*#__PURE__*/_jsx(UILink, {
      external: true,
      href: getTemplateUrl(templateId),
      truncate: true,
      children: template.label
    });
  }

  return /*#__PURE__*/_jsx(Small, {
    use: "help",
    children: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sequences.emailPerformanceReport.templateNotFound"
    })
  });
}

var mapResolversToProps = function mapResolversToProps(resolvers, props) {
  return {
    template: resolvers[ReferenceObjectTypes.TEMPLATE].byId(props.templateId)
  };
};

var TemplateName = ResolveReferences(mapResolversToProps)(TemplateNameDisplay);
export default TemplateName;