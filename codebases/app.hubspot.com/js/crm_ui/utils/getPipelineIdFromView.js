'use es6';

import localSettings from '../legacy/utils/localSettings';
import { DEFAULT } from 'customer-data-objects/view/ViewTypes';
import { DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { DEFAULT_PIPELINE_ID, DEFAULT_TICKET_PIPELINE_ID } from 'crm_data/settings/LocalSettingsKeys';
export default function (view, defaultPipelineId, objectType) {
  var pipelineId = view.getIn(['state', 'pipelineId']);

  if (!pipelineId && view.get('type') === DEFAULT) {
    if (objectType === DEAL) {
      pipelineId = localSettings.get(DEFAULT_PIPELINE_ID);
    } else if (objectType === TICKET) {
      pipelineId = localSettings.get(DEFAULT_TICKET_PIPELINE_ID);
    }
  }

  return pipelineId || defaultPipelineId;
}