import {DetailedProduct as Product, DetailedProduct, CustomerReviews} from "models";

import {ProductDetailTabId} from "../components/ProductDetailTab/ProductDetailTab";

/**
 * Set here max impressions should be sent from PDP as on PDP we show only certain amount of impressions, and this
 * number is hardcoded in src/client/pages/ProductDetailPage/components/CustomerReviewsList
 * TODO: refactor src/client/pages/ProductDetailPage/components/CustomerReviewsList to get rid of hardcoded number for reviews
 */
const MAX_IMPRESSIONS_PER_PDP = 3;

const RATING_AND_REVIEWS = "RatingsAndReviews";
export const CUSTOMER_GENERATED_CONTENT_MIN_PIXELS = 75;
export const CUSTOMER_GENERATED_CONTENT_MIN_TIME = 5000;

export const CUSTOMER_GENERATED_CONTENT_CONTAINER_ID = ProductDetailTabId && ProductDetailTabId.Reviews;

interface WriteReviewProductDetails extends Pick<Product, "sku" | "brandName" | "primaryParentCategoryId"> {}

export interface ConversionData {
    label: string;
    value: number;
    type: "BuyNow" | "AddToCart"; // add more types from BazaarVoice conversion when needed.myDevelopment.ca
}

export interface BazaarVoicePixelEvents {
    trackEvent: (eventName: string, data: object) => void;
    trackPageView: (viewData: object) => void;
    trackImpression: (impressionData: object) => void;
    trackInView: (viewData: object, viewSetting: object) => void;
    trackViewedCGC: (viewData: object, viewSetting: object) => void;
    trackConversion: (conversionData: ConversionData) => void;
}

export interface BazaarVoicePixel {
    pixel: BazaarVoicePixelEvents;
}
export interface BazaarVoiceWindow extends Window {
    BV?: BazaarVoicePixel;
    bvCallback?: () => void;
    bvDCC?: object;
    $BV?: object;
}

/**
 * A utility function to send the feature event to Bazaar voice.
 * @param product A partial product information
 * @param reviewBtnLocationTagName A tag name to distinguish same event from different review button placements.
 */
export const sendReviewAnalytics = (
    product: WriteReviewProductDetails,
    operation: "write" | "submit",
    reviewBtnLocationTagName: string,
) => {
    const bvWindow = window as BazaarVoiceWindow;
    if (bvWindow && bvWindow.BV) {
        bvWindow.BV.pixel.trackEvent("Feature", {
            type: "Used",
            name: operation,
            brand: product.brandName,
            productId: product.sku,
            bvProduct: RATING_AND_REVIEWS,
            categoryId: product.primaryParentCategoryId,
            detail1: "review",
            detail2: reviewBtnLocationTagName || "",
        });
    }
};

/**
 * A utility function to send trackPageView and trackImpressions events to Bazaar voice
 * @param product
 */
export const sendPageAnalytics = (product: DetailedProduct, reviews: CustomerReviews) => {
    const bvWindow = window as BazaarVoiceWindow;
    const ratingSummary = reviews && reviews.ratingSummary;
    if (bvWindow && bvWindow.BV) {
        // BV.pixel.trackPageView
        bvWindow.BV.pixel.trackPageView({
            bvProduct: RATING_AND_REVIEWS,
            productId: product.sku,
            brand: product.brandName,
            type: "Product",
            categoryId: product.primaryParentCategoryId,
            numReviews: ratingSummary ? ratingSummary.reviewCount : 0,
            avgRating: ratingSummary ? ratingSummary.averageRating : 0,
        });
        if (reviews.customerReviews.length) {
            const impressions = reviews.customerReviews.slice(0, MAX_IMPRESSIONS_PER_PDP);
            impressions.forEach((impression) => {
                if (impression.id !== undefined) {
                    // BV.pixel.trackImpression
                    bvWindow.BV.pixel.trackImpression({
                        contentId: impression.id,
                        productId: product.sku,
                        categoryId: product.primaryParentCategoryId,
                        contentType: "review",
                        bvProduct: RATING_AND_REVIEWS,
                        brand: product.brandName,
                    });
                }
            });
        }

        const inViewData = {
            productId: product.sku,
            bvProduct: RATING_AND_REVIEWS,
            brand: product.brandName,
        };

        bvWindow.BV.pixel.trackInView(inViewData, {
            minPixels: CUSTOMER_GENERATED_CONTENT_MIN_PIXELS,
            containerId: CUSTOMER_GENERATED_CONTENT_CONTAINER_ID,
        });

        bvWindow.BV.pixel.trackViewedCGC(inViewData, {
            minPixels: CUSTOMER_GENERATED_CONTENT_MIN_PIXELS,
            minTime: CUSTOMER_GENERATED_CONTENT_MIN_TIME,
            containerId: CUSTOMER_GENERATED_CONTENT_CONTAINER_ID,
        });
    }
};

export const sendConversionAnalytics = (conversionData: ConversionData) => {
    const bvWindow = window as BazaarVoiceWindow;
    if (bvWindow && bvWindow.BV) {
        bvWindow.BV.pixel.trackConversion(conversionData);
    }
};
