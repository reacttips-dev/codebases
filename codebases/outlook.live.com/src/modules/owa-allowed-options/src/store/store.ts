import type OwaAllowedOptionsState from './schema/OwaAllowedOptionsState';
import { createStore } from 'satcheljs';

export const getStore = createStore<OwaAllowedOptionsState>('allowedOptions', {
    allowedOptions: [],
});
