'use es6';

import { DEFAULT_TICKET_PIPELINE_ID } from 'crm_data/settings/LocalSettingsKeys';
import TicketsPipelinesStore from 'crm_data/tickets/TicketsPipelinesStore';
import localSettings from '../../legacy/utils/localSettings';
export default {
  store: TicketsPipelinesStore,
  getPipelines: function getPipelines() {
    return TicketsPipelinesStore.get();
  },
  getDefaultPipeline: function getDefaultPipeline() {
    return localSettings.get(DEFAULT_TICKET_PIPELINE_ID);
  },
  savePipelineSettings: function savePipelineSettings(pipelineId) {
    var key = DEFAULT_TICKET_PIPELINE_ID;

    if (pipelineId) {
      localSettings.set(key, pipelineId);
    } else {
      localSettings.unset(key);
    }
  }
};