import {
    productActionTypes as productDetailActionTypes,
    ProductActionCreators as ProductDetailActionCreators,
    productActionCreators as productDetailActionCreators,
} from "./product";

import {productReviewActionTypes, productReviewActionCreators, ProductReviewActionCreators} from "./customerReviews";

import {cellPhonePlanActionTypes, cellPhonePlanActionCreators, CellPhonePlanActionCreators} from "./cellPhonePlan";

import {productMediaActionTypes, productMediaActionCreators, ProductMediaActionCreators} from "./productMedia";

export const productActionTypes = {
    ...productDetailActionTypes,
    ...productReviewActionTypes,
    ...cellPhonePlanActionTypes,
    ...productMediaActionTypes,
};

export type ProductActionCreators = ProductDetailActionCreators &
    ProductReviewActionCreators &
    CellPhonePlanActionCreators &
    ProductMediaActionCreators;

export const productActionCreators: ProductActionCreators = {
    ...productDetailActionCreators,
    ...productReviewActionCreators,
    ...cellPhonePlanActionCreators,
    ...productMediaActionCreators,
};
