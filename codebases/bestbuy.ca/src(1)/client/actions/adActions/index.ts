import {ActionCreatorsMapObject} from "redux";
import {GoogleAdsEventAdSlot} from "components/Advertisement/GooglePublisherTag";

export const adActionTypes = {
    adLoaded: "AD_LOADED",
};

export interface AdActionCreators extends ActionCreatorsMapObject {
    adLoaded: (adId: string, adRendered: boolean, adSlot: GoogleAdsEventAdSlot) => any;
}

export const adActionCreators: AdActionCreators = (() => {
    const adLoaded = (adId: string, adRendered: boolean, adSlot: GoogleAdsEventAdSlot) => {
        return {
            type: adActionTypes.adLoaded,
            adId,
            adRendered,
            isSponsored: isSponsored(adSlot),
            isNativeAd: isNativeAd(adSlot),
        };
    };

    return {
        adLoaded,
    };
})();

const isSponsored = (adSlot) => {
    const html = adSlot.getHtml();
    return /shouldRenderSponsoredLabel = "YES"/.test(html);
};

const isNativeAd = (adSlot) => {
    const html = adSlot.getHtml();
    return /googleNativeAd_wrapper/.test(html);
};
