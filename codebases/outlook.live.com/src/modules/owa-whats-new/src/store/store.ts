import { createStore } from 'satcheljs';
import type { WhatsNewStore } from './schema/WhatsNewStore';

export let getStore = createStore<WhatsNewStore>('whatsNewStore', {
    cards: null,
    disablePauseInboxTryIt: false,
});
