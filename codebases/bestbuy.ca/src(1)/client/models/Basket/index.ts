import {
    LineItemType,
    AvailableServicePlan,
    IChildItem,
    IDiscount,
    ISku,
} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities";
import {
    AvailabilityShippingStatus,
    Availabilities,
    ShippingStatus,
    AvailabilityPickupStatus,
} from "models/Availability";
import {Region} from "models/Region";
import {Warranty} from "models/DetailedProduct";
import {BasketShippingStatus} from "@bbyca/ecomm-checkout-components";

export enum RequiredPartsCartStatus {
    isInCart = "isInCart",
    notInCart = "notInCart",
    initial = "initial",
}
// temp: Just until we remove the mappers
export interface ShipmentLineItem {
    availabilities?: Availabilities;
    availableServicePlans?: AvailableServicePlan[];
    children?: IChildItem[];
    displayEhfRegions: Region[];
    errorType?: string;
    id: string;
    isLightweightBasketEnabled?: boolean;
    isRpuEnabled?: boolean;
    itemLevelDiscounts?: IDiscount[];
    lineItemType: LineItemType;
    purchasable: boolean;
    quantity: number;
    regionCode: Region;
    removed?: boolean;
    requiresAgeVerification?: boolean;
    shippingStatus: AvailabilityShippingStatus;
    sku: ISku;
    totalPrice: number;
    totalPurchasePrice: number;
    totalSavings: number;
    subTotal: number;
}

export interface CartLineItem {
    id: string;
    type: LineItemType;
    product: Product;
    summary: Summary;
    childLineItems?: ChildLineItem[];
    promotions?: Promotion[];
    shippingStatus: AvailabilityShippingStatus;
    removed?: boolean;
    selectedWarranty: Warranty | null;
    availability: CartLineItemAvailability;
    savedForLater?: boolean;
    saveForLaterError?: boolean;
}

export interface CartLineItemMap {
    [key: string]: CartLineItem;
}

export interface ChildLineItem {
    id: string;
    type: LineItemType;
    product: ChildProduct;
    summary: Summary;
    promotions?: Promotion[];
    purchasable: boolean; // TODO: Update Basket API to return this
}

export interface ChildProduct {
    sku: string;
    name: string;
    thumbnailUrl: string;
    seoText: string;
    requiresAgeVerification: boolean;
    offer: Offer;
}

export interface Product {
    sku: string;
    name: string;
    thumbnailUrl: string;
    seoText: string;
    requiresAgeVerification: boolean;
    offer: Offer;
    availableServicePlans?: ServicePlan[];
}

export interface Offer {
    id: string;
    regularPrice: number;
    purchasePrice: number;
    ehf?: number;
    onSale: boolean;
    seller: Seller;
    orderLimit?: number;
    saleEnd?: string;
}

export interface Seller {
    id: string;
    name: string;
}

export interface ServicePlan {
    servicePlanType: ServicePlanType;
    sku: string;
    name: string;
    offer: {
        regularPrice: number;
    };
    termMonths: number;
}

export declare enum ServicePlanType {
    PRP = "PRP",
    PSP = "PSP",
}

export interface Summary {
    ehf?: number;
    quantity: number;
    savings: number;
    shipping?: number;
    taxes?: number;
    subtotal: number;
    total: number;
}

export interface Promotion {
    id: string;
    name: string;
    description: string;
    amount: number;
}

export interface CartAvailability {
    shipping: {
        purchasable: boolean;
        status: BasketShippingStatus;
    };
}

export interface CartLineItemAvailability {
    pickup: {
        purchasable: boolean;
        status: AvailabilityPickupStatus;
    };
    shipping: {
        purchasable: boolean;
        status: AvailabilityShippingStatus;
    };
}

export interface CartApiResponse {
    lineItems: CartLineItem[];
    summary: Summary;
    availability: CartAvailability;
    basketId: string;
    promotions: Promotion[];
}
