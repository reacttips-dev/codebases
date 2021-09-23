'use es6';

import getIn from 'transmute/getIn';
import { PIPELINE_ID, PIPELINE_NAME, PIPELINE_STAGE, PIPELINE_STAGE_ID, UPDATE_TYPE } from '../constants/keyPaths';
export var getUpdateType = getIn(UPDATE_TYPE);
export var getPipelineId = getIn(PIPELINE_ID);
export var getPipelineName = getIn(PIPELINE_NAME);
export var getPipelineStageId = getIn(PIPELINE_STAGE_ID);
export var getPipelineStage = getIn(PIPELINE_STAGE);