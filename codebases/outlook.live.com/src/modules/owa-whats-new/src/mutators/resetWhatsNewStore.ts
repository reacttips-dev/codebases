import { mutatorAction } from 'satcheljs';
import type { WhatsNewCardStatesMap } from '../store/schema/WhatsNewCardStatesMap';
import { getStore } from '../store/store';

export let resetWhatsNewStore = mutatorAction(
    'resetWhatsNewStore',
    (cards: WhatsNewCardStatesMap) => {
        getStore().cards = cards;
    }
);
