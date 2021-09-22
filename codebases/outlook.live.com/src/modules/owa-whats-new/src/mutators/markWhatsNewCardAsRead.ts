import { mutatorAction } from 'satcheljs';
import type { WhatsNewCardState } from '../store/schema/WhatsNewCardState';
import { WhatsNewCardStatus } from '../store/schema/WhatsNewCardStatus';

export let markWhatsNewCardAsRead = mutatorAction(
    'markWhatsNewCardAsRead',
    (card: WhatsNewCardState) => {
        card.status = WhatsNewCardStatus.Read;
    }
);
