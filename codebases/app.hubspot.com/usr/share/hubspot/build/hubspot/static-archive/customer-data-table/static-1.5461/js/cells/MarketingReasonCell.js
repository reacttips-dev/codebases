'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { getId } from 'customer-data-objects/record/ObjectRecordAccessors';
import { isError, isLoading } from 'reference-resolvers/utils';
import { referencedObjectTypes } from '../constants/referencedObjectTypes';
import FormattedMessage from 'I18n/components/FormattedMessage';
import ImmutablePropTypes from 'react-immutable-proptypes';
import LoadingCell from './LoadingCell';
import PropTypes from 'prop-types';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import Raven from 'Raven';
import { memo } from 'react';
import ResolveReferences from 'reference-resolvers/ResolveReferences';
import StringCell from './StringCell';
import UILink from 'UIComponents/link/UILink';
import devLogger from 'react-utils/devLogger';
import get from 'transmute/get';
export var MarketingReasonCell = function MarketingReasonCell(props) {
  var resolvedValue = props.resolvedValue,
      value = props.value,
      cellProps = _objectWithoutProperties(props, ["resolvedValue", "value"]);

  if (isLoading(resolvedValue)) {
    return /*#__PURE__*/_jsx(LoadingCell, {});
  }

  if (isError(resolvedValue)) {
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "customerDataTable.error.resolver"
    });
  }

  if (!resolvedValue) {
    return /*#__PURE__*/_jsx(StringCell, Object.assign({}, cellProps, {
      value: value
    }));
  }

  if (!resolvedValue.description) {
    return /*#__PURE__*/_jsx(StringCell, Object.assign({}, cellProps, {
      value: resolvedValue.label
    }));
  }

  return /*#__PURE__*/_jsx(UILink, {
    className: "domain-name text-left",
    external: true,
    href: resolvedValue.description,
    children: resolvedValue.label
  });
};
export var mapResolversToProps = function mapResolversToProps(resolvers, _ref) {
  var objectType = _ref.objectType,
      original = _ref.original,
      property = _ref.property;
  var propertyName = get('name', property);
  var vid = getId(original);

  if (!vid) {
    return {};
  }

  var resolver = resolvers[referencedObjectTypes.MARKETING_REASON];

  if (property && !resolver) {
    devLogger.warn({
      message: "Missing resolver: " + propertyName + " for " + objectType
    });
    Raven.captureException(new Error('Missing Resolver'), {
      extra: {
        vid: vid,
        propertyName: propertyName
      }
    });
    return {};
  } else {
    return {
      resolvedValue: resolver.byId(vid)
    };
  }
};
MarketingReasonCell.propTypes = {
  id: PropTypes.string,
  objectType: PropTypes.string,
  original: PropTypes.oneOfType([PropTypes.object, ImmutablePropTypes.map, ImmutablePropTypes.record]),
  property: PropTypes.instanceOf(PropertyRecord),
  resolvedValue: PropTypes.object,
  value: PropTypes.string
};
var ResolvedCell = ResolveReferences(mapResolversToProps)(MarketingReasonCell);
export default /*#__PURE__*/memo(ResolvedCell);