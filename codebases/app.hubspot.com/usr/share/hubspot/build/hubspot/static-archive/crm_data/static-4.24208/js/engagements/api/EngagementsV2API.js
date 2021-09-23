'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { fromJS, List, Map as ImmutableMap } from 'immutable';
import { PUT, POST } from 'crm_data/constants/HTTPVerbs';
import { send } from 'crm_data/api/ImmutableAPI';
import { CRM_UI } from 'customer-data-objects/property/PropertySourceTypes';
import User from 'hub-http-shims/UserDataJS/user';
import { engagementUpdatesToInboundDbProperties } from 'crm_data/engagements/inboundDbProperties/engagementInboundDbObjectHelpers';
import { ENGAGEMENT_TO_COMPANY, ENGAGEMENT_TO_CONTACT, ENGAGEMENT_TO_DEAL, ENGAGEMENT_TO_TICKET } from 'crm_data/associations/AssociationTypes';
var ASSOCIATIONS_MAP = {
  contactIds: ENGAGEMENT_TO_CONTACT,
  companyIds: ENGAGEMENT_TO_COMPANY,
  dealIds: ENGAGEMENT_TO_DEAL,
  ticketIds: ENGAGEMENT_TO_TICKET
};
import { COMMON_PROPERTIES, PROPERTIES_BY_ENGAGEMENT_TYPE } from './EngagementsV2Properties';
import getIn from 'transmute/getIn';
/*
 * @param {Immutable.Map} associations - A map of associations for a task.
 *    Possible keys include contactIds, companyIds, dealIds, ticketIds.
 * @returns {Immutable.Map} The same map of associations with the keys translated for use in the associations API.
 */

export function _formatAssociationsForCreate(associations) {
  return associations.filter(function (__value, key) {
    return key in ASSOCIATIONS_MAP;
  }).mapKeys(function (key) {
    return ASSOCIATIONS_MAP[key];
  });
}
/**
 * This maps the fields present on an engagement to the keys at which they are store on the backend
 *
 * A full listing of the keys on each engagement can be found here:
 * https://git.hubteam.com/HubSpot/InboundDbProperties/tree/master/InboundDbPropertiesBase/src/main/java/com/hubspot/inbounddb/properties/defaults/engagements
 *
 * */

export var formatPropertyValue = function formatPropertyValue(value) {
  if (List.isList(value)) {
    return value.join(';');
  }

  return value;
};
export var getPropertyName = function getPropertyName(engagementType, property) {
  if (COMMON_PROPERTIES.has(property)) {
    return COMMON_PROPERTIES.get(property);
  }

  var engagementProperties = PROPERTIES_BY_ENGAGEMENT_TYPE.get(engagementType);
  var propertyDef = engagementProperties.find(function (def) {
    return def.propertyNameV1 === property;
  });
  return propertyDef.propertyNameV2;
};
/**
 * Given `engagementType` and `updates`, reduces the Map of updates into `List()`
 *
 * @example
 * formatUpdatedProperties("NOTE", Map({ body: '<div>New Body</div>', ownerIds: List([123456, 56789])}));
 *
 * @example return
 * List([
 *  {
 *    name: 'hs_note_body',
 *    value: '<div>New Body</div>'
 *  },
 *  {
 *    name: 'hs_at_mentioned_owner_ids',
 *    value: '123456;56789'
 *  }
 * ]);
 *
 * @param  {string}
 * @param  {Map}
 * @return {List<object>}
 */

export var formatUpdatedProperties = function formatUpdatedProperties(engagementType, updates) {
  return updates.reduce(function (acc, value, key) {
    return acc.push(ImmutableMap({
      name: getPropertyName(engagementType, key),
      value: formatPropertyValue(value)
    }));
  }, List());
};
export function updateEngagement(engagementType, engagementId, updates) {
  return send({
    type: PUT,
    headers: {
      'X-Properties-Source': CRM_UI,
      'X-Properties-SourceId': User.get().get('email')
    }
  }, "engagements/v2/engagements/" + engagementId, {
    properties: formatUpdatedProperties(engagementType, updates)
  });
}
/**
 *
 * @param {Array} portalSpecificObjectsToAssociate
 *
 * [
 *   {
 *     "associationSpec": {
 *       "associationCategory": "HUBSPOT_DEFINED",
 *       "associationTypeId": 32
 *     },
 *     "objectIds": [20751]
 *   }
 * ]
 *
 */

