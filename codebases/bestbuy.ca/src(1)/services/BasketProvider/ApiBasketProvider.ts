import "isomorphic-fetch";
import { NotFoundError } from "../../errors";
export default class ApiBasketProvider {
    constructor(baseUri, postalCode = "", accessToken = null, regionCode = "", locale = "") {
        this.getBasket = (basketId) => this.send(`/v2/baskets/${basketId}`, null, "GET");
        this.addToBasket = (offer, basketId) => {
            const lineItems = offer.length
                ? offer.map(this.toLineItem)
                : [this.toLineItem(offer)];
            const bodyMsg = {
                id: basketId,
                lineItems,
            };
            return this.send("/v2/baskets", JSON.stringify(bodyMsg), "POST", { clearBfcache: true, clearBfcacheBasketId: basketId });
        };
        /**
         * ✔ TODO: find a better way to clear the BF cache without having to make a get after delete
         * Solution: Set the clearBfcache to False
         */
        this.deleteBasket = (basketId) => {
            return this.send(`/v2/baskets/${basketId}`, null, "DELETE", { clearBfcache: false, clearBfcacheBasketId: basketId });
        };
        this.removeCartItem = (basketId, lineItemId) => this.send(`/v2/baskets/${basketId}/lineItems/${lineItemId}`, "", "DELETE", { clearBfcache: true, clearBfcacheBasketId: basketId });
        this.addChildCartItem = (basketId, lineItemId, childItem) => this.send(`/v2/baskets/${basketId}/lineitems/${lineItemId}/associateditems`, JSON.stringify({ lineItem: childItem }), "POST", { clearBfcache: true, clearBfcacheBasketId: basketId });
        this.removeChildCartItem = (basketId, lineItemId, childItemId) => this.send(`/v2/baskets/${basketId}/lineitems/${lineItemId}/associateditems/${childItemId}`, "", "DELETE", { clearBfcache: true, clearBfcacheBasketId: basketId });
        this.updateCartItemQuantity = (basketId, lineItemId, quantity) => this.send(`/v2/baskets/${basketId}/lineItems/${lineItemId}`, JSON.stringify({ quantity }), "PATCH", { clearBfcache: true, clearBfcacheBasketId: basketId });
        this.mergeBasket = (sourceId, destinationId) => {
            const url = `/v2/baskets/${sourceId}/merge?destinationId=${destinationId}`;
            return this.send(url, null, "PATCH", { clearBfcache: true, clearBfcacheBasketId: sourceId });
        };
        this.toLineItem = (offer) => (Object.assign(Object.assign({ quantity: 1 }, offer), { associatedItems: offer.associatedItems ? offer.associatedItems.map(this.toLineItem) : undefined }));
        // set clearBfcache sendParams flag to true to update cached getBasket endpoint response (see Back-Forward Cache).
        this.send = (url, body, verb, { clearBfcache, clearBfcacheBasketId } = { clearBfcache: false }) => {
            return new Promise((resolve, reject) => {
                const apiUrl = `${this.baseUri}${url}`;
                const fetchData = {
                    credentials: "include",
                    headers: this.buildHeaders(),
                    method: verb,
                };
                if (body) {
                    fetchData.body = body;
                }
                return fetch(apiUrl, fetchData).then((res) => {
                    if (res.status === 204) {
                        resolve({});
                        return;
                    }
                    else if (res.status === 404) {
                        throw new NotFoundError();
                    }
                    else if (res.status >= 400) {
                        return res.json().then(reject);
                    }
                    else {
                        return res.json();
                    }
                }).then((response) => {
                    if (clearBfcache && clearBfcacheBasketId && verb !== "GET") {
                        this.getBasket(clearBfcacheBasketId);
                    }
                    resolve(response);
                }).catch((error) => { reject(error); });
            });
        };
        this.buildHeaders = () => {
            const headers = Object.assign(Object.assign({}, this.locale && { "Accept-Language": this.locale }), { "Content-Type": "application/json", "Postal-Code": this.postalCode, "Region-Code": this.regionCode });
            if (this.accessToken) {
                headers.Authorization = "Bearer " + this.accessToken;
            }
            return headers;
        };
        this.baseUri = baseUri;
        this.postalCode = postalCode;
        this.accessToken = accessToken;
        this.regionCode = regionCode;
        this.locale = locale;
    }
}
//# sourceMappingURL=ApiBasketProvider.js.map