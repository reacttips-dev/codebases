import * as url from "url";

import {HttpRequestType} from "errors";
import {SellerReviewDuplicateError} from "errors/";
import fetch from "utils/fetch/";

import {SaveSellerReviewProps, SellerReviewsProvider} from "./index";
import {SellerRatingSummaryResponse} from "../SellerReviewsProvider";
import sellerCache from "../SellerProvider/sellerCache";

export class ApiSellerReviewsProvider implements SellerReviewsProvider {
    private sellerReviewsUrl: string;

    constructor(private baseUrl: string, private locale: Locale) {
        const tempUrl = url.parse(baseUrl, true);
        tempUrl.query = {lang: locale};
        this.sellerReviewsUrl = url.format(tempUrl);
    }

    public async saveSellerReview(saveSellerReviewProps: SaveSellerReviewProps): Promise<any> {
        if (saveSellerReviewProps.Secret) {
            saveSellerReviewProps.Secret = decodeURIComponent(saveSellerReviewProps.Secret);
        }

        const response = await fetch(
            this.sellerReviewsUrl,
            HttpRequestType.SellerReviewApi,
            {
                body: JSON.stringify(saveSellerReviewProps),
                headers: {
                    Connection: "keep-alive",
                    "Content-Type": "application/json",
                },
                method: "POST",
            },
            true,
        );
        if (!response.ok) {
            if (response.headers) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorResponse: any = await response.json();
                    if (errorResponse.ErrorCode && errorResponse.ErrorCode === "40") {
                        return Promise.reject(new SellerReviewDuplicateError("Seller review already submitted"));
                    }
                }
            }
            return Promise.reject(`${response.status} error when creating seller review`);
        }
        return response;
    }

    public async getSellerReviewStats(sellerId: string): Promise<SellerRatingSummaryResponse> {
        const sellerReviewStatsApiUrl = this.buildReviewStatsUrl(sellerId);

        if (typeof window === "undefined") {
            const reviewStats = sellerCache.get(sellerReviewStatsApiUrl);
            if (reviewStats) {
                return this.toSellerRating(reviewStats);
            }
        }

        try {
            const reviewStatsApiResponse = await fetch(sellerReviewStatsApiUrl, HttpRequestType.SellerReviewStatsApi);
            const json = await reviewStatsApiResponse.json();

            if (typeof window === "undefined") {
                sellerCache.set(sellerReviewStatsApiUrl, json);
            }

            return this.toSellerRating(json);
        } catch (error) {
            // Let it fail silently.
        }
    }

    private buildReviewStatsUrl(sellerId: string) {
        const apiUrl = url.parse(`${this.baseUrl}/sellers/${sellerId}/review-summary`, true);
        apiUrl.query = {
            "accept-language": this.locale,
        };
        return url.format(apiUrl);
    }

    private toSellerRating({
        sellerId,
        reviewCount,
        averageRating,
    }: SellerRatingSummaryResponse): SellerRatingSummaryResponse {
        return {
            sellerId,
            reviewCount,
            averageRating,
        };
    }
}
