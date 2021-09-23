'use es6';

import I18n from 'I18n';
import { fromJS, List, Map as ImmutableMap } from 'immutable';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
import { CRM_OBJECT_META_TYPE } from '../constants/crmObjectMetaTypes';
import { ATTRIBUTION_TOUCH_POINTS, COMPANIES, CONTACTS, CONTACT_CREATE_ATTRIBUTION, CONVERSATIONS, DEAL_CREATE_ATTRIBUTION, FEEDBACK_SUBMISSIONS, LINE_ITEMS, TICKETS, SUBSCRIPTIONS, SEQUENCE_ENROLLMENTS, SEQUENCE_STEP_ENROLLMENTS } from '../constants/dataTypes/inboundDb';
import * as checked from '../lib/checked';
import { isCustomObjectType } from '../lib/customObjects';
import * as http from '../request/http';
import { userInfo } from '../request/user-info';
var CrmObjectDataTypeDefinition = checked.record({
  name: checked.string(),
  objectTypeId: checked.string(),
  id: checked.number(),
  metaTypeId: checked.number(),
  defaultSearchPropertyNames: checked.list().optional(),
  createDatePropertyName: checked.string().optional(),
  pluralForm: checked.string(),
  originalMetaDefinition: checked.any()
}, 'CrmObjectDataTypeDefinition');
var CrmObjectPropertyDefinition = checked.record({
  name: checked.string(),
  label: checked.string(),
  type: checked.string(),
  description: checked.string(),
  groupName: checked.string(),
  showCurrencySymbol: checked.boolean().optional()
}, 'CrmObjectPropertyDefinition');
var CrmObjectPropertyGroupDefinition = checked.record({
  name: checked.string(),
  displayName: checked.string(),
  properties: checked.list(checked.any().fromJS()),
  displayOrder: checked.number(),
  hubspotDefined: checked.boolean()
}, 'CrmObjectPropertyGroupDefinition');
var crmObjectMap = ImmutableMap({});
var crmObjectPropertyMap = ImmutableMap({});
var crmObjectPropertyGroupMap = ImmutableMap({});
/**
 * This is purely a map for reference to the actual name of the hubspot object while we work through migrating through objects in
 * reporting platform that we still refer to as 'CONTACT', 'DEAL', 'TICKET', etc...
 * In the future this will completely go away and everything will be 0-1,0-3, 0-5, etc...
 *
 * It could just be list of the objectTypeIds but that would be diffcult for traceability while performing these migrations
 */

export var HUBSPOT_CRM_OBJECTS_BY_ID = ImmutableMap({
  '0-1': CONTACTS,
  '0-2': COMPANIES,
  '0-5': TICKETS,
  '0-8': LINE_ITEMS,
  '0-11': CONVERSATIONS,
  // CONVERSATIONS https://git.hubteam.com/HubSpot/Reporting-as-a-Service/issues/328
  '0-19': FEEDBACK_SUBMISSIONS,
  '0-20': ATTRIBUTION_TOUCH_POINTS,
  '0-52': CONTACT_CREATE_ATTRIBUTION,
  '0-63': DEAL_CREATE_ATTRIBUTION,
  '0-68': SEQUENCE_ENROLLMENTS,
  '0-69': SUBSCRIPTIONS,
  '0-79': SEQUENCE_STEP_ENROLLMENTS
});
export var ALLOWLISTED_HUBSPOT_DEFINED_CRM_OBJECTS = HUBSPOT_CRM_OBJECTS_BY_ID.flip();
var HUBSPOT_DEFINED_CRM_OBJECT_GATES = fromJS({
  '0-1': [''],
  '0-2': [''],
  '0-5': [''],
  '0-8': [''],
  '0-11': ['RAAS:ConversationsCrmObjectReporting'],
  '0-19': [''],
  '0-20': [''],
  '0-52': [''],
  '0-63': ['']
});

var buildCRMObjectDataTypeDefinition = function buildCRMObjectDataTypeDefinition(objectMetaDefinition) {
  var objectTypeId = objectMetaDefinition.get('objectTypeId');
  return CrmObjectDataTypeDefinition({
    id: objectMetaDefinition.get('id'),
    metaTypeId: objectMetaDefinition.get('metaTypeId'),
    name: ALLOWLISTED_HUBSPOT_DEFINED_CRM_OBJECTS.includes(objectMetaDefinition.get('objectTypeId')) ? I18n.text("reporting-data.dataTypes.crmObjects." + HUBSPOT_CRM_OBJECTS_BY_ID.get(objectTypeId) + ".singularForm") : objectMetaDefinition.get('name'),
    objectTypeId: objectTypeId,
    defaultSearchPropertyNames: objectMetaDefinition.get('defaultSearchPropertyNames'),
    createDatePropertyName: objectMetaDefinition.get('createDatePropertyName'),
    pluralForm: ALLOWLISTED_HUBSPOT_DEFINED_CRM_OBJECTS.includes(objectTypeId) ? I18n.text("reporting-data.dataTypes.crmObjects." + HUBSPOT_CRM_OBJECTS_BY_ID.get(objectTypeId) + ".pluralForm") : objectMetaDefinition.get('pluralForm'),
    originalMetaDefinition: objectMetaDefinition
  });
}; // Used for readability in places where dataType could be the objectTypeId or CRM_OBJECT