export function createEngagementV2(engagement, portalSpecificObjectsToAssociate) {
  var engagementType = engagement.getIn(['engagement', 'type']);
  var engagementProperties = PROPERTIES_BY_ENGAGEMENT_TYPE.get(engagementType);
  /**
   * @example engagementSpecificProperties
   *
   * [
   *   {
   *     name: 'hs_note_body',
   *     value: '<p>this is the note body</p>'
   *   }
   * ]
   */

  var engagementSpecificProperties = engagementProperties.map(function (def) {
    var name = def.propertyNameV2;
    var shouldParsePropertyValue = !!def.parser;
    var value = shouldParsePropertyValue ? def.parser(engagement.getIn(def.propertyPathV1)) : engagement.getIn(def.propertyPathV1);
    return {
      name: name,
      value: value
    };
  }).filter(function (property) {
    // filter out properties with undefined or null value
    return !!property.value;
  });
  var attachments = engagement.get('attachments') || List();
  var attachmentsProperty = attachments.size > 0 ? [{
    name: COMMON_PROPERTIES.get('attachments'),
    value: attachments.map(function (attachment) {
      return attachment.get('id');
    }).join(';')
  }] : [];
  var atMentions = getIn(['associations', 'ownerIds'], engagement) || List();
  var formattedAtMentions = atMentions.join(';');
  var properties = [{
    name: COMMON_PROPERTIES.get('engagementType'),
    value: engagementType
  }, {
    name: COMMON_PROPERTIES.get('timestamp'),
    value: engagement.getIn(['engagement', 'timestamp'])
  }, {
    name: COMMON_PROPERTIES.get('ownerId'),
    value: engagement.getIn(['engagement', 'ownerId'])
  }, {
    name: COMMON_PROPERTIES.get('ownerIds'),
    value: formattedAtMentions
  }].concat(_toConsumableArray(engagementSpecificProperties), attachmentsProperty);
  /**
   * @example hubSpotDefinedObjectAssociations
   *
   * {
   *   [ENGAGEMENT_TO_CONTACT]: [123, 456],
   *   [ENGAGEMENT_TO_COMPANY]: [],
   *   [ENGAGEMENT_TO_DEAL]: [],
   *   [ENGAGEMENT_TO_TICKET]: [789],
   * }
   *
   */

  var hubSpotDefinedObjectAssociations = !portalSpecificObjectsToAssociate ? _formatAssociationsForCreate(engagement.get('associations')) : undefined;
  var body = {
    objectsToAssociate: portalSpecificObjectsToAssociate,
    shouldValidateAssociations: true,
    associations: hubSpotDefinedObjectAssociations,
    object: {
      properties: properties
    }
  };
  var source = engagement.getIn(['engagement', 'source']) || CRM_UI;
  var sourceId = engagement.getIn(['engagement', 'sourceId']) || User.get().get('email');
  return send({
    type: POST,
    headers: {
      'X-Properties-Source': source,
      'X-Properties-SourceId': sourceId
    }
  }, 'engagements/v2/engagements', body).then(function (result) {
    /**
     * @example result
     *
     * {
     *    objectId: 12345678,
     *    objectType: "ENGAGEMENT",
     *    properties: {
     *      hs_created_by: {
     *        value: 77777777
     *      }
     *      hs_createdate: {
     *        value: 88888888
     *      }
     *      hs_note_body: {
     *        value: "<p>this is the body</p>"
     *      }
     *      hs_timestamp: {
     *        value: 88888888
     *      }
     *    }
     * }
     *
     */
    var id = result.get('objectId');
    var createdAt = result.getIn(['properties', COMMON_PROPERTIES.get('createdAt'), 'value']);
    var timestamp = result.getIn(['properties', COMMON_PROPERTIES.get('timestamp'), 'value']);
    var createdBy = result.getIn(['properties', COMMON_PROPERTIES.get('createdBy'), 'value']); // hydrate engagement with id, create date, created by, and timestamp

    var postCreationData = fromJS({
      engagement: {
        id: id,
        createdAt: parseInt(createdAt, 10),
        createdBy: createdBy,
        timestamp: parseInt(timestamp, 10)
      }
    });
    var engagementPostCreation = engagement.mergeDeep(postCreationData);
    return {
      createdEngagementRecord: engagementPostCreation,
      associationCreateFailures: []
    };
  });
}
export function createTask(task) {
  return send({
    type: POST,
    headers: {
      'X-Properties-Source': CRM_UI,
      'X-Properties-SourceId': User.get().get('email')
    }
  }, 'engagements/v2/engagements', {
    associations: _formatAssociationsForCreate(task.associations),
    object: {
      properties: task.properties.toList().map(function (_ref) {
        var name = _ref.name,
            value = _ref.value;
        return {
          name: name,
          value: value
        };
      })
    }
  });
}
export function updateTask(task) {
  return send({
    type: PUT,
    headers: {
      'X-Properties-Source': CRM_UI,
      'X-Properties-SourceId': User.get().get('email')
    }
  }, "engagements/v2/engagements/" + task.objectId, {
    properties: task.properties.toList().map(function (_ref2) {
      var name = _ref2.name,
          value = _ref2.value;
      return {
        name: name,
        value: value
      };
    })
  });
}
export function batchUpdateEngagements(engagementIds, updates) {
  return send({
    type: PUT,
    headers: {
      'X-Properties-Source': CRM_UI,
      'X-Properties-SourceId': User.get().get('email')
    }
  }, 'engagements/v2/engagements/batch', engagementIds.map(function (engagementId) {
    return {
      engagementId: engagementId,
      properties: engagementUpdatesToInboundDbProperties(updates)
    };
  }));
}