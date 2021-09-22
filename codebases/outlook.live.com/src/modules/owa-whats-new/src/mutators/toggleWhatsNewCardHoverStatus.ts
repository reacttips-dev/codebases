import { mutatorAction } from 'satcheljs';
import type { WhatsNewCardState } from '../store/schema/WhatsNewCardState';

export let toggleWhatsNewCardHoverStatus = mutatorAction(
    'toggleWhatsNewCardHoverStatus',
    (card: WhatsNewCardState, isHovered: boolean) => {
        card.isHovered = isHovered;
    }
);
