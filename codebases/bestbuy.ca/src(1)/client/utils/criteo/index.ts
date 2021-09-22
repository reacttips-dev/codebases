import {Cookie, CookieUtils} from "@bbyca/bbyca-components";
import * as uuid from "uuid";
import {Key} from "@bbyca/apex-components";
import {
    ContextItemTypes,
    GlobalCMSContexts,
    GlobalCustomContent,
    GlobalCustomContentType,
    SearchPath,
    SearchPathTypes,
    SearchPathNames,
    OnSaleFilterValue,
    BestBuyOnlyValue,
} from "models";
import {
    SponsoredProductsFilterName,
    SponsoredProductsFilter,
    SponsoredProductsVendorType,
} from "providers/SponsoredProductsProvider";

import State from "store";

export const getCriteoCustomerId = () => {
    const isLoggedIn = !!CookieUtils.getCookie("ta");
    if (isLoggedIn) {
        const cartIdCookie = CookieUtils.getCookie("cartId");
        return cartIdCookie && cartIdCookie.value;
    }

    return "";
};

export const getCriteoVisitorId = () => {
    const criteoVisitorIdKey = "criteoVisitorId";
    const criteoVisitorIdCookie = CookieUtils.getCookie(criteoVisitorIdKey);
    const criteoVisitorId = criteoVisitorIdCookie && criteoVisitorIdCookie.value;

    if (criteoVisitorId) {
        return criteoVisitorId;
    } else {
        const newUserId = uuid();
        const newCriteoVisitorIdCookie = new Cookie(criteoVisitorIdKey, newUserId);
        const today = new Date();
        const nextYear = new Date();
        nextYear.setFullYear(today.getFullYear() + 1);
        newCriteoVisitorIdCookie.expires = nextYear;
        CookieUtils.setCookie(newCriteoVisitorIdCookie);
        return newUserId;
    }
};

export const sendCriteoImagePixel = (pixelUrl) => {
    const criteoImgPixel = document.createElement("img");
    criteoImgPixel.src = pixelUrl;
    const bodyElement = document.querySelector("body");
    bodyElement.appendChild(criteoImgPixel);
    criteoImgPixel.onload = () => {
        bodyElement.removeChild(criteoImgPixel);
    };
};

export const addPageSourceTrackingToCriteoUrl = (
    clientPDPUrl: string,
    criteoPDPUrl: string,
    pageKey: Key,
    slotNumber?: number,
) => {
    const queryParams = slotNumber ? `source=${pageKey}&adSlot=${slotNumber}` : `source=${pageKey}`;
    return (
        criteoPDPUrl &&
        clientPDPUrl &&
        criteoPDPUrl.replace(
            /dest=.*?(?=&|$)/,
            `dest=${encodeURIComponent(`${window.location.origin}${clientPDPUrl}?${queryParams}`)}`,
        )
    );
};

const _isValidBrandPathName = (pathName: string) =>
    _isLocalizedMatch(pathName, [SearchPathNames.Brands, SearchPathNames.Marque]);

const _isValidPricePathName = (pathName: string) =>
    _isLocalizedMatch(pathName, [SearchPathNames.Price, SearchPathNames.Prix]);

const _isBestBuyOnly = (pathName: string, value: string) =>
    value === BestBuyOnlyValue &&
    _isLocalizedMatch(pathName, [SearchPathNames.SoldAndShippedBy, SearchPathNames.VenduEtExpediePar]);

const _isOnSale = (pathName: string, value: string) =>
    _isLocalizedMatch(value, [OnSaleFilterValue.En, OnSaleFilterValue.Fr]) &&
    _isLocalizedMatch(pathName, [SearchPathNames.CurrentOffers, SearchPathNames.OffresCourantes]);

const _isLocalizedMatch = (pathName: string, matches: [string, string]) => {
    const lowercasePathName = pathName?.toLowerCase();
    return lowercasePathName === matches[0].toLowerCase() || lowercasePathName === matches[1].toLowerCase();
};

/**
 * This examines any filters that may have been selected and confirms they're compatible with Criteo. e.g. if a user
 * selects a filter like "Seller Name" or something unknown, the ad may not be appropriate so they're not added. But
 * if they select a brand and a price, say, then criteo is able to filter their list accordingly.
 */
