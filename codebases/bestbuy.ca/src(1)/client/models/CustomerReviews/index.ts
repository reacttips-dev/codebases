export interface CustomerReviews {
    customerReviews: CustomerReview[];
    ratingSummary: RatingSummary;
    sortOption?: ReviewSortOptions;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalRows: number;
    loadingReviews: boolean;
    ratingFilter: string;
    filter: ReviewFilterOptions;
}

export interface CustomerReview {
    id: string;
    reviewerName: string;
    title: string;
    rating: number;
    isRecommended: boolean | null;
    comment: string;
    reviewerLocation: string;
    submissionTime: string;
    syndicationSource: SyndicationSource;
    totalNegativeFeedbackCount?: number;
    totalPositiveFeedbackCount?: number;
    isVerifiedPurchaser: boolean;
}

export interface SyndicationSource {
    name: string;
    logoImgUrl: string;
}

export interface RatingSummary {
    averageRating: number;
    reviewCount: number;
    ratingDistribution: RatingDistribution;
    localeReviewCount: LocaleReviewCount;
    recommendationCount: RecommendationCount;
    keyConsiderations: KeyConsiderations;
}

export interface KeyConsiderations {
    value?: number;
    quality?: number;
    easeOfUse?: number;
}

export enum SortBy {
    rating = "rating",
    date = "date",
    helpfulness = "helpfulness",
    relevancy = "relevancy:A1",
}

export enum SortDir {
    ascending = "asc",
    descending = "desc",
}
export interface ReviewFilterOptions {
    verifiedPurchaserToggleSelected: boolean;
}

export enum ReviewSortOptions {
    newest = "newest",
    oldest = "oldest",
    highestRating = "highestRating",
    lowestRating = "lowestRating",
    helpfulness = "helpfulness",
    relevancy = "relevancy",
}

export enum ProductReviewFormFields {
    title = "title",
    comment = "comment",
    email = "email",
    reviewrLocation = "reviewerLocation",
}

export enum FormErrorCodes {
    CONTAIN_PROFANITY = "CONTAIN_PROFANITY",
    EMOJI_NOT_SUPPORTED = "EMOJI_NOT_SUPPORTED",
    DUPLICATE_SUBMISSION = "DUPLICATE_SUBMISSION",
}

export enum EmailVerificationErrorCodes {
    tokenUsed = "EMAIL_VERIFICATION_TOKEN_ALREADY_USED",
    invalidToken = "EMAIL_VERIFICATION_TOKEN_INVALID",
}

export enum ReviewStarRating {
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
}

export interface RatingDistribution {
    [ReviewStarRating.One]: number;
    [ReviewStarRating.Two]: number;
    [ReviewStarRating.Three]: number;
    [ReviewStarRating.Four]: number;
    [ReviewStarRating.Five]: number;
}

export interface LocaleReviewCount {
    english: number;
    french: number;
}

export interface RecommendationCount {
    positive: number;
    negative: number;
}
