'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import PortalIdParser from 'PortalIdParser';
import { List } from 'immutable';
import { CONTACT_SEARCH_AGGREGATION_MAX_SIZE } from '../../../../constants/limits';
import Request from '../../../../request/Request';
import { getUrl } from '../../common/urls';
import * as preconditions from '../preconditions';
import transform from '../transform';
import payload from './basic-payload';
import { fixProductIdRequest, fixNumericBucketResponse } from './repairs';
import { load } from '../../../../dataTypeDefinitions';
import commonCrmSearchDefinition from '../../../../dataTypeDefinitions/inboundDb/common-crm-search';
import { CRM_SEARCH_DATA_TYPES } from '../../../inboundDb/common/crm-search-data-types';
import * as DataType from '../../../../constants/dataTypes'; // see https://git.hubteam.com/HubSpot/Elsie/pull/162

var enforceLimit = function enforceLimit(limit, bucket) {
  return bucket.updateIn(['dimension', 'buckets'], List(), function (buckets) {
    return buckets.take(limit);
  });
};

var addCustomObjectFields = function addCustomObjectFields(spec, config, requestPayload) {
  var objectTypeId = spec.get('objectTypeId');

  if (!objectTypeId) {
    return requestPayload;
  }

  return requestPayload.set('objectTypeId', objectTypeId).set('portalId', PortalIdParser.get());
};

export default (function (config, properties, runtimeOptions) {
  var dataType = config.get('dataType');
  return Promise.all([load(dataType), preconditions.generate(config)]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        moduleDefinition = _ref2[0];

    var useCrmSearch = CRM_SEARCH_DATA_TYPES.includes(dataType) || dataType === DataType.LINE_ITEMS || dataType === DataType.FEEDBACK_SUBMISSIONS;
    var spec = useCrmSearch ? commonCrmSearchDefinition.getInboundSpec(config) : moduleDefinition.getInboundSpec(config);
    var limit = config.get('limit') || 0;

    var _transformer = limit === 0 || limit > CONTACT_SEARCH_AGGREGATION_MAX_SIZE ? transform(properties) : function () {
      return enforceLimit(limit, transform(properties).apply(void 0, arguments));
    };

    var repairs = fixProductIdRequest(dataType);
    return Request.post({
      url: getUrl(config, Object.assign({}, runtimeOptions, {
        useCrmSearch: useCrmSearch
      })),
      data: addCustomObjectFields(spec, config, repairs(payload(config, properties))),
      transformer: function transformer(reportConfig, response) {
        return _transformer(reportConfig, fixNumericBucketResponse(response, properties.get(dataType)));
      }
    });
  });
});