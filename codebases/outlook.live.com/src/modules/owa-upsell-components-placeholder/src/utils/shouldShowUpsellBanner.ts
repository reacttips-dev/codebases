import { isFeatureEnabled } from 'owa-feature-flags';
import { lazyInitializeBizBarIrisState, lazyBizBarArcStore } from 'owa-iris-store';
import { BannerType } from '../utils/BannerType';
import setUpsellBannerType from '../mutators/setUpsellBannerType';
import { isBrowserEDGECHROMIUM, isWinXp, isLinux, isChromiumOs, isWin10 } from 'owa-user-agent';
import {
    doesSupportProtocolHandlerRegistration,
    shouldShowMailtoProtocolUpsellBanner,
} from 'owa-mailto-protocol-handler';
import { lazyIsOutlookRecommendationEnabled } from 'owa-ocps-policy-store';

export const shouldShowUpsellBanner = async function (): Promise<boolean> {
    var isOutlookRecommendationEnabled = await lazyIsOutlookRecommendationEnabled.importAndExecute();

    if (
        isFeatureEnabled('fwk-mailtoProtocolHandler') &&
        doesSupportProtocolHandlerRegistration() &&
        shouldShowMailtoProtocolUpsellBanner()
    ) {
        setUpsellBannerType(BannerType.OWAMailHandlerUpsell);
        return true;
    } else if (
        isFeatureEnabled('iris-commercial-bizbar') &&
        isWin10() &&
        isOutlookRecommendationEnabled
    ) {
        return shouldShowIrisUpsellBanner(BannerType.CommercialBizBar);
    } else if (!isChromiumOs() && !isBrowserEDGECHROMIUM() && !isWinXp() && !isLinux()) {
        if (isFeatureEnabled('edge-iris-upsell-experiment')) {
            return shouldShowIrisUpsellBanner(BannerType.IrisUpsell);
        }
    }
    return false;
};

async function shouldShowIrisUpsellBanner(bannerType: BannerType): Promise<boolean> {
    let bizBarArcStore = await lazyBizBarArcStore.import();
    if (!bizBarArcStore?.message) {
        await lazyInitializeBizBarIrisState.importAndExecute();
    }
    setUpsellBannerType(bannerType);

    return bizBarArcStore.message ? true : false;
}
