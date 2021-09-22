import { createStore } from 'satcheljs';
import type { UpsellBizBarState } from './schema/upsellBizBarState';

export let bizBarArcStore = createStore<UpsellBizBarState>('UpsellBizBarState', {
    message: '',
    userRedirectionText: '',
    userRedirectionUrl: '',
    textColor: '',
    backgroundColor: '',
    urlTextColor: '',
    iconUri: '',
    trackingBaseUri: '',
    impressionBaseUri: '',
})();
