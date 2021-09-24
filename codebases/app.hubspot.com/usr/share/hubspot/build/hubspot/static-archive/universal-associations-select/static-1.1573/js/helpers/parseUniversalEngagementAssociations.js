'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { OrderedMap, Map as ImmutableMap } from 'immutable';
import UniversalAssociationRecord from '../records/UniversalAssociationRecord';
import UniversalAssociationOptionRecord from '../records/UniversalAssociationOptionRecord';
import getIn from 'transmute/getIn';
import I18n from 'I18n';
import formatName from 'I18n/utils/formatName';
import { CONTACT, COMPANY, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { CALL, NOTE, TASK, MEETING, EMAIL } from 'customer-data-objects/engagement/EngagementTypes';
import { ObjectTypesToIds, ObjectTypeFromIds, CONTACT_TYPE_ID, COMPANY_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import sortBy from 'transmute/sortBy';
import memoize from 'transmute/memoize';
var HUBSPOT_DEFINED_OBJECT_TYPE_ALLOWLIST = [CONTACT, COMPANY, DEAL, TICKET];
var ENGAGEMENT_TYPE_ALLOWLIST = [NOTE, TASK, MEETING, CALL, EMAIL];
var HUSBPOT_DEFINED_ASSOCIATION_TYPE_ID_ALLOWLIST = ImmutableMap({
  CALL_TO_COMPANY: 182,
  CALL_TO_CONTACT: 194,
  CALL_TO_DEAL: 206,
  CALL_TO_TICKET: 220,
  COMPANY_TO_CONTACT: 2,
  COMPANY_TO_DEAL: 6,
  COMPANY_TO_TICKET: 25,
  CONTACT_TO_COMPANY: 1,
  CONTACT_TO_DEAL: 4,
  CONTACT_TO_TICKET: 15,
  DEAL_TO_COMPANY: 5,
  DEAL_TO_CONTACT: 3,
  DEAL_TO_TICKET: 27,
  EMAIL_TO_COMPANY: 186,
  EMAIL_TO_CONTACT: 198,
  EMAIL_TO_DEAL: 210,
  EMAIL_TO_TICKET: 224,
  ENGAGEMENT_TO_COMPANY: 8,
  ENGAGEMENT_TO_CONTACT: 10,
  ENGAGEMENT_TO_DEAL: 12,
  ENGAGEMENT_TO_TICKET: 18,
  MEETING_TO_COMPANY: 188,
  MEETING_TO_CONTACT: 200,
  MEETING_TO_DEAL: 212,
  MEETING_TO_TICKET: 226,
  NOTE_TO_COMPANY: 190,
  NOTE_TO_CONTACT: 202,
  NOTE_TO_DEAL: 214,
  NOTE_TO_TICKET: 228,
  TASK_TO_CONTACT: 204,
  TASK_TO_COMPANY: 192,
  TASK_TO_DEAL: 216,
  TASK_TO_TICKET: 230,
  TICKET_TO_COMPANY: 26,
  TICKET_TO_CONTACT: 16,
  TICKET_TO_DEAL: 28
}); // all object type id's that are valid to associate with an engagement

var HUBSPOT_DEFINED_OBJECT_TYPE_ID_ALLOWLIST_FOR_ENGAGEMENTS = HUBSPOT_DEFINED_OBJECT_TYPE_ALLOWLIST.map(function (objectType) {
  return ObjectTypesToIds[objectType];
});
export var NULL_LABEL_VALUE = '--';
var universalAssociationOptionComparator = memoize(function (optionA, optionB) {
  var includeIsSelected = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (includeIsSelected) {
    var aIsSelected = optionA.get('isSelected');
    var bIsSelected = optionB.get('isSelected');

    if (aIsSelected && !bIsSelected) {
      return -1;
    }

    if (!aIsSelected && bIsSelected) {
      return 1;
    }
  }

  var aPrimaryDisplayLabel = optionA.get('primaryDisplayLabel').toLowerCase();
  var bPrimaryDisplayLabel = optionB.get('primaryDisplayLabel').toLowerCase();

  if (aPrimaryDisplayLabel > bPrimaryDisplayLabel) {
    return 1;
  }

  if (aPrimaryDisplayLabel < bPrimaryDisplayLabel) {
    return -1;
  }

  var aSecondaryDisplayLabel = optionA.get('secondaryDisplayLabel');
  var bSecondaryDisplayLabel = optionB.get('secondaryDisplayLabel'); // Secondary display labels are not guarenteed to exist, return the option without one first

  if (aSecondaryDisplayLabel && !bSecondaryDisplayLabel) {
    return 1;
  }

  if (!aSecondaryDisplayLabel && bSecondaryDisplayLabel) {
    return -1;
  }

  if (!aSecondaryDisplayLabel && !bSecondaryDisplayLabel) {
    return 0;
  }

  var lowerCaseASecondaryDisplayLabel = optionA.get('secondaryDisplayLabel').toLowerCase();
  var lowerCaseBSecondaryDisplayLabel = optionB.get('secondaryDisplayLabel').toLowerCase();

  if (lowerCaseASecondaryDisplayLabel > lowerCaseBSecondaryDisplayLabel) {
    return 1;
  }

  if (lowerCaseASecondaryDisplayLabel < lowerCaseBSecondaryDisplayLabel) {
    return -1;
  }

  return 0;
});

function primaryDisplayLabelGetterWithDefault(propertyName) {
  return function (properties) {
    var primaryDisplayLabel = getIn(['properties', propertyName, 'value'], properties);
    return primaryDisplayLabel || NULL_LABEL_VALUE;
  };
}

function propertyValueGetter(propertyName) {
  return getIn(['properties', propertyName, 'value']);
}

function isEngagement(objectType) {
  return ENGAGEMENT_TYPE_ALLOWLIST.includes(objectType);
}

function getIsPortalSpecificObject(objectTypeId) {
  return objectTypeId.startsWith('2-');
}

function getIsValidEngagementAssociation(definition) {
  var toObjectTypeId = definition.toObjectTypeId;
  var fromObjectTypeId = definition.fromObjectTypeId;

  if (getIsPortalSpecificObject(fromObjectTypeId)) {
    /**
     * Associations from portal specific objects to portal specific objects and specific legacy
     * HubSpot objects (Companies, Contacts, Deals, and Tickets) are always valid
     * @todo
     * Accomodate flexible associations with portal specific objects. Currently, we have no idea
     * what the valid associationTypeIds for these relationships will be
     */
    var isCompanyContactDealOrTicket = HUBSPOT_DEFINED_OBJECT_TYPE_ID_ALLOWLIST_FOR_ENGAGEMENTS.includes(toObjectTypeId);
    return getIsPortalSpecificObject(toObjectTypeId) || isCompanyContactDealOrTicket;
  }

  if (getIsPortalSpecificObject(toObjectTypeId)) {
    // all associations TO portal specific objects are valid for engagements
    // e.g. note --> vendor, task --> vendor, meeting --> vendor
    return true;
  }

  return definition.associationCategory === 'HUBSPOT_DEFINED' && HUSBPOT_DEFINED_ASSOCIATION_TYPE_ID_ALLOWLIST.includes(definition.associationTypeId);
}

function getFormattedPrimaryAndSecondaryDisplayLabels(_ref) {
  var toObjectTypeId = _ref.toObjectTypeId,
      primaryDisplayLabel = _ref.primaryDisplayLabel,
      secondaryDisplayLabels = _ref.secondaryDisplayLabels,
      properties = _ref.properties;

  if (ObjectTypeFromIds[toObjectTypeId] === CONTACT) {
    var firstName = primaryDisplayLabel;
    var lastName = secondaryDisplayLabels[0];
    var email = secondaryDisplayLabels[1];
    var formattedName = formatName({
      firstName: firstName,
      lastName: lastName
    });

    var _secondaryDisplayLabel = email ? I18n.text('universalAssociationsSelect.optionFormatting.emailWrapper', {
      secondaryDisplayLabel: email
    }) : undefined;

    return {
      primaryDisplayLabel: formattedName || NULL_LABEL_VALUE,
      secondaryDisplayLabel: _secondaryDisplayLabel
    };
  }

  if (ObjectTypeFromIds[toObjectTypeId] === TICKET) {
    var content = properties.find(function (property) {
      return property.name === 'content';
    });

    var _secondaryDisplayLabel2 = content && content.value ? I18n.text('universalAssociationsSelect.optionFormatting.parentheses', {
      secondaryDisplayLabel: content.value
    }) : undefined;

    return {
      primaryDisplayLabel: primaryDisplayLabel || NULL_LABEL_VALUE,
      secondaryDisplayLabel: _secondaryDisplayLabel2
    };
  }

  var hasSecondaryDisplayLabel = ObjectTypeFromIds[toObjectTypeId] !== DEAL && !!secondaryDisplayLabels.length && !!secondaryDisplayLabels[0];
  var secondaryDisplayLabel = hasSecondaryDisplayLabel ? I18n.text('universalAssociationsSelect.optionFormatting.parentheses', {
    secondaryDisplayLabel: secondaryDisplayLabels[0]
  }) : undefined;
  return {
    primaryDisplayLabel: primaryDisplayLabel || NULL_LABEL_VALUE,
    secondaryDisplayLabel: secondaryDisplayLabel
  };
}

function getObjectDisplayLabelGettersAndPluralObjectName(_ref2) {
  var associationCategory = _ref2.associationCategory,
      associationTypeId = _ref2.associationTypeId,
      pluralForm = _ref2.pluralForm,
      primaryDisplayLabelPropertyName = _ref2.primaryDisplayLabelPropertyName,
      secondaryDisplayLabelPropertyNames = _ref2.secondaryDisplayLabelPropertyNames,
      toObjectTypeId = _ref2.toObjectTypeId;

  // Currently, relationships from CONTACT, COMPANY, DEAL, or TICKET to a specific engagement
  // type (NOTE, CALL, EMAIL etc.) is not supported. We supply CCDT to ENGAGEMENT as a workaround for
  // associationTypeId and associationCategory. This will be resolved once the engagement migration is complete
  switch (toObjectTypeId) {
    case CONTACT_TYPE_ID:
      {
        var contactPrimaryDisplayLabelGetter = function contactPrimaryDisplayLabelGetter(optionRecord) {
          var firstName = propertyValueGetter('firstname')(optionRecord);
          var lastName = propertyValueGetter('lastname')(optionRecord);
          return formatName({
            firstName: firstName,
            lastName: lastName
          }) || NULL_LABEL_VALUE;
        };

        return {
          associationCategory: 'HUBSPOT_DEFINED',
          associationTypeId: associationTypeId,
          pluralObjectName: I18n.text('universalAssociationsSelect.associationType.CONTACT'),
          primaryDisplayLabelGetter: contactPrimaryDisplayLabelGetter,
          secondaryDisplayLabelGetter: propertyValueGetter('email'),
          toObjectType: CONTACT
        };
      }

    case COMPANY_TYPE_ID:
      return {
        associationCategory: 'HUBSPOT_DEFINED',
        associationTypeId: associationTypeId,
        pluralObjectName: I18n.text('universalAssociationsSelect.associationType.COMPANY'),
        primaryDisplayLabelGetter: primaryDisplayLabelGetterWithDefault('name'),
        secondaryDisplayLabelGetter: propertyValueGetter('domain'),
        toObjectType: COMPANY
      };

    case DEAL_TYPE_ID:
      return {
        associationCategory: 'HUBSPOT_DEFINED',
        associationTypeId: associationTypeId,
        pluralObjectName: I18n.text('universalAssociationsSelect.associationType.DEAL'),
        primaryDisplayLabelGetter: primaryDisplayLabelGetterWithDefault('dealname'),
        secondaryDisplayLabelGetter: undefined,
        toObjectType: DEAL
      };

    case TICKET_TYPE_ID:
      return {
        associationCategory: 'HUBSPOT_DEFINED',
        associationTypeId: associationTypeId,
        pluralObjectName: I18n.text('universalAssociationsSelect.associationType.TICKET'),
        primaryDisplayLabelGetter: primaryDisplayLabelGetterWithDefault('subject'),
        secondaryDisplayLabelGetter: propertyValueGetter('content'),
        toObjectType: TICKET
      };

    default:
      {
        // Custom object
        var secondaryDisplayLabelGetter = secondaryDisplayLabelPropertyNames && secondaryDisplayLabelPropertyNames.length ? propertyValueGetter(secondaryDisplayLabelPropertyNames[0]) : undefined;
        return {
          associationCategory: associationCategory,
          associationTypeId: associationTypeId,
          pluralObjectName: pluralForm,
          primaryDisplayLabelGetter: primaryDisplayLabelGetterWithDefault(primaryDisplayLabelPropertyName),
          secondaryDisplayLabelGetter: secondaryDisplayLabelGetter
        };
      }
  }
}

var getUniversalAssociationRecord = memoize(function (_ref3) {
  var associationDefinitionCategory = _ref3.associationCategory,
      associationDefinitionTypeId = _ref3.associationTypeId,
      _ref3$toObjectTypeDef = _ref3.toObjectTypeDefinition;
  _ref3$toObjectTypeDef = _ref3$toObjectTypeDef === void 0 ? {} : _ref3$toObjectTypeDef;
  var primaryDisplayLabelPropertyName = _ref3$toObjectTypeDef.primaryDisplayLabelPropertyName,
      secondaryDisplayLabelPropertyNames = _ref3$toObjectTypeDef.secondaryDisplayLabelPropertyNames,
      pluralForm = _ref3$toObjectTypeDef.pluralForm,
      toObjectTypeId = _ref3.toObjectTypeId;

  var _getObjectDisplayLabe = getObjectDisplayLabelGettersAndPluralObjectName({
    toObjectTypeId: toObjectTypeId,
    primaryDisplayLabelPropertyName: primaryDisplayLabelPropertyName,
    secondaryDisplayLabelPropertyNames: secondaryDisplayLabelPropertyNames,
    pluralForm: pluralForm,
    associationCategory: associationDefinitionCategory,
    associationTypeId: associationDefinitionTypeId
  }),
      associationCategory = _getObjectDisplayLabe.associationCategory,
      associationTypeId = _getObjectDisplayLabe.associationTypeId,
      pluralObjectName = _getObjectDisplayLabe.pluralObjectName,
      primaryDisplayLabelGetter = _getObjectDisplayLabe.primaryDisplayLabelGetter,
      secondaryDisplayLabelGetter = _getObjectDisplayLabe.secondaryDisplayLabelGetter,
      toObjectType = _getObjectDisplayLabe.toObjectType;

  return UniversalAssociationRecord({
    associationCategory: associationCategory,
    associationTypeId: associationTypeId,
    toObjectTypeId: toObjectTypeId,
    pluralObjectName: pluralObjectName,
    primaryDisplayLabelGetter: primaryDisplayLabelGetter,
    secondaryDisplayLabelGetter: secondaryDisplayLabelGetter,
    toObjectType: toObjectType
  });
});

function getSubjectAssociationRecord(crmObject, subjectObjectId, subjectObjectTypeId) {
  // We only build the subject association if the crmObject is the subject
  if (crmObject.id !== +subjectObjectId) {
    return ImmutableMap();
  }

  var subjectRecord = getUniversalAssociationRecord({
    toObjectTypeDefinition: crmObject.objectTypeDefinition,
    toObjectTypeId: subjectObjectTypeId
  });

  var _getFormattedPrimaryA = getFormattedPrimaryAndSecondaryDisplayLabels({
    toObjectTypeId: subjectObjectTypeId,
    primaryDisplayLabel: crmObject.primaryDisplayLabel,
    secondaryDisplayLabels: crmObject.secondaryDisplayLabels,
    properties: crmObject.properties
  }),
      primaryDisplayLabel = _getFormattedPrimaryA.primaryDisplayLabel,
      secondaryDisplayLabel = _getFormattedPrimaryA.secondaryDisplayLabel;

  var subjectOption = OrderedMap(_defineProperty({}, subjectObjectId, UniversalAssociationOptionRecord({
    isDefaultAssociation: true,
    isSelected: true,
    objectId: +subjectObjectId,
    primaryDisplayLabel: primaryDisplayLabel,
    secondaryDisplayLabel: secondaryDisplayLabel,
    currentUserCanCommunicate: crmObject.userPermissions ? crmObject.userPermissions.currentUserCanCommunicate : undefined
  })));
  return ImmutableMap(_defineProperty({}, subjectObjectTypeId, subjectRecord.set('associationOptionRecords', subjectOption)));
}

var getShouldPreselectDefaultAssociationOnLegacyHubspotObject = function getShouldPreselectDefaultAssociationOnLegacyHubspotObject(_ref4) {
  var isSubjectCrmObject = _ref4.isSubjectCrmObject,
      subjectObjectTypeId = _ref4.subjectObjectTypeId,
      toObjectTypeId = _ref4.toObjectTypeId,
      properties = _ref4.properties,
      preselectedDefaultDealCount = _ref4.preselectedDefaultDealCount;

  if (!isSubjectCrmObject) {
    return false;
  }

  var isSubjectLegacyHubspotObject = [CONTACT_TYPE_ID, COMPANY_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID].includes(subjectObjectTypeId); // Below is a link to the spread sheet where we define our expected behaviors for default associations and preselecting.
  // There are no general rules for contacts or tickets that can be applied here.
  // https://docs.google.com/spreadsheets/d/1iUzusStqf2u8c7BG9Yre76AfZKRsv9t4UCsxNlZTwqU/edit#gid=913464275

  var isToObjectTypeIdContactOrTicket = [CONTACT_TYPE_ID, TICKET_TYPE_ID].includes(toObjectTypeId);

  if (!isSubjectLegacyHubspotObject || isToObjectTypeIdContactOrTicket) {
    return false;
  }

  if (toObjectTypeId === COMPANY_TYPE_ID) {
    return true;
  }

  var isDealOpen = properties && properties.find(function (property) {
    return property.name === 'hs_is_closed' && property.value === 'false';
  });
  return !!isDealOpen && preselectedDefaultDealCount < 5;
};

var getIsSelected = function getIsSelected(_ref5) {
  var crmObjectId = _ref5.crmObjectId,
      node = _ref5.node,
      preselectedDefaultDealCount = _ref5.preselectedDefaultDealCount,
      subjectObjectId = _ref5.subjectObjectId,
      subjectObjectTypeId = _ref5.subjectObjectTypeId,
      toObjectTypeId = _ref5.toObjectTypeId,
      isExistingEngagement = _ref5.isExistingEngagement;
  var isSubjectNode = node.id === +subjectObjectId;
  var isAssociatedWithEngagement = crmObjectId !== +subjectObjectId;

  if (isSubjectNode || isAssociatedWithEngagement) {
    return true;
  }

  if (isExistingEngagement) {
    return false;
  } // We only evaluate whether or not the node should be preselected when creating a new engagement.
  // Based on the data returned, if the engagement crmObject exists that means we are parsing an
  // engagement in the timeline, not the communicator where we would want to evaluate below


  var isSubjectCrmObject = crmObjectId === +subjectObjectId;
  var shouldPreselectOnLegacyHubSpotObjects = getShouldPreselectDefaultAssociationOnLegacyHubspotObject({
    isSubjectCrmObject: isSubjectCrmObject,
    subjectObjectTypeId: subjectObjectTypeId,
    toObjectTypeId: toObjectTypeId,
    properties: node.properties,
    preselectedDefaultDealCount: preselectedDefaultDealCount
  });
  return shouldPreselectOnLegacyHubSpotObjects;
};

var getUniversalAssociationRecordWithOptions = memoize(function (_ref6) {
  var associatedObjects = _ref6.associatedObjects,
      associationRecord = _ref6.associationRecord,
      subjectObjectId = _ref6.subjectObjectId,
      crmObjectId = _ref6.crmObjectId,
      subjectObjectTypeId = _ref6.subjectObjectTypeId,
      isExistingEngagement = _ref6.isExistingEngagement,
      isUngatedForViewCommunicatePermissions = _ref6.isUngatedForViewCommunicatePermissions;

  if (!associatedObjects) {
    return associationRecord;
  }

  var edges = associatedObjects.edges,
      _associatedObjects$pa = associatedObjects.pageInfo,
      endCursor = _associatedObjects$pa.endCursor,
      hasNextPage = _associatedObjects$pa.hasNextPage;
  var toObjectTypeId = associationRecord.get('toObjectTypeId');
  var preselectedDefaultDealCount = 0;
  var options = edges.reduce(function (acc, _ref7) {
    var node = _ref7.node;

    if (isUngatedForViewCommunicatePermissions && node.userPermissions && !node.userPermissions.currentUserCanView) {
      return acc;
    } // We fetch two crmObjects, the engagement and the subject.
    // If this is the engagement, the node (association) is always selected.
    // Engagments do NOT have default associations


    var isDefaultAssociation = crmObjectId === +subjectObjectId;
    var isSelected = getIsSelected({
      crmObjectId: crmObjectId,
      node: node,
      preselectedDefaultDealCount: preselectedDefaultDealCount,
      subjectObjectId: subjectObjectId,
      subjectObjectTypeId: subjectObjectTypeId,
      toObjectTypeId: toObjectTypeId,
      isExistingEngagement: isExistingEngagement
    });

    var _getFormattedPrimaryA2 = getFormattedPrimaryAndSecondaryDisplayLabels({
      toObjectTypeId: toObjectTypeId,
      primaryDisplayLabel: node.primaryDisplayLabel,
      secondaryDisplayLabels: node.secondaryDisplayLabels,
      properties: node.properties
    }),
        primaryDisplayLabel = _getFormattedPrimaryA2.primaryDisplayLabel,
        secondaryDisplayLabel = _getFormattedPrimaryA2.secondaryDisplayLabel;

    if (isSelected && toObjectTypeId === DEAL_TYPE_ID) {
      preselectedDefaultDealCount++;
    }

    var id = "" + node.id;
    var optionRecord = UniversalAssociationOptionRecord({
      isDefaultAssociation: isDefaultAssociation,
      isSelected: isSelected,
      objectId: node.id,
      primaryDisplayLabel: primaryDisplayLabel,
      secondaryDisplayLabel: secondaryDisplayLabel,
      currentUserCanCommunicate: node.userPermissions ? node.userPermissions.currentUserCanCommunicate : undefined
    });
    return acc.set(id, optionRecord);
  }, OrderedMap());
  var isSelectedAToZSortedOptions = options.sort(universalAssociationOptionComparator);
  return associationRecord.set('associationOptionRecords', isSelectedAToZSortedOptions).set('hasMore', hasNextPage).set('offset', endCursor);
});
var getRecordsFromAssociationDefinitions = memoize(function (allAssociationTypesFromObjectType) {
  if (!allAssociationTypesFromObjectType) {
    return ImmutableMap();
  }

  var validAssociationDefinitions = allAssociationTypesFromObjectType.filter(getIsValidEngagementAssociation);
  return ImmutableMap(validAssociationDefinitions.map(function (associationTypeFromObject) {
    var associationRecord = getUniversalAssociationRecord(associationTypeFromObject);
    return [associationRecord.get('toObjectTypeId'), associationRecord];
  }));
});
var getRecordsFromCrmObject = memoize(function (crmObject, subjectObjectId, subjectObjectTypeId, isExistingEngagement, isUngatedForViewCommunicatePermissions) {
  if (!crmObject) {
    return ImmutableMap();
  }

  var validAssociations = crmObject.allAssociations.filter(function (_ref8) {
    var associationDefinition = _ref8.associationDefinition;
    return getIsValidEngagementAssociation(associationDefinition);
  });
  var subjectAssociation = getSubjectAssociationRecord(crmObject, subjectObjectId, subjectObjectTypeId);
  var associations = ImmutableMap(validAssociations.map(function (_ref9) {
    var associationDefinition = _ref9.associationDefinition,
        associatedObjects = _ref9.associatedObjects;
    var associationRecord = getUniversalAssociationRecord(associationDefinition);
    var associationRecordWithOptions = getUniversalAssociationRecordWithOptions({
      associatedObjects: associatedObjects,
      associationRecord: associationRecord,
      subjectObjectId: subjectObjectId,
      crmObjectId: crmObject.id,
      subjectObjectTypeId: subjectObjectTypeId,
      isExistingEngagement: isExistingEngagement,
      isUngatedForViewCommunicatePermissions: isUngatedForViewCommunicatePermissions
    });
    return [associationRecordWithOptions.get('toObjectTypeId'), associationRecordWithOptions];
  }));
  return associations.concat(subjectAssociation);
});

function allAssociationsMerger(subjectRecord, engagementRecord) {
  var subjectOptions = subjectRecord.get('associationOptionRecords');
  var engagementOptions = engagementRecord.get('associationOptionRecords');
  var mergedOptions = subjectOptions.mergeWith(function (subjectOption, engagementOption) {
    return engagementOption.set('isDefaultAssociation', true);
  }, engagementOptions);
  var mergedRecord = subjectRecord.merge(engagementRecord);
  return mergedRecord.set('associationOptionRecords', mergedOptions);
}

var getAllAssociations = memoize(function (associationRecordsFromDefinitions, engagementAssociationRecords, subjectAssociationRecords) {
  if (engagementAssociationRecords.size) {
    return subjectAssociationRecords.mergeWith(allAssociationsMerger, engagementAssociationRecords);
  }

  return subjectAssociationRecords.mergeDeep(associationRecordsFromDefinitions);
});

function parseUniversalEngagementAssociations(_ref10) {
  var _ref10$data = _ref10.data,
      allAssociationTypesFromObjectType = _ref10$data.allAssociationTypesFromObjectType,
      engagement = _ref10$data.engagement,
      subject = _ref10$data.subject,
      _ref10$variables = _ref10.variables,
      subjectObjectId = _ref10$variables.subjectObjectId,
      subjectObjectTypeId = _ref10$variables.subjectObjectTypeId,
      isUngatedForViewCommunicatePermissions = _ref10.isUngatedForViewCommunicatePermissions;
  var isExistingEngagement = !!engagement;
  var associationRecordsFromDefinitions = getRecordsFromAssociationDefinitions(allAssociationTypesFromObjectType, subject, subjectObjectTypeId);
  var engagementAssociationRecords = getRecordsFromCrmObject(engagement, subjectObjectId, undefined, undefined, isUngatedForViewCommunicatePermissions);
  var subjectAssociationRecords = getRecordsFromCrmObject(subject, subjectObjectId, subjectObjectTypeId, isExistingEngagement, isUngatedForViewCommunicatePermissions);
  var allAssociations = getAllAssociations(associationRecordsFromDefinitions, engagementAssociationRecords, subjectAssociationRecords).map(function (record) {
    var defaultOptions = record.get('associationOptionRecords');
    var sortedDefaults = defaultOptions.sort(universalAssociationOptionComparator);
    return record.set('associationOptionRecords', sortedDefaults);
  });
  return sortBy(function (association) {
    return association.get('pluralObjectName');
  }, allAssociations);
}

export { isEngagement, getAllAssociations, getFormattedPrimaryAndSecondaryDisplayLabels, getIsPortalSpecificObject, getIsSelected, getIsValidEngagementAssociation, getObjectDisplayLabelGettersAndPluralObjectName, getRecordsFromAssociationDefinitions, getRecordsFromCrmObject, getShouldPreselectDefaultAssociationOnLegacyHubspotObject, getSubjectAssociationRecord, getUniversalAssociationRecord, getUniversalAssociationRecordWithOptions, HUBSPOT_DEFINED_OBJECT_TYPE_ALLOWLIST, parseUniversalEngagementAssociations, primaryDisplayLabelGetterWithDefault, propertyValueGetter, universalAssociationOptionComparator };