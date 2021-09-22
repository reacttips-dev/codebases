import loadTrustedSendersAndDomains from '../services/loadTrustedSendersAndDomains';
import store from '../store/store';
import { action } from 'satcheljs/lib/legacy';

export default action('getTrustedSendersAndDomains')(function getTrustedSendersAndDomains() {
    if (!store.trustedSendersAndDomains) {
        loadTrustedSendersAndDomains().then(
            action('updateTrustedSendersAndDomains')(function updateTrustedSendersAndDomains(
                trustedSendersAndDomains: string[]
            ) {
                if (trustedSendersAndDomains) {
                    store.trustedSendersAndDomains = trustedSendersAndDomains;
                }
            })
        );
    }
});
