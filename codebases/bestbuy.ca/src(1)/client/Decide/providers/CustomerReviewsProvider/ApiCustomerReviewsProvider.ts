import * as url from "url";
import {Url} from "url";
import {ParsedUrlQuery} from "querystring";
import {isEmpty} from "lodash-es";
import {HttpRequestError, HttpRequestType, StatusCode} from "errors";
import {
    CustomerReview,
    CustomerReviews,
    ReviewSortOptions,
    SortBy,
    SortDir,
    EmailVerificationErrorCodes,
    ReviewFilterOptions,
    RatingSummary,
    KeyConsiderations,
    ReviewStarRating,
    RatingDistribution,
    LocaleReviewCount,
    RecommendationCount,
} from "models";
import fetch from "utils/fetch";
import {CustomerReviewsProviderProps, WriteReviewRequest} from "./";
import customerReviewsCache from "./customerReviewsCache";

export class ApiCustomerReviewsProvider {
    protected static findAndReplace(reviews: CustomerReview[], value: string, replaceValue: string) {
        reviews
            .filter(
                (review) => review.reviewerLocation && review.reviewerLocation.toLowerCase() === value.toLowerCase(),
            )
            .forEach((review) => (review.reviewerLocation = replaceValue));
    }

    private DEFAULT_HEADERS = {
        Connection: "keep-alive",
        "Content-Type": "application/json",
        "Accept-Charset": "UTF-8",
    };

    constructor(private baseUrl: string, private locale: Locale) {}

    public async getReviews({
        sortOption,
        filterOption,
        sku,
        source,
        pageSize,
    }: CustomerReviewsProviderProps): Promise<CustomerReviews> {
        const reviewUrl = url.parse(`${this.baseUrl}/products/${sku}/reviews`, true);
        reviewUrl.query = {
            source,
            lang: this.locale,
            pageSize: String(pageSize),
        };

        const formattedUrl = this.getFormattedUrl(reviewUrl, sortOption, filterOption);

        if (typeof window === "undefined") {
            const reviewsData = customerReviewsCache.get(formattedUrl);
            if (reviewsData) {
                return reviewsData;
            }
        }

        const customerReviews: CustomerReviews = await this.getCustomerReviews(formattedUrl);

        if (typeof window === "undefined") {
            customerReviewsCache.set(formattedUrl, customerReviews);
        }

        return customerReviews;
    }

    public async getDetailedReviewSummary(sku: string): Promise<RatingSummary> {
        const detailedReviewSummaryUrl = `${this.baseUrl}/products/${sku}/detailed-review-summary`;
        let reviewSummaryResponse;

        try {
            const response = await fetch(detailedReviewSummaryUrl, HttpRequestType.DetailedReviewSummaryApi);
            reviewSummaryResponse = await response.json();
        } catch {
            return null;
        }

        const ratingSummary: RatingSummary = {
            averageRating: reviewSummaryResponse.averageRating,
            reviewCount: reviewSummaryResponse.reviewCount,
            ratingDistribution: this.getRatingDistribution(reviewSummaryResponse),
            localeReviewCount: this.getLocaleReviewCount(reviewSummaryResponse),
            recommendationCount: this.getRecommendationCount(reviewSummaryResponse),
            keyConsiderations: this.getKeyConsiderations(reviewSummaryResponse.keyConsiderations),
        };
        return ratingSummary;
    }

    public async getMoreReviews(
        {sortOption, filterOption, source, pageSize, sku}: CustomerReviewsProviderProps,
        pageNum: number,
    ): Promise<CustomerReviews> {
        const reviewUrl = url.parse(`${this.baseUrl}/products/${sku}/reviews`, true);
        reviewUrl.query = {
            source,
            lang: this.locale,
            pageSize: String(pageSize),
            page: String(pageNum),
        };

        const formattedUrl = this.getFormattedUrl(reviewUrl, sortOption, filterOption);
        const customerReviews: CustomerReviews = await this.getCustomerReviews(formattedUrl);

        if (customerReviews && pageNum > customerReviews.totalPages) {
            const error = new HttpRequestError(
                HttpRequestType.CustomerReviewApi,
                this.baseUrl,
                "Customer reviews not found",
                undefined,
                StatusCode.NotFound,
            );
            return Promise.reject(error);
        }
        return customerReviews;
    }

