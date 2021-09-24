'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _getStagesByDataType;

import { Promise } from '../../../../lib/promise';
import getContactLifecycles from '../../../../properties/partial/contacts-lifecyclestages';
import getContactEvents from '../../../../properties/partial/contacts-events';
import { CONTACTS, DEALS } from '../../../../constants/dataTypes';
import Request from '../../../../request/Request';
import transformFunnel from '../transform/funnel';
import getStagesExtractor from '../../common/extractors/stages';
import getPipelineIdExtractor from '../../common/extractors/pipeline';
import getDealStages from './deal-stages';
import buildPipelineFunnelPayload from './pipeline-funnel-payload';
import { DeprecatedPropertyException } from '../../../../exceptions';
import PortalIdParser from 'PortalIdParser';
var CRM_SEARCH_URL = 'crm-search/report/multi/beta';
var getStagesByDataType = (_getStagesByDataType = {}, _defineProperty(_getStagesByDataType, CONTACTS, function (_, dimension) {
  return dimension === 'hs_contact_source_event' ? getContactEvents() : getContactLifecycles();
}), _defineProperty(_getStagesByDataType, DEALS, getDealStages), _getStagesByDataType);
var pipelineIdExtractor = getPipelineIdExtractor();
export default (function (config) {
  var dataType = config.get('dataType');
  var dimension = config.get('dimensions').first();
  var pipelineId = pipelineIdExtractor(config);
  return Promise.resolve(getStagesByDataType[dataType](pipelineId, dimension)).then(function (allStageInfo) {
    return allStageInfo.map(function (stageInfo) {
      return stageInfo.get('value');
    });
  }).then(function (allStages) {
    var stages = getStagesExtractor(allStages)(config);

    if (stages.isEmpty()) {
      throw new DeprecatedPropertyException('stages');
    }

    var payload = buildPipelineFunnelPayload(config, dataType, stages, pipelineId);
    return Request.post({
      url: CRM_SEARCH_URL,
      data: payload.map(function (part) {
        return part.set('portalId', PortalIdParser.get()).set('objectTypeId', dataType);
      }),
      transformer: transformFunnel(stages)
    });
  });
});