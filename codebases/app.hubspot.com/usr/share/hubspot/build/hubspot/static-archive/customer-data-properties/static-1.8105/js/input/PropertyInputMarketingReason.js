'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { isError, isLoading } from 'reference-resolvers/utils';
import { MARKETING_REASON } from 'reference-resolvers/constants/ReferenceObjectTypes';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import ResolveReferences from 'reference-resolvers/ResolveReferences';
import UITextInput from 'UIComponents/input/UITextInput';
import get from 'transmute/get';
export var PropertyInputMarketingReasonView = /*#__PURE__*/forwardRef(function (props, ref) {
  var resolvedValue = props.resolvedValue,
      className = props.className;

  if (isLoading(resolvedValue)) {
    return null;
  }

  if (isError(resolvedValue)) {
    throw new Error('Error resolving Marketable Contact Property');
  }

  return /*#__PURE__*/_jsx(UITextInput, {
    inputRef: ref,
    className: className,
    value: get('label', resolvedValue),
    styled: false,
    readOnly: true
  });
});

var mapResolversToProps = function mapResolversToProps(resolvers, _ref) {
  var subjectId = _ref.subjectId;
  return {
    resolvedValue: resolvers[MARKETING_REASON].byId(subjectId)
  };
};

var PropertyInputMarketingReason = ResolveReferences(mapResolversToProps)(PropertyInputMarketingReasonView);
PropertyInputMarketingReasonView.propTypes = {
  resolvedValue: PropTypes.object,
  className: PropTypes.string.isRequired
};
export default PropertyInputMarketingReason;