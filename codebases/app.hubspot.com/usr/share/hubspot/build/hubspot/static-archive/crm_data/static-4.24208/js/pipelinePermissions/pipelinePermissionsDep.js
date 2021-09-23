'use es6';

import PipelinePermissionsStore from './PipelinePermissionsStore';
import TicketsPipelinesStore from 'crm_data/tickets/TicketsPipelinesStore';
import { DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { getAccessLevel } from './getAccessLevel';
import { LOADING } from '../flux/LoadingStatus';
export var pipelinePermissionsDep = {
  stores: [TicketsPipelinesStore, PipelinePermissionsStore],
  deref: function deref(_ref) {
    var objectTypeId = _ref.objectTypeId;

    if (objectTypeId === DEAL_TYPE_ID) {
      return PipelinePermissionsStore.get(objectTypeId);
    } else if (objectTypeId === TICKET_TYPE_ID) {
      var ticketPipelines = TicketsPipelinesStore.get();

      if (!ticketPipelines) {
        return LOADING;
      }

      return ticketPipelines.map(function (pipeline) {
        return getAccessLevel(pipeline);
      }).toJS();
    }

    return {};
  }
};