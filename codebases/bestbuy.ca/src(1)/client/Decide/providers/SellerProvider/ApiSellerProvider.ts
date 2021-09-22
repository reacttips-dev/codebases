import * as url from "url";

import {HttpRequestError, HttpRequestType, StatusCode} from "errors";
import {Seller, SellerReviews} from "models";
import fetch from "utils/fetch";

import {SellerProvider} from "./";
import sellerCache from "./sellerCache";

export class ApiSellerProvider implements SellerProvider {
    constructor(private baseUrl: string, private locale: Locale) {}

    public async getSeller(sellerId: string): Promise<Seller> {
        const sellerApiUrl = this.buildUrl(sellerId);
        const cacheKey = sellerApiUrl;

        if (typeof window === "undefined") {
            const seller = sellerCache.get(cacheKey);
            if (seller) {
                return this.toSeller(seller);
            }
        }
        const sellerApiResponse = await fetch(sellerApiUrl, HttpRequestType.SellerApi);

        if (sellerApiResponse.status === StatusCode.NotFound) {
            const error = new HttpRequestError(
                HttpRequestType.SellerApi,
                sellerApiUrl,
                "Seller not found",
                null,
                StatusCode.NotFound,
            );
            return Promise.reject(error);
        }

        // TODO(SB-3117): Ideal solution is to using sellerApiResponse.json()
        // but currently seller api has byte order mark returned in response which is causing issues
        // when this code executes on the server side. For now using below work around.
        const raw = (await sellerApiResponse.text()) as string;
        const sellerJson = JSON.parse(raw.trim());
        if (typeof window === "undefined") {
            sellerCache.set(cacheKey, sellerJson);
        }

        return this.toSeller(sellerJson);
    }

    public async getReviews(sellerId: string): Promise<SellerReviews> {
        const sellerApiReviewsUrl = this.buildReviewsUrl(sellerId);
        const cacheKey = sellerApiReviewsUrl;

        if (typeof window === "undefined") {
            const reviews = sellerCache.get(cacheKey);
            if (reviews) {
                return reviews;
            }
        }

        try {
            const sellerApiReviewsResponse = await fetch(sellerApiReviewsUrl, HttpRequestType.SellerApi);
            const json = await sellerApiReviewsResponse.json();
            if (typeof window === "undefined") {
                sellerCache.set(cacheKey, json);
            }
            return json;
        } catch (error) {
            // Let it fail silently.
        }
    }

    public async getMoreReviews(sellerId: string, page: number): Promise<SellerReviews> {
        const sellerApiReviewsUrl = this.buildReviewsUrlWithPagination(sellerId, page);
        const sellerApiReviewsResponse = await fetch(sellerApiReviewsUrl, HttpRequestType.SellerApi);
        const json = await sellerApiReviewsResponse.json();

        if (page > json.totalPages) {
            const error = new HttpRequestError(
                HttpRequestType.SellerApi,
                sellerApiReviewsUrl,
                "Seller reviews not found",
                null,
                StatusCode.NotFound,
            );
            return Promise.reject(error);
        }

        return json;
    }

    private buildUrl(sellerId: string) {
        const sellerApiUrl = url.parse(url.resolve(this.baseUrl, sellerId), true);
        sellerApiUrl.query = {
            "accept-language": this.locale,
        };
        return url.format(sellerApiUrl);
    }

    private buildReviewsUrl(sellerId: string) {
        const apiUrl = url.parse(`${this.baseUrl}${sellerId}/reviews`, true);
        apiUrl.query = {
            "accept-language": this.locale,
        };
        return url.format(apiUrl);
    }

    private buildReviewsUrlWithPagination(sellerId: string, page: number) {
        const apiUrl = url.parse(`${this.baseUrl}${sellerId}/reviews`, true);
        apiUrl.query = {
            "accept-language": this.locale,
            page: String(page),
        };
        return url.format(apiUrl);
    }

    private toSeller(seller: any): Seller {
        return {
            description: seller.description,
            id: seller.sellerId,
            name: seller.name,
            policies: {
                return: seller.policies.return.value,
                shipping: seller.policies.shipping.value,
            },
        };
    }
}

export default ApiSellerProvider;
