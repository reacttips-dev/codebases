'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { fromJS, List } from 'immutable';
import getInboundDbPropertyGroups from '../../retrieve/inboundDb/common/properties';
import { TICKETS } from '../../constants/dataTypes';
import { mergeProperties } from '../mergeProperties';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import getQuotasProperties from '../partial/quotas';
import countProperty from '../partial/count-property';
import ticketsModule from '../../dataTypeDefinitions/inboundDb/tickets';
import overridePropertyTypes from '../../retrieve/inboundDb/common/overridePropertyTypes';
import prefix from '../../lib/prefix';
var translate = prefix('reporting-data.properties.tickets');
export var getPropertyGroups = function getPropertyGroups() {
  return getInboundDbPropertyGroups(TICKETS).then(function (groups) {
    return List(_toConsumableArray(groups));
  }).then(function (groups) {
    return mergeProperties(groups, 'ticketinformation', {
      hubspot_team_id: {
        referencedObjectType: 'TEAM'
      },
      time_to_close: {
        type: 'duration'
      },
      time_to_first_agent_reply: {
        type: 'duration'
      }
    });
  });
};
export var getProperties = function getProperties() {
  return createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
    return properties.merge(countProperty(TICKETS)).merge(getQuotasProperties()).merge(fromJS({
      objectId: {
        name: 'objectId',
        label: translate('ticket'),
        type: 'string'
      }
    }));
  })().then(overridePropertyTypes(ticketsModule.getInboundSpec()));
};