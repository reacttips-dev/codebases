import * as url from "url";
import {IChildItemAddition} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities";

import fetch from "utils/fetch";
import {Region} from "models";
import getLogger from "common/logging/getLogger";
import {HttpRequestType} from "errors";
import {StatusCode} from "../../../errors/StatusCode";

export default class ApiBasketProvider {
    private defaultHeaders = {
        "Content-Type": "application/json",
        "Accept-Language": this.locale,
    };

    constructor(private baseUrl: string, private locale: Locale) {}

    public async mergeBasket(postalCode: string, regionCode: Region, sourceCartId: string, destinationId: string) {
        const basketApiUrl = url.parse(`${this.baseUrl}/v2/baskets/${sourceCartId}/merge`);
        const formattedBasketApiUrl = url.format({
            ...basketApiUrl,
            query: {
                destinationId,
            },
        });
        try {
            const response = await fetch(formattedBasketApiUrl, HttpRequestType.MergeBasketApi, {
                headers: {
                    "Region-Code": regionCode,
                    "Postal-Code": postalCode,
                    ...this.defaultHeaders,
                },
                method: "PATCH",
            });
            const json = await response.json();
            return json;
        } catch (error) {
            const caughtError = new Error("Error when calling merge basket. Error is: " + error);
            getLogger().error(caughtError);
            return Promise.reject(caughtError);
        }
    }

    public async removeLineItem(postalCode: string, regionCode: Region, basketId: string, lineItemId: string) {
        const basketApiUrl = `${this.baseUrl}/v2/baskets/${basketId}/lineItems/${lineItemId}`;

        try {
            const response = await fetch(basketApiUrl, HttpRequestType.RemoveLineItem, {
                headers: {
                    "Region-Code": regionCode,
                    "Postal-Code": postalCode,
                    ...this.defaultHeaders,
                },
                method: "DELETE",
            });
            const json = await response.json();
            return json;
        } catch (error) {
            if (error.statusCode === StatusCode.Delete) {
                return Promise.resolve("Deleted");
            }
            const caughtError = new Error("Error when calling remove line item. Error is: " + error);
            getLogger().error(caughtError);
            return Promise.reject(caughtError);
        }
    }

    public async removeChildItem(
        postalCode: string,
        regionCode: Region,
        basketId: string,
        lineItemId: string,
        childItemId: string,
    ) {
        const basketApiUrl = `${this.baseUrl}/v2/baskets/${basketId}/lineitems/${lineItemId}/associateditems/${childItemId}`;
        try {
            const response = await fetch(basketApiUrl, HttpRequestType.RemoveChildItem, {
                headers: {
                    "Region-Code": regionCode,
                    "Postal-Code": postalCode,
                    ...this.defaultHeaders,
                },
                method: "DELETE",
            });
            const json = await response.json();
            return json;
        } catch (error) {
            const caughtError = new Error("Error when calling remove child line item. Error is: " + error);
            getLogger().error(caughtError);
            return Promise.reject(caughtError);
        }
    }

    public async addChildItem(
        postalCode: string,
        regionCode: Region,
        lineItemId: string,
        basketId: string,
        childItem: IChildItemAddition,
    ) {
        const basketApiUrl = `${this.baseUrl}/v2/baskets/${basketId}/lineitems/${lineItemId}/associateditems`;
        try {
            const response = await fetch(basketApiUrl, HttpRequestType.AddChildItem, {
                headers: {
                    "Region-Code": regionCode,
                    "Postal-Code": postalCode,
                    ...this.defaultHeaders,
                },
                method: "POST",
                body: JSON.stringify({lineItem: childItem}),
            });
            const json = await response.json();
            return json;
        } catch (error) {
            const caughtError = new Error("Error when calling add child item. Error is: " + error);
            getLogger().error(caughtError);
            return Promise.reject(caughtError);
        }
    }

    public async updateItemQuantity(
        lineItemId: string,
        quantity: number,
        basketId: string,
        regionCode: Region,
        postalCode: string,
    ) {
        const basketApiUrl = `${this.baseUrl}/v2/baskets/${basketId}/lineitems/${lineItemId}`;
        try {
            const response = await fetch(basketApiUrl, HttpRequestType.UpdateLineItemQuantity, {
                headers: {
                    "Region-Code": regionCode,
                    "Postal-Code": postalCode,
                    ...this.defaultHeaders,
                },
                method: "PATCH",
                body: JSON.stringify({quantity}),
            });
            const json = await response.json();
            return json;
        } catch (error) {
            const caughtError = new Error("Error when calling update line item quantity. Error is: " + error);
            getLogger().error(caughtError);
            return Promise.reject(caughtError);
        }
    }
}