export var isSupportedCrmObject = function isSupportedCrmObject(dataType) {
  return dataType && (isCustomObjectType(dataType) || dataType === 'CRM_OBJECT') || ALLOWLISTED_HUBSPOT_DEFINED_CRM_OBJECTS.includes(dataType);
};
export var getSupportedCrmObjects = function getSupportedCrmObjects() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$bypassScopes = _ref.bypassScopes,
      bypassScopes = _ref$bypassScopes === void 0 ? false : _ref$bypassScopes;

  return userInfo().then(function (info) {
    return http.get('inbounddb-meta/v1/object-types/for-portal').then(function (objectTypes) {
      return objectTypes.filter(function (objectType) {
        var objectTypeId = objectType.get('objectTypeId');
        return objectType.get('metaTypeId') === CRM_OBJECT_META_TYPE.PORTAL_SPECIFIC && (bypassScopes || info.user.scopes.includes('custom-object-access')) || ALLOWLISTED_HUBSPOT_DEFINED_CRM_OBJECTS.includes(objectTypeId) && HUBSPOT_DEFINED_CRM_OBJECT_GATES.get(objectTypeId, List()).every(function (gate) {
          return info.gates.includes(gate);
        });
      });
    }).then(function (objectTypes) {
      objectTypes.forEach(function (objectType) {
        crmObjectMap = crmObjectMap.set(objectType.get('objectTypeId'), buildCRMObjectDataTypeDefinition(objectType));
      });
      return objectTypes.map(function (objectType) {
        return buildCRMObjectDataTypeDefinition(objectType);
      });
    });
  });
};
export var getCrmObjectProperties = function getCrmObjectProperties(objectTypeId) {
  return crmObjectPropertyMap.includes(objectTypeId) ? Promise.resolve(crmObjectPropertyMap.get(objectTypeId)) : http.get("properties/v4/" + objectTypeId).then(function (properties) {
    crmObjectPropertyMap = crmObjectPropertyMap.set(objectTypeId, properties.map(function (property) {
      return CrmObjectPropertyDefinition({
        name: property.get('property').get('name'),
        label: property.get('property').get('label'),
        type: property.get('property').get('type'),
        description: property.get('property').get('description'),
        groupName: property.get('property').get('groupName'),
        showCurrencySymbol: property.get('property').get('showCurrencySymbol')
      });
    }));
    return crmObjectPropertyMap.get(objectTypeId);
  });
};
export var getCrmObjectPropertyGroups = function getCrmObjectPropertyGroups(objectTypeId) {
  return crmObjectPropertyGroupMap.includes(objectTypeId) ? Promise.resolve(crmObjectPropertyGroupMap.get(objectTypeId)) : http.get("properties/v4/groups/" + objectTypeId + "?includeProperties=true").then(function (response) {
    var propertyGroups = response.get('results', List());
    crmObjectPropertyGroupMap = crmObjectPropertyMap.set(objectTypeId, propertyGroups.map(function (property) {
      return CrmObjectPropertyGroupDefinition({
        name: property.get('name'),
        displayName: property.get('displayName'),
        properties: property.get('properties').map(function (prop) {
          return prop.update('label', function (label) {
            return propertyLabelTranslator(label);
          });
        }),
        displayOrder: property.get('displayOrder'),
        hubspotDefined: property.get('hubspotDefined')
      });
    }));
    return crmObjectPropertyGroupMap.get(objectTypeId);
  });
};

var getCrmObjectData = function getCrmObjectData(objectTypeId) {
  return crmObjectMap.includes(objectTypeId) ? Promise.resolve(crmObjectMap.get(objectTypeId)) : http.get("inbounddb-meta/v1/object-types/" + objectTypeId).then(function (objectMetaDefinition) {
    crmObjectMap = crmObjectMap.set(objectTypeId, buildCRMObjectDataTypeDefinition(objectMetaDefinition));
    return crmObjectMap.get(objectTypeId);
  });
};

export var getCrmObjectName = function getCrmObjectName(objectTypeId) {
  return getCrmObjectData(objectTypeId).then(function (object) {
    return object.get('name');
  });
};
export var getCrmObjectPluralName = function getCrmObjectPluralName(objectTypeId) {
  return getCrmObjectData(objectTypeId).then(function (object) {
    return object.get('pluralForm');
  });
};
export var getDefaultProperties = function getDefaultProperties(objectTypeId) {
  return getCrmObjectData(objectTypeId).then(function (object) {
    return {
      defaultProperties: object.get('defaultSearchPropertyNames'),
      defaultDateProperty: object.get('createDatePropertyName'),
      pluralName: object.get('pluralForm')
    };
  });
};