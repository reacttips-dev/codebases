import { arcStore } from '../store/ArcStore';
import { mutatorAction } from 'satcheljs';
import type { ArcApiResponse, LeftNavUpsellAdContent } from '../service/schema/arcApiResponse';

export default mutatorAction('setLeftNavIrisState', (state: ArcApiResponse) => {
    let adData = state?.ad as LeftNavUpsellAdContent;
    if (adData) {
        arcStore.message = adData.body;
        arcStore.iconUri = adData.icon;
        arcStore.textColor = adData.textColor;
        arcStore.userRedirectionUrl = adData.ctaUrl;
        arcStore.trackingBaseUri = state.tracking?.baseUri;
        arcStore.impressionBaseUri = state.prm?._imp;
    }
});