export const hasCompatibleFilters = (
    pageType: GlobalCMSContexts.category | GlobalCMSContexts.search,
    paths: SearchPath[] = [],
) => {
    const searchPathType = pageType === GlobalCMSContexts.search ? SearchPathTypes.Query : SearchPathTypes.Category;

    // the UI lets the user select multiple price ranges, but the Criteo API only permits passing a single range
    const isSinglePriceFilter = paths.filter((path) => _isValidPricePathName(path.name)).length <= 1;
    if (!isSinglePriceFilter) {
        return false;
    }

    return paths.every(
        (path) =>
            path.type === searchPathType ||
            _isValidBrandPathName(path.name) ||
            _isValidPricePathName(path.name) ||
            _isBestBuyOnly(path.name, path.value) ||
            _isOnSale(path.name, path.value),
    );
};

export const buildBrandFilter = (paths): SponsoredProductsFilter[] => {
    const brandNames = paths.filter((path) => _isValidBrandPathName(path.name)).map((brand) => brand.value);
    return brandNames.length
        ? [
              {
                  filterName: SponsoredProductsFilterName.brand,
                  operator: "in",
                  value: brandNames,
              },
          ]
        : [];
};

export const buildPriceFilter = (paths): SponsoredProductsFilter[] => {
    const priceValue = paths.filter((path) => _isValidPricePathName(path.name)).map((brand) => brand.value);
    const lessThanExp = new RegExp("(Less than|Moins de) \\$?(\\d+)\\$?");
    const greaterThanExp = new RegExp("\\$?(\\d+)\\s?\\$? (and Up|et plus)");
    const priceRangeExp = new RegExp("\\$?(\\d+)\\$? (-|à) \\$?([\\d.,]+\\s?\\$?)");
    const isSinglePriceFilter = priceValue.length === 1;
    const convertPriceToFilterValue = (price: string) => [parseInt(price, 10).toString()] as string[];

    if (isSinglePriceFilter) {
        if (lessThanExp.test(priceValue)) {
            return [
                {
                    filterName: SponsoredProductsFilterName.price,
                    operator: "lt",
                    value: [lessThanExp.exec(priceValue)[2]],
                },
            ];
        } else if (isSinglePriceFilter && greaterThanExp.test(priceValue)) {
            return [
                {
                    filterName: SponsoredProductsFilterName.price,
                    operator: "gt",
                    value: [greaterThanExp.exec(priceValue)[1]],
                },
            ];
        } else if (isSinglePriceFilter && priceRangeExp.test(priceValue)) {
            return [
                {
                    filterName: SponsoredProductsFilterName.price,
                    operator: "ge",
                    value: convertPriceToFilterValue(priceRangeExp.exec(priceValue)[1]),
                },
                {
                    filterName: SponsoredProductsFilterName.price,
                    operator: "lt",
                    value: convertPriceToFilterValue(priceRangeExp.exec(priceValue)[3]),
                },
            ];
        }
    }
    return [];
};

// the VendorType filter is currently super basic. If the user has selected it in the UI, it passes. Otherwise the param
// isn't passed to Criteo. Down the road we could open it up to filter by marketplace only.
export const buildVendorTypeFilter = (paths: any[] | undefined): SponsoredProductsFilter[] => {
    if (!paths) {
        return [];
    }
    const vendorTypeFilter = paths.filter((path) => _isBestBuyOnly(path.name, path.value));
    return vendorTypeFilter.length
        ? [
              {
                  filterName: SponsoredProductsFilterName.vendortype,
                  operator: "eq",
                  value: [SponsoredProductsVendorType.bestBuy],
              },
          ]
        : [];
};

export const buildOnSaleFilter = (paths: any[] | undefined): SponsoredProductsFilter[] => {
    if (!paths) {
        return [];
    }

    const onSaleFilter = paths.filter((path) => _isOnSale(path.name, path.value));
    return onSaleFilter.length ? [{filterName: SponsoredProductsFilterName.onsale, operator: "eq", value: ["1"]}] : [];
};

export const isCriteoEnabled = (state: State, pageType: GlobalCMSContexts.search | GlobalCMSContexts.category) => {
    const globalContent = state.app.globalContent.content;

    if (!globalContent) {
        return false;
    }

    const isCriteoCustomContent = (item: GlobalCustomContent) =>
        item &&
        item.type === ContextItemTypes.customContent &&
        item.customContentType === GlobalCustomContentType.criteoSponsoredProducts;

    if (pageType === GlobalCMSContexts.category || pageType === GlobalCMSContexts.search) {
        const items = globalContent[pageType]?.items;
        return !!(items && globalContent[pageType].items.findIndex((item) => isCriteoCustomContent(item)) !== -1);
    }

    return false;
};
