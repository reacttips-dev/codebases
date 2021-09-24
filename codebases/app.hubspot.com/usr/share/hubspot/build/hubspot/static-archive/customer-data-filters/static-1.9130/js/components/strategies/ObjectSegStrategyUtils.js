'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as ObjectTypeIds from 'customer-data-objects/constants/ObjectTypeIds';
import * as DSAssetFamilies from 'customer-data-filters/filterQueryFormat/DSAssetFamilies/DSAssetFamilies';
import { CustomObjectTypeIdRegex, ObjectTypeIdRegex } from '../../filterQueryFormat/ObjectTypeId';
import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { __ASSOCIATION_LABEL } from '../../converters/listSegClassic/ListSegConstants';
import { HUBSPOT_DEFINED, USER_DEFINED } from '../../filterQueryFormat/associations/AssociationCategory';
import { getCustomBehavioralEventTypeName, getCustomObjectName, getIntegrationName } from './filterFamilyEntityNameGetters';
import { makeDynamicFilterFamily, testDynamicFilterFamily } from '../../filterQueryFormat/DynamicFilterFamilies';
import AssociationLabelField from '../../converters/objectSeg/specialFields/AssociationLabelField';
import I18n from 'I18n';
import PropertyGroupRecord from 'customer-data-objects/property/PropertyGroupRecord';
import PropertyOptionRecord from 'customer-data-objects/property/PropertyOptionRecord';
import getIn from 'transmute/getIn';
/**
 * Extract association id and category from association label filter
 * if it exists on a given filter branch
 */

export var getAssociationSpecFromLabelFilter = function getAssociationSpecFromLabelFilter(filterBranch) {
  var conditions = filterBranch.get('conditions');
  var associationFilter = conditions.find(function (val) {
    return val.getIn(['field', 'name']) === __ASSOCIATION_LABEL;
  });
  var associationTypeId;
  var associationCategory;

  if (associationFilter) {
    var _associationFilter$ge = associationFilter.get('value').split('--');

    var _associationFilter$ge2 = _slicedToArray(_associationFilter$ge, 2);

    associationTypeId = _associationFilter$ge2[0];
    associationCategory = _associationFilter$ge2[1];
  }

  return {
    associationTypeId: associationTypeId,
    associationCategory: associationCategory
  };
};
/**
 * Extract association id and category from filter branch
 */

export var getAssociationSpecFromFilterBranch = function getAssociationSpecFromFilterBranch(filterBranch) {
  var associationTypeId = filterBranch.associationTypeId,
      associationCategory = filterBranch.associationCategory;
  return {
    associationTypeId: associationTypeId,
    associationCategory: associationCategory
  };
};
/**
 * Get an internal primary association between two objects.
 *
 * Association is considered primary if it has "ONE_TO_ONE" cardinality
 * or the lowest `id`
 * (see https://hubspot.slack.com/archives/C01B5SP6Y76/p1603380387131400)
 */

