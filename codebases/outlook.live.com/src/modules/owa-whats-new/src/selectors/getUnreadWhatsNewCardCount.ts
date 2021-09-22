import { getStore } from '../store/store';
import { WhatsNewCardStatus } from '../store/schema/WhatsNewCardStatus';

export function getUnreadWhatsNewCardCount(): number {
    let store = getStore();

    if (store.cards) {
        return Object.keys(store.cards).filter(
            key => store.cards[key].status === WhatsNewCardStatus.Unread
        ).length;
    }

    return 0;
}
