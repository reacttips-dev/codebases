import { bizBarArcStore } from '../store/BizBarArcStore';
import { mutatorAction } from 'satcheljs';
import type { ArcApiResponse, BizBarAdContent } from '../service/schema/arcApiResponse';

export default mutatorAction('setBizBarUpsellState', (state: ArcApiResponse) => {
    let adData = state?.ad as BizBarAdContent;
    if (adData) {
        bizBarArcStore.message = adData.bodyText;
        bizBarArcStore.userRedirectionText = adData.ctaText;
        bizBarArcStore.textColor = adData.bodyTextColor;
        bizBarArcStore.urlTextColor = adData.ctaTextColor;
        bizBarArcStore.backgroundColor = adData.backgroundColor;
        bizBarArcStore.userRedirectionUrl = adData.ctaUrl;
        bizBarArcStore.trackingBaseUri = state.tracking?.baseUri;
        bizBarArcStore.impressionBaseUri = state.prm?._imp;
    }
});
