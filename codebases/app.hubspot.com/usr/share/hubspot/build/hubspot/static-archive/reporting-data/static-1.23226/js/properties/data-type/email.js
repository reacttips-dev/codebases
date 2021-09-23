'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { fromJS, List, Map as ImmutableMap } from 'immutable';
import { Promise } from '../../lib/promise';
import prefix from '../../lib/prefix';
import { EMAIL } from '../../constants/dataTypes';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import countProperty from '../partial/count-property';
var translate = prefix('reporting-data.properties.email');
var translateGroup = prefix('reporting-data.groups.email');

var dimensions = function dimensions() {
  return fromJS([{
    name: 'emaildate',
    label: translate('date'),
    type: 'string'
  }, {
    name: 'id',
    label: translate('email'),
    type: 'string'
  }, {
    name: 'deviceType',
    label: translate('deviceType'),
    type: 'enumeration',
    options: [{
      value: 'computer',
      label: translate('deviceTypes.computer')
    }, {
      value: 'mobile',
      label: translate('deviceTypes.mobile')
    }, {
      value: 'unknown',
      label: translate('deviceTypes.unknown')
    }]
  }, {
    name: 'emailCampaign',
    label: translate('emailCampaign'),
    type: 'string'
  }]);
};

var metrics = function metrics() {
  return fromJS([{
    name: 'bounce',
    label: translate('bounce'),
    type: 'number',
    inverseDeltas: true
  }, {
    name: 'emailSends',
    label: translate('emailSends'),
    type: 'number'
  }, {
    name: 'click',
    label: translate('click'),
    type: 'number'
  }, {
    name: 'reply',
    label: translate('reply'),
    type: 'number'
  }, {
    name: 'contactslost',
    label: translate('contactslost'),
    type: 'number',
    inverseDeltas: true
  }, {
    name: 'delivered',
    label: translate('delivered'),
    type: 'number'
  }, {
    name: 'dropped',
    label: translate('dropped'),
    type: 'number'
  }, {
    name: 'hardbounced',
    label: translate('hardbounced'),
    type: 'number',
    inverseDeltas: true
  }, {
    name: 'notsent',
    label: translate('notsent'),
    type: 'number'
  }, {
    name: 'open',
    label: translate('open'),
    type: 'number'
  }, {
    name: 'pending',
    label: translate('pending'),
    type: 'number'
  }, {
    name: 'selected',
    label: translate('selected'),
    type: 'number'
  }, {
    name: 'sent',
    label: translate('sent'),
    type: 'number'
  }, {
    name: 'softbounced',
    label: translate('softbounced'),
    type: 'number',
    inverseDeltas: true
  }, {
    name: 'spamreport',
    label: translate('spamreport'),
    type: 'number',
    inverseDeltas: true
  }, {
    name: 'suppressed',
    label: translate('suppressed'),
    type: 'number'
  }, {
    name: 'unsubscribed',
    label: translate('unsubscribed'),
    type: 'number',
    inverseDeltas: true
  }, {
    name: 'bounceratio',
    label: translate('bounceratio'),
    type: 'percent',
    inverseDeltas: true
  }, {
    name: 'clickratio',
    label: translate('clickratio'),
    type: 'percent'
  }, {
    name: 'replyratio',
    label: translate('replyratio'),
    type: 'percent'
  }, {
    name: 'clickthroughratio',
    label: translate('clickthroughratio'),
    type: 'percent'
  }, {
    name: 'contactslostratio',
    label: translate('contactslostratio'),
    type: 'percent',
    inverseDeltas: true
  }, {
    name: 'deliveredratio',
    label: translate('deliveredratio'),
    type: 'percent'
  }, {
    name: 'hardbounceratio',
    label: translate('hardbounceratio'),
    type: 'percent',
    inverseDeltas: true
  }, {
    name: 'notsentratio',
    label: translate('notsentratio'),
    type: 'percent',
    inverseDeltas: true
  }, {
    name: 'openratio',
    label: translate('openratio'),
    type: 'percent'
  }, {
    name: 'pendingratio',
    label: translate('pendingratio'),
    type: 'percent'
  }, {
    name: 'softbounceratio',
    label: translate('softbounceratio'),
    type: 'percent',
    inverseDeltas: true
  }, {
    name: 'spamreportratio',
    label: translate('spamreportratio'),
    type: 'percent',
    inverseDeltas: true
  }, {
    name: 'unsubscribedratio',
    label: translate('unsubscribedratio'),
    type: 'percent',
    inverseDeltas: true
  }, {
    name: 'rssEmailId',
    label: translate('rssEmailId'),
    type: 'string'
  }]);
};

var metadata = function metadata() {
  return fromJS([{
    name: 'campaignId',
    label: translate('campaign'),
    type: 'enumeration'
  }, {
    name: 'created',
    label: translate('created'),
    type: 'datetime'
  }, {
    name: 'publishDate',
    label: translate('publishDate'),
    type: 'datetime'
  }, {
    name: 'updated',
    label: translate('updated'),
    type: 'datetime'
  }, {
    name: 'state',
    label: translate('state'),
    type: 'enumeration'
  }]);
};

var deprecated = function deprecated() {
  return fromJS([{
    name: 'campaign',
    label: translate('campaign'),
    type: 'string'
  }, {
    name: 'name',
    label: translate('name'),
    type: 'string'
  }]);
};

export var getPropertyGroups = function getPropertyGroups() {
  return Promise.resolve(List([ImmutableMap({
    name: 'emailInfo',
    displayName: translateGroup('emailInfo'),
    displayOrder: 0,
    hubspotDefined: true,
    properties: List([].concat(_toConsumableArray(dimensions()), _toConsumableArray(metrics()), _toConsumableArray(metadata()), _toConsumableArray(deprecated())))
  })]));
};
export var getProperties = createPropertiesGetterFromGroups(getPropertyGroups, function (properties) {
  return properties.merge(countProperty(EMAIL));
});