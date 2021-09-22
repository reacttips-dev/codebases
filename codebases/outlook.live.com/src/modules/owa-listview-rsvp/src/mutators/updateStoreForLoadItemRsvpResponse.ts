import { mutatorAction } from 'satcheljs';
import type TableViewConversationRelation from 'owa-mail-list-store/lib/store/schema/TableViewConversationRelation';
import type ClientItem from 'owa-mail-store/lib/store/schema/ClientItem';

export const updateMailStoreForRsvp = mutatorAction(
    'updateMailStoreForRsvp',
    (mailStoreItem: ClientItem, shouldShowRSVP: boolean) => {
        mailStoreItem.shouldShowRSVP = shouldShowRSVP;
    }
);

export const updateTableRelationMapForRsvp = mutatorAction(
    'updateTableRelationMapForRsvp',
    (tableViewConversationRelation: TableViewConversationRelation, shouldShowRSVP: boolean) => {
        tableViewConversationRelation.shouldShowRSVP = shouldShowRSVP;
    }
);
