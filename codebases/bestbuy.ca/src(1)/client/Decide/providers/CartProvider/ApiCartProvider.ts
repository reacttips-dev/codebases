import * as url from "url";
import {LineItemType, ServicePlanType} from "@bbyca/ecomm-checkout-components";

import fetch from "utils/fetch";
import {
    Region,
    CartLineItem,
    CartApiResponse,
    Warranty,
    WarrantySubType,
    WarrantyType,
    UserDefaultLocation,
} from "models";
import getLogger from "common/logging/getLogger";
import {HttpRequestType} from "errors";

export default class ApiCartProvider {
    constructor(private baseUrl: string, private includeCredentials: boolean = false) {}

    public async getCart(
        locale: Locale,
        postalCode: string,
        regionCode: Region,
        cartId: string,
        locationIds: string[],
    ) {
        const cartApiUrl = url.parse(`${this.baseUrl}/carts`);
        if (!postalCode) {
            postalCode = UserDefaultLocation.postalCode;
            regionCode = UserDefaultLocation.regionCode;
        }

        const formattedCartApiUrl = url.format({
            ...cartApiUrl,
            query: {
                basketId: cartId,
                postalCode,
                regionCode,
                locationIds: locationIds?.join("|") || [],
            },
        });
        try {
            const response = await fetch(formattedCartApiUrl, HttpRequestType.CartApi, {
                headers: {
                    "Accept-Language": locale,
                    "Content-Type": "application/json",

                    // needed for IE11 on Windows 10 machines to prevent caching of response - UB-99411
                    "Expires": "Sat, 01 Jan 2000 00:00:00 GMT",
                    "If-Modified-Since": "0"
                },
                ...(this.includeCredentials && {credentials: "include"}),
            });
            const json: CartApiResponse = await response.json();
            return {
                ...json,
                lineItems: this.transformLineItems(json.lineItems),
            };
        } catch (error) {
            getLogger().error(new Error("Error when calling get carts. Error is: " + error));
            throw error;
        }
    }

    private transformLineItems(lineItems: CartLineItem[] = []): CartLineItem[] {
        const remappedLineItems: CartLineItem[] = lineItems.map((lineItem: any) => {
            const newLineItem = {
                ...lineItem,
                childLineItems: lineItem.children,
                selectedWarranty: this.getSelectedGspForLineItemSku(lineItem),
            };
            delete newLineItem.children;
            return newLineItem;
        });
        return remappedLineItems;
    }

    private getSelectedGspForLineItemSku = (lineItem) => {
        let gspPlanFound: Warranty | null = null;
        if (lineItem && lineItem.children) {
            for (const childLineItem of lineItem.children) {
                if (childLineItem.type === LineItemType.Psp) {
                    const availableServicePlan =
                        lineItem.product.availableServicePlans &&
                        lineItem.product.availableServicePlans.find((servicePlan) => {
                            return servicePlan.sku === childLineItem.product.sku;
                        });
                    if (availableServicePlan) {
                        const isPsp = availableServicePlan.servicePlanType === ServicePlanType.PSP;

                        gspPlanFound = {
                            parentSku: lineItem.product.sku,
                            regularPrice: childLineItem.product.offer.regularPrice,
                            sku: childLineItem.product.sku,
                            subType: isPsp ? WarrantySubType.InHome : WarrantySubType.InStore,
                            termMonths: availableServicePlan.termMonths,
                            title: childLineItem.product.name,
                            type: isPsp ? WarrantyType.PSP : WarrantyType.PRP,
                        };
                    }
                    break;
                }
            }
        }

        return gspPlanFound;
    };
}