export var getInternalPrimaryAssociation = function getInternalPrimaryAssociation(associationsBetweenObjects) {
  var primaryAssociation;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = associationsBetweenObjects.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var association = _step.value;

      if (association.cardinality === 'ONE_TO_ONE') {
        primaryAssociation = association;
        break;
      }

      if (association.fromObjectTypeId === association.toObjectTypeId) {
        continue;
      }

      if (!primaryAssociation || association.id < primaryAssociation.id) {
        primaryAssociation = association;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return primaryAssociation;
};
/**
 * Get a wildcard association between two object types.
 *
 * Wildcard is an association that always exists between two
 * records of two different object types
 */

export var getWildcardAssociation = function getWildcardAssociation(associationsBetweenObjects) {
  return associationsBetweenObjects.find(function (assn) {
    return assn.hasAllAssociatedObjects;
  });
};
export var isWildcardAssociation = function isWildcardAssociation(association) {
  return association.hasAllAssociatedObjects === true;
};
/**
 * Check whether given association is a public "Primary" association
 */

export var isPublicPrimaryAssociation = function isPublicPrimaryAssociation(association) {
  return association.isPrimary;
};
/**
 * Get a default association between two object types
 *
 * If provided object types have more then one association they should have
 * a wildcard association, if not use internal primary association
 */

export var getDefaultAssociation = function getDefaultAssociation(fromObjectTypeId, toObjectTypeId, associationDefinitions) {
  var associationsBetweenObjects = associationDefinitions.getIn([fromObjectTypeId, toObjectTypeId]);

  if (fromObjectTypeId === toObjectTypeId || !associationsBetweenObjects) {
    return undefined;
  }

  return getWildcardAssociation(associationsBetweenObjects) || getInternalPrimaryAssociation(associationsBetweenObjects);
};
export var makeAssociationOption = function makeAssociationOption(id, category) {
  return id + "--" + category;
};
export var parseAssociationOption = function parseAssociationOption(assnOption) {
  var _assnOption$split = assnOption.split('--'),
      _assnOption$split2 = _slicedToArray(_assnOption$split, 2),
      id = _assnOption$split2[0],
      category = _assnOption$split2[1];

  return {
    id: parseInt(id, 10),
    category: category
  };
};

var getAssociationLabelOptions = function getAssociationLabelOptions(associations) {
  if (associations && associations.size > 1) {
    return associations.filter(function (assn) {
      return assn.label && !isPublicPrimaryAssociation(assn) && !isWildcardAssociation(assn);
    }).map(function (assn) {
      return PropertyOptionRecord({
        value: makeAssociationOption(assn.id, assn.category),
        label: assn.label
      });
    }).valueSeq().toArray();
  }

  return [];
};

export var isUngatedForFlexibleAssociationsSelect = function isUngatedForFlexibleAssociationsSelect(fromObjectTypeId, toObjectTypeId, getIsUngated) {
  var ungatedAssociations = {};

  if (getIsUngated('flexible-associations')) {
    ungatedAssociations = Object.assign({}, ungatedAssociations, _defineProperty({}, ObjectTypeIds.CONTACT_TYPE_ID, _defineProperty({}, ObjectTypeIds.COMPANY_TYPE_ID, true)));
  }

  if (getIsUngated('flexible-associations')) {
    var _Object$assign2;

    ungatedAssociations = Object.assign({}, ungatedAssociations, (_Object$assign2 = {}, _defineProperty(_Object$assign2, ObjectTypeIds.DEAL_TYPE_ID, _defineProperty({}, ObjectTypeIds.COMPANY_TYPE_ID, true)), _defineProperty(_Object$assign2, ObjectTypeIds.TICKET_TYPE_ID, _defineProperty({}, ObjectTypeIds.COMPANY_TYPE_ID, true)), _Object$assign2));
  }

  return getIn([fromObjectTypeId, toObjectTypeId], ungatedAssociations) || false;
};
export var isAssociationBranch = function isAssociationBranch(group) {
  return typeof group.get('associationTypeId') === 'number' && [HUBSPOT_DEFINED, USER_DEFINED].includes(group.get('associationCategory'));
};
export var getAssociationValueFromFilterBranch = function getAssociationValueFromFilterBranch(group) {
  if (!isAssociationBranch(group)) {
    return undefined;
  }

  return makeAssociationOption(group.get('associationTypeId'), group.get('associationCategory'));
};
export var convertAssnDefinitionToOption = function convertAssnDefinitionToOption(assn, objectName) {
  var text;
  var isPublicPrimary = false;
  var isWildcard = false;

  if (isPublicPrimaryAssociation(assn)) {
    text = I18n.text('customerDataFilters.FilterFamilyGroupHeadingTranslator.CRM_OBJECT_PRIMARY', {
      entityName: objectName
    });
    isPublicPrimary = true;
  } else if (isWildcardAssociation(assn)) {
    text = I18n.text('customerDataFilters.FilterFamilyGroupHeadingTranslator.CRM_OBJECT_ANY', {
      entityName: objectName
    });
    isWildcard = true;
  } else {
    text = assn.label;
  }

  return {
    value: makeAssociationOption(assn.id, assn.category),
    text: text,
    isPublicPrimary: isPublicPrimary,
    isWildcard: isWildcard
  };
};
export var getSpecialField = function getSpecialField(key, assetFamily, props) {
  if (key === __ASSOCIATION_LABEL) {
    var associationOptions = getAssociationLabelOptions(props.data.getIn([DSAssetFamilies.ASSOCIATION_DEFINITION, props.baseFilterFamily, assetFamily]));
    return AssociationLabelField(associationOptions);
  }

  return undefined;
};

var getCrmObjectSpecialFields = function getCrmObjectSpecialFields(assetFamily, props) {
  var baseFilterFamily = props.baseFilterFamily,
      getIsUngated = props.getIsUngated;
  var crmObjectSpecialFields = ImmutableSet();

  if (getIsUngated('CRM:ILSFilters:AssociationLabel') && assetFamily !== baseFilterFamily) {
    var associationLabelField = getSpecialField(__ASSOCIATION_LABEL, assetFamily, props);
    crmObjectSpecialFields = associationLabelField ? crmObjectSpecialFields.add(associationLabelField) : crmObjectSpecialFields;
  }

  return crmObjectSpecialFields;
};

export var getSpecialFields = function getSpecialFields(assetFamily, props) {
  var specialFields = ImmutableSet();

  if (ObjectTypeIdRegex.test(assetFamily)) {
    specialFields = specialFields.merge(getCrmObjectSpecialFields(assetFamily, props));
  }

  return specialFields;
};
export var getSpecialFieldGroups = function getSpecialFieldGroups(assetFamily) {
  if (ObjectTypeIdRegex.test(assetFamily)) {
    return ImmutableMap({
      association: PropertyGroupRecord({
        displayName: I18n.text('customerDataFilters.FilterPropertyGroupTranslator.association'),
        name: 'association'
      })
    });
  }

  return ImmutableMap();
};
export var makeGetFilterFamilyEntityName = function makeGetFilterFamilyEntityName(filterFamily, props) {
  var baseFilterFamily = props.baseFilterFamily,
      data = props.data;

  if (CustomObjectTypeIdRegex.test(filterFamily)) {
    return function (objectTypeId) {
      return getCustomObjectName({
        objectTypeId: objectTypeId,
        customObjectDefinitions: data.get(DSAssetFamilies.CUSTOM_OBJECT_DEFINITION)
      });
    };
  }

  if (testDynamicFilterFamily(DSAssetFamilies.INTEGRATION, filterFamily)) {
    return function (integrationFamily) {
      return getIntegrationName(integrationFamily, data.get(DSAssetFamilies.INTEGRATION));
    };
  }

  if (testDynamicFilterFamily(DSAssetFamilies.CUSTOM_BEHAVIORAL_EVENT_TYPE, filterFamily)) {
    return function (eventType) {
      var eventFilterFamily = makeDynamicFilterFamily(DSAssetFamilies.CUSTOM_BEHAVIORAL_EVENT, baseFilterFamily);
      var eventLabel = getCustomBehavioralEventTypeName(eventType, data.get(eventFilterFamily));
      return eventLabel;
    };
  }

  return undefined;
};
export var getObjectAssociationDefinitions = function getObjectAssociationDefinitions(baseFilterFamily, assetFamily, data) {
  var associations = getIn([DSAssetFamilies.ASSOCIATION_DEFINITION, baseFilterFamily, assetFamily], data);

  if (associations) {
    return associations.valueSeq().toArray();
  }

  return undefined;
};