    public async writeReview(props: WriteReviewRequest): Promise<Response> {
        const writeReviewEndpoint = url.format({
            ...url.parse(`${this.baseUrl}/products/${props.productId}/reviews`, true),
            query: {
                lang: this.locale,
            },
        });

        return fetch(
            writeReviewEndpoint,
            HttpRequestType.CreateProductReviewApi,
            {
                body: JSON.stringify(props),
                headers: {...this.DEFAULT_HEADERS},
                method: "POST",
            },
            true,
        );
    }

    public submitFeedback(reviewId: string, helpful: boolean): Promise<Response> {
        const submitFeedbackUrl = url.parse(`${this.baseUrl}/reviews/${reviewId}/helpfulness`, true);

        return fetch(
            url.format(submitFeedbackUrl),
            HttpRequestType.CreateProductReviewApi,
            {
                body: JSON.stringify({reviewId, helpful}),
                headers: {...this.DEFAULT_HEADERS},
                method: "POST",
            },
            false,
        );
    }

    public submitReportReview(reviewId: string): Promise<Response> {
        const submitFeedbackUrl = url.parse(`${this.baseUrl}/reviews/${reviewId}/reports`, true);

        return fetch(
            url.format(submitFeedbackUrl),
            HttpRequestType.CreateProductReviewApi,
            {
                body: JSON.stringify({reviewId}),
                headers: {...this.DEFAULT_HEADERS},
                method: "POST",
            },
            false,
        );
    }

    public async verifyReviewer(authToken: string) {
        const emailVerification = "/user-verification";
        const verificationEndpoint = url.format({
            ...url.parse(this.baseUrl + emailVerification),
            query: {
                bv_authtoken: authToken,
            },
        });

        let data;

        try {
            const response = await fetch(verificationEndpoint, HttpRequestType.ProductReviewVerificationApi, {}, true);
            data = await response.json();
            const {ErrorCode, ErrorMessage} = data;

            if (response && (response.ok || response.status === 200)) {
                return data;
            } else if (ErrorCode && ErrorCode === EmailVerificationErrorCodes.tokenUsed) {
                return data; // Email is verified, review is pending
            } else {
                throw new HttpRequestError(
                    HttpRequestType.ProductReviewVerificationApi,
                    verificationEndpoint,
                    ErrorMessage,
                );
            }
        } catch (error) {
            // Error Connecting to API;
            throw new HttpRequestError(
                HttpRequestType.ProductReviewVerificationApi,
                verificationEndpoint,
                "Error connecting to API",
            );
        }
    }

    private addSortToReviewUrlQuery = (reviewUrl: Url, sortOption: ReviewSortOptions): Url => {
        if (sortOption) {
            switch (sortOption) {
                case ReviewSortOptions.oldest:
                    return {
                        ...reviewUrl,
                        query: {
                            ...(reviewUrl.query as ParsedUrlQuery),
                            sortBy: SortBy.date,
                            sortDir: SortDir.ascending,
                        },
                    };
                case ReviewSortOptions.highestRating:
                    return {
                        ...reviewUrl,
                        query: {
                            ...(reviewUrl.query as ParsedUrlQuery),
                            sortBy: SortBy.rating,
                            sortDir: SortDir.descending,
                        },
                    };
                case ReviewSortOptions.lowestRating:
                    return {
                        ...reviewUrl,
                        query: {
                            ...(reviewUrl.query as ParsedUrlQuery),
                            sortBy: SortBy.rating,
                            sortDir: SortDir.ascending,
                        },
                    };
                case ReviewSortOptions.helpfulness:
                    return {
                        ...reviewUrl,
                        query: {
                            ...(reviewUrl.query as ParsedUrlQuery),
                            sortBy: SortBy.helpfulness,
                            sortDir: SortDir.descending,
                        },
                    };
                case ReviewSortOptions.relevancy:
                    return {
                        ...reviewUrl,
                        query: {
                            ...(reviewUrl.query as ParsedUrlQuery),
                            sortBy: SortBy.relevancy,
                            sortDir: "", // review service makes sort direction mandatory
                        },
                    };
                default:
                    return {
                        ...reviewUrl,
                        query: {
                            ...(reviewUrl.query as ParsedUrlQuery),
                            sortBy: SortBy.date,
                            sortDir: SortDir.descending,
                        },
                    };
            }
        }
        return reviewUrl;
    };

