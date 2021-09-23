'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import AssociatedCompanyProperty from 'customer-data-objects/property/special/AssociatedCompanyProperty';
import AssociatedContactProperty from 'customer-data-objects/property/special/AssociatedContactProperty';
import FormSubmissionsProperty from 'customer-data-objects/property/special/FormSubmissionsProperty';
import InboundDbImportProperty from 'customer-data-objects/property/special/InboundDbImportProperty';
import ListMembershipsProperty from 'customer-data-objects/property/special/ListMembershipsProperty';
import InboundDbListMembershipProperty from 'customer-data-objects/property/special/InboundDbListMembershipProperty';
import RelatesToProperty from 'customer-data-objects/property/special/RelatesToProperty';
import { inboundDbPropertiesToEngagementsProperties } from 'crm_data/engagements/inboundDbProperties/engagementInboundDbObjectHelpers';
import filterNot from 'transmute/filterNot';
import getIn from 'transmute/getIn';
import { Map as ImmutableMap, Set as ImmutableSet, List } from 'immutable';
import * as ImmutableAPI from '../api/ImmutableAPI';
import indexBy from 'transmute/indexBy';
import partial from 'transmute/partial';
import pluck from 'transmute/pluck';
import invariant from 'react-utils/invariant';
import { COMPANY, CONTACT, DEAL, ENGAGEMENT, TASK, VISIT, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import pipe from 'transmute/pipe';
import PropertyGroupRecord from 'customer-data-objects/property/PropertyGroupRecord';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import toSeq from 'transmute/toSeq';
import DealStageProbabilityProperty from 'customer-data-objects/property/special/DealStageProbabilityProperty';
import { isObjectTypeId, ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';

function getGroupsApi(objectTypeOrId) {
  var objectTypeId = ObjectTypesToIds[objectTypeOrId] || objectTypeOrId;
  invariant(isObjectTypeId(objectTypeId), objectTypeId + " is not supported", objectTypeOrId);
  return "properties/v4/groups/" + objectTypeId;
}

export function normalizePropertyGroups(json) {
  var normalizedGroups = ImmutableMap(json.reduce(function (groupsMap, group) {
    var propertyNames = group.properties.map(function (property) {
      return property.name;
    });
    groupsMap[group.name] = PropertyGroupRecord.fromJS(Object.assign({}, group, {
      properties: propertyNames
    }));
    return groupsMap;
  }, {}));
  var normalizedProperties = ImmutableMap(json.reduce(function (allProperties, group) {
    var properties = group.properties || List();
    return properties.reduce(function (acc, property) {
      acc[property.name] = PropertyRecord.fromJS(property);
      return acc;
    }, allProperties);
  }, {}));
  return ImmutableMap({
    groups: normalizedGroups,
    properties: normalizedProperties
  });
} // performs exact inverse of normalize function above. in technical terms:
// denormalize(normalize(apiResponse)) === apiResponse

export function denormalizePropertyGroups(map) {
  return map.get('groups').reduce(function (acc, entry) {
    return acc.push(entry.set('properties', entry.properties.map(function (p) {
      return map.get('properties').get(p);
    })));
  }, List()).toJS();
}
export function normalizePropertyGroupsImmutable(json) {
  var groups = json.results ? json.results : json;

  if (!groups.toJS) {
    return normalizePropertyGroups(groups);
  }

  var ret = ImmutableMap({
    groups: groups.reduce(function (groupsMap, group) {
      return groupsMap.set(group.get('name'), PropertyGroupRecord.fromJS(group.set('properties', pluck('name', group.get('properties'))).toJS()));
    }, ImmutableMap()),
    properties: groups.reduce(function (allProperties, group) {
      var properties = group.get('properties') || List();
      return properties.reduce(function (acc, property) {
        return acc.set(property.get('name'), PropertyRecord.fromJS(property.toJS()));
      }, allProperties);
    }, ImmutableMap())
  });
  return ret;
}
var hiddenVisitProperties = ImmutableSet.of('address1', 'address2', 'dnsresolves', 'email', 'latitude', 'longitude', 'numcontacts', 'organization');
var dropHiddenProperties = pipe(toSeq, filterNot(function (_ref) {
  var name = _ref.name;
  return hiddenVisitProperties.contains(name);
}), indexBy(getIn(['name'])));
var PROSPECTS_GROUP = 'prospects';
export function normalizeBidenGroups(json) {
  var visibleItems = dropHiddenProperties(json);
  return ImmutableMap({
    groups: ImmutableMap(_defineProperty({}, PROSPECTS_GROUP, PropertyGroupRecord({
      displayName: 'Prospect properties',
      displayOrder: 0,
      name: PROSPECTS_GROUP,
      properties: visibleItems.keySeq().toList()
    }))),
    properties: visibleItems.map(function (item) {
      return PropertyRecord.fromJS(Object.assign({}, item, {
        groupName: PROSPECTS_GROUP,
        isBidenProperty: true,
        readOnlyValue: true
      }));
    }).toMap()
  });
}
var ENGAGEMENT_GROUP = 'engagement';
export function normalizeEngagementGroups(inboundDbProperties) {
  var properties = inboundDbPropertiesToEngagementsProperties(ENGAGEMENT, inboundDbProperties.map(function (_ref2) {
    var property = _ref2.property;
    return PropertyRecord.fromJS(property);
  }));
  return ImmutableMap({
    groups: ImmutableMap(_defineProperty({}, ENGAGEMENT_GROUP, PropertyGroupRecord({
      displayName: 'Engagements',
      displayOrder: 0,
      hubspotDefined: true,
      name: ENGAGEMENT_GROUP,
      properties: properties.keySeq().toList()
    }))),
    properties: properties
  });
}
var TASKS_GROUP = 'task';
export function normalizeTaskGroups(inboundDbProperties) {
  var properties = inboundDbPropertiesToEngagementsProperties(TASK, inboundDbProperties.map(function (_ref3) {
    var property = _ref3.property;
    return PropertyRecord.fromJS(property);
  }));
  return ImmutableMap({
    groups: ImmutableMap(_defineProperty({}, TASKS_GROUP, PropertyGroupRecord({
      displayName: 'Tasks',
      displayOrder: 0,
      hubspotDefined: true,
      name: TASKS_GROUP,
      properties: properties.keySeq().toList()
    }))),
    properties: properties
  });
}
var VISITS_GROUP = 'companyVisits';
export function normalizeVisitGroups(json) {
  var visibleItems = dropHiddenProperties(json);
  return ImmutableMap({
    groups: ImmutableMap(_defineProperty({}, VISITS_GROUP, PropertyGroupRecord({
      displayName: 'Visit properties',
      displayOrder: 1,
      name: VISITS_GROUP,
      properties: visibleItems.keySeq().toList()
    }))),
    properties: visibleItems.map(function (item) {
      return PropertyRecord.fromJS(Object.assign({}, item, {
        groupName: VISITS_GROUP,
        isBidenProperty: true,
        readOnlyValue: true
      }));
    }).toMap()
  });
}

function addRelatesToProperty(result) {
  var groupPath;

  if (!result.hasIn(['groups', TASKS_GROUP]) && !result.hasIn(['groups', ENGAGEMENT_GROUP])) {
    return result;
  } else {
    groupPath = result.hasIn(['groups', TASKS_GROUP]) ? ['groups', TASKS_GROUP, 'properties'] : ['groups', ENGAGEMENT_GROUP, 'properties'];
  }

  return result.setIn(groupPath, result.getIn(groupPath).push(RelatesToProperty.name)).setIn(['properties', RelatesToProperty.name], RelatesToProperty);
}

export function addAssociatedCompanyProperty(groupname, result) {
  if (!result.hasIn(['groups', groupname])) {
    return result;
  }

  var groupPath = ['groups', groupname, 'properties'];
  return result.setIn(groupPath, result.getIn(groupPath).push(AssociatedCompanyProperty.name)).setIn(['properties', AssociatedCompanyProperty.name], AssociatedCompanyProperty);
}
export function addAssociatedContactProperty(groupname, result) {
  if (!result.hasIn(['groups', groupname])) {
    return result;
  }

  var groupPath = ['groups', groupname, 'properties'];
  return result.setIn(groupPath, result.getIn(groupPath).push(AssociatedContactProperty.name)).setIn(['properties', AssociatedContactProperty.name], AssociatedContactProperty);
}
export function addDealStageProbability(result) {
  if (!result.hasIn(['groups', 'dealinformation'])) {
    return result;
  }

  var groupPath = ['groups', 'dealinformation', 'properties'];
  return result.setIn(groupPath, result.getIn(groupPath).push(DealStageProbabilityProperty.name)).setIn(['properties', DealStageProbabilityProperty.name], DealStageProbabilityProperty);
}
export function addFormSubmissionProperty(result) {
  if (!result.hasIn(['groups', 'contactinformation'])) {
    return Promise.resolve(result);
  }

  var groupPath = ['groups', 'contactinformation', 'properties'];
  return Promise.resolve(result.setIn(groupPath, result.getIn(groupPath).push(FormSubmissionsProperty.name)).setIn(['properties', FormSubmissionsProperty.name], FormSubmissionsProperty));
}
export function addInboundDbImportProperty() {
  var groupname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'contactinformation';
  var result = arguments.length > 1 ? arguments[1] : undefined;

  if (!result.hasIn(['groups', groupname])) {
    return Promise.resolve(result);
  }

  var groupPath = ['groups', groupname, 'properties'];
  return Promise.resolve(result.setIn(groupPath, result.getIn(groupPath).push(InboundDbImportProperty.name)).setIn(['properties', InboundDbImportProperty.name], InboundDbImportProperty));
}
export function addListMembershipProperty(result) {
  if (!result.hasIn(['groups', 'contactinformation'])) {
    return Promise.resolve(result);
  }

  var groupPath = ['groups', 'contactinformation', 'properties'];
  return Promise.resolve(result.setIn(groupPath, result.getIn(groupPath).push(ListMembershipsProperty.name)).setIn(['properties', ListMembershipsProperty.name], ListMembershipsProperty));
}
export function addInboundDbListMembershipProperty() {
  var groupName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'contactinformation';
  var result = arguments.length > 1 ? arguments[1] : undefined;

  if (!result.hasIn(['groups', groupName])) {
    return Promise.resolve(result);
  }

  var groupPath = ['groups', groupName, 'properties'];
  return Promise.resolve(result.setIn(groupPath, result.getIn(groupPath).push(InboundDbListMembershipProperty.name)).setIn(['properties', InboundDbListMembershipProperty.name], InboundDbListMembershipProperty));
}
export function unhideTicketPipelineProperties(result) {
  if (!result.hasIn(['groups', 'ticketinformation'])) {
    return Promise.resolve(result);
  }

  var pipelineProperty = result.getIn(['properties', 'hs_pipeline']).set('hidden', false);
  var pipelineStageProperty = result.getIn(['properties', 'hs_pipeline_stage']).set('hidden', false);
  return Promise.resolve(result.setIn(['properties', 'hs_pipeline'], pipelineProperty).setIn(['properties', 'hs_pipeline_stage'], pipelineStageProperty));
}
export function fetchEngagementPropertyGroups(_ref4) {
  var objectType = _ref4.objectType;
  return ImmutableAPI.get('properties/v4/engagements', {}, objectType === TASK ? normalizeTaskGroups : normalizeEngagementGroups).then(function (groups) {
    return addRelatesToProperty(groups);
  });
}
export function fetchPropertyGroups(_ref5) {
  var objectType = _ref5.objectType;

  if (objectType === TASK || objectType === ENGAGEMENT) {
    return fetchEngagementPropertyGroups({
      objectType: objectType
    });
  } // Visit properties live at two different APIs


  if (objectType === VISIT) {
    return Promise.all([ImmutableAPI.get('biden-app/v1/properties', {}, normalizeBidenGroups), ImmutableAPI.get('companyprospects/v1/prospects/search/properties', {}, normalizeVisitGroups)]).then(function (_ref6) {
      var _ref7 = _slicedToArray(_ref6, 2),
          bidenGroup = _ref7[0],
          visitGroup = _ref7[1];

      return bidenGroup.mergeDeep(visitGroup);
    });
  }

  var result = ImmutableAPI.get(getGroupsApi(objectType), {
    includeProperties: true
  }, normalizePropertyGroupsImmutable);

  if (objectType === COMPANY) {
    return result.then(partial(addInboundDbImportProperty, 'companyinformation')).then(partial(addInboundDbListMembershipProperty, 'companyinformation'));
  }

  if (objectType === CONTACT) {
    return result.then(addFormSubmissionProperty).then(partial(addInboundDbImportProperty, 'contactinformation')).then(addListMembershipProperty).then(partial(addInboundDbListMembershipProperty, 'contactinformation'));
  }

  if (objectType === DEAL) {
    return result.then(partial(addAssociatedCompanyProperty, 'dealinformation')).then(partial(addAssociatedContactProperty, 'dealinformation')).then(partial(addInboundDbImportProperty, 'dealinformation')).then(partial(addInboundDbListMembershipProperty, 'dealinformation')).then(addDealStageProbability);
  }

  if (objectType === TICKET) {
    return result.then(partial(addAssociatedCompanyProperty, 'ticketinformation')).then(partial(addAssociatedContactProperty, 'ticketinformation')).then(unhideTicketPipelineProperties).then(partial(addInboundDbListMembershipProperty, 'ticketinformation'));
  }

  return result;
}
export function fetchPropertyGroupsBatch(objectTypes) {
  return Promise.all(objectTypes.map(function (objectType) {
    return fetchPropertyGroups({
      objectType: objectType
    });
  }).toArray()).then(function (results) {
    return results.reduce(function (acc, result, index) {
      return acc.set(objectTypes.get(index), result);
    }, ImmutableMap());
  });
}