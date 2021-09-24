'use es6';

import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { InboundDbModule } from '../../module';
import { SOCIAL_POSTS } from '../../constants/dataTypes';
import { hydrate as _hydrate } from '../../retrieve/inboundDb/dynamicHydrate';
import { adapt } from '../../references/adapt';
import campaign from '../../references/campaign';
import channelKeyReferences from '../../references/channelKey';
import Spec from '../../retrieve/inboundDb/common/specs/Spec';
var idProperty = 'id';

var getInboundSpec = function getInboundSpec() {
  return new Spec({
    dataType: SOCIAL_POSTS,
    properties: {
      idProperty: idProperty,
      responsePaths: {
        id: ['id'],
        'stats.clicks': ['stats', 'clicks'],
        'stats.impressions': ['stats', 'impressions'],
        'stats.shares': ['stats', 'shares']
      },
      extractors: {
        __default: function __default(obj, property) {
          return obj.get(property);
        },
        'stats.clicks': function statsClicks(result) {
          return result.getIn(['stats', 'clicks']);
        },
        'stats.impressions': function statsImpressions(result) {
          return result.getIn(['stats', 'impressions']);
        },
        'stats.shares': function statsShares(result) {
          return result.getIn(['stats', 'shares']);
        }
      }
    },
    search: {
      url: 'social-reporting/v1/search/posts',
      objectsField: 'results'
    },
    hydrate: {
      inputs: ImmutableSet([idProperty, 'channelType']),
      // TODO: update to use real hydrator
      fn: function fn(_ref) {
        var id = _ref.id,
            channelType = _ref.channelType;
        return id + " (" + channelType + ")";
      }
    }
  });
};

export default InboundDbModule({
  dataType: SOCIAL_POSTS,
  references: ImmutableMap({
    channelId: adapt(function () {
      return channelKeyReferences({
        useChannelId: true
      });
    }),
    campaignGuid: adapt(campaign)
  }),
  referenceProperties: ImmutableMap({
    id: SOCIAL_POSTS
  }),
  hydrate: function hydrate(ids, config) {
    return _hydrate(SOCIAL_POSTS, ids, config);
  },
  getInboundSpec: getInboundSpec
});