    private addFilterToReviewUrlQuery = (reviewUrl: Url, filterOption: ReviewFilterOptions): Url => {
        return {
            ...reviewUrl,
            query: {
                ...(reviewUrl.query as ParsedUrlQuery),
                verifiedPurchaserFilter: filterOption.verifiedPurchaserToggleSelected,
            },
        };
    };

    private getKeyConsiderations = (keyConsiderations: KeyConsiderations): KeyConsiderations | null => {
        if (isEmpty(keyConsiderations)) {
            return null;
        }
        return {
            value: keyConsiderations.value || null,
            easeOfUse: keyConsiderations.easeOfUse || null,
            quality: keyConsiderations.quality || null,
        };
    };

    private async getCustomerReviews(formattedUrl: string): Promise<CustomerReviews> {
        let json;
        try {
            const response = await fetch(formattedUrl, HttpRequestType.CustomerReviewApi);
            json = await response.json();
        } catch {
            return null;
        }
        const customerReviews: CustomerReviews = {
            customerReviews: json.reviews,
            currentPage: json.currentPage,
            pageSize: json.pageSize,
            totalPages: json.totalPages,
            totalRows: json.total,
            loadingReviews: false,
            ratingFilter: null,
        };
        return customerReviews;
    }

    private getFormattedUrl(reviewUrl: Url, sortOption: ReviewSortOptions, filterOption: ReviewFilterOptions): string {
        let modifiedReviewUrl = this.addSortToReviewUrlQuery(reviewUrl, sortOption);
        modifiedReviewUrl = this.addFilterToReviewUrlQuery(modifiedReviewUrl, filterOption);
        const formattedUrl = url.format(modifiedReviewUrl);
        return formattedUrl;
    }

    private getRatingDistribution(reviewSummaryResponse): RatingDistribution {
        return {
            [ReviewStarRating.One]:
                reviewSummaryResponse.ratingDistribution &&
                reviewSummaryResponse.ratingDistribution[ReviewStarRating.One]
                    ? reviewSummaryResponse.ratingDistribution[ReviewStarRating.One]
                    : 0,
            [ReviewStarRating.Two]:
                reviewSummaryResponse.ratingDistribution &&
                reviewSummaryResponse.ratingDistribution[ReviewStarRating.Two]
                    ? reviewSummaryResponse.ratingDistribution[ReviewStarRating.Two]
                    : 0,
            [ReviewStarRating.Three]:
                reviewSummaryResponse.ratingDistribution &&
                reviewSummaryResponse.ratingDistribution[ReviewStarRating.Three]
                    ? reviewSummaryResponse.ratingDistribution[ReviewStarRating.Three]
                    : 0,
            [ReviewStarRating.Four]:
                reviewSummaryResponse.ratingDistribution &&
                reviewSummaryResponse.ratingDistribution[ReviewStarRating.Four]
                    ? reviewSummaryResponse.ratingDistribution[ReviewStarRating.Four]
                    : 0,
            [ReviewStarRating.Five]:
                reviewSummaryResponse.ratingDistribution &&
                reviewSummaryResponse.ratingDistribution[ReviewStarRating.Five]
                    ? reviewSummaryResponse.ratingDistribution[ReviewStarRating.Five]
                    : 0,
        };
    }

    private getLocaleReviewCount(reviewSummaryResponse): LocaleReviewCount {
        return {
            english:
                reviewSummaryResponse.localeReviewCount && reviewSummaryResponse.localeReviewCount.english
                    ? reviewSummaryResponse.localeReviewCount.english
                    : 0,
            french:
                reviewSummaryResponse.localeReviewCount && reviewSummaryResponse.localeReviewCount.french
                    ? reviewSummaryResponse.localeReviewCount.french
                    : 0,
        };
    }

    private getRecommendationCount(reviewSummaryResponse): RecommendationCount {
        return {
            positive:
                reviewSummaryResponse.recommendationCount && reviewSummaryResponse.recommendationCount.positive
                    ? reviewSummaryResponse.recommendationCount.positive
                    : 0,
            negative:
                reviewSummaryResponse.recommendationCount && reviewSummaryResponse.recommendationCount.negative
                    ? reviewSummaryResponse.recommendationCount.negative
                    : 0,
        };
    }
}

export default ApiCustomerReviewsProvider;
