import type SharedMailboxState from './schema/SharedMailboxState';
import { createStore } from 'satcheljs';

export const getStore = createStore<SharedMailboxState>('sharedMailboxState', {
    initialized: false,
    isSharedMailbox: false,
});
