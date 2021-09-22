import type DelayedSendStore from './schema/DelayedSendStore';
import { createStore } from 'satcheljs';

const defaultDelayedSendStore: DelayedSendStore = {
    delayedMailItems: [],
};

export const getStore = createStore<DelayedSendStore>('delayedSend', defaultDelayedSendStore);
export default getStore();
