/**
 * These are selectors for the cartPage state
 */
import * as React from "react";
import {createSelector} from "reselect";
import {get} from "lodash-es";
import {LineItemType, RequiredProduct, BasketShippingStatus} from "@bbyca/ecomm-checkout-components";
import {FormattedMessage} from "react-intl";
import {RequiredProductsState} from "@bbyca/ecomm-checkout-components/dist/redux/requiredProducts";
import * as url from "url";

import {getManufacturersWarrantyUrl} from "utils/productWarranty";
import State from "store";
import {getIntlLanguage, getIntlLocale} from "store/selectors/intlSelectors";
import {ClientConfig} from "config";
import {
    getConfig,
    getFeatureToggle,
    getDataSources,
    getUserShippingLocationPostalCode,
    getUserShippingLocationRegionCode,
    isKiosk as isKioskSelector,
    isLightWeightBasketEnabled,
    isQueueItEnabled as isQueueItEnabledSelector,
} from "store/selectors";
import {Warranty, CartLineItem, Summary, ChildLineItem, Promotion, CartAvailability} from "models";
import {CartPageState, CheckoutFlow} from "reducers";

import {getRequiredProducts as getRequiredProductsState} from "../../../store/selectors/requiredProducts";
import {TermsAndConditionsLink} from "../../../components/TermsAndConditions";
import messages from "../translations/messages";

const isPsp = (lineItem: ChildLineItem): boolean => {
    return lineItem.type === LineItemType.Psp;
};

export const getBasketServiceApiUrl = createSelector<State, ClientConfig["dataSources"] | undefined, string>(
    [getDataSources],
    (dataSources) => (dataSources && dataSources.basketServiceApiUrl) || "",
);

export const getCartPage = (state: State): CartPageState => state.cartPage;

export const getLineItems = createSelector<State, CartPageState, CartLineItem[] | []>(
    [getCartPage],
    (cartPageState) => cartPageState.lineItems || [],
);

export const getIsLoading = createSelector<State, CartPageState, boolean>(
    [getCartPage],
    (cartPageState) => cartPageState.isLoading,
);

export const getSummary = createSelector<State, CartPageState, Summary>(
    [getCartPage],
    (cartPageState) => cartPageState.summary,
);

export const getAvailability = createSelector<State, CartPageState, CartAvailability>(
    [getCartPage],
    (cartPageState) => cartPageState.availability,
);

export const getBasketId = createSelector<State, CartPageState, string>(
    [getCartPage],
    (cartPageState) => cartPageState.basketId,
);

export const getPromotions = createSelector<State, CartPageState, Promotion[]>(
    [getCartPage],
    (cartPageState) => cartPageState && cartPageState.promotions,
);

export const getCartShippingStatus = createSelector<State, CartAvailability, BasketShippingStatus>(
    [getAvailability],
    (availability) => availability.shipping.status,
);

export const getSelectedCheckoutFlow = createSelector<State, CartPageState, CheckoutFlow>(
    [getCartPage],
    (cartPageState) => cartPageState.selectedCheckoutFlow,
);

export const getLineItemsWithWarrantyFromCart = createSelector<State, CartLineItem[], CartLineItem[]>(
    [getLineItems],
    (lineItems) => {
        return lineItems.filter((lineItem) => {
            if (!lineItem.removed && !lineItem.savedForLater && lineItem.childLineItems) {
                return lineItem.childLineItems.filter(isPsp).length > 0;
            }
            return false;
        });
    },
);

export const getManufacturersWarrantyLinks = createSelector<State, CartLineItem[], Language, TermsAndConditionsLink[]>(
    [getLineItemsWithWarrantyFromCart, getIntlLanguage],
    (lineItems, language) => {
        return lineItems.map(
            (lineItem): TermsAndConditionsLink => {
                return {
                    href: getManufacturersWarrantyUrl(language, lineItem.product.sku),
                    dataAutomation: "geeksquad-manufacturer-warranty-link",
                    text: (
                        <FormattedMessage
                            values={{product: lineItem.product.name}}
                            {...messages.manufacturerWarrantyLink}
                        />
                    ),
                    openNewTab: true,
                };
            },
        );
    },
);

export const lineItemHasWarranty = (lineItemId: string) =>
    createSelector<State, CartLineItem[], boolean>([getLineItemsWithWarrantyFromCart], (lineItems) =>
        lineItems.some((lineItem) => lineItem.id === lineItemId),
    );

export const getLineItemById = (lineItemId: string) =>
    createSelector<State, CartLineItem[], CartLineItem | undefined>([getLineItems], (lineItems) =>
        lineItems.find((item) => item.id === lineItemId),
    );

export const getLineItemBySku = (sku: string) =>
    createSelector<State, CartLineItem[], CartLineItem | undefined>([getLineItems], (lineItems) =>
        lineItems.find((item) => item.product.sku === sku),
    );

