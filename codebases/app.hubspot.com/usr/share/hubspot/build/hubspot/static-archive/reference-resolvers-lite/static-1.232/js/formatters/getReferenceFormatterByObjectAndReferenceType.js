'use es6';

import { formatToReference } from './Formatter';
import { PIPELINE_STAGE } from '../constants/ReferenceTypes';
import { COMPANY_TYPE_ID, CONTACT_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
export var getReferenceFormatterByObjectAndReferenceType = function getReferenceFormatterByObjectAndReferenceType(_ref) {
  var referenceType = _ref.referenceType,
      objectTypeId = _ref.objectTypeId;

  if (referenceType === PIPELINE_STAGE && ![CONTACT_TYPE_ID, COMPANY_TYPE_ID].includes(objectTypeId)) {
    return function (objectAccessors) {
      return formatToReference(Object.assign({}, objectAccessors, {
        getLabel: function getLabel(item) {
          var originalLabel = objectAccessors.getLabel && objectAccessors.getLabel(item);
          var additionalProperties = objectAccessors.getAdditionalProperties && objectAccessors.getAdditionalProperties(item);
          var pipelineName = additionalProperties && additionalProperties.label;
          return pipelineName ? originalLabel + " (" + pipelineName + ")" : originalLabel;
        }
      }));
    };
  }

  return formatToReference;
};