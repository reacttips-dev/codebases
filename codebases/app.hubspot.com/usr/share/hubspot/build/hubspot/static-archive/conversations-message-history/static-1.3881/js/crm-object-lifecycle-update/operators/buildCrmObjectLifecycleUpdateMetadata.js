'use es6';

import { TICKET } from '../constants/objectTypes';
import TicketUpdateMetadata from '../records/TicketUpdateMetadata';
import TicketAssociationUpdateMetadata from '../records/TicketAssociationUpdateMetadata';
import { ASSOCIATION_UPDATED } from '../constants/updateTypes';
import { getUpdateType } from './ticketUpdateMetadataGetters';
export var buildCrmObjectLifecycleUpdateMetadata = function buildCrmObjectLifecycleUpdateMetadata(type, updateProps) {
  switch (type) {
    case TICKET:
      if (getUpdateType(updateProps) === ASSOCIATION_UPDATED) {
        return new TicketAssociationUpdateMetadata(updateProps);
      }

      return new TicketUpdateMetadata(updateProps);

    default:
      return null;
  }
};