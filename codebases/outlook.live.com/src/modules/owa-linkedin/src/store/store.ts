import { createStore } from 'satcheljs';
import type { LinkedInStoreObject } from './schema/LinkedInStoreObject';

export let linkedInStore = createStore<LinkedInStoreObject>('linkedInStore', {
    status: null,
});
