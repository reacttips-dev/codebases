'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { TICKET_STAGE } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { isError, isLoading } from 'reference-resolvers/utils';
import { stageLabelTranslator, propertyLabelTranslator } from 'property-translator/propertyTranslator';
import { referencedObjectTypes } from 'customer-data-table/constants/referencedObjectTypes';
import FormattedMessage from 'I18n/components/FormattedMessage';
import LoadingCell from './LoadingCell';
import PropTypes from 'prop-types';
import Raven from 'Raven';
import { memo } from 'react';
import ResolveReferences from 'reference-resolvers/ResolveReferences';
import StringCell from '../cells/StringCell';
import count from 'transmute/count';
import devLogger from 'react-utils/devLogger';
import get from 'transmute/get';
import isNumber from 'transmute/isNumber';
import memoize from 'transmute/memoize';
import resolverSerializer from 'customer-data-table/resolverSerializer';
export var getIdArray = function getIdArray(lookupId, objectType) {
  if (!lookupId) {
    return [];
  }

  if (isNumber(lookupId) || objectType === DEAL) {
    return ["" + lookupId];
  } // NOTE: see `customer-data-property-utils/parseMultiEnumValue`
  //       (customer-data-table doesn't have a dep on this library or we'd call it directly)


  return lookupId.split(';').map(function (id) {
    return id.trim();
  }).filter(function (id) {
    return id !== '';
  });
};

var getStageLabelFromReferencedObject = function getStageLabelFromReferencedObject(objectType, referencedObject) {
  var pipeline = get('pipeline', referencedObject);
  var stageLabelArgs = {
    label: get('label', referencedObject),
    objectType: objectType,
    pipelineId: get('pipelineId', referencedObject),
    stageId: get('stageId', referencedObject)
  };
  return stageLabelTranslator(stageLabelArgs) + " (" + pipeline.get('label') + ")";
};

export var ResolvedView = function ResolvedView(props) {
  var CustomCell = props.CustomCell,
      extraCellProps = props.extraCellProps,
      objectType = props.objectType,
      object = props.object,
      property = props.property,
      cellProps = _objectWithoutProperties(props, ["CustomCell", "extraCellProps", "objectType", "object", "property"]);

  if (!object) {
    return /*#__PURE__*/_jsx(StringCell, Object.assign({}, cellProps, {}, extraCellProps, {
      value: props.value || props.id
    }));
  }

  var propertyName = get('name', property);
  var firstObject = get(0, object);
  var referencedObject = get('referencedObject', firstObject);

  var getResolvedValue = function getResolvedValue() {
    if (referencedObject) {
      if (propertyName === 'dealstage' && objectType === DEAL) {
        return getStageLabelFromReferencedObject(objectType, referencedObject);
      }

      if (propertyName === 'hs_pipeline_stage' && objectType === TICKET_STAGE) {
        // TICKET_STAGE is a reference resolver objectType, but it corresponds to the CCDT TICKET objectType
        // that's used by stageLabelTranslator
        return getStageLabelFromReferencedObject(TICKET, referencedObject);
      }
    }

    return propertyLabelTranslator(get('label', firstObject));
  };

  if (isLoading(firstObject)) {
    return /*#__PURE__*/_jsx(LoadingCell, {});
  }

  if (isError(firstObject)) {
    return /*#__PURE__*/_jsx(FormattedMessage, {
      message: "customerDataTable.error.resolver"
    });
  }

  if (count(object) > 1) {
    var _value = object.map(function (x) {
      return get('label', x);
    }).join(', ');

    return /*#__PURE__*/_jsx(StringCell, Object.assign({}, cellProps, {}, extraCellProps, {
      value: _value
    }));
  }

  var value = resolverSerializer(firstObject, objectType);

  if (CustomCell) {
    return /*#__PURE__*/_jsx(CustomCell, Object.assign({}, cellProps, {}, extraCellProps, {
      objectType: objectType,
      value: value
    }));
  }

  return /*#__PURE__*/_jsx(StringCell, Object.assign({}, cellProps, {}, extraCellProps, {
    value: getResolvedValue()
  }));
};
export var getResolver = memoize(function (propertyName, objectType, resolvers) {
  return resolvers[referencedObjectTypes[propertyName]] || resolvers[referencedObjectTypes[objectType]];
});

var mapResolversToProps = function mapResolversToProps(resolvers, _ref) {
  var id = _ref.id,
      value = _ref.value,
      property = _ref.property,
      objectType = _ref.objectType;
  var propertyName = get('name', property);
  var externalOptions = get('externalOptions', property);
  var resolver = getResolver(propertyName, objectType, resolvers);

  if (!resolver) {
    devLogger.warn({
      message: "Missing resolver: " + propertyName + " for " + objectType
    });
    Raven.captureException('Missing resolver', {
      extra: {
        id: id,
        propertyName: propertyName
      }
    });
    return {};
  }

  var lookupId = externalOptions ? value : id;
  var lookupIds = getIdArray(lookupId, objectType);
  var values = lookupIds.map(function (_id) {
    return resolver.byId(_id);
  });
  return values ? {
    object: values
  } : {};
};

ResolvedView.propTypes = {
  CustomCell: PropTypes.elementType,
  extraCellProps: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  object: PropTypes.array,
  objectType: PropTypes.string,
  property: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
var ResolvedCell = ResolveReferences(mapResolversToProps)(ResolvedView);
export default /*#__PURE__*/memo(ResolvedCell);