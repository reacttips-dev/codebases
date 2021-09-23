/*
  https://git.hubteam.com/HubSpot/CRM-Issues/issues/586

  Avoid calling this file directly.
  Instead, use the abstraction `DealPermissions`
*/
'use es6';

import memoize from 'transmute/memoize';
import { addWarning } from 'customer-data-ui-utilities/alerts/Alerts';
import enviro from 'enviro';
import PIPELINES_AND_STAGES from './BETDealPermissionsPipelineStages';
var memoizedCanMoveStage = memoize(function (pipeline, prevStage, nextStage, scopes) {
  var isSalesOpsUser = scopes.has('bet-bypass-deal-stage-restrictions');

  if (isSalesOpsUser) {
    return true;
  }

  var env = enviro.isQa() ? 'QA' : 'PROD';
  var addStages = PIPELINES_AND_STAGES.getIn([env, pipeline, 'blacklistAddStages']);
  var removeStages = PIPELINES_AND_STAGES.getIn([env, pipeline, 'blacklistRemoveStages']);
  return !(addStages && addStages.includes(nextStage) || removeStages && removeStages.includes(prevStage));
});
export var closedLostStage = function closedLostStage(pipeline) {
  var env = enviro.isQa() ? 'QA' : 'PROD';
  return PIPELINES_AND_STAGES.getIn([env, pipeline, 'closedLost']);
};
export var canMoveStage = function canMoveStage(pipeline, prevStage, nextStage, scopes, includeWarning) {
  if (memoizedCanMoveStage(pipeline, prevStage, nextStage, scopes)) {
    return true;
  }

  if (includeWarning) {
    addWarning('bet.BETDealPermissions.unauthorizedStageChange');
  }

  return false;
};