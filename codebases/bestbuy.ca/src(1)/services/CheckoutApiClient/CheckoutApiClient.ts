import "isomorphic-fetch";
export default class CheckoutApiClient {
    setBaseUri(baseUri) {
        this.baseUri = baseUri;
    }
    createBasket(requestBody) {
        const url = this.baseUri + "/cart";
        return fetch(url, {
            body: JSON.stringify(requestBody),
            headers: {
                Accept: "application/vnd.bestbuy.guestcart.v1+json",
            },
            method: "POST",
        });
    }
    commitOrder(basketJson, etag) {
        const url = this.baseUri + "/orders";
        return fetch(url, {
            body: JSON.stringify(basketJson),
            headers: {
                "Accept": "application/vnd.bestbuy.guestorder.v1+json",
                "Accept-Language": "en",
                "ETag": etag,
                "content-type": "text/plain",
            },
            method: "POST",
        });
    }
}
//# sourceMappingURL=CheckoutApiClient.js.map