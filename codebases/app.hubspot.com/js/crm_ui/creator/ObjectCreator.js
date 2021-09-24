'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _translateProperties;

import { fromJS, Map as ImmutableMap, List } from 'immutable';
import isArray from 'transmute/isArray';
import isObject from 'transmute/isObject';
import omit from 'transmute/omit';
import partial from 'transmute/partial';
import pipe from 'transmute/pipe';
import translate from 'transmute/translate';
import PortalIdParser from 'PortalIdParser';
import { DEAL, COMPANY, CONTACT, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import PropertyValueRecord from 'customer-data-objects/property/PropertyValueRecord';
import { BIDEN, CRM_UI } from 'customer-data-objects/property/PropertySourceTypes';
import { getId, getProperty } from 'customer-data-objects/model/ImmutableModel';
import { associate } from 'crm_data/associations/AssociationsActions';
import { createLineItems } from 'crm_data/lineItems/LineItemsActions';
import { CrmLogger } from 'customer-data-tracking/loggers';
import localSettings from '../legacy/utils/localSettings';
import ObjectCreatorConfig from './ObjectCreatorConfig';
import { getDefaultProperties, saveNewObject } from './ObjectCreatorActions';
import ObjectCreatorError from './ObjectCreatorError';
import UserStore from 'crm_data/user/UserStore';

var createObjectProperties = function createObjectProperties(propertyValues, bidenCompany, sourceApp) {
  var sourceId = UserStore.get('email');
  return propertyValues.reduce(function (map, value, key) {
    var source;

    if (bidenCompany && value === getProperty(bidenCompany, key)) {
      source = BIDEN;
    } else {
      source = sourceApp;
    }

    if (value && typeof value.trim === 'function') {
      value = value.trim();
    }

    return map.set(key, PropertyValueRecord({
      value: value,
      source: source,
      sourceId: sourceId
    }));
  }, ImmutableMap());
};

var handleTracking = function handleTracking(objectType, lineItemsToAdd, object) {
  if (objectType === DEAL) {
    localSettings.set("onboarding:" + PortalIdParser.get() + ":createdDeal", true); // temporary tracking for Mobile team

    if (lineItemsToAdd.size) {
      CrmLogger.logIndexInteraction(DEAL, {
        action: 'Created deal with a product'
      });
    }
  }

  return object;
};

var handleAddTicketAssociations = function handleAddTicketAssociations(objectType, associations, object) {
  if (objectType === TICKET && associations) {
    if (associations[COMPANY]) {
      associate(getId(object), List([associations[COMPANY]]), objectType, COMPANY);
    }

    if (associations[CONTACT]) {
      associate(getId(object), List([associations[CONTACT]]), objectType, CONTACT);
    }
  }

  return object;
};

var handleAddDealLineItems = function handleAddDealLineItems(objectType, lineItemsToAdd, object) {
  if (objectType === DEAL) {
    var dealId = object.get('dealId');
    return createLineItems({
      associatedObjectType: DEAL,
      associatedObjectId: dealId,
      lineItemsToAdd: lineItemsToAdd
    }).then(function () {
      return object;
    }).catch(function () {
      throw new ObjectCreatorError(object, 'saveLineItemsError');
    });
  }

  return object;
};

var toPropertyDefaults = function toPropertyDefaults(objectType) {
  var defaultProperties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var shouldDefaultOwnerId = arguments.length > 2 ? arguments[2] : undefined;
  return fromJS(getDefaultProperties(objectType, defaultProperties, shouldDefaultOwnerId));
};

var normalizeParams = omit(['defaultProperties']);

var toString = function toString(prop, o) {
  return o[prop] ? String(o[prop]) : o.prop;
};

var translateCompanyProperties = translate({
  name: true,
  hubspot_owner_id: true
});
var translateContactProperties = translate({
  firstname: true,
  lastname: true,
  email: true,
  hubspot_owner_id: true
});
var translateDealProperties = translate({
  associatedcompanyid: partial(toString, 'associatedcompanyid'),
  associatedcontactid: partial(toString, 'associatedcontactid'),
  hubspot_owner_id: true,
  pipeline: true,
  dealstage: true
});
var translateTicketProperties = translate({
  associatedcompanyid: partial(toString, 'associatedcompanyid'),
  content: true,
  subject: true,
  source_type: true,
  hubspot_owner_id: true,
  hs_conversations_originating_thread_id: true,
  hs_pipeline: true,
  hs_pipeline_stage: true
});
var translateProperties = (_translateProperties = {}, _defineProperty(_translateProperties, COMPANY, translateCompanyProperties), _defineProperty(_translateProperties, CONTACT, translateContactProperties), _defineProperty(_translateProperties, DEAL, translateDealProperties), _defineProperty(_translateProperties, TICKET, translateTicketProperties), _translateProperties);
var translatePostedParams = translate({
  additionalProperties: true,
  additionalRequiredProperties: true,
  ignoreDefaultCreatorProperties: true,
  shouldDefaultOwnerId: true,
  shouldRenderConfirmAndAddButton: true,
  associationObjectType: ['association', 'objectType'],
  associationObjectId: function associationObjectId(p) {
    return toString('objectId', p.association);
  },
  defaultProperties: function defaultProperties(p) {
    return translateProperties[p.objectType](p.properties);
  },
  objectType: true,
  via: true
});
export var toObjectCreatorParams = function toObjectCreatorParams(params) {
  var objectType = params.objectType,
      defaultProperties = params.defaultProperties,
      _params$shouldDefault = params.shouldDefaultOwnerId,
      shouldDefaultOwnerId = _params$shouldDefault === void 0 ? true : _params$shouldDefault;
  return Object.assign({}, normalizeParams(params), {
    propertyDefaults: toPropertyDefaults(objectType, defaultProperties, shouldDefaultOwnerId)
  });
};
export var transformPostedParamsToObjectCreatorParams = pipe(translatePostedParams, toObjectCreatorParams);
export var validObjectCreatorParams = function validObjectCreatorParams(_ref) {
  var objectType = _ref.objectType,
      association = _ref.association,
      properties = _ref.properties;
  return !!ObjectCreatorConfig[objectType] && isObject(association) && !isArray(association) && isObject(properties) && !isArray(properties);
};
export var createObject = function createObject(_ref2) {
  var associationObjectId = _ref2.associationObjectId,
      associationObjectType = _ref2.associationObjectType,
      associations = _ref2.associations,
      bidenCompany = _ref2.bidenCompany,
      isMarketable = _ref2.isMarketable,
      lineItemsToAdd = _ref2.lineItemsToAdd,
      objectType = _ref2.objectType,
      properties = _ref2.properties,
      propertyValues = _ref2.propertyValues,
      requestedAssociatedObjects = _ref2.requestedAssociatedObjects,
      _ref2$sourceApp = _ref2.sourceApp,
      sourceApp = _ref2$sourceApp === void 0 ? CRM_UI : _ref2$sourceApp,
      isUngatedForFlexibleAssociations = _ref2.isUngatedForFlexibleAssociations;
  var track = partial(handleTracking, objectType, lineItemsToAdd);
  var addTicketAssociations = partial(handleAddTicketAssociations, objectType, associations);
  var addDealLineItems = partial(handleAddDealLineItems, objectType, lineItemsToAdd);
  var objectProperties = createObjectProperties(propertyValues, bidenCompany, sourceApp);
  var ObjectRecord = ObjectCreatorConfig[objectType].record;
  var record = ObjectRecord({
    properties: objectProperties
  });

  if (objectType === DEAL && associationObjectType === CONTACT) {
    var associatedVids = List([parseInt(associationObjectId, 10)]);
    record = record.setIn(['associations', 'associatedVids'], associatedVids);
  }

  return saveNewObject({
    record: record,
    properties: properties,
    objectType: objectType,
    isMarketable: isMarketable,
    associationObjectType: associationObjectType,
    associationObjectId: associationObjectId,
    requestedAssociatedObjects: requestedAssociatedObjects,
    isUngatedForFlexibleAssociations: isUngatedForFlexibleAssociations
  }).then(track).then(addTicketAssociations).then(addDealLineItems);
};