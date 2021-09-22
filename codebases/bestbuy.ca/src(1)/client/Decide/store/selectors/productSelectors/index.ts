import {createSelector, Selector} from "reselect";
import {get} from "lodash-es";

import {State} from "store";
import {
    DetailedProduct,
    Warranty,
    RequiredProduct,
    AvailabilityReduxStore,
    ProductMedia,
    CellPhonePlanStore,
    PickupWithAddress,
    PickupStore
} from "models";
import getStoresSortedByAvailabilityAndDistance from "Decide/utils/getStoresSortedByAvailabilityAndDistance"

import {ProductState} from "../../../reducers/productReducer";

export const getProduct: Selector<State, ProductState> = (state: State) => state.product;

export const isAvailabilityError = createSelector<State, ProductState, boolean>([getProduct], (product) =>
    get(product, "isAvailabilityError"),
);

export const getProductAvailability = createSelector<State, ProductState, AvailabilityReduxStore>(
    [getProduct],
    (product) => get(product, "availability"),
);

export const getProductPickup = createSelector<State, AvailabilityReduxStore, PickupWithAddress>(
    [getProductAvailability],
    (productAvailability) => get(productAvailability, "pickup"),
);

export const getSortedPickupStores = createSelector<State, PickupWithAddress, PickupStore[]>(
    [getProductPickup],
    (productPickup) => getStoresSortedByAvailabilityAndDistance(get(productPickup, "stores") || []),
);

export const getProductData = createSelector<State, ProductState, DetailedProduct>([getProduct], (product) =>
    get(product, "product"),
);

export const getProductSku = createSelector<State, DetailedProduct, string>([getProductData], (productData) =>
    get(productData, "sku"),
);

export const isDisabledWithMCF = createSelector<State, ProductState, boolean>(
    [getProduct],
    (product) =>
        !!(
            product?.product?.isSpecialDelivery ||
            product?.product?.isPreorderable ||
            product?.product?.isMarketplace ||
            product?.product?.sku[0] === "M" ||
            product?.product?.sku[0] === "B" ||
            product?.availability?.isGiftCard ||
            product?.availability?.isService
        ),
);

export const getProductWarranties = createSelector<State, DetailedProduct, Warranty[]>(
    [getProductData],
    (productData) => get(productData, "warranties"),
);

export const getProductRequiredProducts = createSelector<State, DetailedProduct, RequiredProduct[]>(
    [getProductData],
    (productData) => get(productData, "requiredProducts"),
);

export const hasRequiredProducts = createSelector<State, ProductState["product"]["requiredProducts"], boolean>(
    [getProductRequiredProducts],
    (state) => state && state.length > 0,
);

export const getWarrantyTypeForProduct = createSelector<State, DetailedProduct, string>(
    [getProductData],
    (productData) => {
        return get(productData, "warranties[0].type");
    },
);

export const getCellPhonePlan = createSelector<State, DetailedProduct, CellPhonePlanStore>(
    [getProductData],
    (productData) => {
        return get(productData, "cellPhonePlan");
    },
);

export const selectProductMedia = createSelector<State, DetailedProduct, ProductMedia>(
    [getProductData],
    (productData) => {
        return get(productData, "media");
    },
);
