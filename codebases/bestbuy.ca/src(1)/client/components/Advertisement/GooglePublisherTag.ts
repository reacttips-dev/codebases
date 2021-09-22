import {AdItem, AvailableAdFormats} from "./";
import {getAdSizeForFormat} from "./AdSlotUtils";
import getLogger from "common/logging/getLogger";

/**
 * @classdesc - Class providing chained methods for constructing, fetching and loding Google Ads
 * Reference: https://developers.google.com/doubleclick-gpt/reference
 */

export interface AdTargetingProps {
    lang: Locale;
    environment?: string;
    breadcrumb?: string;
}

export interface CategoryAdTargetingProps extends AdTargetingProps {
    categoryId: string;
    breadcrumb: string;
}

export interface DynamicContentPageAdTargetingProps extends AdTargetingProps {
    marketingPageId: string;
}

export interface SearchCollectionAdTargetingProps extends AdTargetingProps {
    collectionId: string;
}

export interface SearchQueryAdTargetingProps extends AdTargetingProps {
    query: string;
}

export interface SearchBrandAdTargetingProps extends AdTargetingProps {
    brandName: string;
}

export interface PDPAdTargetingProps extends AdTargetingProps {
    sku: string;
}

export interface GoogleAdsEvent {
    slot: GoogleAdsEventAdSlot;
    isEmpty: boolean;
}

export interface GoogleAdsEventAdSlot {
    getHtml: () => string;
    getAdUnitPath: () => string;
}

export class GooglePublisherTag {
    private googletag = undefined;

    constructor() {
        if (typeof window !== "undefined") {
            this.googletag = (window as any).googletag || {};
            this.googletag.cmd = this.googletag.cmd || [];
        }
    }

    /**
     * Constructs Google Ad slots
     * @param {AdItem[]} items - Advertisement items
     * @returns {GooglePublisherTag} The instance of class
     */
    public constructAdSlots = (items: AdItem[] = []): GooglePublisherTag => {
        if (!this.isGoogleTagAvailable() || !items.length) {
            return this;
        }
        this.googletag.cmd.push(() => this.googletag.destroySlots());
        items.forEach(this.constructAdSlot);
        return this;
    };

    /**
     * Constructs Google Ad slot
     * @param {AdItem} items - Advertisement item
     * @returns {GooglePublisherTag} The instance of class
     */
    public constructAdSlot = (item: AdItem): GooglePublisherTag => {
        if (!item) {
            return this;
        }
        const adFormat = item.format;
        const adId = item.id;
        if (AvailableAdFormats[adFormat] && adId) {
            this.googletag.cmd.push(() => {
                const size = this.buildAdSize(adFormat);
                const slot = this.defineAdSlot(adId);
                if (slot) {
                    if (size) {
                        slot.defineSizeMapping(size);
                    }
                    slot.setCollapseEmptyDiv(true).addService(this.googletag.pubads());
                }
            });
        }

        return this;
    };

    /**
     * Enables Google Ad services to fetch Ads in one single request
     * @param {AdTargetingProps} adTargetingProps - Object that holds properties used for adTargetingProps
     * @returns {GooglePublisherTag} The instance of class
     */
    public loadAds = (adTargetingProps?: AdTargetingProps): GooglePublisherTag => {
        if (!this.isGoogleTagAvailable()) {
            return this;
        }
        this.googletag.cmd.push(() => {
            const googlePubAdsService = this.googletag.pubads().clearTargeting();
            this.setTargetingThroughProps(googlePubAdsService, adTargetingProps).enableSingleRequest();
            this.googletag.enableServices();
        });
        return this;
    };

    /**
     * Adds a callback when an ad is rendered
     * @param {(event) => void} callbackOnAdRendered - A function that will be called ads render
     * @returns {GooglePublisherTag} The instance of class
     */
    public addEventListener = (
        callbackOnAdRendered: (adSlotId: string, adRendered: boolean, adSlot: GoogleAdsEventAdSlot) => void,
    ): GooglePublisherTag => {
        if (callbackOnAdRendered && this.isGoogleTagAvailable()) {
            this.googletag.cmd.push(() => {
                this.googletag.pubads().addEventListener("slotRenderEnded", (event: GoogleAdsEvent) => {
                    callbackOnAdRendered(event.slot.getAdUnitPath(), event && !event.isEmpty, event.slot);
                });
                this.googletag.pubads().addEventListener("slotOnload", (event: GoogleAdsEvent) => {
                    this.verifyAdDisplayDimension(event.slot.getAdUnitPath());
                });
            });
        }
        return this;
    };

    public refreshAds = (): GooglePublisherTag => {
        if (!this.isGoogleTagAvailable()) {
            return this;
        }
        this.googletag.cmd.push(() => {
            this.googletag.pubads().refresh();
        });

        return this;
    };

    private verifyAdDisplayDimension = (adId: string): void => {
        const TIME_TO_WAIT_BEFORE_CHECKING = 2000;

        setTimeout(() => {
            const container = document.getElementById(adId);
            const iframe = container && container.querySelector("iframe");

            if (iframe && iframe.height === "0") {
                getLogger().error(`Ad '${adId}' loaded, but failed to display.`);
            }
        }, TIME_TO_WAIT_BEFORE_CHECKING);
    };

    private setTargetingThroughProps = (googlePubAdsService, adTargetingProps: AdTargetingProps) => {
        if (adTargetingProps) {
            const adTargetingPropsKeys = Object.keys(adTargetingProps);
            adTargetingPropsKeys.forEach((key): void => {
                const value = adTargetingProps[key];
                if (key && value) {
                    googlePubAdsService.setTargeting(key, value);
                }
            });
        }
        return googlePubAdsService;
    };

    private isGoogleTagAvailable = () => {
        return this.googletag;
    };

    private buildAdSize = (format: AvailableAdFormats) => {
        let sizeMappingIAB = {
            m: [],
            s: [],
            xs: [],
        };

        const allowedFormats = [
            AvailableAdFormats.leaderboard,
            AvailableAdFormats.billboard,
            AvailableAdFormats.mediumRectangle,
        ];
        if (allowedFormats.indexOf(format) > -1) {
            sizeMappingIAB = getAdSizeForFormat(format);
        }

        return this.googletag
            .sizeMapping()
            .addSize([960, 0], ["fluid", ...sizeMappingIAB.m])
            .addSize([600, 0], ["fluid", ...sizeMappingIAB.s])
            .addSize([0, 0], ["fluid", ...sizeMappingIAB.xs])
            .build();
    };

    private defineAdSlot = (adId: string) => {
        return adId ? this.googletag.defineSlot(adId, "fluid", adId) : null;
    };
}

const googleAdProvider = new GooglePublisherTag();

export default googleAdProvider;
