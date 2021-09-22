import type { EntityType } from '../../data/schema/SubstrateSearchRequest';
import type ItemTypesFilter from 'owa-service/lib/contract/ItemTypesFilter';

export default function convertItemTypesToEntityType(itemTypes: ItemTypesFilter): EntityType {
    if (!itemTypes) {
        return 'MailItems';
    }

    switch (itemTypes) {
        case 'CalendarItems':
            return 'Event';
        case 'MailConversations':
            return 'Conversation';
        case 'MessageItems':
            return 'Email';
        case 'MailItems':
        default:
            return 'Message';
    }
}
