import type { WhatsNewCardState } from '../store/schema/WhatsNewCardState';
import { getWhatsNew } from '../services/getWhatsNew';

export function getWhatsNewCardsFromServer(): Promise<WhatsNewCardState[]> {
    return getWhatsNew();
}
