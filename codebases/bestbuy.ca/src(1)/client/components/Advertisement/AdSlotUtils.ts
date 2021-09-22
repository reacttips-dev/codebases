import {
    SectionData,
    OfferItem,
    MerchItem,
    SectionItemTypes,
    CustomContentType,
    GlobalCMSContext,
    GlobalCMSContextItem,
    ContextItemTypes,
    GlobalCustomContentList,
    GlobalCustomContentType,
    GlobalCustomContent,
} from "models";
import {AdItem, AvailableAdFormats} from "components/Advertisement";

const hasSectionItems = (section: SectionData): boolean =>
    section && section.items && section.items.length > 0 && !!section.items[0];

const isGoogleAdSlotItem = (item: OfferItem | MerchItem) =>
    item && item.type === SectionItemTypes.customContent && item.customContentType === CustomContentType.adSlotGoogle;

const isGoogleAdSlotSection = (section: SectionData) =>
    hasSectionItems(section) && isGoogleAdSlotItem(section.items[0]);

const isCustomContentList = (contextItem: GlobalCMSContextItem) =>
    contextItem && contextItem.type === ContextItemTypes.customContentList;

const isGlobalCustomContentAdSlot = (contextItem: GlobalCMSContextItem) =>
    contextItem &&
    contextItem.type === ContextItemTypes.customContent &&
    contextItem.customContentType === GlobalCustomContentType.adSlotGoogle;

export const buildAdItemsFromGlobalContentContext = (
    globalContentContext: GlobalCMSContext | SectionData,
): AdItem[] => {
    if (!globalContentContext || !globalContentContext.items || globalContentContext.items.length === 0) {
        return [];
    }

    const adItems: AdItem[] = [];

    const contextItems = globalContentContext.items || [];

    contextItems.forEach((contextItem) => {
        if (isCustomContentList(contextItem)) {
            (contextItem as GlobalCustomContentList).customContentList.forEach((customContentItem) => {
                if (isGlobalCustomContentAdSlot(customContentItem)) {
                    adItems.push({
                        format: customContentItem.values.format as AvailableAdFormats,
                        id: customContentItem.values.id,
                    });
                }
            });
        } else if (isGlobalCustomContentAdSlot(contextItem)) {
            adItems.push({
                format: (contextItem as GlobalCustomContent).values.format as AvailableAdFormats,
                id: (contextItem as GlobalCustomContent).values.id,
            });
        }
    });

    return adItems;
};

export const buildAdItemsFromSectionData = (sectionList: SectionData[]) => {
    if (!sectionList || sectionList.length === 0) {
        return [];
    }

    const adItems: AdItem[] = [];

    const getAdListKeyFromSectionItem = (item) => {
        if (item.hasOwnProperty("offerList")) {
            return "offerList";
        } else if (item.hasOwnProperty("featureBannerList")) {
            return "featureBannerList";
        } else {
            return false;
        }
    };

    const getAdItemsFromValidNonGoogleAdSections = (section: SectionData) => {
        const firstSectionItem = section.items[0];
        const adListKey = getAdListKeyFromSectionItem(firstSectionItem);
        if (adListKey) {
            firstSectionItem[adListKey].forEach((item: OfferItem | MerchItem) => {
                if (isGoogleAdSlotItem(item) && (item as MerchItem).values.format) {
                    adItems.push({
                        format: (item as MerchItem).values.format as AvailableAdFormats,
                        id: (item as MerchItem).values.id,
                    });
                }
            });
        }
    };

    sectionList = sectionList || [];

    sectionList.forEach((section: SectionData) => {
        if (isGoogleAdSlotSection(section)) {
            section.items.forEach((item) => {
                adItems.push({
                    format: item.values.format as AvailableAdFormats,
                    id: item.values.id,
                });
            });
        } else if (hasSectionItems(section)) {
            getAdItemsFromValidNonGoogleAdSections(section);
        }
    });

    return adItems;
};

export const buildAdItemsFromGlobalContentContexts = (
    globalContentContexts: Array<GlobalCMSContext | SectionData>,
): AdItem[] => {
    return globalContentContexts && globalContentContexts.length > 0
        ? globalContentContexts
              .map((globalContext) => buildAdItemsFromGlobalContentContext(globalContext))
              .reduce((combinedAdItems, globalContextAdItems) => combinedAdItems.concat(globalContextAdItems), [])
        : [];
};

export const updateOfferListAdRenderedStatus = (
    sectionList: SectionData[],
    adId: string,
    isAdLoaded: boolean,
): SectionData[] => {
    let changed = false;
    const changedSectionLists = sectionList.map((section: SectionData) => {
        if (hasSectionItems(section) && section.items[0].hasOwnProperty("offerList")) {
            const firstSectionItem = section.items[0];
            return {
                ...section,
                items: [
                    {
                        ...firstSectionItem,
                        offerList: (firstSectionItem as any).offerList.map((item: MerchItem) => {
                            if (isGoogleAdSlotItem(item) && item.values.id === adId && item.adLoaded !== isAdLoaded) {
                                changed = true;
                                return {
                                    ...item,
                                    adLoaded: isAdLoaded,
                                };
                            }
                            return item;
                        }),
                    },
                ],
            };
        }
        return section;
    });

    return changed ? changedSectionLists : [];
};

export const getAdSizeForFormat = (format: string) => {
    let sizes;
    switch (format) {
        case AvailableAdFormats.leaderboard:
            sizes = {
                m: [[728, 90]],
                s: [[728, 90]],
                xs: [[320, 50]],
            };
            break;
        case AvailableAdFormats.billboard:
            sizes = {
                m: [[970, 250]],
                s: [[970, 250]],
                xs: [[300, 250]],
            };
            break;
        case AvailableAdFormats.mediumRectangle:
            sizes = {
                m: [[300, 250]],
                s: [[300, 250]],
                xs: [[320, 50]],
            };
            break;
        case AvailableAdFormats.barBanner:
            sizes = {
                m: [[1232, 123]],
                s: [[927, 115]],
                xs: [[450, 75]],
            };
            break;
        case AvailableAdFormats.featureBanner:
            sizes = {
                m: [[1232, 308]],
                s: [[927, 232]],
                xs: [[539, 539]],
            };
            break;
        case AvailableAdFormats.offer:
            sizes = {
                m: [[290, 286]],
                s: [[290, 286]],
                xs: [[276, 286]],
            };
            break;
        case AvailableAdFormats.pencilAd:
            sizes = {
                m: [[1232, 33]],
                s: [[927, 33]],
                xs: [[450, 33]],
            };
            break;
    }

    return sizes;
};
