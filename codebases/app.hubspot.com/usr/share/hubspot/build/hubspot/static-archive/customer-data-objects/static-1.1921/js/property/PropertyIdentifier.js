'use es6';

import * as PropertyFieldTypes from 'customer-data-objects/property/PropertyFieldTypes';
import * as PropertyTypes from 'customer-data-objects/property/PropertyTypes';
import { DURATION, UNFORMATTED, PERCENTAGE } from './NumberDisplayHint';
import { currencyPricePrefix } from 'customer-data-objects/lineItem/PropertyNames';
import { CONTACT_TYPE_ID, COMPANY_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID, CALL_TYPE_ID, ObjectTypeFromIds } from 'customer-data-objects/constants/ObjectTypeIds';
import { CONTACT } from 'customer-data-objects/constants/ObjectTypes'; // NOTE: Do not add any immutable/transmute dependencies to this file, it is
// meant to be a lightweight utility file that all projects can import to
// identify properties so it should have no deps other than direct imports from
// customer-data-objects

export var ProfilePropertyBlocklist = ['_inbounddbio.importid_', 'associatedcompanyid', 'associations.company', 'associations.contact', 'dealstage.probability', 'formSubmissions.formId', 'hs_parent_company_id', 'ilsListMemberships.listId', 'listMemberships.listId'];
export var isVisibleProperty = function isVisibleProperty(_ref) {
  var hidden = _ref.hidden,
      name = _ref.name,
      searchable = _ref.searchable,
      hubspotDefined = _ref.hubspotDefined;
  return !hidden && !(ProfilePropertyBlocklist.includes(name) && hubspotDefined) && searchable;
}; // This util is a holdover while we migrate existing properties onto external
// options. Right now there are some properties that are valid external options
// but that aren't supported by the service so we need to provide a util that
// apps can use to figure out which properties to send to reference-resolvers-lite
// and which properties they should continue to resolve how they were before.

export var isPropertySupportedByExternalOptions = function isPropertySupportedByExternalOptions(_ref2) {
  var property = _ref2.property,
      objectTypeId = _ref2.objectTypeId;
  var denormalizedObjectType = ObjectTypeFromIds[objectTypeId] || objectTypeId;

  if (isPipelineStageProperty(property, objectTypeId)) {
    return true;
  }

  if (isPipelineProperty(property, objectTypeId)) {
    return true;
  }

  if (isBusinessUnit(property, denormalizedObjectType)) {
    return true;
  }

  return false;
};
export function isReadOnly(property) {
  return property.readOnlyValue || property.calculated || !isVisibleProperty(property) || property.name === 'file_upload_';
}
export function isTextarea(property) {
  return property && [PropertyTypes.STRING, 'multiline'].includes(property.type) && (property.fieldType === PropertyFieldTypes.TEXTAREA || property.name === 'description');
}
export function isSingleLineText(property) {
  return property && property.type === PropertyTypes.STRING && !isTextarea(property) && !['firstname', 'lastname', 'phone'].includes(property.name);
}
export function isDate(property) {
  return property && [PropertyTypes.DATE_TIME, PropertyTypes.DATE].includes(property.type);
}
export function isCurrency(property) {
  return property && property.showCurrencySymbol && property.type === PropertyTypes.NUMBER;
}
export function isFormattedNumber(property) {
  return property && property.type === PropertyTypes.NUMBER && property.numberDisplayHint !== UNFORMATTED;
}
export function isNumber(property) {
  return property && [PropertyTypes.NUMBER, 'integer'].includes(property.type);
}
export function isEnum(property) {
  return property && [PropertyTypes.ENUMERATION, 'multienum'].includes(property.type);
}
export function isMultienum(property) {
  return property && property.fieldType === PropertyFieldTypes.CHECKBOX && property.type !== PropertyTypes.BOOLEAN;
}
export function isMultiple(property) {
  return property && (property.type === PropertyTypes.STRING || isMultienum(property));
} // Identifies whether a number ought to be displayed as a percent AND is stored as a whole number percent. eg. stored as 50 displayed as 50%

export function isPercentWholeNumber(property) {
  return property && property.name === 'hs_predictivecontactscore_v2';
} // Identifies whether a number ought to be displayed as a percent AND is stored as a decimal percent. eg. stored as 0.5 displayed as 50%

export function isPercent(property) {
  return property && property.type === PropertyTypes.NUMBER && property.numberDisplayHint === PERCENTAGE;
}
export function isDurationEquation(property) {
  return property.fieldType === PropertyFieldTypes.EQUATION && property.numberDisplayHint === DURATION;
}
export function isDuration(property) {
  if (!property) {
    return property;
  }

  var hubspotDefined = property.hubspotDefined;
  var isDefaultDuration = property.name.startsWith('hs_time_in_') || property.name === 'time_to_first_agent_reply' || property.name === 'time_to_close';
  var isStandardDuration = property.type === PropertyTypes.NUMBER && property.numberDisplayHint === DURATION;
  return hubspotDefined && isDefaultDuration || isStandardDuration;
}
export function isUser(property) {
  return property && property.hubspotDefined && (property.name === 'hs_created_by' || property.name === 'hs_created_by_user_id' || property.name === 'hs_updated_by_user_id');
}
export function isBusinessUnit(property, objectType) {
  return objectType === CONTACT && property && property.hubspotDefined && property.name === 'hs_all_assigned_business_unit_ids';
}
export function isMultiCurrencyPrice(property) {
  return isCurrency(property) && property.hubspotDefined && property.name.startsWith(currencyPricePrefix);
}
export function isStatus(property) {
  return property && property.hubspotDefined && property.name === 'hs_event_status';
}
export function isAppId(property) {
  return property && property.hubspotDefined && property.name === 'hs_app_id';
}
export function isHtml(property) {
  return property && property.type === PropertyTypes.STRING && property.fieldType === PropertyFieldTypes.HTML;
}
export function isCallDisposition(property, objectTypeId) {
  return objectTypeId === CALL_TYPE_ID && property && property.hubspotDefined && property.name === 'hs_call_disposition';
} // HACK: The default property names are hard-coded because we do not have access to
// the object type definition here. Customers cannot make properties prefixed with
// hs_ and those are the defaults set when enabling custom object pipelines,
//  so this should be relatively safe until we're in a place where we can rely on the typeDef.

export function isPipelineProperty(property, objectTypeId) {
  if (!property || !property.hubspotDefined || !property.externalOptions) {
    return false;
  }

  switch (objectTypeId) {
    case DEAL_TYPE_ID:
      {
        return property.name === 'pipeline';
      }

    case TICKET_TYPE_ID:
    default:
      {
        return property.name === 'hs_pipeline';
      }
  }
}
export function isPipelineStageProperty(property, objectTypeId) {
  if (!property || !property.hubspotDefined || !property.externalOptions) {
    return false;
  }

  switch (objectTypeId) {
    case CONTACT_TYPE_ID:
    case COMPANY_TYPE_ID:
      {
        return property.name === 'lifecyclestage';
      }

    case DEAL_TYPE_ID:
      {
        return property.name === 'dealstage';
      }

    case TICKET_TYPE_ID:
    default:
      {
        return property.name === 'hs_pipeline_stage';
      }
  }
}