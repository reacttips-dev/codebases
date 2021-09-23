'use es6';

import enviro from 'enviro';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
import { CLOSED_LOST_STAGE_IDS_QA, CLOSED_LOST_STAGE_IDS_PROD, CLOSED_WON_STAGE_IDS_QA, CLOSED_WON_STAGE_IDS_PROD, PIPELINE_2_STARTER_QA, PIPELINE_2_STARTER_PROD } from 'customer-data-properties/revenue/RevenueConstants';

function getPipeline(subject) {
  return getProperty(subject, 'pipeline') || 0;
}

export function isInClosedLostStage(targetStageId) {
  if (enviro.isQa()) {
    return CLOSED_LOST_STAGE_IDS_QA.includes(targetStageId);
  } else {
    return CLOSED_LOST_STAGE_IDS_PROD.includes(targetStageId);
  }
}
export function isInClosedWonStage(targetStageId) {
  if (enviro.isQa()) {
    return CLOSED_WON_STAGE_IDS_QA.includes(targetStageId);
  } else {
    return CLOSED_WON_STAGE_IDS_PROD.includes(targetStageId);
  }
}
export function isInStarterPipeline(subject) {
  var pipelineId = getPipeline(subject);

  if (enviro.isQa()) {
    return PIPELINE_2_STARTER_QA === pipelineId;
  } else {
    return PIPELINE_2_STARTER_PROD === pipelineId;
  }
}