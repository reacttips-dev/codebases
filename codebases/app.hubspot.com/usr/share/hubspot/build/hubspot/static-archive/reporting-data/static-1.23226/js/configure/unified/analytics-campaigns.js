'use es6';

import { ANALYTICS_CAMPAIGNS } from '../../constants/dataTypes';
import { assetTypeToServerConst } from '../../retrieve/unified/options/assetTypes';
import { Map as ImmutableMap, List } from 'immutable';
import { SUM } from '../../constants/metricTypes';
export var configure = function configure(config) {
  var dataType = config.get('dataType');

  if (dataType !== ANALYTICS_CAMPAIGNS || ['breakdown', 'people', 'deals-influenced'].includes(config.getIn(['dimensions', 0]))) {
    return Promise.resolve(config);
  }

  var configured = config;

  if (configured.getIn(['dimensions', 1]) === 'source') {
    configured = configured.set('metrics', List(['offline', 'directTraffic', 'organicSearch', 'paidSearch', 'socialMedia', 'paidSocial', 'otherCampaigns', 'referrals', 'emailMarketing']).map(function (source) {
      return ImmutableMap({
        property: source,
        metricTypes: [SUM]
      });
    }));
    configured = configured.update('dimensions', function (dimensions) {
      return dimensions.pop();
    });
  }

  configured = configured.has('dimensions') ? configured.update('dimensions', function (dimensions) {
    return dimensions.map(function (dimension) {
      return dimension === 'sessionDate' ? dimension : 'breakdown';
    });
  }) : configured.set('dimensions', List());

  if (configured.hasIn(['filters', 'custom'])) {
    var d2Present = false;
    configured = configured.updateIn(['filters', 'custom'], function (filters) {
      return filters && filters.map(function (filter) {
        switch (filter.get('property')) {
          case 'campaignId':
            return filter.set('property', configured.getIn(['dimensions', 0]) === 'breakdown' ? 'd1' : 'filters');

          case 'searchQuery':
            return filter.set('property', 'NAME');

          case 'assetType':
            d2Present = true;
            return filter.set('property', 'd2').update('value', function (assetType) {
              return assetTypeToServerConst(assetType);
            });

          default:
            return filter;
        }
      });
    });

    if (d2Present) {
      configured = configured.updateIn(['filters', 'custom'], function (filters) {
        return filters.map(function (filter) {
          return filter.get('property') === 'filters' ? filter.set('property', 'd1') : filter;
        });
      });
    }
  }

  return Promise.resolve(configured);
};