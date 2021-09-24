'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { isLoading } from 'reference-resolvers/utils';
import { referencedObjectTypes } from '../constants/referencedObjectTypes';
import I18n from 'I18n';
import ImmutablePropTypes from 'react-immutable-proptypes';
import LoadingCell from './LoadingCell';
import PropTypes from 'prop-types';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import { DATA_2, isFromImport, isFromIntegration, isFromEmailMarketing } from 'customer-data-objects/record/AnalyticsSourceIdentifier';
import Raven from 'Raven';
import { memo } from 'react';
import ResolveReferences from 'reference-resolvers/ResolveReferences';
import StringCell from './StringCell';
import devLogger from 'react-utils/devLogger';
import get from 'transmute/get'; // Copied from https://git.hubteam.com/HubSpot/reporting/blob/master/reporting-data/static/js/lib/guids.js

var knownGuids = {
  nobreakdown: 'NO_BREAKDOWN',
  'c90e6907-e895-479c-8689-0d22fa660677': 'NO_DETAIL_GUID',
  '30434570-5795-496c-b0ae-8d2dc9053483': 'EMPTY_LIST_GUID',
  '5ca1ab1e-fb50-4e89-9cff-a000ba5eba11': 'UNKNOWN',
  '9bae4a1c-0f1c-11e1-9afb-58b0357d1cb3': 'UNKNOWN_CAMPAIGN_GUID',
  'bd185678-735d-4c78-a673-d9528d37a4a6': 'UNKNOWN_COUNTRY_GUID',
  'c1d25565-f664-4089-9f0a-1734cc1b3a65': 'UNKNOWN_KEYWORD_GUID',
  '1ca35c16-25e9-49f1-bfcb-960300c42b6f': 'UNKNOWN_REFERRER_GUID',
  '7081c5b2-d128-4ec1-a9be-cba29cfc540a': 'UNKNOWN_GEO_GUID',
  'e3875d32-ab81-48f1-9e78-493eae864f12': 'UNKNOWN_URL',
  'Unknown keywords (SSL)': 'SSL_REMOVED_KEYWORDS',
  'Unknown keywords (image preview)': 'LYCOS_IMAGE_KEYWORD_PLACEHOLDER',
  'Auto-tagged PPC': 'PPC_GCLID_BUCKET',
  EMAIL_INTEGRATION: 'EMAIL_INTEGRATION',
  BCC_TO_CRM: 'BCC_TO_CRM',
  GMAIL_INTEGRATION: 'GMAIL_INTEGRATION',
  IMPORT: 'IMPORT'
};
export var AnalyticsDataView = function AnalyticsDataView(props) {
  var resolvedValue = props.resolvedValue,
      value = props.value,
      cellProps = _objectWithoutProperties(props, ["resolvedValue", "value"]);

  var knownGuidConstant = knownGuids[value];

  if (knownGuidConstant) {
    return /*#__PURE__*/_jsx(StringCell, Object.assign({}, cellProps, {
      value: I18n.text("customerDataTable.analyticsData.guids." + knownGuidConstant)
    }));
  }

  if (isLoading(resolvedValue)) {
    return /*#__PURE__*/_jsx(LoadingCell, {});
  }

  if (resolvedValue && resolvedValue.label) {
    return /*#__PURE__*/_jsx(StringCell, Object.assign({}, cellProps, {
      value: resolvedValue.label
    }));
  }

  return /*#__PURE__*/_jsx(StringCell, Object.assign({}, cellProps, {
    value: value
  }));
}; // If the "Original source" and "Original source drill-down 1" properties
// indicate that this record came from a source that we know how to
// resolve (import, integration, or email campaign), then treat the
// value of the "Original source drill-down 2" property as an internal id
// referencing one of those entities

export var getResolverType = function getResolverType(property, original) {
  if (property.name !== DATA_2) {
    // don't try to resolve values for "Original source drill-down 1", they aren't references
    return undefined;
  }

  if (isFromImport(original)) {
    return referencedObjectTypes.IMPORT_NAME;
  } else if (isFromIntegration(original)) {
    return referencedObjectTypes.INTEGRATION_NAME;
  } else if (isFromEmailMarketing(original)) {
    return referencedObjectTypes.EMAIL_CAMPAIGN;
  }

  return undefined;
};

var mapResolversToProps = function mapResolversToProps(resolvers, _ref) {
  var id = _ref.id,
      objectType = _ref.objectType,
      original = _ref.original,
      property = _ref.property,
      value = _ref.value;
  var propertyName = get('name', property);
  var resolverType = getResolverType(property, original);

  if (!value || knownGuids[value] || !resolverType) {
    return {};
  }

  var resolver = resolvers[resolverType];

  if (property && !resolver) {
    devLogger.warn({
      message: "Missing resolver: " + propertyName + " for " + objectType
    });
    Raven.captureException(new Error('Missing Resolver'), {
      extra: {
        id: id,
        propertyName: propertyName
      }
    });
    return {};
  } else {
    return {
      resolvedValue: resolver.byId(value)
    };
  }
};

AnalyticsDataView.propTypes = {
  id: PropTypes.string,
  objectType: PropTypes.string,
  original: PropTypes.oneOfType([PropTypes.object, ImmutablePropTypes.map, ImmutablePropTypes.record]),
  property: PropTypes.instanceOf(PropertyRecord),
  resolvedValue: PropTypes.object,
  value: PropTypes.string
};
var ResolvedCell = ResolveReferences(mapResolversToProps)(AnalyticsDataView);
export default /*#__PURE__*/memo(ResolvedCell);