import { createStore } from 'satcheljs';
import type { LeftNavIrisState } from './schema/leftNavIrisState';

export let arcStore = createStore<LeftNavIrisState>('LeftNavIrisState', {
    message: '',
    userRedirectionUrl: '',
    textColor: '',
    iconUri: '',
    trackingBaseUri: '',
    impressionBaseUri: '',
})();
