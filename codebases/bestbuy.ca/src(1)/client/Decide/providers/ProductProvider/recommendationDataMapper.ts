import {SimpleProductProps} from "models";
import {Region} from "models";
import {RecommendationApiProduct} from "models";

const seoNameExpression: RegExp = /product\/(.*)\//;

export function recommendationDataMapper(
    product: RecommendationApiProduct,
    locale: Locale,
    regionCode: Region,
): SimpleProductProps {
    return {
        sku: product.sku,
        thumbnailImage: product.thumbnailImage,
        productUrl: seoNameExpression.test(product[locale].desktopUrl)
            ? product[locale].desktopUrl
            : `/${locale}/product/-/${product.sku}.aspx`,
        saleEndDate: product.saleEndDate ? Number(product.saleEndDate) : product.saleEndDate,
        customerRating: product.customerRating,
        customerRatingCount: product.customerRatingCount,
        name: product[locale].name,
        salePrice: product.salePrice,
        regularPrice: product.regularPrice,
        hideSaving: null,
        ehf: product.ehf[regionCode] || 0,
        isMarketplace: product.isMarketplace === "true",
        isAvailable: product.isAvailable,
        isAvailabilityLoaded: product.isAvailabilityLoaded,
        isAdvertised: undefined,
        isOnlineOnly: undefined,
        isOpenBox: product.isOpenBox,
        isPreOrder: product.isPreOrder,
        modelNumber: product.modelNumber,
        query: product.query,
    };
}