export const getChildLineItemById = (childLineItemId: string) =>
    createSelector<State, CartLineItem[], ChildLineItem | undefined>([getLineItems], (lineItemsMap) => {
        let itemFound;
        lineItemsMap.find((lineItem) => {
            return (
                lineItem.childLineItems &&
                lineItem.childLineItems.find((childLineItem) => {
                    if (childLineItem.id === childLineItemId) {
                        itemFound = childLineItem;
                        return true;
                    }
                    return false;
                })
            );
        });
        return itemFound;
    });

export const hasWarrantyInCart = createSelector<State, CartLineItem[], boolean>(
    [getLineItemsWithWarrantyFromCart],
    (lineItems) => lineItems.length > 0,
);

export const getSkuToRequiredProductsMap = createSelector<
    State,
    RequiredProductsState,
    CartLineItem[],
    Map<string, {isLoading: boolean; requiredProducts: RequiredProduct[]; warranties: Warranty[]}>
>([getRequiredProductsState, getLineItems], (requiredProducts, lineItems) => {
    const skuRequiredProductsMap = new Map();
    lineItems.forEach((lineItem) => {
        const sku = lineItem.product.sku;
        const mappedRequiredProduct = requiredProducts[sku];
        if (mappedRequiredProduct) {
            const requiredProductInfo = {
                isLoading: mappedRequiredProduct.isLoading,
                requiredProducts: mappedRequiredProduct.products,
                warranties: mappedRequiredProduct.warranties,
            };
            skuRequiredProductsMap.set(sku, requiredProductInfo);
        }
    });
    return skuRequiredProductsMap;
});

export const getGspChildForLineItem = (sku: string) =>
    createSelector<State, CartLineItem[], ChildLineItem | undefined>([getLineItems], (lineItems) => {
        const lineItem = lineItems.find((item: CartLineItem) => item.product.sku === sku);
        if (lineItem && lineItem.childLineItems && lineItem.childLineItems.length > 0) {
            return lineItem.childLineItems.find(isPsp);
        }
        return undefined;
    });

export const getMasterPassConfig = createSelector(
    [getConfig, isLightWeightBasketEnabled],
    (config, isLWBasketEnabled) => {
        const masterPass = config.checkout && config.checkout.masterPass;
        return {
            allowedCardTypes: get(masterPass, "allowedCardTypes", ""),
            buttonImageUrl: get(masterPass, "buttonImageUrl", ""),
            checkoutId: get(masterPass, "checkoutId", ""),
            isEnabled: !isLWBasketEnabled && get(masterPass, "isEnabled", false),
            jsLibraryUrl: get(masterPass, "jsLibraryUrl", ""),
        };
    },
);

export const getNonQPUableSkusInCart = createSelector([getLineItems], (lineItems): string[] =>
    lineItems
        .filter(({removed, savedForLater, availability}) => {
            return !availability?.pickup?.purchasable && removed !== true && savedForLater !== true;
        })
        .map(({product}) => product.sku),
);

export const getLineItemsNotRemovedOrSaved = createSelector([getLineItems], (lineItems): CartLineItem[] =>
    lineItems.filter(({removed, savedForLater}) => {
        return removed !== true && savedForLater !== true;
    }),
);

export interface CheckoutButtonData {
    url: string;
    requireSignIn: boolean;
}

export const getCheckoutButtonData = createSelector(
    [
        getBasketId,
        getConfig,
        getUserShippingLocationRegionCode,
        getUserShippingLocationPostalCode,
        isKioskSelector,
        isQueueItEnabledSelector,
        getNonQPUableSkusInCart,
        getSelectedCheckoutFlow,
        getIntlLocale,
    ],
    (
        basketId,
        config,
        regionCode,
        postalCode,
        isKiosk,
        isQueueItEnabled,
        nonQPUableSkus,
        selectedCheckoutFlow,
        locale,
    ): CheckoutButtonData => {
        const {checkout: unParsedCheckoutUri} = config.appPaths;
        const checkoutUrl = url.parse(unParsedCheckoutUri, true);
        let requireSignIn = true;

        if (selectedCheckoutFlow === CheckoutFlow.pickUpAtAStore) {
            const omitParam = nonQPUableSkus.length ? `&om=${nonQPUableSkus.join(",")}` : "";
            const returnUrlPath = locale === "en-CA" ? "basket" : "panier";
            checkoutUrl.hash = `/${locale}/reserve-pickup/pickup-store/?postalCode=${postalCode}&regionCode=${regionCode}&isItemInCart=true&basketId=${basketId}${omitParam}&returnUrl=/${locale}/${returnUrlPath}`;
            requireSignIn = false;
        } else {
            checkoutUrl.hash = `/${locale}/shipping/${regionCode}/${postalCode}`;
        }
        if (isKiosk) {
            requireSignIn = false;
        }
        if (isQueueItEnabled && !isKiosk) {
            checkoutUrl.query = {qit: "1"};
        }

        return {
            url: url.format(checkoutUrl),
            requireSignIn,
        };
    },
);
